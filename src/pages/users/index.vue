<template>
  <UsersList
  :user-list="userList"
  />
</template>

<script setup lang="ts">
import UsersList from "./usersList.vue"
import { ref } from "vue"

interface UserContactObjectResponse {
  userName: string,
  userAvatar: string,
  userStatus: string
}

const { $api } = useNuxtApp()

const userList = ref<Array<UserContactObjectResponse>>()

async function getAllUserList() {
  const { data } = await $api.get("/users-contact/all-users-list")
  userList.value = data.usersList
}

getAllUserList()
</script>


<style scoped lang="scss">

</style>