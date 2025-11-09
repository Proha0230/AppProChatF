<template>
  <a-form
      ref="resourceRef"
      layout="vertical"
      :model="resource"
      :rules="rules"
  >
    <div class="sign-up">
      <div
          v-if="!successSignUp.login && !successSignUp.password"
          class="sign-up-content"
      >
        <div
            class="sign-up-content__title"
            v-text="'Регистрация в AppProChat'"
        />

        <div class="sign-up-content__login-and-password">
            <a-form-item
              name="login"
              label="Введите ваш Логин"
            >
              <a-input
                  v-model:value="resource.login"
                  class="sign-up-content__login-input"
              />
            </a-form-item>

            <a-form-item
                name="password"
                label="Введите ваш Пароль"
            >
              <a-input-password
                  v-model:value="resource.password"
                  class="sign-up-content__password-input"
              />
            </a-form-item>
        </div>

        <div class="sign-up-content__login-and-registration">
          <a-button
            @click="signUp"
          >Регистрация</a-button>

          <a-button
            @click="signIn"
          >Назад</a-button>
        </div>

        <div class="sign-up-content_error">
          <div
              v-if="error"
              v-text="error"
          />
        </div>
      </div>

      <div v-else
           class="sign-up-success-content"
      >
        <div
            class="sign-up-success-content__title"
            v-text="'Пользователь создан!'"
        />

        <div v-text="`Ваш Логин: ${successSignUp.login }`"/>

        <div v-text="`Ваш Пароль: ${successSignUp.password }`"/>

        <a-button
          class="sign-up-success-content__button"
          @click="signIn"
        >На страницу входа</a-button>
      </div>
    </div>
  </a-form>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue"

useHead({
  title: "Регистрация - AppProChat"
})

definePageMeta({
  layout: "guest"
})

const { $api } = useNuxtApp()
const router = useRouter()

const resourceRef = ref()

const resource = reactive({
  login: "",
  password: ""
})
const error = ref()
const successSignUp = ref({
  login: "",
  password: ""
})

const rules = {
  login: [{ validator: handlersErrorLoginAndPass, required: true }],
  password: [{ validator: handlersErrorLoginAndPass, required: true }]
}

// function handlersError(rule: any, value: string) {
//   if (!value || value.trim() === '') {
//     return Promise.reject()
//   }
//
//   return Promise.resolve()
// }

function handlersErrorLoginAndPass(rule: any, value: string) {
  // проверяем длину
  if (value.trim().length < 5) {
    return Promise.reject('Минимум 5 символов');
  }

  // разрешаем только буквы и цифры
  const regex = /^[A-Za-z0-9]+$/;
  if (!regex.test(value)) {
    return Promise.reject('Только латинские буквы и цифры');
  }

  return Promise.resolve();
}


async function signUp() {
try {
    await resourceRef.value.validate()

    const { data } = await $api.post("/users-auth/sign-up", {
      login: resource.login,
      password: resource.password
    })

    if (data?.error) {
      error.value = data?.error
    } else {
      error.value = ""

      successSignUp.value = { ...data }
    }

    resource.login = ""
    resource.password = ""

  } catch(error) {
  console.log(error)
  }
}

function signIn() {
  router.push("/sign-in")
}
</script>

<style scoped lang="scss">
.sign-up {
  width: 100%;
  display: flex;
  justify-content: center;
  top: 25rem;
  position: absolute;
}

.sign-up-content__title,
.sign-up-success-content__title {
  font-size: 2rem;
  font-weight: 600;
}

.sign-up-content,
.sign-up-success-content {
  min-width: 30rem;
  height: 30rem;
  padding: 1.5rem;
  border: 0.1rem solid gray;
  border-radius: 1.2rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  position: relative;
}

.sign-up-content__login-and-password {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 90%;

  :deep(.ant-form-item) {
    margin-bottom: 0;
  }
}

.sign-up-content__login-and-registration {
  display: flex;

  gap: 1rem;
}

.sign-up-content_error {
  width: 100%;
  height: 2rem;
  text-align: center;
  color: orangered;
}

.sign-up-success-content__button {
  position: absolute;
  bottom: 3rem;
}
</style>