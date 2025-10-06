import axios from 'axios'
import { useCookie } from "#app"

export default defineNuxtPlugin(() => {
    const userAuthCookie = useCookie('app-pro-chat.auth.token')

    const api = axios.create({
        baseURL: 'http://localhost:3023', // своя база
        timeout: 10000
    })

    api.interceptors.request.use(
        (config) => {
            // пушим в каждый запрос хэдер авторизации с айди юзера
            if (userAuthCookie.value) {
                config.headers.Authorization = userAuthCookie.value
            }

            return config
        },
        (error) => Promise.reject(error)
        )

    // Interceptor ответов
    api.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => Promise.reject(error)
    )

    return {
        provide: {
            api
        }
    }
})