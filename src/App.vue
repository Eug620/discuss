<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'
import { useDBStore } from '@/store/modules/database'
import { useSocketStore } from '@/store/modules/socket'
import { debounce, cloneDeep } from 'lodash-es'
import { watch, onUnmounted } from 'vue'

const userStore = useUserStore()
const dbStore = useDBStore()
const socketStore = useSocketStore()  

userStore.init()

// 监听整个 store 的变化
// const unsubscribe = socketStore.$subscribe((mutation, state) => {
//   console.log('mutation', mutation,state)
//   if (mutation.type === 'direct' && mutation.events?.key === 'userMessageMap') {
//     console.log('userMessageMap 变化了:', state.userMessageMap)
//   }
// }) // detached: true 表示组件卸载后继续监听
// 在组件卸载时取消订阅（可选）
onUnmounted(() => {
  // unsubscribe()
})
watch(() => [socketStore.userMessageMap, socketStore.roomMessageMap], debounce(([newUserMessageMap, newRoomMessageMap]) => {
  dbStore.database?.setItem('User_Message', cloneDeep(newUserMessageMap))
  dbStore.database?.setItem('Room_Message', cloneDeep(newRoomMessageMap))
}, 1000),{ deep: true })


</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
