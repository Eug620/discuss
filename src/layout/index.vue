<template>
    <div class="w-full h-full flex">
        <div class="w-[100px] border-r border-gray-300">
            <div class="flex flex-col gap-4 p-4 ">
                <div v-for="tab in tabs" :key="tab.name" class="cursor-pointer" @click="activeTab = tab.name">{{
                    tab.label }}</div>
            </div>
        </div>
        <div class="w-[360px] border-r border-gray-300">
            <div class="flex flex-col gap-4 p-4">
                <div class="flex items-center gap-2">
                    <input type="text" placeholder="Search" v-model="searchQuery" class="input flex-1"/>
                    <button @click="handleSearch">Search</button>
                </div>
                <div class=" border-b border-gray-300 pb-4">
                    {{searchResult.name}}
                    <button v-if="searchResult.id" @click="handleResultClick(searchResult)">Join</button>
                </div>
                <template v-if="activeTab === TabName.rooms">
                    <div v-for="room in userStore.rooms" @click="handleRoomClick(room)" :key="room.id"
                        class="cursor-pointer border-b border-gray-300 py-4">
                        {{ room.name }}
                    </div>
                </template>
                <template v-if="activeTab === TabName.friends">
                    <div v-for="friend in userStore.friends" @click="handleFriendClick(friend)" :key="friend.id"
                        class="cursor-pointer">{{ friend.friend_info.username }}</div>
                </template>
            </div>
        </div>
        <div class="flex-auto">
            <router-view></router-view>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import router from '@/router'
import { ref } from 'vue'
import serverApi from '@/api'
import { RouterLink } from 'vue-router'


enum TabName {
    rooms = 'rooms',
    friends = 'friends'
}
const userStore = useUserStore()
const activeTab = ref<TabName>(TabName.rooms)
const tabs = ref([
    {
        name: TabName.rooms,
        label: 'rooms'
    },
    {
        name: TabName.friends,
        label: 'friends'
    }
])
// const collapsed = ref(false)
const handleLogout = () => {
    userStore.logout()
    router.push('/login')
}
const handleRoomClick = (room: any) => {
    router.push({
        name: 'room',
        params: {
            roomId: room.id
        }
    })
}
const handleFriendClick = (friend: any) => {
    router.push({
        name: 'friend',
        params: {
            friendId: friend.friend_info.id
        }
    })
}

// 搜索
const searchQuery = ref('')
const searchResult = ref<any>({})
const handleSearch = () => {
    if (activeTab.value === TabName.rooms) {
        serverApi.GetRoomInfo(searchQuery.value).then((res: any) => {
            console.log(res.data)
            searchResult.value = res.data
        })
    } else if (activeTab.value === TabName.friends) {
        serverApi.GetUserInfo(searchQuery.value).then((res: any) => {
            console.log(res.data)
            searchResult.value = res.data
        })

    }
}
const handleResultClick = (result: any) => {
    if (activeTab.value === TabName.rooms) {
        serverApi.apply({
            room_id: result.id
        }).then((res: any) => {
            console.log(res.data)
        })
    } else if (activeTab.value === TabName.friends) {
        serverApi.apply({
            apply_user_id: result.id
        }).then((res: any) => {
            console.log(res.data)
        })
    }
}
</script>
<style lang="scss">
// .talk-layout {
//     // display: flex;
//     height: 100dvh;
//     // overflow: hidden;
//     // gap: .6vw;

//     &-menu {
//         // width: 16vw;
//         height: 100%;
//         background: #f5f5f5;
//         // padding: .6vw;
//         position: relative;

//         &-item {
//             // padding: .6vw;
//         }

//         &-bottom {
//             // position: absolute;
//             // bottom: 0;
//             // left: 0;
//         }
//     }

//     .talk-layout-content {
//         // flex: 1;
//         height: 100%;
//     }
// }</style>