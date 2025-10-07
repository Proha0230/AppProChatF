import { defineStore } from "pinia"

export const useChatsStore = defineStore("chatsStore", {
    state: () => ({
    }),

    actions: {
        async createChat($api : any, loginUserWithWhomCreate: string) {
            const response = await $api.post("/chats/create", {
                    loginUserWithWhomCreate
            })
            console.log(response)
        },

        async deleteChat($api : any, loginUserWithWhomCreate: string) {
            const response = await $api.post("/chats/delete", {
                loginUserWithWhomCreate
            })
            console.log(response)
        }
    }

})