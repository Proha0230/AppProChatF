<template>
  <a-page-header
      class="demo-page-header"
      style="border: 1px solid rgb(235, 237, 240)"
      title="AppProChat"
      @back="() => $router.go(-1)"
  >
    <template #extra>
      <a-button
          key="1"
          type="primary"
          @click="signOut"
      >
        Выйти из аккаунта</a-button>
    </template>
  </a-page-header>
</template>

<script setup lang="ts">
import { useUserStore } from "~/pinia/user"
import { storeToRefs } from "pinia"
import { useCookie } from "#app"

const userStore = useUserStore()
const { isUserAuth } = storeToRefs(userStore)

function signOut() {
  isUserAuth.value = false
  const userAuthCookie = useCookie('app-pro-chat.auth.token')
  userAuthCookie.value = undefined
}

</script>

<style scoped lang="scss">

</style>