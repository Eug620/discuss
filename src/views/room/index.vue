<template lang="">
    <div class="w-full h-full flex gap-4 ">
      <div class="w-full h-full flex-1 flex flex-col gap-4">
        <div class="w-full text-center border-b border-gray-300 py-2 relative">
            <div class="">
              {{ getRoomInfo.name }}
            </div>
        </div>
        <div class="w-full border-b border-gray-300 py-2" v-if="applyList.length > 0">
          <div class="" v-for="apply in applyList">
              {{apply.user_info.username}} 申请加入房间

              <template v-if="apply.handle_status">
                {{apply.status ? '已同意' : '已拒绝'}}
              </template>
              <template v-else>
                <button  @click="handleHandleApply(apply, true)">同意</button>
                <button  @click="handleHandleApply(apply, false)">拒绝</button>
              </template>
          </div>
        </div>

        <div class="w-full h-full p-4">
                <div v-for="message in getHistory" :key="message.id" class="w-full h-auto p-2" :style="{
            textAlign: message.sender === userStore.userInfo.id ? 'right' : 'left',
           }">
            <div class="flex">
                <div class="px-2" v-if="message.sender !== userStore.userInfo.id" >
                  [{{getUserInfo(message.sender)}}]
                </div>
                <div class=flex-1> {{ message.content }} </div>
                <div class="px-2" v-if="message.sender === userStore.userInfo.id" >
                  [{{ userStore.userInfo.username}}]
                </div>
            </div>
            <div style="font-size: 12px; color: #999;">
                {{ new Date(message.timestamp).toLocaleString() }}
            </div>
           </div>
        </div>
        <div class="w-full h-100 border-t border-gray-300 p-4 relative">
            <textarea id="story" name="story" placeholder="Type your message..." v-model.trim="story" rows="5" cols="33" class="w-full h-full ">
            </textarea>
            <button class="absolute bottom-12 right-12 cursor-pointer" @click="handleSend">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
        </div>
      </div>
      <div class="w-[200px] h-full border-l border-gray-300 flex flex-col gap-2 p-2">
        <div class="border-b border-gray-300 pb-2">群成员</div>
        <div v-for="member in getMember" :key="member.user_id" class="text-sm" :class="{
          'text-rose-400': member.user_id === userStore.userInfo.id,
        }">
          {{member.user_info.username}} | {{getMemberOnline.has(member.user_id) ? '在线' : '离线'}}
        </div>
      </div>
    </div>
</template>
<script setup lang="ts">
import { useSocketStore } from "@/store/modules/socket";
import { useUserStore } from "@/store/modules/user";
import { useRoomStore } from "@/store/modules/room";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Socket } from "socket.io-client";
import { computed } from "vue";
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
  return socketStore.roomMemberOnlineMap.get(route.params.id as string) || new Set();
});
// 获取用户信息
const getUserInfo = (user_id: string) => {
  return getMember.value.find((item: any) => item.user_id === user_id)?.user_info?.username;
}
// 获取房间信息
const getRoomInfo = computed(() => {
  return roomStore.getRoomMap[route.params.id as string]?.room_info || {}
})


// 监听路由变化
const applyList = ref([])
watch(() => route.params.id, (room_id) => {
  handleApplyRoom()
})

function handleApplyRoom() {
  if (!roomStore.roomsMine.find((item: any) => item.id === route.params.id)) {
    return applyList.value = []
  }
  ServerApi.getApplyRoom(route.params.id as string).then((res: any) => {
    applyList.value = res.data || []
  })
}
handleApplyRoom()

// 处理申请
function handleHandleApply(apply: any, status: boolean) {

  ServerApi.handleApply({
    id: apply.id,
    status
  }).then((res: any) => {
    if (res.code === 200) {
      handleApplyRoom()
    }
  })
}



// 发送消息
const handleSend = () => {
  (socketStore.socket as Socket).emit("room", {
    room: route.params.id,
    content: story.value,
  });
  story.value = "";
};
</script>
<style lang="">
</style>