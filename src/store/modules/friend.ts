import { defineStore } from 'pinia'
import { User } from './user'
import userApi from '@/api/user'

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
                prev[cur.id] = cur
                return prev
            }, {} as Record<string, Friend>)
        },

    },
    actions: {
        getFriends() {
            userApi.GetFriends().then(res => {
                console.log(res)
                this.friends = res.data
            })
        },
    }
})