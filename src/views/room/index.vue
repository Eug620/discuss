<template lang="">
    <div class="w-full h-full flex flex-col gap-4 ">
        <div class="w-full h-full p-4">
        </div>
        <div class="w-full h-100 border-t border-gray-300 p-4 relative">
            <textarea id="story" name="story" placeholder="Type your message..." v-model.trim="story" rows="5" cols="33" class="w-full h-full input ">
            </textarea>
            <button class="absolute bottom-12 right-12 " @click="handleSend">Send</button>
        </div>
    </div>
</template>
<script setup lang="ts">

import { useSocketStore } from '@/store/modules/socket'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Socket } from 'socket.io-client'

const socketStore = useSocketStore()
const story = ref('')
const route = useRoute()

const handleSend = () => {
    (socketStore.socket as Socket).emit('room', {
        room: route.params.roomId,
        content: story.value
    })
}
</script>
<style lang="">

</style>