<template>
  <div class="w-full h-full flex">
    <div class="w-[60px] flex flex-col shadow-md animate__fadeIn animate__animated">
      <div class="flex-1">
        <div
          v-for="page in initRoutes"
          @click="handleClick(page)"
          :key="page.path"
          class="cursor-pointer text-center p-2 hover:bg-gray-300"
        >
        <div class="w-6 py-1 mx-auto text-slate-600"  v-html="page.meta.icon"></div>
      </div>
      </div>
      <div class="">
        <div
          class="cursor-pointer text-center p-2 hover:bg-gray-300"
          @click="handleLogout"
        >
        <div class="w-6 py-1 mx-auto text-slate-600 " >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
          </svg>
        </div>
        </div>
      </div>
    </div>
    <div class="flex-auto animate__fadeIn animate__animated">
      <router-view></router-view>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from "@/store/modules/user";
import router from "@/router";
import { ref } from "vue";
import serverApi from "@/api";
import { RouterLink } from "vue-router";
import { initRoutes } from "@/router/routes";

function handleClick(page: any) {
  router.push({
    name: page.name,
  });
}

enum TabName {
  rooms = "rooms",
  friends = "friends",
}
const userStore = useUserStore();
const activeTab = ref<TabName>(TabName.rooms);
const tabs = ref([
  {
    name: TabName.rooms,
    label: "rooms",
  },
  {
    name: TabName.friends,
    label: "friends",
  },
]);
// const collapsed = ref(false)
const handleLogout = () => {
  userStore.logout();
  router.push("/login");
};
const handleRoomClick = (room: any) => {
  router.push({
    name: "room",
    params: {
      roomId: room.id,
    },
  });
};
const handleFriendClick = (friend: any) => {
  router.push({
    name: "friend",
    params: {
      friendId: friend.friend_info.id,
    },
  });
};

// 搜索
const searchQuery = ref("");
const searchResult = ref<any>({});
const handleSearch = () => {
  if (activeTab.value === TabName.rooms) {
    serverApi.GetRoomInfo(searchQuery.value).then((res: any) => {
      searchResult.value = res.data;
    });
  } else if (activeTab.value === TabName.friends) {
    serverApi.GetUserInfo(searchQuery.value).then((res: any) => {
      searchResult.value = res.data;
    });
  }
};
const handleResultClick = (result: any) => {
  if (activeTab.value === TabName.rooms) {
    serverApi
      .apply({
        room_id: result.id,
      })
      .then((res: any) => {
      });
  } else if (activeTab.value === TabName.friends) {
    serverApi
      .apply({
        apply_user_id: result.id,
      })
      .then((res: any) => {
      });
  }
};
</script>
<style lang="scss">
</style>