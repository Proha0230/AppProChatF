<template>
  <UsersList
      :user-list="userList"
      is-my-contact-mode
  />
</template>

<script setup lang="ts">
import UsersList from '../users/usersList.vue'
import { useCookie } from "#app"

const { $api } = useNuxtApp()
const authToken = useCookie("app-pro-chat.auth.token")

const userList = ref()

async function getAllContact() {
  const { data } = await $api.get("/users-contact/get-all", {
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

getAllContact()
</script>


<style scoped lang="scss">

</style>