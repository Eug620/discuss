import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import { filterAsnycRouter } from '@/importRoutercom';

import { initRoutes } from '@/router/routes';
const menu: any[] = [
    {
        path: '/about',
        name: 'about',
        component: 'views/about/index',
        meta: {
            title: 'about',
            icon: 'about',
            roles: ['admin', 'user']
        }
    },
]

export const useMenuStore = defineStore('menu', {
    state: () => ({
        isLoad: false,
        menu: [] as any[]
    }),
    actions: {
        setMenus() {
            this.menu = markRaw(menu) // 走接口的时候要往pinia里面存一份用作首次渲染
        },
        GenerateRoutes() {
            return new Promise(resolve => {
                const asyncMenu = localStorage.getItem('ASYNCMENU')
                // 向后端请求路由数据
                if (!asyncMenu) {
                    // 本地没有菜单信息 --> 走接口获取
                    this.setMenus()
                } else {
                    // 有菜单信息 --> 走本地信息
                    this.menu = markRaw(JSON.parse(asyncMenu))
                    localStorage.setItem('ASYNCMENU', JSON.stringify(asyncMenu))
                }

                let accessedRoutes = filterAsnycRouter(this.menu);
                accessedRoutes = initRoutes.concat(accessedRoutes)
                // accessedRoutes.push({ path: "*", redirect: "/404", hidden: true });
                resolve(accessedRoutes);
            });
        }
    }
})
