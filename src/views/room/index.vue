<template lang="">
    <div class="w-full h-full flex gap-4 ">
      <div class="w-full h-full flex-1 flex flex-col gap-4">
        <div class="w-full text-center border-b border-gray-300 pb-2 relative">
            <div class="">
              {{ getRoomInfo.name }}
            </div>
        </div>

<div class="w-full h-full p-4">
  <div v-for="message in getHistory" :key="message.id" class="w-full h-auto p-2" :style="{
            textAlign: message.sender === userStore.userInfo.id ? 'right' : 'left',
           }">
    <div class="flex mb-1 items-center ">
      <div class="px-2 text-sm" v-if="message.sender !== userStore.userInfo.id">
        [{{getUserInfo(message.sender)}}]
      </div>
      <div class="flex-1">
        <div class="inline-block border border-gray-300 p-2 py-1 rounded-md relative text-sm">
          <img v-if="message.type === 'image'" :src="message.content" alt=""  @click="handlePreviewImage(message.content)" class="h-24 rounded-md">
          <span v-else class="whitespace-pre-wrap">
            {{ message.content }}
          </span>

          <div v-if="message.sender !== userStore.userInfo.id" class="absolute top-2 -left-2 w-0 h-0 
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
      <div class="px-2 text-sm" v-if="message.sender === userStore.userInfo.id">
        [{{ userStore.userInfo.username}}]
      </div>
    </div>
    <div class="text-xs text-gray-700">
      {{ new Date(message.timestamp).toLocaleString() }}
    </div>
  </div>
</div>
<div class="w-full h-100 border-t border-gray-300 p-4 relative">
  <textarea id="story" name="story" placeholder="Type your message..." v-model.trim="story" rows="5" cols="33"
    class="w-full h-full ">
  </textarea>
  <button class="absolute bottom-12 right-12 cursor-pointer" @click="handleSend">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
      class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
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
  <div class="flex-1">
    <div class="border-b border-gray-300 pb-2">群成员</div>
    <div v-for="member in getMember" :key="member.user_id" class="text-sm flex justify-between items-center py-1" :class="{
          'text-rose-400': member.user_id === userStore.userInfo.id,
        }">
      <span>{{member.user_info.username}}</span>
      <span>{{getMemberOnline.has(member.user_id) ? '在线' : '离线'}}</span>
    </div>
  </div>
  <div class="flex-1" v-if="applyList.length > 0">
    <div class="border-b border-gray-300 pb-2">群申请</div>
    <div v-for="apply in applyList" class="text-sm flex justify-between items-center gap-2 py-1" >
      <span class="text-rose-400 flex-1">{{apply.user_info.username}}</span>
      <template v-if="apply.handle_status">
        {{apply.status ? '已同意' : '已拒绝'}}
      </template>
<template v-else>
  <button @click="handleHandleApply(apply, true)">同意</button>
  <button @click="handleHandleApply(apply, false)">拒绝</button>
</template>
</div>
</div>
</div>
<input class="hidden" id="chooseImage" type="file" accept="image/*">

</div>
</template>
<script setup lang="ts">
import { useSocketStore } from "@/store/modules/socket";
import { useUserStore } from "@/store/modules/user";
import { useRoomStore } from "@/store/modules/room";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Socket } from "socket.io-client";
import { computed, onMounted } from "vue";
import ServerApi from "@/api";

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
    }
  });
}

// 发送消息
const handleSend = () => {
  (socketStore.socket as Socket).emit("room", {
    room: route.params.id,
    content: story.value,
  });
  story.value = "";
};

const handleSendImage = () => {
  document.getElementById("chooseImage")?.click();
};
onMounted(() => {
  document.getElementById("chooseImage")?.addEventListener("change", (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      (socketStore.socket as Socket).emit("room", {
        room: route.params.id,
        content: reader.result as string,
        type: "image",
      });
    };
  });
});

const handlePreviewImage = (url: string) => {
  const win = window.open();
  win?.document.write(`<img src="${url}" style="max-width: 100%; height: auto;">`);
  win?.document.write(`<style rel="stylesheet" >*{margin: 0; padding: 0; text-align: center;}</style>`);
}
</script>
<style lang="">
</style>