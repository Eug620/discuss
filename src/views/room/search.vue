<!--
 * @Author       : Eug yyh3531@163.com
 * @Date         : 2025-11-23 20:37:33
 * @LastEditors  : Eug yyh3531@163.com
 * @LastEditTime : 2025-11-23 22:52:24
 * @FilePath     : \e-talk\src\views\room\search.vue
 * @Description  : filename
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template >
  <div>
    <div class="flex justify-center items-center gap-2 p-2 text-xs">
      <input
        type="text"
        placeholder="Enter room name"
        @keyup.enter="handleSearch"
        v-model.trim="roomName"
        class="w-[200px] rounded-md p-2 h-8 border border-gray-300 flex justify-center items-center focus:outline-none"
      />
    </div>

    <div class="p-2">
      <div
        v-for="item in result"
        :key="item.id"
        class="cursor-pointer p-2 flex justify-around"
      >
        <span>{{ item.name }}</span>
        <button
          v-if="!roomStore.getRoomMap[item.id]"
          @click="handleJoin(item.id)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>

      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useRoomStore } from "@/store/modules/room";
import ServerApi from "@/api";
import { Room } from "@/store/modules/room";
const roomName = ref("");

const result = ref<Room[]>([]);
const roomStore = useRoomStore();

const handleSearch = () => {
  ServerApi.SearchRoom(roomName.value).then((res: any) => {
    if (res.code === 200) {
      result.value = res.data;
    }
  });
};

const handleJoin = (room_id: string) => {
    ServerApi.apply({room_id}).then((res: any) => {
        if (res.code === 200) {
            roomName.value = ''
            result.value = []
        }
    })
};
</script>
<style lang="scss">
</style>