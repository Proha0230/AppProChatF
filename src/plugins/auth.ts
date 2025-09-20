import {useUserStore} from "~/pinia/user";
import {useRouter} from "#app";

export default defineNuxtPlugin(async (nuxtApp) => {
    const userStore = useUserStore()
    const router = useRouter()

    watch(() => userStore.getUserAuth, async (value) => {
        await router.push(value ? "/my-profile" : "/sign-in")
    }, { immediate: true })
})