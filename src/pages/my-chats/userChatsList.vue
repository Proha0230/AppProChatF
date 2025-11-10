<template>
  <div v-if="chatsList.length">
  <a-list
      class="user-chats-list"
      item-layout="horizontal"
      :data-source="list"
  >
    <template
        #renderItem="{ item }"
    >
      <a-list-item>
        <template #actions>
          <div
              class="user-chats-list__item-delete"
              @click="deleteChat(item.userLogin)"
          >
            <DeleteOutlined />
          </div>
        </template>

        <a-list-item-meta
            @click="goToChat(item.userLogin)"
        >
          <template #title>
            <!--            <a href="https://www.antdv.com/">{{ item.title }}</a>-->
            <div v-text="item.userLogin"/>
          </template>

          <template #avatar>
            <a-avatar :src="item.userAvatar" />
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
  </div>

  <div
      v-else
      class="user-chats-list-empty"
  >
    <a-empty :description="'У вас пока нет чатов'" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "#app"
import { useChatsStore } from "~/pinia/chats"
import { useUserStore } from "~/pinia/user"
import { storeToRefs } from "pinia"

interface userChatItem {
  userAvatar: string,
  userLogin: string
}

interface IProps {
  chatsList?: Array<userChatItem>
}
const props = withDefaults(defineProps<IProps>(), {
  chatsList: () => ([])
})

const router = useRouter()
const { $api } = useNuxtApp()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const chatsStore = useChatsStore()
const { allUserChats, loginUserWithWhomChatIsOpened } = storeToRefs(chatsStore)

const list = computed(() => {
  return Array.isArray(props.chatsList) ? props.chatsList : []
})

function deleteChat(userLogin: string) {
  chatsStore.deleteChat($api, userLogin)
  user.value.chatsList = user.value.chatsList.filter((chat) => chat.includes(userLogin))
  allUserChats.value = allUserChats.value.filter((chat) => chat.userLogin !== userLogin)
}

function goToChat(userLogin: string) {
  loginUserWithWhomChatIsOpened.value = userLogin
  router.push(`/my-chats/${userLogin}`)
}
</script>

<style scoped lang="scss">
.user-chats-list {
  padding: 2rem;

  :deep(.ant-list-items) {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  :deep(.ant-list-item) {
    background-color: #FFFFFF;
    border-radius: 0.8rem;

    &:hover {
      cursor: pointer;

      .ant-list-item-meta-title {
        color: #1677ff;;
      }
    }
  }

  :deep(.ant-list-item-meta) {
    align-items: center;
    gap: 1.5rem;
  }

  :deep(.ant-list-item-meta-title) {
    margin: 0 !important;

    div {
      font-size: 1.8rem;
    }
  }

  :deep(.ant-list-item-meta-avatar) {
    margin: 0 !important;
    width: 5rem;
    height: 5rem;
  }

  :deep(.ant-avatar-circle) {
    width: 100%;
    height: 100%;
  }
}

.user-chats-list__item-delete {
  padding: 1.5rem;

  &:hover {
    color: red;
  }
}

.user-chats-list-empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>