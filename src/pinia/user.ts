import { defineStore } from "pinia"
import {useCookie} from "#app";

export const useUserStore = defineStore("userStore", {
    state: () => ({
    isUserAuth: false as boolean,
    user: {} as any
    }),

    actions: {},

    getters: {
        getUserAuth(state) {
            const userAuthCookie = useCookie('app-pro-chat.auth.token')
            return state.isUserAuth || !!userAuthCookie.value
        }
    }
})