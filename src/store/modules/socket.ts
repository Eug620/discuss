import { defineStore } from 'pinia'
import { io, Socket } from 'socket.io-client'
import { useUserStore } from './user'
export const useSocketStore = defineStore('socket', {
    state: () => ({
        socket: null as Socket | null,
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
            })
            this.socket.on('disconnect', () => {
                console.log('disconnect')
            })
        },
        disconnect() {
            this.socket?.disconnect()
            this.socket = null
        }
    }
})