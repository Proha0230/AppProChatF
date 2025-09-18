import axios from 'axios'

export default defineNuxtPlugin(() => {
    const api = axios.create({
        baseURL: 'http://localhost:3023', // своя база
    })
    return {
        provide: {
            api
        }
    }
})