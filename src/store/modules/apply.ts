import { defineStore } from 'pinia'
import serverApi from "@/api";
import { User } from './user'
import { Room, useRoomStore } from './room'
import { useFriendStore } from './friend'



interface Apply {

    id: string

    // 被申请人信息
    apply_user_id?: string
    apply_user_info?: User



    // 被申请房间信息
    room_id?: string
    room_info ?: Room


    handle_status: boolean
    status: boolean

    // 申请人信息
    user_id :string
    user_info: User
    createdAt: string
    updatedAt:string

}

export const useApplyStore = defineStore('apply', {
    state: () => ({
        // 我的申请列表
        applies: [] as Apply[],
        // 待审核申请列表
        pendingApplies: [] as Apply[],
    }),
    getters: {

    },
    actions: {
        getApplies() {
            serverApi.getApply().then((res: any) => {
                console.log(res)
                this.applies = res.data
            })
        },
        getPendingApplies() {
            serverApi.GetApplyMine().then((res: any) => {
                console.log(res)
                this.pendingApplies = res.data
            })
        },
        // 处理申请
        handleApply(id: string, status: boolean) {
            serverApi.handleApply({ id, status }).then((res: any) => {
                console.log(res)
                // 处理成功后，刷新待审核申请列表
                this.getPendingApplies()
                // 处理成功后，刷新房间列表和好友列表
                status && useRoomStore().getRooms()
                status && useFriendStore().getFriends()
            })
        }
    }
})
