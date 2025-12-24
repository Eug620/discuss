/*
 * @Author       : eug yyh3531@163.com
 * @Date         : 2022-08-31 15:08:14
 * @LastEditors  : Eug yyh3531@163.com
 * @LastEditTime : 2025-11-23 22:47:08
 * @FilePath     : \e-talk\src\api\user\index.ts
 * @Description  : filename
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import request from '@/plugin/axios'
import { cloneDeep, get } from 'lodash-es'

const Url:any = {
    'server': {
        'login': '/user/login',
        'register': '/user',
        'userSearch': '/user/search',
        'userUpload': '/user/upload',


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
    GetUserInfo(id?:string) {
        return request({
            url: `${Url[requestServerName].register}/${id}`,
            method: 'get'
        })
    },
    SearchUser(name?:string) {
        return request({
            url: `${Url[requestServerName].userSearch}?username=${name}`,
            method: 'get'
        })
    },
    UploadUser(data?:any) {
        return request({
            url: Url[requestServerName].userUpload,
            method: 'post',
            data,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },

}