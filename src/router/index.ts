import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import NProgress from 'nprogress';

import { pinia } from '@/store'
import { useUserStore } from '@/store/modules/user'
import { useMenuStore } from '@/store/modules/menu'

const userStore = useUserStore(pinia)
const menuStore = useMenuStore(pinia)

const router = createRouter({
    history: createWebHistory(),
    routes
})

NProgress.configure({
    showSpinner: false,
    easing: 'ease',
    speed: 1000,
    minimum: 0.2,
    trickle: false,
    trickleSpeed: 800,
});

router.beforeEach(async (to, from, next: Function) => {
    if (!NProgress.isStarted()) {
        NProgress.start();
    }
    // console.log('[Router]:beforeEach', to.name, from.name);
    if (userStore.isLogin) { // 已登陆
        if (!menuStore.isLoad) { // 已登陆-未加载路由
            let asyncRoutes: any = await menuStore.GenerateRoutes()
            const layout = routes.find(r => r.path === '/')
            layout.children = [...asyncRoutes]
            router.addRoute(layout)
            
            menuStore.isLoad = true
            if (to.name === 'login') {
                next(from.path)
            } else {
                next(to.fullPath)
            }

        } else { // 
            next()
        }
    } else {
        if (to.name !== 'login') { // 不是去login
            next({
                name: 'login',
                query: {
                    redirect: encodeURIComponent(to.fullPath)
                }
            })
        } else {
            next()
        }
    }
})

router.afterEach(_ => {
    // console.log('[Router]:afterEach');
    NProgress.done();
})
// router.isReady().then(res => {
//     console.log('[Router]:isReady');
// })
export default router
