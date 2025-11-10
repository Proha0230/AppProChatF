import { defineStore } from "pinia"

interface userChatItem {
    userAvatar: string,
    userLogin: string
}

interface resultMessageInChatList {
    userWhoWrote: string,
    userWhoReceived: string,
    messageDispatchTime?: string,
    messageText: string,
    messageIsText: boolean,
    messageIsImage: boolean,
    messageIsVoice: boolean,
    messageIsEditable: boolean,
    messageId?: string
}

export const useChatsStore = defineStore("chatsStore", {
    state: () => ({
        allUserChats: [] as Array<userChatItem>,
        chatWithUserMessagesList: [] as Array<resultMessageInChatList>,
        loginUserWithWhomChatIsOpened: "" as string
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
        },

        async getChatWithUser($api: any, loginWithWhomWeRequestChat: string) {
            const { data } = await $api.post("/chats/go-to-user-chat", {
                loginWithWhomWeRequestChat
            })

            this.chatWithUserMessagesList = data
        },

        async editMessage($api: any, data: { idMessage: string, userWhoReceived: string, messageText: string }) {
            await $api.post("/chat-message/edit-message", {
                ...data
            })
        },

        async sendMessage($api: any, data: resultMessageInChatList) {
            await $api.post("/chat-message/send", {
                ...data
            })
        },

        async deleteMessage($api: any, data: { idMessage: string, userWhoReceived: string }) {
            await $api.post("/chat-message/delete-message", {
                ...data
            })
        },
    }

})