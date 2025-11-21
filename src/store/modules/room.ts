import { defineStore } from 'pinia'
import { User } from './user'
import userApi from '@/api/user'
import { useSocketStore } from './socket'

export interface Room {
    createdAt: string
    creator: string
    description: string
    id: string
    name: string
    updatedAt: string
    user_info: User
}
export const useRoomStore = defineStore('room', {
    state: () => ({
        rooms: [] as Room[],
    }),
    getters: {
        getRoomMap: (state) => {
            return state.rooms.reduce((prev, cur) => {
                prev[cur.id] = cur
                return prev
            }, {} as Record<string, Room>)
        },

    },
    actions: {
        getRooms() {
            userApi.GetRoomMine().then(res => {
                console.log(res)
                this.rooms = res.data.list || []

                this.rooms.forEach(room => {
                    useSocketStore().socket?.emit('join', room.id)
                })
            })
        }
    }
})