<template>
  <UsersList
      :user-list="mySentInviteContacts"
      is-my-sent-invite-contact-mode
  />
</template>

<script setup lang="ts">
import UsersList from '../users/usersList.vue'
import { useContactStore } from "~/pinia/contact"
import { storeToRefs } from "pinia"

const { $api } = useNuxtApp()

const contactStore = useContactStore()
const { mySentInviteContacts } = storeToRefs(contactStore)

contactStore.getSentInviteContacts($api)

</script>


<style scoped lang="scss">

</style>