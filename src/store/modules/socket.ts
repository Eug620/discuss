import { defineStore } from 'pinia'
import { io, Socket } from 'socket.io-client'
import { useUserStore } from './user'
import { useFriendStore } from './friend'
export const useSocketStore = defineStore('socket', {
    state: () => ({
        socket: null as Socket | null,
        // 用户id - 用户消息历史
        userMessageMap: new Map<string, any[]>(),
        // 房间id - 房间消息历史
        roomMessageMap: new Map<string, any[]>(),
        // 房间id - 房间成员
        roomMemberMap: new Map<string, any[]>(),
        // 房间id - 房间在线成员id
        roomMemberOnlineMap: new Map<string, Set<string>>(),
    }),
    actions: {
        initSocket() {
            const { userInfo } = useUserStore()
            return new Promise((resolve, reject) => {
                this.socket = io(import.meta.env.VITE_APP_WS_BASE_URL, {
                    path: '/websocket',
                    transports: ['websocket'],
                    auth: {
                        token: useUserStore().token
                    },
                })
                this.socket.on('connect', () => {
                    console.log('connect')
                    this.socket && this.socket.emit('init')

                    const roomMessageMap = localStorage.getItem(`${userInfo.id}_roomMessageMap`)
                    this.roomMessageMap = new Map(JSON.parse(roomMessageMap || '[]'))
                    const userMessageMap = localStorage.getItem(`${userInfo.id}_userMessageMap`)
                    this.userMessageMap = new Map(JSON.parse(userMessageMap || '[]'))
                    resolve(true)
                })
                this.socket.on('disconnect', () => {
                    console.log('disconnect')
                    reject(false)
                })

                // 异常处理
                this.socket.on('exception', (data) => {
                    console.log(data)
                    useUserStore().logout()
                    reject(false)
                })


                // 接收用户消息
                this.socket.on('user', (data) => {
                    const messages = this.userMessageMap.get(data.sender) || []
                    messages.push(data)
                    this.userMessageMap.set(data.sender, messages)

                    localStorage.setItem(`${userInfo.id}_userMessageMap`, JSON.stringify(Array.from(this.userMessageMap)))
                })

                // 接收已发送回显信息
                this.socket.on('sender', (data) => {
                    const messages = this.userMessageMap.get(data.receiver) || []
                    messages.push(data)
                    this.userMessageMap.set(data.receiver, messages)

                    localStorage.setItem(`${userInfo.id}_userMessageMap`, JSON.stringify(Array.from(this.userMessageMap)))
                })

                this.socket.on('room', (data) => {
                    const messages = this.roomMessageMap.get(data.room) || []
                    messages.push(data)
                    this.roomMessageMap.set(data.room, messages)

                    localStorage.setItem(`${userInfo.id}_roomMessageMap`, JSON.stringify(Array.from(this.roomMessageMap)))
                })

                this.socket.on('online', (data) => {
                    this.roomMemberOnlineMap.set(data.room, new Set(data.users || []))
                })

                // 接收好友状态更新
                this.socket.on('status', (data) => {
                    useFriendStore().setFriendStatus(data.friend, data.status)
                })

                // 初始化获取所有在线好友
                this.socket.on('onlineFriends', (data) => {
                    data.users.forEach((id:string) => {
                        useFriendStore().setFriendStatus(id, true)
                    })
                })
            })
            

        },
        disconnect() {
            this.socket?.disconnect()
            this.socket = null
        }
    }
})