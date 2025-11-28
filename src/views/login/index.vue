<template lang="">
    <div class="login w-full h-full ">
        <div class="fixed top-1/2 w-[400px] h-[480px] bg-gray-100 left-1/2 -translate-x-1/2 flex flex-col gap-8 -translate-y-1/2  px-10 py-10 rounded-md ">
            <div class="login-toggle">
                <input type="checkbox" v-model="activeTab" id="bluetooth">
                <label for="bluetooth"></label>
            </div>

            <input type="text" class="input" placeholder="用户名" v-model.trim="loginForm.username">
            <input type="password" class="input" placeholder="密码" v-model.trim="loginForm.password">
            <input type="text" class="input" placeholder="邮箱" v-if="activeTab" v-model.trim="loginForm.email">
            <button type="submit" @click="handleLogin">提交</button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useUserStore } from '@/store/modules/user'
import router from '@/router'
import serverApi from '@/api'
// https://uiverse.io/elements?tags=neumorphism&page=2

const activeTab = ref(false)

const userStore = useUserStore()
const loginForm = reactive({
    username: '',
    password: '',
    email: ''
})


const handleLogin = () => {
    console.log(serverApi)
    if (!loginForm.username || !loginForm.password) {
        return
    }
    serverApi[activeTab.value ? 'Register' : 'Login'](loginForm).then((res: any) => {
        console.log(res.data)
        !activeTab.value && userStore.login(res.data)
        !activeTab.value && router.push('/')
    })
}

</script>
<style lang="">

</style>