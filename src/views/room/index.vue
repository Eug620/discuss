<template lang="">
  <div class="w-full h-full flex bg-[#f6f8fa]">
      <div class="w-full h-full flex-1 flex flex-col gap-0">
          <!-- 头部 -->
          <div class="w-full bg-white border-b border-[#d0d7de] px-4 py-4 flex items-center justify-between h-16 flex items-center content-center">
              <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-md bg-gradient-to-br from-[#8957e5] to-[#6e40c9] flex items-center justify-center text-white text-sm font-bold">
                      {{ getRoomInfo.name?.charAt(0)?.toUpperCase() || 'R' }}
                  </div>
                  <div>
                      <div class="text-base font-medium text-[#24292f]">{{ getRoomInfo.name }}</div>
                      <div class="text-xs text-[#6e7781]">{{ getMember.length }} 位成员</div>
                  </div>
              </div>
          </div>

          <!-- 消息区域 -->
          <div class="w-full flex-1 p-4 overflow-y-auto" id="messageContainer">
              <div v-for="message in getHistory" :key="message.id" class="w-full mb-4" :class="[
                  message.sender === userStore.userInfo.id ? 'text-right' : 'text-left',
              ]">
                  <div class="inline-block max-w-[70%]">
                      <div class="text-xs text-[#6e7781] mb-1 px-1">
                          <span v-if="message.sender !== userStore.userInfo.id" class="font-medium text-[#0969da] mr-2">
                              {{ getUserInfo(message.sender) }}
                          </span>
                          <span v-if="message.type && message.sender !== userStore.userInfo.id" class="mr-2">
                              {{ formatFileSize(message.size) }}
                          </span>
                          {{ dayjs(message.timestamp).fromNow() }}
                          <span v-if="message.type && message.sender === userStore.userInfo.id" class="ml-2">
                              {{ formatFileSize(message.size) }}
                          </span>
                      </div>
                      <div class="flex items-start justify-end" >
                          <div class="px-2 text-sm py-1 border border-transparent flex-shrink-0" v-if="message.sender !== userStore.userInfo.id">
                              <div class="w-6 h-6 rounded-full bg-gradient-to-br from-[#1f6feb] to-[#1a88e8] flex items-center justify-center text-white text-xs font-bold">
                                  {{ getUserInfo(message.sender)?.charAt(0)?.toUpperCase() || 'U' }}
                              </div>
                          </div>
                          <div class="inline-block px-4 py-2 rounded-md relative" :class="[
                              message.sender === userStore.userInfo.id 
                                  ? 'bg-[#1f6feb] text-white border border-[#1f6feb]' 
                                  : 'bg-white border border-[#d0d7de] text-[#24292f]'
                          ]">
                              <img 
                                  v-if="message.type === 'image'" 
                                  :src="`${VITE_APP_API_BASE_URL}${message.content}`" 
                                  alt="图片已失效"
                                  @click="handlePreviewImage(message.content)" 
                                  class="h-24 rounded-md cursor-pointer"
                              />
                              <a 
                                  v-else-if="message.type === 'file'" 
                                  class="text-[#0969da] no-underline hover:underline flex items-center gap-2" 
                                  :href="`${VITE_APP_API_BASE_URL}${message.content}`" 
                                  target="_blank"
                              >
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  {{ message.originalname }}
                              </a>
                              <span v-else class="whitespace-pre-wrap text-sm">
                                  {{ message.content }}
                              </span>
                          </div>
                          <div class="px-2 text-sm py-1 border border-transparent flex-shrink-0" v-if="message.sender === userStore.userInfo.id">
                              <div class="w-6 h-6 rounded-full bg-gradient-to-br from-[#1f6feb] to-[#1a88e8] flex items-center justify-center text-white text-xs font-bold">
                                  {{ userStore.userInfo.username?.charAt(0)?.toUpperCase() || 'U' }}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <!-- 输入区域 -->
          <div class="w-full bg-white border-t border-[#d0d7de] p-4">
              <div class="relative">
                  <textarea 
                      id="story" 
                      name="story" 
                      placeholder="输入消息..." 
                      v-enter="handleSend" 
                      v-model.trim="story" 
                      rows="5"
                      class="w-full px-4 py-3 text-sm border-0 rounded-md focus:outline-none focus:ring-0 transition-colors resize-none"
                  ></textarea>
                  <div class="absolute bottom-3 right-3 flex gap-2">
                      <button 
                          @click="handleSendImage" 
                          class="p-2 text-[#6e7781] hover:text-[#24292f] hover:bg-[#eaeef2] rounded-md transition-colors"
                          title="发送图片"
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                      </button>
                      <button 
                          @click="handleSendFile" 
                          class="p-2 text-[#6e7781] hover:text-[#24292f] hover:bg-[#eaeef2] rounded-md transition-colors"
                          title="发送文件"
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                          </svg>
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <!-- 侧边栏 -->
      <div class="w-[200px] bg-white border-l border-[#d0d7de] flex flex-col">
          <div class="flex-1 overflow-y-auto">
              <div class="text-sm font-medium text-[#24292f]  pb-2 border-b border-[#d0d7de] p-4 h-16 flex items-center">群成员</div>
              <div class="p-2 flex flex-col gap-1">
                <div v-for="member in getMember" :key="member.user_id"
                    class="text-sm flex justify-between items-center py-2 px-2 rounded hover:bg-[#f6f8fa] transition-colors" :class="{
                        'bg-[#ddf4ff]': member.user_id === userStore.userInfo.id,
                    }">
                    <div class="flex items-center gap-2 flex-1 min-w-0">
                        <div class="w-6 h-6 rounded-full bg-gradient-to-br from-[#1f6feb] to-[#1a88e8] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {{ member.user_info.username?.charAt(0)?.toUpperCase() || 'U' }}
                        </div>
                        <span class="truncate">{{ member.user_info.username }}</span>
                    </div>
                    <span :class="getMemberOnline.has(member.user_id) ? 'text-[#1a7f37]' : 'text-[#6e7781]'" class="text-xs flex-shrink-0">
                        {{ getMemberOnline.has(member.user_id) ? '在线' : '离线' }}
                    </span>
                </div>
              </div>
          </div>
          
          <div class="border-t border-[#d0d7de] p-4" v-if="applyList.length > 0">
              <div class="text-sm font-medium text-[#24292f] mb-4 pb-2 border-b border-[#d0d7de]">群申请</div>
              <div v-for="apply in applyList" class="text-sm mb-3 last:mb-0">
                  <div class="flex justify-between items-start gap-2 mb-2">
                      <span class="text-[#cf222e] flex-1">{{ apply.user_info.username }}</span>
                      <div class="flex gap-1 flex-shrink-0">
                          <button 
                              @click="handleHandleApply(apply, true)"
                              class="px-2 py-1 text-xs font-medium text-white bg-[#2da44e] border border-transparent rounded hover:bg-[#2c974b] transition-colors"
                          >
                              同意
                          </button>
                          <button 
                              @click="handleHandleApply(apply, false)"
                              class="px-2 py-1 text-xs font-medium text-[#24292f] bg-white border border-[#d0d7de] rounded hover:bg-[#f3f4f6] transition-colors"
                          >
                              拒绝
                          </button>
                      </div>
                  </div>
                  <div v-if="apply.handle_status" class="text-xs text-center">
                      <span :class="apply.status ? 'text-[#1a7f37]' : 'text-[#cf222e]'">
                          {{ apply.status ? '已同意' : '已拒绝' }}
                      </span>
                  </div>
              </div>
          </div>  
    </div>
    <input class="hidden" id="chooseImage" type="file" accept="image/*">
    <input class="hidden" id="chooseFile" type="file" accept="*">
  </div>
</template>
<script setup lang="ts">
import { useSocketStore } from "@/store/modules/socket";
import { useUserStore } from "@/store/modules/user";
import { useRoomStore } from "@/store/modules/room";
import { ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { Socket } from "socket.io-client";
import { computed, onMounted } from "vue";
import ServerApi from "@/api";
import dayjs from "@/plugin/dayjs";
import serverApi from "@/api";
import { vEnter } from "@/directives/vEnter";
import { formatFileSize, scrollToBottom } from "@/utils/index";

const VITE_APP_API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const socketStore = useSocketStore();
const userStore = useUserStore();
const roomStore = useRoomStore();
const story = ref("");
const route = useRoute();

// 获取房间消息历史
const getHistory = computed(() => {
  return socketStore.roomMessageMap.get(route.params.id as string) || [];
});
// 获取房间成员
const getMember = computed(() => {
  return socketStore.roomMemberMap.get(route.params.id as string) || [];
});
// 获取房间成员在线状态
const getMemberOnline = computed(() => {
  return (
    socketStore.roomMemberOnlineMap.get(route.params.id as string) || new Set()
  );
});
// 获取用户信息
const getUserInfo = (user_id: string) => {
  return getMember.value.find((item: any) => item.user_id === user_id)
    ?.user_info?.username;
};
// 获取房间信息
const getRoomInfo = computed(() => {
  return roomStore.getRoomMap[route.params.id as string]?.room_info || {};
});

// 监听路由变化
const applyList = ref([]);
watch(
  () => route.params.id,
  (room_id) => {
    handleApplyRoom();
  }
);

function handleApplyRoom() {
  if (!roomStore.roomsMine.find((item: any) => item.id === route.params.id)) {
    return (applyList.value = []);
  }
  ServerApi.getApplyRoom(route.params.id as string).then((res: any) => {
    applyList.value = res.data || [];
  });
}
handleApplyRoom();

// 处理申请
function handleHandleApply(apply: any, status: boolean) {
  ServerApi.handleApply({
    id: apply.id,
    status,
  }).then((res: any) => {
    if (res.code === 200) {
      handleApplyRoom();
      // 同意申请后，刷新获取房间成员
      status && roomStore.getRoomMember(route.params.id as string);
    }
  });
}

// 发送消息
const handleSend = () => {
  if (!story.value) return;
  (socketStore.socket as Socket).emit("room", {
    room: route.params.id,
    content: story.value,
  });
  story.value = "";
};

const handleSendImage = () => {
  document.getElementById("chooseImage")?.click();
};
const handleSendFile = () => {
  document.getElementById("chooseFile")?.click();
};
onMounted(() => {
  document.getElementById("chooseImage")?.addEventListener("change", (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file as Blob);
    serverApi.UploadUser(formData).then((res: any) => {
      if (res.code === 200) {
        (socketStore.socket as Socket).emit("room", {
          size: res.data.size,
          room: route.params.id,
          content: `/${res.data.path}`,
          type: "image",
        });
      }
    });
  });
  document.getElementById("chooseFile")?.addEventListener("change", (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file as Blob);
    serverApi.UploadUser(formData).then((res: any) => {
      if (res.code === 200) {
        (socketStore.socket as Socket).emit("room", {
          size: res.data.size,
          room: route.params.id,
          content: `/${res.data.path}`,
          type: "file",
          originalname: res.data.originalname,
        });
      }
    });
  });

  scrollToBottom('messageContainer');
});

// 自动滚到最新消息
watch(
  () => getHistory.value,
  () => {
    scrollToBottom('messageContainer');
  },
  { deep: true }
);

const handlePreviewImage = (url: string) => {
  window.open(`${VITE_APP_API_BASE_URL}${url}`);
};
</script>
<style lang="">
</style>