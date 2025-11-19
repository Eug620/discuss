<template lang="">
    <div class="w-full h-full flex flex-col gap-4 ">
        <div class="w-full h-full p-4">
            <!-- {{user}} -->
           <div v-for="message in getHistory" :key="message.id" class="w-full h-auto p-2 border-b border-gray-300" :style="{
            textAlign: message.sender === route.params.friendId ? 'left' : 'right',
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
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { Socket } from "socket.io-client";

const socketStore = useSocketStore();
const story = ref("");
const route = useRoute();
// const user = JSON.parse(localStorage.getItem("userInfo") || "{}");

const getHistory = computed(() => {
  return socketStore.userMessageMap.get(route.params.friendId as string) || [];
});

const handleSend = () => {
  (socketStore.socket as Socket).emit("user", {
    sender: route.params.friendId,
    content: story.value,
  });
};
</script>
<style lang="">
</style>