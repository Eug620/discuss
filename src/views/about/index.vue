<template>
    <div>
        <div v-for="(item, k) in userStore.userInfo" :key="k">
            {{ k }} : {{ item }}
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

</script>
<style lang="">

</style>