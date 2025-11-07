import { defineStore } from 'pinia'
import { useSocketStore } from './socket'

export const useUserStore = defineStore('user', {
    state: () => ({
        isLogin: false,
        token: '',
        userInfo: {}
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
        },
        logout() {
            this.isLogin = false;
            this.token = ''
            this.userInfo = {}
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            useSocketStore().disconnect()
        },
        init() {
            this.token = localStorage.getItem('token') || ''
            this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
            this.isLogin = this.token !== ''
            this.isLogin && (useSocketStore().initSocket())
        }
    }
})
