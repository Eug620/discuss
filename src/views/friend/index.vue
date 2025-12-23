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
            <div :class="[]">
              {{ getFriendInfo.username }} 
            </div>
        </div>
        <div class="w-full h-full p-4 flex-1 overflow-y-auto">
           <div v-for="message in getHistory" :key="message.id" class="w-full h-auto p-2" :style="{
            textAlign: message.sender === route.params.id ? 'left' : 'right',
           }">
            <div class="mb-1 ">
              <div class="text-xs text-gray-700" >
                {{ dayjs(message.timestamp).fromNow() }}
              </div>
              <div class="inline-block border border-gray-300 p-2 py-1 rounded-md relative">
                <img v-if="message.type === 'image'" :src="message.content" alt="" @click="handlePreviewImage(message.content)" class="h-24 rounded-md">
                <span v-else class="whitespace-pre-wrap">
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
            <button class="absolute bottom-12 right-24 cursor-pointer" @click="handleSendImage">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </button>
        </div>
    </div>
    <div class="w-[200px] h-full border-l border-gray-300 flex flex-col gap-2 p-2 pt-0">
      <div class="border-b border-gray-300 pb-2">用户信息</div>
      <div class="text-sm  flex justify-between" >
        <span>{{ getFriendInfo.username }}</span>
        <span>{{ getFriendStatus ? '在线' : '离线' }}</span>
      </div>
      <div class="text-sm" >{{ getFriendInfo.email }}</div>
      <div class="text-sm" >{{ new Date(getFriendInfo.createdAt).toLocaleString() }}</div>
    </div>

    <input class="hidden" id="chooseImage" type="file" accept="image/*">

  </div>
</template>
<script setup lang="ts">
import { useSocketStore } from "@/store/modules/socket";
import { useFriendStore } from "@/store/modules/friend";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Socket } from "socket.io-client";
import dayjs from "@/plugin/dayjs";

const socketStore = useSocketStore();
const friendStore = useFriendStore();

const story = ref("");
const route = useRoute();

const getHistory = computed(() => {
  return socketStore.userMessageMap.get(route.params.id as string) || [];
});

const getFriendInfo = computed(() => {
  return friendStore.getFriendMap[route.params.id as string]?.friend_info || {}
})

const getFriendStatus = computed(() => {
  return friendStore.getFriendMap[route.params.id as string]?.status || false
})


const handleSend = () => {
  if (!story.value) return;
  (socketStore.socket as Socket).emit("user", {
    sender: route.params.id,
    content: story.value,
  });
  story.value = "";
};
const handleSendImage = () => {
  document.getElementById('chooseImage')?.click()
};
onMounted(() => {
  document.getElementById('chooseImage')?.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      (socketStore.socket as Socket).emit('user', {
        sender: route.params.id,
        content: reader.result as string,
        type: 'image'
      })
    }
  })
})

const handlePreviewImage = (url: string) => {
  const win = window.open();
  win?.document.write(`<img src="${url}" style="max-width: 100%; height: auto;">`);
  win?.document.write(`<style rel="stylesheet" >*{margin: 0; padding: 0; text-align: center;}</style>`);
}
</script>
<style lang="">
</style>