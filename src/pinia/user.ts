import { defineStore } from "pinia"
import {useCookie} from "#app";

interface UserInfoObjectResponse {
    login: string,
    avatar: string,
    lang: string,
    status: string,
    chatsList: Array<string>,
    blackList: Array<string>,
    usersInContactList: Array<string>,
    usersInInviteList: Array<string>,
    usersWhomISentInvite: Array<string>
}

export const useUserStore = defineStore("userStore", {
    state: () => ({
    isUserAuth: false as boolean,
    user: {} as UserInfoObjectResponse
    }),

    actions: {
        async getUserInfo($api: any) {
            const { data } = await $api.get("/users-auth/get-info")

            this.user = {
                ...data,
                usersWhomISentInvite: JSON.parse(data.usersWhomISentInvite),
                usersInInviteList: JSON.parse(data.usersInInviteList),
                usersInContactList: JSON.parse(data.usersInContactList),
                chatsList: JSON.parse(data.chatsList),
                blackList: JSON.parse(data.blackList)
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