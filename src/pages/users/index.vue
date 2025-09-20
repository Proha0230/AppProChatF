<template>
  <UsersList
  :user-list="userList"
  />
</template>

<script setup lang="ts">
import UsersList from "./usersList.vue";

const { $api } = useNuxtApp()

const userList = ref()

async function getAllUserList() {
  const { data } = await $api.get("/users-contact/all-users-list")
  userList.value = data.usersList.map((user: { userName: string, userAvatar: string, userInviteList: string, userContactList: string }) => {
    return {
      ...user,
      userInviteList: JSON.parse(user.userInviteList),
      userContactList: JSON.parse(user.userContactList)
    }
  })
}

getAllUserList()
</script>


<style scoped lang="scss">

</style>