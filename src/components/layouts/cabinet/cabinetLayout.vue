<template>
  <a-layout class="root-layout">
    <cabinetHeader />

    <a-layout>
      <a-layout-sider
          :collapsible="true"
          :trigger="null"
          >
        <a-menu
            v-model:openKeys="openKeys"
            :selectedKeys="selectedKeys"
            style="width: 256px"
            mode="vertical"
            :items="items"
            @click="onClickMenu"
        />
      </a-layout-sider>

      <a-layout-content
          id="cabinet-layout-main-content"
          class="main-content oc-scrollbar"
      >
        <slot name="content" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import {
  MailOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  BookOutlined,
  SettingOutlined,
  UserAddOutlined,
  PlusCircleOutlined
} from '@ant-design/icons-vue'
import cabinetHeader from './cabinetHeader.vue'
import { useRouter } from "#app"
import { useUserStore } from "~/pinia/user"
import { useContactStore } from "~/pinia/contact"

const router = useRouter()
const { $api } = useNuxtApp()

const userStore = useUserStore()
const contactStore = useContactStore()

const openKeys = ref([])
const selectedKeys = computed(() => {
  const fullPath = router.currentRoute.value.fullPath

  const matchPath = items.value.find(item => fullPath.includes(item.path))

  return matchPath ? [matchPath.key] : [""]
})

const items = ref([
  {
    key: 'users',
    icon: () => h(UsergroupAddOutlined),
    label: 'Поиск контактов',
    title: 'Navigation One',
    path: 'users'
  },
  {
    key: 'my-profile',
    icon: () => h(UserOutlined),
    label: 'Мой профиль',
    title: 'Navigation One',
    path: 'my-profile'
  },
  {
    key: 'my-contact',
    icon: () => h(BookOutlined),
    label: 'Мои контакты',
    title: 'Navigation Two',
    path: 'my-contacts'
  },
  {
    key: 'my-get-invite-contact',
    icon: () => h(UserAddOutlined),
    label: 'Мои приглашения в контакты',
    title: 'Navigation Two',
    path: 'my-get-invite-contact'
  },
  {
    key: 'my-sent-invite-contact',
    icon: () => h(PlusCircleOutlined),
    label: 'Мои исходящие заявки',
    title: 'Navigation Two',
    path: 'my-sent-invite-contact'
  },
  {
    key: 'my-chats',
    icon: () => h(MailOutlined),
    label: 'Мои чаты',
    title: 'Navigation One',
    path: 'my-chats'
  },
  {
    key: 'edit-profile',
    icon: () => h(SettingOutlined),
    label: 'Настройки профиля',
    title: 'Navigation Two',
    path: 'edit-profile'
  }
])

function onClickMenu(event) {
  router.push(`/${event.item.path}`)
}

userStore.getUserInfo($api)
contactStore.getMyContacts($api)
</script>

<style scoped lang="scss">

</style>