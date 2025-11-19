import { defineStore } from 'pinia'
import { io, Socket } from 'socket.io-client'
import { useUserStore } from './user'
export const useSocketStore = defineStore('socket', {
    state: () => ({
        socket: null as Socket | null,
        userMessageMap: new Map<string, any[]>(),
        roomMessageMap: new Map<string, any[]>(),
    }),
    actions: {
        initSocket() {
            this.socket = io('http://localhost:3001', {
                path: '/websocket',
                transports: ['websocket'],
                auth: {
                    token: useUserStore().token
                },
            })
            this.socket.on('connect', () => {
                console.log('connect')
                this.socket && this.socket.emit('init')
            })
            this.socket.on('disconnect', () => {
                console.log('disconnect')
            })

            // 异常处理
            this.socket.on('exception', (data) => {
                console.log(data)
                useUserStore().logout()
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
                console.log(data)
            })

        },
        disconnect() {
            this.socket?.disconnect()
            this.socket = null
        }
    }
})