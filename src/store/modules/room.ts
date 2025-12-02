import { defineStore } from 'pinia'
import { User } from './user'
import ServerApi from '@/api/index'
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

export interface Rooms {
    id: string
    room_id: string
    room_info: Rooms
    user_id: string
    user_info: User
    createdAt: string
}
export const useRoomStore = defineStore('room', {
    state: () => ({
        // 我加入的房间
        rooms: [] as Rooms[],

        // 我创建的房间
        roomsMine: [] as Room[],
    }),
    getters: {
        getRoomMap: (state) => {
            return state.rooms.reduce((prev, cur) => {
                prev[cur.room_id] = cur
                return prev
            }, {} as Record<string, Rooms>)
        },

    },
    actions: {
        getRooms() {
            ServerApi.GetRoomMine().then((res:any) => {
                this.roomsMine = res.data.list || []
            })
            const userinfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

            ServerApi.GetMemberInfo({
                user_id: userinfo.id 
            }).then((res:any) => {
                this.rooms = res.data || []
                this.rooms.forEach(room => {
                    // 加入房间
                    useSocketStore().socket?.emit('join', room.room_id)

                    // 获取房间成员
                    ServerApi.GetMemberInfo({
                        room_id: room.room_id,
                    }).then((res: any) => {
                        if (res.code === 200) {
                            
                            useSocketStore().roomMemberMap.set(room.room_id, res.data || [])
                        }
                    });
                })
            })
        }
    }
})