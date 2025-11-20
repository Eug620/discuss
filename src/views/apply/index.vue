<template lang="">
    <div class="apply p-2">
        <!-- apply{{applyList}} -->
        <template v-if="applyList.length > 0">
            <div v-for="item in applyList" :key="item.id">
                {{item.user_info.username}} 申请加为好友
                <template v-if="!item.handle_status">
                    <button @click="handleAccept(item.id)">同意</button>
                    <button @click="handleReject(item.id)">拒绝</button>
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


        <div>
            <h2>我发起的所有申请</h2>
            <div v-for="item in applyListMine" :key="item.id">
                {{item}}
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import serverApi from "@/api";
import { ref } from "vue";
import { useUserStore } from "@/store/modules/user";
const userStore = useUserStore();

const applyList = ref([]);
function getApplyList() {
  // 待我同意
  serverApi.GetApplyMine().then((res: any) => {
    console.log(res.data);
    applyList.value = res.data;
  });
}
getApplyList();

function handleAccept(id: string) {
  serverApi.handleApply({ id, status: true }).then((res: any) => {
    console.log(res.data);
    getApplyList();
  });
}

function handleReject(id: string) {
  serverApi.handleApply({ id, status: false }).then((res: any) => {
    console.log(res.data);
    getApplyList();
  });
}

// serverApi.GetMemberInfo({user_id: userStore.userInfo?.id}).then((res:any) => {
//     console.log(res.data)
// })

const applyListMine = ref([]);
// 我发起的所有申请
serverApi.getApply().then((res: any) => {
  console.log(res.data);
  applyListMine.value = res.data;
});
</script>
<style lang="">
</style>