import { useUserStore } from "~/pinia/user";
import {useChatsStore} from "~/pinia/chats";

export default defineNuxtRouteMiddleware((to, from) => {

    const userStore = useUserStore()

    const chatsStore = useChatsStore()
    const { loginUserWithWhomChatIsOpened } = storeToRefs(chatsStore)

    const usernameInPath = ref()

    const getLayout = computed(() => {
        if (userStore.getUserAuth) {
            return "cabinet"
        } else {
            return "guest"
        }
    })

    to.meta.layout = getLayout.value

    const getPathGuest = to.path === "/sign-in" || to.path === "/sign-up" || to.path === "/"

    // когда авторизованный юзер пытается получить доступ к страницам только для гостей
    if (userStore.getUserAuth && getPathGuest) {
        return navigateTo(("/my-profile"))
    }

    // когда авторизованный юзер открыл чат и вводит в url логин другого юзера
    if (loginUserWithWhomChatIsOpened.value) {
        usernameInPath.value = to.path.split('/my-chats/')[1]
    }

    // то в таком случае редиректим его
    if (userStore.getUserAuth && to.path.includes("/my-chats/") && usernameInPath.value !== loginUserWithWhomChatIsOpened.value) {
        loginUserWithWhomChatIsOpened.value = ""
        return navigateTo(("/my-profile"))
    }

    // если юзер покинул страницу чата с пользователем, то очищаем loginUserWithWhomChatIsOpened
    if (userStore.getUserAuth && !to.path.includes("my-chats")) {
        loginUserWithWhomChatIsOpened.value = ""
    }


    // если неавторизованный юзер пытается получить доступ до страниц авторизованного юзера
    // редиректим его на страницу входа
    if (!userStore.getUserAuth && !getPathGuest) {
        return navigateTo(("/sign-in"))
    }
})