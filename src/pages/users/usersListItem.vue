<template>
  <a-card
    class="users-list-item"
    hoverable style="width: 240px"
  >
    <template #cover>
      <a-image
          :preview="isVisiblePreview"
          :width="200"
          :src="userData.userAvatar"
          @click="isVisiblePreview = true"
      />
    </template>

    <a-card-meta :title="userData.userName">
      <template
          #description
      >
        <div
            class="users-list-item__card-contacts-length"
            v-text="`Контактов: ${userData.userContactList?.length}`"
        />

        <div
            v-if="isMyGetInviteContactMode || isMyContactMode"
            class="users-list-item__card-buttons"
        >
          <a-button
              type="primary"
              @click="onAcceptInvite"
          >{{isMyGetInviteContactMode ? 'Принять' : 'Написать'}}</a-button>

          <a-button
              danger
              @click="onDeclineInvite"
          >{{isMyGetInviteContactMode ? 'Отклонить' : 'Удалить'}}</a-button>
        </div>

        <a-button
          v-if="!isUserCard && !isUserAddedToInviteList && !isMyGetInviteContactMode && !isMyContactMode && !isUserContact"
          class="users-list-item__card-button-add"
          @click="addToContact"
        >+ Добавить в контакты</a-button>

        <div
          v-else-if="isUserCard && !isUserAddedToInviteList && !isMyGetInviteContactMode && !isMyContactMode && !isUserContact"
          v-text="'Это вы'"
        />

        <div
            v-else-if="!isMyGetInviteContactMode && !isMyContactMode && !isUserContact"
            v-text="'Вы отправили запрос'"
        />

        <div
          v-else-if="isUserContact && (!isMyGetInviteContactMode && !isMyContactMode)"
          v-text="'В списке ваших контактов'"
        />

      </template>
    </a-card-meta>
  </a-card>
</template>

<script setup lang="ts">

import { computed } from "vue";
import { useUserStore } from "~/pinia/user";
import { storeToRefs } from "pinia";

interface IProps {
  userData?: {
    userName?: string,
    userAvatar?: string,
    userInviteList?: Array<string>,
    userContactList?: Array<string>
  }
  isMyGetInviteContactMode?: boolean
  isMyContactMode?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  userData: () => ({
    userName: "",
    userAvatar: "",
    userInviteList: [],
    userContactList: []
  }),
  isMyGetInviteContactMode: false,
  isMyContactMode: false
})

const { $api } = useNuxtApp()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isVisiblePreview = ref(false)

const isUserCard = computed(() => {
  return user.value?.userName === props.userData?.userName
})

const isUserAddedToInviteList = computed(() => {
  return props.userData?.userInviteList?.includes(user.value?.userName)
})

const isUserContact = computed(() => {
  return user.value.userContactList?.includes(props.userData?.userName)
})

async function addToContact() {
  if (!isUserCard.value) {
    await $api.post("/users-contact/send-invite",
      {
      userSendInviteLogin: user.value?.userName,
      userGetInviteLogin: props.userData?.userName
    })
  }
}

async function onAcceptInvite() {
  if (props.isMyGetInviteContactMode) {
    await $api.post("/users-contact/accept-invite",
        {
          userSendInviteLogin: props.userData?.userName,
          userGetInviteLogin: user.value?.userName
        }
    )
  }

  if (props.isMyContactMode) {

  }
}

async function onDeclineInvite() {
  if (props.isMyGetInviteContactMode) {
    await $api.post("/users-contact/decline-invite",
        {
          userSendInviteLogin: props.userData?.userName,
          userGetInviteLogin: user.value?.userName
        }
    )
  }

  if (props.isMyContactMode) {
    await $api.post("/users-contact/delete-contact",
        {
          currentUserLogin: user.value?.userName,
          deleteUserLogin: props.userData?.userName
        }
    )
  }
}
</script>

<style scoped lang="scss">
.users-list-item {
  padding-top: 2rem;

  :deep(.ant-card-cover) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.users-list-item__card-contacts-length {
  margin-bottom: 1rem;
}

.users-list-item__card-buttons {
  display: flex;
  justify-content: space-between;
}

.users-list-item__card-button-add {
  width: 100%;
}
</style>