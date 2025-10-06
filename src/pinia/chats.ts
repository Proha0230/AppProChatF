import { defineStore } from "pinia"

interface UserContactObjectResponse {
    userName: string,
    userAvatar: string,
    userStatus: string
}

export const useChatsStore = defineStore("chatsStore", {
    state: () => ({
        // myChatsNam: [] as Array<UserContactObjectResponse>,
        // mySentInviteContacts: [] as Array<UserContactObjectResponse>,
        // myContacts: [] as Array<UserContactObjectResponse>,
    }),

    actions: {
        async createChat($api : any) {
            const { data } = await $api.get("/users-contact/all-sends-invite")
            console.log(data)
        }
    }

})