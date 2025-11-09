<template>
  <UserChatsList
    :chats-list="allUserChats"
  />
</template>

<script setup lang="ts">
import { useChatsStore } from "~/pinia/chats"
import UserChatsList from "~/pages/my-chats/userChatsList.vue"
import {storeToRefs} from "pinia"

const { $api } = useNuxtApp()

const chatsStore = useChatsStore()
const { allUserChats } = storeToRefs(chatsStore)

chatsStore.getAllUserChats($api)

</script>

<style scoped lang="scss">

</style>