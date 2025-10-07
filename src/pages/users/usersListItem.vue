<template>
  <a-card
    :class="['users-list-item', { 'users-list-item_my-contact-mode': isMyContactMode || isMyGetInviteContactMode }]"
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
          v-if="!isUserCard && !isUserAddedToInviteList && !isMyGetInviteContactMode && !isMyContactMode && !isUserWhomSentInvite && !isUserAddedToContactList"
          class="users-list-item__card-button-add"
          @click="addToContact"
        >+ Добавить в контакты</a-button>

        <div
          v-else-if="isUserCard && !isUserAddedToInviteList && !isMyGetInviteContactMode && !isMyContactMode"
          v-text="'Это вы'"
        />

        <div
            v-else-if="!isMyContactMode && isUserWhomSentInvite"
            v-text="'Вы отправили запрос на добавление в контакты'"
        />

        <div
            v-else-if="!isMyContactMode && isUserAddedToInviteList"
            v-text="'Получен запрос на добавление в контакты'"
        />

        <div
          v-else-if="!isMyContactMode && isUserAddedToContactList"
          v-text="'В списке ваших контактов'"
        />

      </template>
    </a-card-meta>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useUserStore } from "~/pinia/user"
import { useChatsStore } from "~/pinia/chats"
import { storeToRefs } from "pinia"

interface UserContactObjectResponse {
  userName: string,
  userAvatar: string,
  userStatus: string
}

interface IProps {
  userData?: UserContactObjectResponse
  isMyGetInviteContactMode?: boolean
  isMyContactMode?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  userData: () => ({
    userName: "",
    userAvatar: "",
    userStatus: ""
  }),
  isMyGetInviteContactMode: false,
  isMyContactMode: false
})

const { $api } = useNuxtApp()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const chatStore = useChatsStore()

const isVisiblePreview = ref(false)

const isUserCard = computed(() => {
  return user.value?.login === props.userData?.userName
})

const isUserAddedToInviteList = computed(() => {
  return user.value.usersInInviteList?.includes(props.userData?.userName)
})

const isUserAddedToContactList = computed(() => {
  return user.value.usersInContactList?.includes(props.userData?.userName)
})

const isUserWhomSentInvite = computed(() => {
  return user.value.usersWhomISentInvite?.includes(props.userData?.userName)
})



async function addToContact() {
  if (!isUserCard.value) {
    await $api.post("/users-contact/send-invite",
      {
      userSendInviteLogin: user.value?.login,
      userGetInviteLogin: props.userData?.userName
    })
  }

  user.value.usersWhomISentInvite.push(props.userData?.userName)
}

async function onAcceptInvite() {
  if (props.isMyGetInviteContactMode) {
    await $api.post("/users-contact/accept-invite",
        {
          userSendInviteLogin: props.userData?.userName,
          userGetInviteLogin: user.value?.login
        }
    )

    // удаляем юзера из списка тех кто кинул инвайт
    user.value.usersInInviteList = user.value.usersInInviteList.filter(user => user !== props.userData?.userName)
    // добавляем юзера в список контактов
    user.value.usersInContactList.push(props.userData?.userName)
  }

  if (props.isMyContactMode) {
      await onCreateChat()
  }
}

async function onDeclineInvite() {
  if (props.isMyGetInviteContactMode) {
    await $api.post("/users-contact/decline-invite",
        {
          userSendInviteLogin: props.userData?.userName,
          userGetInviteLogin: user.value?.login
        }
    )

    // удаляем юзера из списка тех кто кинул инвайт
    user.value.usersInInviteList = user.value.usersInInviteList.filter(user => user !== props.userData?.userName)
  }

  if (props.isMyContactMode) {
    await $api.post("/users-contact/delete-contact",
        {
          currentUserLogin: user.value?.login,
          deleteUserLogin: props.userData?.userName
        }
    )

    // удаляем юзера из списка контактов
    user.value.usersInContactList = user.value.usersInContactList.filter(user => user !== props.userData?.userName)

  }
}

async function onCreateChat() {
  await chatStore.createChat($api, props.userData?.userName)
}
</script>

<style scoped lang="scss">
.users-list-item {
  padding-top: 2rem;

  &.users-list-item_my-contact-mode {
    :deep(.ant-card-meta-description) {
      text-align: center;
    }
  }

  :deep(.ant-card-meta-description) {
    display: flex;
    gap: 1rem;
    flex-direction: column;
  }

  :deep(.ant-card-cover) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :deep(.ant-image-img) {
    max-width: 20rem;
    max-height: 20rem;
    border-radius: 1.6rem 1.6rem 0 0;
  }

  :deep(.ant-card-meta-detail) {
    min-height: 8rem;
    padding: 0 1rem;
  }
}

.users-list-item__card-contacts-length {
  margin-bottom: 1rem;
}

.users-list-item__card-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;

  :deep(.ant-btn:hover) {
    cursor: pointer;
  }
}

.users-list-item__card-button-add {
  width: 100%;
}
</style>