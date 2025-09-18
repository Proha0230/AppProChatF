<template>
  <a-form
      ref="resourceRef"
      layout="vertical"
      :model="resource"
      :rules="rules"
  >
    <div class="sign-in">
      <div class="sign-in-content">
        <div
            class="sign-in-content__title"
            v-text="'Вход в AppProChat'"
        />

        <div class="sign-in-content__login-and-password">
            <a-form-item
              name="login"
              label="Логин"
            >
              <a-input
                  v-model:value="resource.login"
                  class="sign-in-content__login-input"
              />
            </a-form-item>

            <a-form-item
                name="password"
                label="Пароль"
            >
              <a-input-password
                  v-model:value="resource.password"
                  class="sign-in-content__password-input"
              />
            </a-form-item>
        </div>

        <div class="sign-in-content__login-and-registration">
          <a-button
              @click="signIn"
          >Вход</a-button>

          <a-button
              @click="signUp"
          >Регистрация</a-button>
        </div>

        <div class="sign-in-content_error">
          <div
              v-if="error"
              v-text="error"
          />
        </div>
      </div>
    </div>
  </a-form>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import { useRouter } from "#app";

useHead({
  title: "Вход - AppProChat"
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


async function signIn() {
try {
  await resourceRef.value.validate()

  const { data } = await $api.post("/users-auth/sign-in", {
    login: resource.login,
    password: resource.password
  })

  if (data?.error) {
    error.value = data?.error
  } else {
    error.value = ""

    const tokenCookie = useCookie("app-pro-chat.auth.token", {
      maxAge: 60 * 60 * 24 * 180, // 6 мес
      secure: true,
      httpOnly: false,
      sameSite: "lax"
    })

    tokenCookie.value = data.bearerToken

    resource.login = ""
    resource.password = ""
  }
  } catch(error) {
  console.log(error)
  }
}

function signUp() {
  router.push("/sign-up")
}
</script>

<style scoped lang="scss">
.sign-in {
  width: 100%;
  display: flex;
  justify-content: center;
  top: 25rem;
  position: absolute;
}

.sign-in-content__title {
  font-size: 2rem;
  font-weight: 600;
}

.sign-in-content {
  min-width: 30rem;
  max-height: 30rem;
  padding: 1.5rem;
  border: 0.1rem solid gray;
  border-radius: 1.2rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
}

.sign-in-content__login-and-password {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 90%;

  :deep(.ant-form-item) {
    margin-bottom: 0;
  }
}

.sign-in-content__login-and-registration {
  display: flex;

  gap: 1rem;
}

.sign-in-content_error {
  width: 100%;
  height: 2rem;
  text-align: center;
  color: orangered;
}
</style>