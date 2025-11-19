<template lang="">
    <div>
        apply{{applyList}}
    </div>
</template>
<script setup lang="ts">
import serverApi from "@/api";
import { ref } from "vue";
import { useUserStore } from "@/store/modules/user";
const userStore = useUserStore()

const applyList = ref([])
serverApi.GetApplyMine().then((res:any) => {
    console.log(res.data)
    applyList.value = res.data
})

serverApi.GetMemberInfo({user_id: userStore.userInfo?.id}).then((res:any) => {
    console.log(res.data)
})
</script>
<style lang="">
    
</style>