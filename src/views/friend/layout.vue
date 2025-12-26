<!--
 * @Author       : Eug yyh3531@163.com
 * @Date         : 2025-11-23 20:37:33
 * @LastEditors  : Eug yyh3531@163.com
 * @LastEditTime : 2025-11-23 21:15:50
 * @FilePath     : \e-talk\src\views\friend\layout.vue
 * @Description  : filename
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template lang="">
  <div class="w-full h-full flex">
      <div class="w-[240px] shadow-md animate__fadeIn animate__animated">
        <div class="flex justify-center items-center gap-2 p-2 text-xs">

            <input type="text" placeholder="Enter username" v-model="username" class="w-full rounded-md p-2 h-8 border focus:outline-none border-gray-300 flex justify-center items-center"/>

            <router-link to="/friend/search">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </router-link>

        </div>
        <div v-for="friend in getFriends" @click="handleFriendClick(friend)" :key="friend.id"
              class="cursor-pointer p-2 hover:bg-gray-300 " :class="[friendStore.getFriendMap[friend.friend_info.id]?.status ? 'text-gray-950' : 'text-gray-400']">{{ friend.friend_info.username }}</div>
      </div>
      <div class="flex-auto p-2 animate__fadeIn animate__animated">
          <router-view></router-view>
      </div>
  </div>
</template>
<script setup lang="ts">
import { useFriendStore } from "@/store/modules/friend";
import router from "@/router";
import { ref, computed } from "vue";

const friendStore = useFriendStore();
const username = ref('')
const getFriends = computed(() => {
    return friendStore.friends.filter((friend: any) => friend.friend_info.username.includes(username.value))
})

const handleFriendClick = (friend: any) => {
  router.push({
    name: "friend-info",
    params: {
      id: friend.friend_info.id,
    },
  });
};
</script>
<style lang="">
</style>