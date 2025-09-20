import { useUserStore } from "~/pinia/user";

export default defineNuxtRouteMiddleware((to, from) => {

    const userStore = useUserStore()

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

    if (!userStore.getUserAuth && !getPathGuest) {
        return navigateTo(("/sign-in"))
    }
})