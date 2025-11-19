<template lang="">
    <div class="w-full h-full flex flex-col gap-4 ">
        <div class="w-full h-full p-4">
                <div v-for="message in getHistory" :key="message.id" class="w-full h-auto p-2 border-b border-gray-300" :style="{
            textAlign: message.sender === userStore.userInfo.id ? 'right' : 'left',
           }">
            <!-- 发送人：
            {{ message.sender }} 
             接收人：
            {{ message.receiver }} 
            信息： -->
            <div >
                {{ message.content }}
            </div>
            <div style="font-size: 12px; color: #999;">
                {{ new Date(message.timestamp).toLocaleString() }}
            </div>
           </div>
        </div>
        <div class="w-full h-100 border-t border-gray-300 p-4 relative">
            <textarea id="story" name="story" placeholder="Type your message..." v-model.trim="story" rows="5" cols="33" class="w-full h-full input ">
            </textarea>
            <button class="absolute bottom-12 right-12 " @click="handleSend">Send</button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useSocketStore } from "@/store/modules/socket";
import { useUserStore } from "@/store/modules/user";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { Socket } from "socket.io-client";
import { computed } from "vue";

const socketStore = useSocketStore();
const userStore = useUserStore();
const story = ref("");
const route = useRoute();

const getHistory = computed(() => {
  return socketStore.roomMessageMap.get(route.params.roomId as string) || [];
});

const handleSend = () => {
  (socketStore.socket as Socket).emit("room", {
    room: route.params.roomId,
    content: story.value,
  });
};
</script>
<style lang="">
</style>