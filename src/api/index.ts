const modules = import.meta.glob('./**/*.ts', { eager: true, import: 'default' })
let ServerApi: any = {}
// 注册API
const useDeepApi = (modules: any, key: string = '') => {
    // Object的话进去递归
    if (Object.prototype.toString.call(modules) === '[object Object]') {
        for (const _module in modules) {
            useDeepApi(modules[_module], _module)
        }
    } else if (Object.prototype.toString.call(modules) === '[object Function]') {
        // 函数的话就是所需要的接口函数
        ServerApi[key] = modules
    } else {
        console.warn(`useDeepApi: [${key} : ${modules}] Error of the data type`)
    }

}
useDeepApi(modules)

export default ServerApi