import {defineStore} from "pinia"

interface UserContactObjectResponse {
    userName: string,
    userAvatar: string,
    userStatus: string
}

export const useContactStore = defineStore("contactStore", {
    state: () => ({
        myGetInviteContacts: [] as Array<UserContactObjectResponse>,
        mySentInviteContacts: [] as Array<UserContactObjectResponse>,
        myContacts: [] as Array<UserContactObjectResponse>,
    }),

    actions: {
        async getGetInviteContacts($api : any) {
            const { data } = await $api.get("/users-contact/all-sends-invite")
            this.myGetInviteContacts = data
        },

        async getSentInviteContacts($api : any) {
            const { data } = await $api.get("/users-contact/all-whom-sent-invite")
            this.mySentInviteContacts = data
        },

        async getMyContacts($api : any) {
            const { data } = await $api.get("/users-contact/get-all")
            this.myContacts = data
        }
    }

})