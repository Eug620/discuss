import { defineStore } from 'pinia'
import { User } from './user'
import ServerApi from '@/api/index'

interface Friend {
    createdAt: string
    creator: string
    friend_id: string
    friend_info: User
    id: string
    user_info: User
}
export const useFriendStore = defineStore('friend', {
    state: () => ({
        friends: [] as Friend[],
    }),
    getters: {
        getFriendMap: (state) => {
            return state.friends.reduce((prev, cur) => {
                prev[cur.friend_info.id] = cur
                return prev
            }, {} as Record<string, Friend>)
        },

    },
    actions: {
        getFriends() {
            ServerApi.GetFriends().then((res:any) => {
                this.friends = res.data
            })
        },
    }
})