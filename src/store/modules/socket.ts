import { defineStore } from 'pinia'
import { io, Socket } from 'socket.io-client'
import { useUserStore } from './user'
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
                })

                // 接收已发送回显信息
                this.socket.on('sender', (data) => {
                    const messages = this.userMessageMap.get(data.receiver) || []
                    messages.push(data)
                    this.userMessageMap.set(data.receiver, messages)
                })

                this.socket.on('room', (data) => {
                    const messages = this.roomMessageMap.get(data.room) || []
                    messages.push(data)
                    this.roomMessageMap.set(data.room, messages)
                })

                this.socket.on('online', (data) => {
                    this.roomMemberOnlineMap.set(data.room, new Set(data.users || []))
                })
            })
            

        },
        disconnect() {
            this.socket?.disconnect()
            this.socket = null
        }
    }
})