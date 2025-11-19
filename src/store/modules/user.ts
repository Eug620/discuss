import { defineStore } from 'pinia'
import { useSocketStore } from './socket'
import router from '@/router'
import userApi from '@/api/user'
interface User {
    createdAt: string
    email: string
    id: string
    updatedAt: string
    username: string
}
interface Room {
    createdAt: string
    creator: string
    description: string
    id: string
    name: string
    updatedAt: string
    user_info: User
}
interface Friend {
    createdAt: string
    creator: string
    friend_id: string
    friend_info: User
    id: string
    user_info: User
}
export const useUserStore = defineStore('user', {
    state: () => ({
        isLogin: false,
        token: '',
        userInfo: {},
        friends: [] as Friend[],
        rooms: [] as Room[],
    }),
    getters: {
        getToken: (state) => state.token,
    },
    actions: {
        login(data: any) {
            this.isLogin = true;
            this.token = data.access_token
            this.userInfo = data
            localStorage.setItem('token', data.access_token)
            localStorage.setItem('userInfo', JSON.stringify(data))
            useSocketStore().initSocket()
            this.getFriends()
            this.getRooms()
        },
        logout() {
            this.isLogin = false;
            this.token = ''
            this.userInfo = {}
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            useSocketStore().disconnect()
            router.push({
                name: 'login',
            })
        },
        init() {
            this.token = localStorage.getItem('token') || ''
            this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
            this.isLogin = this.token !== ''
            this.isLogin && (useSocketStore().initSocket())
            this.isLogin && this.getFriends()
            this.isLogin && this.getRooms()
        },
        getFriends() {
            userApi.GetFriends().then(res => {
                console.log(res)
                this.friends = res.data
            })
        },
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
