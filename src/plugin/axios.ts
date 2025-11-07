/* eslint-disable */
import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { APIENUM, API_ENUM_SERVICE } from '@/settings'
import { useUserStore } from '@/store/modules/user'
// import { Notification } from '@arco-design/web-vue'
import Cookies from 'js-cookie'
import { pinia } from '@/store'

// 创建一个错误
function errorCreate(msg: any, path: any) {
    const error = new Error(msg)
    errorLog(error, path)
    throw error
}

// 记录和显示错误
function errorLog(error: Error, path?: any) {
    // 添加到日志
    // store.dispatch('d2admin/log/push', {
    //   message: '数据请求异常',
    //   type: 'danger',
    //   meta: {
    //     error
    //   }
    // })
    // 打印到控制台
    if (import.meta.env.MODE === 'development') {
        // util.log.danger('>>>>>> Error >>>>>>')
        console.log(error)
    }
    let errorMsg = error.message

    if (error.message.includes('timeout')) {
        errorMsg = '[ code: 408 ] ' + error.message
    }

    // 显示提示
    //   Notification.error({
    //     content: errorMsg,
    //     title: path || 'Error',
    //     duration: 5 * 1000
    //   })
    /// 如果是401那就去登录 并且不能是mock
    if (error.message.includes('401') && import.meta.env.VITE_APP_BUILD_MODE !== 'true') {
        // setTimeout(() => {
        //   store.dispatch('d2admin/account/logout')
        // }, 2500)
        useUserStore(pinia).logout()
        console.log('logout');

    }
}
// console.log( import.meta.env.VITE_APP_BASE_API, ' import.meta.env.VITE_APP_API');
interface RequestConfig extends AxiosRequestConfig {
    service?: APIENUM
    headers?: any
}
interface RuquestService extends AxiosInstance {
    (config: RequestConfig): AxiosPromise;
}
console.log(import.meta.env, ' import.meta.env.VITE_APP_BASE_API');
// 创建一个 axios 实例
const service: RuquestService = axios.create({
    // withCredentials: true,
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 10 * 60 * 1000, // 请求超时时间
})

// interface ServiceRequestConfig extends AxiosRequestConfig {
//   service?: string
// }

/* eggjs 默认值，可修改 */
const xsrfCookieName = 'csrfToken';
const xsrfHeaderName = 'x-csrf-token';
// 请求拦截器
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Cast config to any to allow custom properties like service
        const customConfig = config as InternalAxiosRequestConfig & { service?: APIENUM };
        if (customConfig.service) {
            customConfig.baseURL = API_ENUM_SERVICE[customConfig.service]
        }
        // store.dispatch('d2admin/tags/toggle', true)
        // 在请求发送之前做一些处理
        // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
        customConfig.headers['Base-Version'] = import.meta.env.VITE_APP_VERSION
        // console.log(import.meta.env.VITE_APP_VERSION,'baseURL')

        /* header 中添加 csrfToken */
        customConfig.headers[xsrfHeaderName] = Cookies.get(xsrfCookieName);
        if (useUserStore(pinia).getToken) {
            customConfig.headers['Authorization'] = `Bearer ${useUserStore().getToken}`
        }


        // loading.show(config)
        return customConfig
    },
    error => {
        // 发送失败
        // store.dispatch('d2admin/tags/toggle', true)
        console.log(error)
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        // store.dispatch('d2admin/tags/toggle', false)
        // loading.hide(response.config)
        // dataAxios 是 axios 返回数据中的 data
        const dataAxios: any = response.data
        // 这个状态码是和后端约定的
        const { code } = dataAxios
        // console.log(code,'code');

        // 根据 code 进行判断
        if (code === undefined) {
            // 如果没有 code 代表这不是项目后端开发的接口 比如可能是 D2Admin 请求最新版本
            return dataAxios
        } else {
            // 有 code 代表这是一个后端接口 可以进行进一步的判断
            switch (code) {
                case 200:
                    return dataAxios
                case 0:
                    return dataAxios.data
                case 403:
                    // [ 示例 ] 其它和后台约定的 code
                    errorCreate(dataAxios.msg, response.config.url)
                    break
                case 204:
                    // [ 示例 ] 其它和后台约定的 code
                    errorCreate(dataAxios.msg, response.config.url)
                    break
                case 401:
                    /// 需要去退出到登录页
                    // [ 示例 ] 其它和后台约定的 code
                    useUserStore().logout()
                    errorCreate(dataAxios.msg, response.config.url)
                    break
                default:
                    // 不是正确的 code
                    errorCreate(dataAxios.msg, response.config.url)
                    break
            }
        }
    },
    error => {
        // store.dispatch('d2admin/tags/toggle', false)
        if (error && error.response) {
            switch (error.response.status) {
                case 400: error.message = `[ code: 400 ] server error 请求错误 ${error.response.data.msg || ''}`; break
                case 401: error.message = '[ code: 401 ] server error 未授权，请登录'; break
                case 403: error.message = '[ code: 403 ] server error 拒绝访问'; break
                case 404: error.message = `[ code: 404 ] server error 请求地址出错: ${error.response.config.url}`; break
                case 408: error.message = '[ code: 408 ] server error 请求超时'; break
                case 413: error.message = `[ code: 413 ] server error Nginx等其他配置文件错误，${error.response.config.url}`; break
                case 500: error.message = '[ code: 500 ] server error 服务器内部错误'; break
                case 501: error.message = '[ code: 501 ] server error 服务未实现'; break
                case 502: error.message = '[ code: 502 ] server error 网关错误'; break
                case 503: error.message = '[ code: 503 ] server error 服务不可用'; break
                case 504: error.message = '[ code: 504 ] server error 网关超时'; break
                case 505: error.message = '[ code: 505 ] server error HTTP版本不受支持'; break
                default: break
            }
        }
        errorLog(error)
        return Promise.reject(error)
    }
)

export default service