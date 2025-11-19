/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2022-08-31 15:08:14
 * @LastEditors  : eug yyh3531@163.com
 * @LastEditTime : 2023-08-03 15:16:59
 * @FilePath     : /micro-vue/src/api/user/index.ts
 * @Description  : filename
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import request from '@/plugin/axios'
import { cloneDeep } from 'lodash-es'

const Url:any = {
    'server': {
        'login': '/user/login',
        'register': '/user',
        'friend': '/friend',
        'roomMine': '/room/mine',
        'room': '/room',
        'apply': '/apply',
    }
}

/// mock
const o = cloneDeep(Url.server)
Url['mock'] = {}
Object.entries(o).forEach(item => {
    Url['mock'][item[0]] = '/mock' + item[1]
})

const isMock = import.meta.env.VITE_APP_BUILD_MODE === 'true'

const requestServerName = isMock ? 'mock' : 'server'

export default {
    Login(data?:any) {
        return request({
            url: Url[requestServerName].login,
            method: 'post',
            data
        })
    },
    Register(data?:any) {
        return request({
            url: Url[requestServerName].register,
            method: 'post',
            data
        })
    },
    GetFriends() {
        return request({
            url: Url[requestServerName].friend,
            method: 'get',
        })
    },
    GetRoomMine() {
        return request({
            url: Url[requestServerName].roomMine,
            method: 'get',
        })
    },
    GetRoomInfo(id?:string) {
        return request({
            url: `${Url[requestServerName].room}/${id}`,
            method: 'get'
        })
    },
    GetUserInfo(id?:string) {
        return request({
            url: `${Url[requestServerName].register}/${id}`,
            method: 'get'
        })
    },
    apply(data?:any) {
        return request({
            url: `${Url[requestServerName].apply}`,
            method: 'post',
            data
        })
    },

}