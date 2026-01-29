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
    room_info: Room
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
        // 获取我加入的房间及房间成员
        getRooms() {
            this.getRoomsMine()
            this.getRoomAll()
        },
        // 获取我创建的房间
        getRoomsMine() {
            ServerApi.GetRoomMine().then((res:any) => {
                this.roomsMine = res.data.list || []
            })
        },
        // 获取我加入的所有房间及房间成员
        getRoomAll() {
            const userinfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
            ServerApi.GetMemberInfo({
                user_id: userinfo.id 
            }).then((res:any) => {
                this.rooms = res.data || []
                this.rooms.forEach(room => {
                    // 获取房间成员
                    this.getRoomMember(room.room_id)
                })
            })
        },
        // 获取房间成员
        getRoomMember(room_id: string) {
            // 获取房间成员
            ServerApi.GetMemberInfo({
                room_id,
            }).then((res: any) => {
                if (res.code === 200) {
                    
                    useSocketStore().roomMemberMap.set(room_id, res.data || [])
                }
            });
        }
    }
})