<template>
<div class="my-profile">
  <div class="my-profile-avatar">
    <a-image
        class="my-profile-avatar__image"
        :preview="isVisiblePreview"
        :width="200"
        :src="user.userAvatar"
        @click="isVisiblePreview = true"
    />

    <a-upload
        :customRequest="onUploadAvatar"
        :show-upload-list="false"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        Изменить фото
      </a-button>
    </a-upload>
  </div>

  <div class="my-profile-status">
    <div
      class="my-profile-status__title"
      v-text="'Статус: '"
    />

    <div
      class="my-profile-status__value"
      v-text="user.userStatus"
    />

    <EditOutlined
      class="my-profile-status__change-status"
    />
  </div>

  <div class="my-profile-name">
    <div
      class="my-profile-name__title"
      v-text="'Мой никнейм: '"
    />

    <div
      class="my-profile-name__value"
      v-text="user.userName"
    />
  </div>

  <div
      class="my-profile-contacts"
      @click="goToUserContacts"
  >
    <div
        class="my-profile-contacts__info"
        v-text="`Мои контакты: ${user.userContactList?.length}`"
    />
  </div>
</div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/pinia/user"
import { storeToRefs } from "pinia"
import { useCookie, useRouter } from "#app"

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const { $api } = useNuxtApp()
const router = useRouter()
const userAuthCookie = useCookie('app-pro-chat.auth.token')

const isVisiblePreview = ref(false)

async function onUploadAvatar(file) {
  const formData = new FormData()
  console.log(file, "file")
  formData.append("file", file.file)

  await $api.post("/users-profile/change-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: userAuthCookie.value
    }
  })

  await userStore.getUserInfo($api)
}

function goToUserContacts() {
  router.push("/my-contacts")
}

async function getImageDimensions(file: File) {
  const img = new Image()
  img.src = URL.createObjectURL(file)
  await img.decode()
  const { width, height } = img
  return {
    width,
    height
  }
}
</script>

<style scoped lang="scss">
.my-profile {
  padding: 2rem;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.my-profile-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  :deep(.my-profile-avatar__image) {
    margin-bottom: 1.5rem;
    border-radius: 50%;
  }
}

.my-profile-avatar__button {
  margin-top: 1.5rem;
}

.my-profile-status,
.my-profile-name,
.my-profile-contacts {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  font-size: 1.6rem;
}

.my-profile-contacts {
  padding: 1rem 2rem;
  border: 0.1rem solid gray;
  color: gray;
  border-radius: 1.5rem;

  &:hover {
    border-color: cadetblue;
    color: cadetblue;
    cursor: pointer;
  }
}

.my-profile-status__change-status,
.my-profile-name__change-icon {

  &:hover {
    color: cadetblue;
    cursor: pointer;
  }
}

</style>