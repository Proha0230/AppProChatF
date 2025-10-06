<template>
  <UsersList
      :user-list="myContacts"
      is-my-contact-mode
  />
</template>

<script setup lang="ts">
import UsersList from '../users/usersList.vue'
import { useContactStore } from "~/pinia/contact"
import { storeToRefs } from "pinia"

const { $api } = useNuxtApp()

const contactStore = useContactStore()
const { myContacts } = storeToRefs(contactStore)

contactStore.getMyContacts($api)
</script>


<style scoped lang="scss">

</style>