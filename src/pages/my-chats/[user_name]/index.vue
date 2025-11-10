<template>
  <div class="my-chats-with-user">
  <div class="my-chats-with-user-info">
    <a-avatar
        :src="getUserAvatar"
        size="large"
        alt=""
    />

    <div class="my-chats-with-user-info__name-and-status">
      <div
          class="my-chats-with-user-info__name"
          v-text="loginUserWithWhomChatIsOpened"
      />

      <div
          class="my-chats-with-user-info__status"
          v-text="'online'"
      />
    </div>
  </div>

  <div class="my-chats-with-user__list-block">
    <a-list
        class="my-chats-with-user__list"
        item-layout="horizontal"
        :data-source="chatWithUserMessagesList"
    >
      <template #renderItem="{ item, index }">
        <div
            v-if="shouldShowDate(index)"
            v-text="splitDate(item.messageDispatchTime).date"
            class="my-chats-with-user__list-date"
        />

        <a-list-item
          :class="['my-chats-with-user__item', { 'my-chats-with-user__item_main-user': isUserMainMessage(item.userWhoWrote)}]"
        >
          <a-list-item-meta>
            <template #title>
              <div class="my-chats-with-user__item-content">
                <div
                    class="my-chats-with-user__item-messages-text"
                    v-text="item.messageText"
                />

                <div
                    class="my-chats-with-user__item-messages-date"
                    v-text="splitDate(item.messageDispatchTime).time"
                />

                <div
                    v-if="isUserMainMessage(item.userWhoWrote)"
                    class="my-chats-with-user__item-messages-options"
                >
                <a-dropdown :trigger="['click']">
                    <EllipsisOutlined class="my-chats-with-user__item-messages-options-icon"/>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item
                          @click="deleteOrEdit('edit', item.messageId, item.messageText)"
                          key="edit"
                      >Редактировать</a-menu-item>

                      <a-menu-item
                          @click="deleteOrEdit('delete', item.messageId)"
                          key="delete"
                      >Удалить</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
                </div>
              </div>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>

    <div class="my-chats-with-user__input">
      <a-textarea
          v-model:value="textAreaValue"
          :autoSize="{ minRows: 2, maxRows: 6 }"
          :maxlength="255"
          show-count
          name="message-input"
      />

      <SendOutlined
          @click="onClickAction"
          class="my-chats-with-user__input-icon-send"
      />
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/pinia/user"
import { storeToRefs } from "pinia"
import { useContactStore } from "~/pinia/contact"
import { useChatsStore } from "~/pinia/chats"

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const contactStore = useContactStore()
const { myContacts } = storeToRefs(contactStore)

const chatsStore = useChatsStore()
const { chatWithUserMessagesList, loginUserWithWhomChatIsOpened } = storeToRefs(chatsStore)

const { $api } = useNuxtApp()

const textAreaValue = ref()
const editOrDeleteMessageId = ref("")

const getUserAvatar = computed(() => {
  return myContacts.value?.find((item => item.userName === loginUserWithWhomChatIsOpened.value))?.userAvatar || ''
})

async function deleteOrEdit(mode: string, idMessage: string, messageText?: string) {
  switch (mode) {
    case 'edit':
      editOrDeleteMessageId.value = idMessage
      textAreaValue.value = messageText
      break;

    case 'delete':
      editOrDeleteMessageId.value = idMessage
      await onDeleteMessage()
      break;
  }
}

async function onClickAction() {
  if (editOrDeleteMessageId.value) {
    await onEditMessage()
  } else {
    await onSendMessage()
  }

}

//TODO отправка сообщения
async function onSendMessage() {
  if (textAreaValue.value?.trim()?.length) {
    // добавить на бэке возвращаемое сообщение чтобы мы запушили его
    await chatsStore.sendMessage($api, {
      userWhoWrote: user.value.login,
      userWhoReceived: loginUserWithWhomChatIsOpened.value,
      messageText: textAreaValue.value,
      messageIsText: true,
      messageIsImage: false,
      messageIsVoice: false,
      messageIsEditable: false
    })
  }

  textAreaValue.value = ""
}

//TODO удаление сообщения
async function onDeleteMessage() {
  await chatsStore.deleteMessage($api,
      {
        idMessage: editOrDeleteMessageId.value,
        userWhoReceived: loginUserWithWhomChatIsOpened.value
      })
  chatWithUserMessagesList.value = chatWithUserMessagesList.value.filter((item) => item.messageId !== editOrDeleteMessageId.value)

  editOrDeleteMessageId.value = ""
}

//TODO редактирование сообщения
async function onEditMessage() {
  if (textAreaValue.value?.trim()?.length) {
    await chatsStore.editMessage($api,
        {
          idMessage: editOrDeleteMessageId.value,
          userWhoReceived: loginUserWithWhomChatIsOpened.value,
          messageText: textAreaValue.value
        })

    chatWithUserMessagesList.value.forEach((item) => {
      if (item.messageId === editOrDeleteMessageId.value) {
        item.messageText = textAreaValue.value
      }
    })
  }

  editOrDeleteMessageId.value = ""
  textAreaValue.value = ""
}

//TODO определяем что это сообщение текущего юзера
function isUserMainMessage(userLogin: string) {
  return user.value.login === userLogin
}

//TODO для отображения даты перед сообщениями если написаны в разные дни
function shouldShowDate(index: number) {
  const current = chatWithUserMessagesList.value?.[index]
  const prev = chatWithUserMessagesList.value?.[index - 1]

  const currentDate = current ? splitDate(current.messageDispatchTime as string).date : undefined
  const prevDate = prev ? splitDate(prev.messageDispatchTime as string).date : undefined

  // показываем, если это первый элемент или дата отличается от предыдущей
  return index === 0 || currentDate !== prevDate
}

//TODO делим дату на 3 части
function splitDate(dateMessage: string) {
  let change: string = ""
  let date: string
  let time: string

  let str = dateMessage

  if (str.startsWith("Изменено")) {
    change = "Изменено"
    str = str.replace("Изменено в ", "")
  }

  const [partOne, partTwo] = str.split(" в ")
  date = partOne?.trim() || ""
  time = partTwo?.trim() || ""

  return {
    change,
    date,
    time
  }
}

// загружаем чат с юзером
onBeforeMount(() => {
  chatsStore.getChatWithUser($api, loginUserWithWhomChatIsOpened.value as string)
})
</script>

<style scoped lang="scss">
.my-chats-with-user {
  height: 100%;
  position: relative;
  background-image: url("@/assets/backgroundChat/messages-light-blue.jpg");
  background-size: cover;          /* адаптивно растягивается */
  background-position: center;     /* центрирует */
  background-repeat: no-repeat;

  :deep(.ant-list-item-meta-title) {
    margin-top: 0;
  }

  :deep(.ant-list-item-meta-avatar),
  :deep(.ant-avatar) {
    width: 4rem;
    height: 4rem;
  }
}

.my-chats-with-user-info__name-and-status {
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.my-chats-with-user-info__name {
  font-size: 1.6rem;
  font-weight: 500;
}

.my-chats-with-user__list-block {
  position: absolute;
  width: 100%;
  top: 7rem;
  height: calc(100% - 6rem);
  overflow-x: auto;
}

.my-chats-with-user-info {
  position: absolute;
  height: 6rem;
  width: 100%;
  top: 0;
  padding: 1rem;
  display: flex;
  background-color: aliceblue;
}

.my-chats-with-user__list-date {
  text-align: center;
  border: solid 0.1rem black;
  display: flex;
  width: fit-content;
  margin-inline: auto;
  padding: 0 0.5rem;
  border-radius: 1rem;
  background-color: aliceblue;
}

.my-chats-with-user__item {
  display: flex;
  width: fit-content;
  max-width: 50%; // для мобилки < 768 сделать 80%
  border: solid 0.1rem black;
  border-radius: 1rem;
  padding: 0.5rem;
  margin: 1rem;
  background-color: lavender;
  border-block-end: solid 0.1rem black !important;

  :deep(.ant-list-item-meta-description) {
    word-break: break-all;
    color: black !important;
  }

  :deep(.ant-list-item-meta-content) {
    width: fit-content !important;
  }

  :deep(.ant-list-item-meta-title) {
    margin-bottom: 0 !important;
  }
}

.my-chats-with-user__item_main-user {
  justify-self: right;
  background-color: aliceblue;
}

.my-chats-with-user__item-messages-date {
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 1.1rem;
  color: gray;
}

.my-chats-with-user__item-messages-options {
  position: absolute;
  top: 0;
  right: 0;
  margin-top: -0.5rem;
}

.my-chats-with-user__item-messages-options-icon {
  :deep(svg) {
    width: 3rem;
    height: 3rem;
    color: gray;

    &:hover {
      color: deepskyblue;
    }
  }
}

.my-chats-with-user__item-content {
  position: relative;
  min-height: 4rem;
}

.my-chats-with-user__item-messages-text {
  margin-right: 4rem;
}

.my-chats-with-user__input {
  display: flex;
  padding: 1rem;
  position: absolute;
  width: 100%;
  bottom: 1rem;
  border-top: solid 0.1rem black;
  background-color: aliceblue;

  :deep(.ant-input-textarea) {
    width: 100%;
    margin-right: 1rem;
  }
}

.my-chats-with-user__input-icon-send {
  :deep(svg) {
    width: 4rem;
    height: 3rem;
    color: steelblue;
    cursor: pointer;

    &:hover {
      color: deepskyblue;
    }
  }
}
</style>