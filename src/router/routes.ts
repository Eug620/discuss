export const initRoutes = [
    // 首页
    {
        path: 'dashboard',
        name: 'dashboard',
        meta: {
            keepAlive: true,
            title: '首页',
            auth: true,
            affix: true,
            icon: `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          `
        },
        component: () => import('@/views/dashboard/index.vue')
    },
    // 好友
    {
        path: 'friend',
        name: 'friend',
        meta: {
            keepAlive: true,
            title: '好友',
            auth: true,
            affix: true,
            icon: `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
            `
        },
        redirect: { name: 'friend-dashboard' },
        component: () => import('@/views/friend/layout.vue'),
        children: [
            {
                path: 'dashboard',
                name: 'friend-dashboard',
                meta: {
                    keepAlive: true,
                    title: '欢迎页',
                    auth: true,
                    affix: true,
                    icon: 'IconUser'
                },
                component: () => import('@/views/dashboard/index.vue')
            },
            {
                path: 'search',
                name: 'friend-search',
                meta: {
                    keepAlive: true,
                    title: '搜索好友',
                    auth: true,
                    affix: true,
                    icon: 'IconSearch'
                },
                component: () => import('@/views/friend/search.vue')
            },
            {
                path: ':id',
                name: 'friend-info',
                meta: {
                    keepAlive: true,
                    title: '消息',
                    auth: true,
                    affix: true,
                    icon: 'IconMessage'
                },
                component: () => import('@/views/friend/index.vue')
            }
        ]
    },
    // 房间
    {
        path: 'room',
        name: 'room',
        meta: {
            keepAlive: true,
            title: '房间',
            auth: true,
            affix: true,
            icon: `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
            `
        },
        redirect: { name: 'room-dashboard' },
        component: () => import('@/views/room/layout.vue'),
        children: [
            {
                path: 'dashboard',
                name: 'room-dashboard',
                meta: {
                    keepAlive: true,
                    title: '欢迎页',
                    auth: true,
                    affix: true,
                    icon: 'IconUser'
                },
                component: () => import('@/views/dashboard/index.vue')
            },
            {
                path: 'search',
                name: 'room-search',
                meta: {
                    keepAlive: true,
                    title: '搜索房间',
                    auth: true,
                    affix: true,
                    icon: 'IconSearch'
                },
                component: () => import('@/views/room/search.vue')
            },
            {
                path: 'create',
                name: 'room-create',
                meta: {
                    keepAlive: true,
                    title: '创建房间',
                    auth: true,
                    affix: true,
                    icon: 'IconAdd'
                },
                component: () => import('@/views/room/create.vue')
            },
            {
                path: ':id',
                name: 'room-message',
                meta: {
                    keepAlive: true,
                    title: '房间消息',
                    auth: true,
                    affix: true,
                    icon: 'IconMessage'
                },
                component: () => import('@/views/room/index.vue')
            }
        ]
    },
    {
        path: 'apply',
        name: 'apply',
        meta: {
            keepAlive: true,
            title: '申请',
            auth: true,
            affix: true,
            icon: `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
            `
        },
        component: () => import('@/views/apply/index.vue')
    },
]


export const frameLogin = [
    // 首页
    {
        path: '/login',
        name: 'login',
        meta: {
            keepAlive: false,
            title: '登陆',
            auth: true,
            affix: true,
            icon: 'IconHome'
        },
        component: () => import('@/views/login/index.vue')
    },
]
export const frameIn: any[] = [
    {
        path: '/',
        redirect: { name: 'dashboard' },
        component: () => import('@/layout/index.vue'),
        children: [
            ...initRoutes,
        ]
    }
]

export const errorPage = [
    { path: '/:pathMatch(.*)*', name: '404', component: () => import('@/views/404/index.vue') }
]
export default [
    ...frameIn,
    // ...frameOut,
    ...frameLogin,
    ...errorPage,
]