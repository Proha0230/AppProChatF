import { defineStore } from "pinia"

interface userChatItem {
    userAvatar: string,
    userLogin: string
}

export const useChatsStore = defineStore("chatsStore", {
    state: () => ({
        allUserChats: [] as Array<userChatItem>
    }),

    actions: {
        async createChat($api : any, loginUserWithWhomCreate: string) {
            const response = await $api.post("/chats/create", {
                    loginUserWithWhomCreate
            })
            console.log(response)
        },

        async deleteChat($api : any, loginUserWithWhomDeleteChat: string) {
            const response = await $api.post("/chats/delete", {
                loginUserWithWhomDeleteChat
            })
            console.log(response)
        },

        async getAllUserChats($api : any) {
            const { data } = await $api.get("/chats/all-user-chats")
            this.allUserChats = data
        }
    }

})