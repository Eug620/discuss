<template>
    <div class="talk-layout">
        <div class="talk-layout-menu bg-white shadow-md">
            <div class="talk-layout-menu-item" @click="handleRedirect('dashboard')">
                首页
            </div>
            <div class="talk-layout-menu-item" @click="handleRedirect('about')">
                关于
            </div>

            <div class="talk-layout-menu-item talk-layout-menu-bottom" @click="handleLogout">
                退出登录
            </div>
        </div>
        <div class="talk-layout-content bg-white ">
            <router-view></router-view>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import router from '@/router'

const userStore = useUserStore()

const handleRedirect = (name: string) => {
    router.push({
        name
    })
}

const handleLogout = () => {
    userStore.logout()
    router.push('/login')
}
</script>
<style lang="scss">
.talk-layout {
    display: flex;
    height: 100dvh;
    overflow: hidden;
    gap: .6vw;

    &-menu {
        width: 16vw;
        height: 100%;
        background: #f5f5f5;
        // padding: .6vw;
        position: relative;

        &-item {
            padding: .6vw;
        }

        &-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
        }
    }

    .talk-layout-content {
        flex: 1;
        height: 100%;
    }
}
</style>