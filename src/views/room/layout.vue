<template lang="">
  <div class="w-full h-full flex">
      <div class="w-[240px] border-r border-gray-300">
        <div class="flex justify-center items-center gap-2 p-2 text-xs">

            <input type="text" placeholder="Enter room name" class="w-full rounded-md p-2 h-8 border border-gray-300 flex justify-center items-center"/>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
        </div>
        <div v-for="room in userStore.rooms" @click="handleRoomClick(room)" :key="room.id"
              class="cursor-pointer p-2">{{ room.name }}</div>
      </div>
      <div class="flex-auto">
          <router-view></router-view>
      </div>
  </div>
</template>
<script setup lang="ts">
import { useSocketStore } from "@/store/modules/socket";
import { useUserStore } from "@/store/modules/user";
import { ref } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
// https://heroicons.com/
// 引入 heroicons 图标

import { Socket } from "socket.io-client";
import { computed } from "vue";

const socketStore = useSocketStore();
const userStore = useUserStore();
const story = ref("");
const route = useRoute();

const handleRoomClick = (room: any) => {
  router.push({
    name: "room-message",
    params: {
      roomId: room.id,
    },
  });
};
</script>
<style lang="">
</style>