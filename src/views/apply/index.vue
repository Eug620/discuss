<template lang="">
    <div class="apply p-2 flex flex-col gap-2 h-full">
      <div>
        <h2>待处理申请</h2>
        <template v-if="applyStore.pendingApplies.length > 0">
            <div v-for="item in applyStore.pendingApplies" :key="item.id">
                {{item.user_info.username}} 申请加为好友
                <template v-if="!item.handle_status">
                    <button @click="applyStore.handleApply(item.id, true)">同意</button>
                    <button @click="applyStore.handleApply(item.id, false)">拒绝</button>
                </template>

                <template v-else>
                  {{item.status ? '已同意' : '已拒绝'}}
                </template>

            </div>
        </template>
        <template v-else>
            <div>
                暂无申请
            </div>
        </template>
      </div>

      <div class="h-1/2">
          <h2>我发起的所有申请</h2>
          <div v-for="item in applyStore.applies" :key="item.id">
              <template v-if="item.room_id">
                {{item.user_info.username}} 申请加入房间 {{item.room_info.name}}
              </template>
              <template v-else>
                {{item.user_info.username}} 申请加 {{item.apply_user_info.username}} 为好友
              </template>

              <span v-if="item.handle_status">{{item.status ? '已同意' : '已拒绝'}}</span>
              <span v-else>待处理</span>
          </div>
      </div>
    </div>
</template>
<script setup lang="ts">
import { useApplyStore } from "@/store/modules/apply";

const applyStore = useApplyStore();
applyStore.getPendingApplies()
applyStore.getApplies()
</script>
<style lang="">
</style>