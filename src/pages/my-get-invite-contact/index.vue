<template>
  <UsersList
      :user-list="userList"
      is-my-get-invite-contact-mode
  />
</template>

<script setup lang="ts">
import UsersList from '../users/usersList.vue'
import { useCookie } from "#app"

const { $api } = useNuxtApp()
const authToken = useCookie("app-pro-chat.auth.token")

const userList = ref()

async function getAllSendInviteUsers() {
  const { data } = await $api.get("/users-contact/all-sends-invite", {
    headers: {
      Authorization: authToken.value
    }
  })
  userList.value = data.map((user: { userName: string, userAvatar: string, userInviteList: string, userContactList: string }) => {
    return {
      ...user,
      userContactList: JSON.parse(user.userContactList)
    }
  })
}

getAllSendInviteUsers()
</script>


<style scoped lang="scss">

</style>