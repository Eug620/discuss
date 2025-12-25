import { defineStore } from 'pinia'
import { useSocketStore } from './socket'
import { useFriendStore } from './friend'

import { useRoomStore } from './room'
import router from '@/router'
import userApi from '@/api/user'
export interface User {
    createdAt?: string
    email?: string
    id?: string
    updatedAt?: string
    username?: string
    token_type?: string
    access_token?: string
}


export const useUserStore = defineStore('user', {
    state: () => ({
        isLogin: false,
        token: '',
        userInfo: {} as User,
    }),
    getters: {
        getToken: (state) => state.token,
    },
    actions: {
        async login(data: User) {
            this.isLogin = true;
            this.token = data.access_token as string
            this.userInfo = data
            localStorage.setItem('token', data.access_token as string)
            localStorage.setItem('userInfo', JSON.stringify(data))
            await useFriendStore().getFriends()
            await useSocketStore().initSocket()
            useRoomStore().getRooms()
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
        async init() {
            this.token = localStorage.getItem('token') || ''
            this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
            this.isLogin = this.token !== ''
            this.isLogin && (await useFriendStore().getFriends())
            this.isLogin && (await useSocketStore().initSocket())
            this.isLogin && (useRoomStore().getRooms())
        },


    }
})
