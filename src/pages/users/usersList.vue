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
    v-else
    class="users-empty-list"
  >
    <a-empty :description="getEmptyText" />
  </div>
</template>

<script setup lang="ts">
import UsersListItem from './usersListItem.vue'

interface UserContactObjectResponse {
  userName: string,
  userAvatar: string,
  userStatus: string
}

interface IProps {
  userList?: Array<UserContactObjectResponse>
  isMyGetInviteContactMode?: boolean
  isMyContactMode?: boolean
  isMySentInviteContactMode?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  userList: () => ([]),
  isMyGetInviteContactMode: false,
  isMyContactMode: false,
  isMySentInviteContactMode: false
})

const getEmptyText = computed(() => {
  if (props.isMyGetInviteContactMode) {
    return 'У вас пока нет заявок на добавление в контакты'
  }

  if (props.isMyContactMode) {
    return 'У вас пока нет контактов'
  }

  if (props.isMySentInviteContactMode) {
    return 'У вас нет отправленных заявок на добавление в контакты'
  }
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