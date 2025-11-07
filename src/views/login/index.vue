<template lang="">
    <div class="login w-full h-full ">
        <div class="fixed top-1/2 bg-white shadow-md left-1/2 -translate-x-1/2 flex flex-col gap-8 -translate-y-1/2  px-10 py-10 rounded-md">
            <div class="flex flex-col gap-2">登录</div>
            <input type="text" class="border border-black px-2 rounded-md" placeholder="用户名" v-model="loginForm.username">
            <input type="password" class="border border-black px-2 rounded-md" placeholder="密码" v-model="loginForm.password">
            <button type="submit" class="border border-black px-2 rounded-md" @click="handleLogin">提交</button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { useUserStore } from '@/store/modules/user'
import router from '@/router'
import serverApi from '@/api'

const userStore = useUserStore()
const loginForm = reactive({
    username: '',
    password: ''
})

const handleLogin = () => {
    console.log(serverApi)
    serverApi.Login(loginForm).then((res: any) => {
        console.log(res.data)
        userStore.login(res.data)
        router.push('/')
    })

}

</script>
<style lang="">

</style>