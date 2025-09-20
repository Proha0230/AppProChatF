<template>
  <div
    v-if="userList.length"
    class="users-list"
  >
    <div
      class="users-list__item"
      v-for="(user, index) in userList"
      :key="index"
    >
      <UsersListItem
        :user-data="user"
        :is-my-get-invite-contact-mode="isMyGetInviteContactMode"
        :is-my-contact-mode="isMyContactMode"
      />
    </div>
  </div>

  <div
    v-else-if="isMyGetInviteContactMode"
    class="users-empty-list"
  >
    <a-empty :description="'У вас пока нет заявок на добавление в контакты'" />
  </div>
</template>

<script setup lang="ts">
import UsersListItem from './usersListItem.vue'

interface IProps {
  userList?: Array<{ userName: string, userAvatar: string, userInviteList: Array<string>, userContactList: Array<string> }>
  isMyGetInviteContactMode?: boolean
  isMyContactMode?: boolean
}
withDefaults(defineProps<IProps>(), {
  userList: () => ([]),
  isMyGetInviteContactMode: false,
  isMyContactMode: false
})
</script>

<style scoped lang="scss">

.users-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 2rem;
  padding: 2rem;
}

.users-empty-list {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>