<template lang="">
  <div class="w-full h-full flex">
      <div class="w-[240px] border-r border-gray-300">
        <div class="flex justify-center items-center gap-2 p-2 text-xs">

            <input type="text" placeholder="Enter username" class="w-full rounded-md p-2 h-8 border border-gray-300 flex justify-center items-center"/>

            <router-link to="/friend/search">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </router-link>

        </div>
        <div v-for="friend in friendStore.friends" @click="handleFriendClick(friend)" :key="friend.id"
              class="cursor-pointer p-2">{{ friend.friend_info.username }}</div>
      </div>
      <div class="flex-auto p-2">
          <router-view></router-view>
      </div>
  </div>
</template>
<script setup lang="ts">
import { useFriendStore } from "@/store/modules/friend";
import router from "@/router";

const friendStore = useFriendStore();

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