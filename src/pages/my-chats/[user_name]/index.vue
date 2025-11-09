<template>
  <div v-text="`Ваш чат с ${route.params.user_name}`"/>

  <div>
    <a-list
        class="my-chats-with-user"
        item-layout="horizontal"
        :data-source="data"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
          >
            <template #title>
              <div v-text="route.params.user_name"/>
            </template>

            <template #avatar>
              <a-avatar src="https://joeschmoe.io/api/v1/random" />
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/pinia/user"
import {storeToRefs} from "pinia"

const route = useRoute()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const data = ref([{}, {}])

const isUserMessage = computed(() => {

})

</script>

<style scoped lang="scss">
.my-chats-with-user {
  :deep(.ant-list-item-meta-title) {
    margin-top: 0;
  }

  :deep(.ant-list-item-meta-avatar),
  :deep(.ant-avatar) {
    width: 4rem;
    height: 4rem;
  }
}
</style>