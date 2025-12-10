<!--
 * @Author       : Eug yyh3531@163.com
 * @Date         : 2025-11-23 20:37:33
 * @LastEditors  : Eug yyh3531@163.com
 * @LastEditTime : 2025-11-23 23:36:26
 * @FilePath     : \e-talk\src\views\friend\index.vue
 * @Description  : filename
 * 
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved. 
-->
<template lang="">
  <div class="w-full h-full flex gap-4 ">
    <div class="w-full h-full flex flex-col gap-4">
        <div class="w-full text-center border-b border-gray-300 pb-2 relative">
            <div class="">
              {{ getFriendInfo.username }}
            </div>
        </div>
        <div class="w-full h-full p-4 flex-1 overflow-y-auto">
            <!-- {{user}} -->
           <div v-for="message in getHistory" :key="message.id" class="w-full h-auto p-2" :style="{
            textAlign: message.sender === route.params.id ? 'left' : 'right',
           }">
            <!-- 发送人：
            {{ message.sender }} 
             接收人：
            {{ message.receiver }} 
            信息： -->
            <div class="mb-1 ">
              <div class="inline-block border border-gray-300 p-2 py-1 rounded-md relative">
                <span>
                  {{ message.content }}
                </span>

                <div v-if="message.sender === route.params.id" class="absolute top-2 -left-2 w-0 h-0 
                  border-t-8 border-t-transparent
                  border-r-8 border-r-gray-300
                  border-b-8 border-b-transparent">
                </div>

                <div v-else class="absolute top-2 -right-2 w-0 h-0 
                  border-t-8 border-t-transparent
                  border-l-8 border-l-gray-300
                  border-b-8 border-b-transparent">
                </div>
              </div>
            </div>
            <div class="text-xs text-gray-700" >
                {{ new Date(message.timestamp).toLocaleString() }}
            </div>
           </div>
        </div>
        <div class="w-full h-60 border-t border-gray-300 p-4 relative">
            <textarea id="story" name="story" placeholder="Type your message..." v-model.trim="story" rows="5" cols="33" class="w-full h-full  ">
            </textarea>
            <button class="absolute bottom-12 right-12 cursor-pointer" @click="handleSend">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
        </div>
    </div>
    <div class="w-[200px] h-full border-l border-gray-300 flex flex-col gap-2 p-2 pt-0">
      <div class="border-b border-gray-300 pb-2">用户信息</div>
      <div class="text-sm" >{{ getFriendInfo.username }}</div>
      <div class="text-sm" >{{ getFriendInfo.email }}</div>
      <div class="text-sm" >{{ new Date(getFriendInfo.createdAt).toLocaleString() }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useSocketStore } from "@/store/modules/socket";
import { useFriendStore } from "@/store/modules/friend";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { Socket } from "socket.io-client";

const socketStore = useSocketStore();
const friendStore = useFriendStore();

const story = ref("");
const route = useRoute();
// const user = JSON.parse(localStorage.getItem("userInfo") || "{}");

const getHistory = computed(() => {
  return socketStore.userMessageMap.get(route.params.id as string) || [];
});

const getFriendInfo = computed(() => {
  return friendStore.getFriendMap[route.params.id as string]?.friend_info || {}
})


const handleSend = () => {
  if (!story.value) return;
  (socketStore.socket as Socket).emit("user", {
    sender: route.params.id,
    content: story.value,
  });
  story.value = "";
};
</script>
<style lang="">
</style>