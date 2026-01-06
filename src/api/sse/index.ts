import request from '@/plugin/axios'
import { cloneDeep, get } from 'lodash-es'
import { useUserStore } from "@/store/modules/user";

const Url: any = {
    'server': {
        'sse': '/sse',
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

    CreateEventSource() {
        const eventSource = new EventSource(import.meta.env.VITE_APP_BASE_API + Url[requestServerName].sse + '?token=' + useUserStore().token, {
            withCredentials: true,
        })

        // 可以使用addEventListener()方法监听
        eventSource.addEventListener('open', function (event) {
            console.log('Connection opened')
        })

        eventSource.addEventListener('message', function (event) {
            console.log('Received message: ' + JSON.parse(event.data));
        })

        // 监听自定义事件
        // eventSource.addEventListener('xxx', function (event) {
        //     console.log('Received message: ' + event.data);
        // })

        eventSource.addEventListener('error', function (event) {
            console.log('Error occurred: ' + event);
        })

        return eventSource

    },
}