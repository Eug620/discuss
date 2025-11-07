<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
userStore.init()
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
