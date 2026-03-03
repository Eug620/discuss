<template>
    <div class="w-full text-sm flex items-center justify-center h-full relative">
        <div class="w-1/2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-gray-300">
            <div v-for="(item, k) in userStore.userInfo" :key="k" class="flex border-b border-gray-300 last:border-b-0">
                <div class="w-[120px] text-right border-r border-gray-300 p-3 pr-4">{{ k }}:</div>
                <div class="flex-1 w-full auto-wrap p-3 pl-4">{{ item }}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

</script>
<style lang="scss">
.auto-wrap {
  word-wrap: break-word;      /* 长单词换行 */
  word-break: break-word;         /* 单词边界换行 */
  white-space: break-spaces;        /* 空白符正常处理 */
}
</style>