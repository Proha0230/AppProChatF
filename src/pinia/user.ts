import { defineStore } from "pinia"
import {useCookie} from "#app";

export const useUserStore = defineStore("userStore", {
    state: () => ({
    isUserAuth: false as boolean,
    user: {} as { userName: string, userAvatar: string, userStatus: string, userContactList: Array<string>, userInviteList: Array<string> }
    }),

    actions: {
        async getUserInfo($api: any) {
            const authToken = useCookie("app-pro-chat.auth.token")

            const { data } = await $api.get("/users-auth/get-info", {
                headers: {
                    Authorization: authToken.value
                }
            })

            this.user = {
                userName: data.login,
                userAvatar: data.userAvatar,
                userStatus: data.userStatus,
                userInviteList: JSON.parse(data.userInviteList),
                userContactList: JSON.parse(data.userContactList)
            }
        }
    },

    getters: {
        getUserAuth(state) {
            const userAuthCookie = useCookie('app-pro-chat.auth.token')
            return state.isUserAuth || !!userAuthCookie.value
        }
    }
})