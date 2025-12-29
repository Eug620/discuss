<template lang="">
    <div class="login w-full h-full ">
        <div class="fixed top-1/2 scale-80 w-[400px] h-[480px] bg-gray-100 left-1/2 -translate-x-1/2 flex flex-col gap-8 -translate-y-1/2  px-10 py-10 rounded-md  animate__fadeIn animate__animated">
            <div class="login-toggle">
                <input type="checkbox" v-model="activeTab" id="bluetooth">
                <label for="bluetooth"></label>
            </div>

            <input type="text" class="input" placeholder="用户名" v-model.trim="loginForm.username">
            <input type="password" class="input" placeholder="密码" @keydown.enter="handleLogin" v-model.trim="loginForm.password">
            <input type="text" class="input" placeholder="邮箱" @keydown.enter="handleLogin" v-if="activeTab" v-model.trim="loginForm.email">
            <div class="flex items-center gap-2 w-full">
                <input type="text" class="input flex-1 w-[50%]" placeholder="验证码" @keydown.enter="handleLogin" v-model.trim="loginForm.captcha">
                <div v-html="captchaImg"  class="h-[40px] captchaImg cursor-pointer" @click="handleGetCaptcha"></div>
            </div>
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
    captcha: '',
    username: '',
    password: '',
    email: ''
})
const captchaImg = ref('')


const handleLogin = () => {
    if (!loginForm.username || !loginForm.password) {
        return
    }
    if (activeTab.value && !loginForm.email) {
        return
    }
    serverApi[activeTab.value ? 'Register' : 'Login'](loginForm).then(async (res: any) => {
        !activeTab.value && await userStore.login(res.data)
        !activeTab.value && router.push('/')
        if (activeTab.value) {
            activeTab.value = false
        }
    })
}

function handleGetCaptcha() {
    loginForm.captcha = ''
    serverApi.GetCaptcha().then((res: any) => {
        captchaImg.value = res
    })
}
handleGetCaptcha()

</script>
<style lang="scss">
.captchaImg{
    svg{
        height: 100%;
    }
}
</style>