// Импортируем клиентскую часть socket.io
// io — функция для подключения к серверу
// Socket — тип для TypeScript, чтобы знать какие методы и свойства есть у сокета
import { io, Socket } from 'socket.io-client';

// Nuxt-плагин — это способ создать и "внедрить" (provide) глобальные вещи в приложение,
// чтобы их потом можно было использовать через useNuxtApp() в любом месте проекта
export default defineNuxtPlugin(() => {

    // Создаём клиентское соединение с нашим сервером WebSocket (NestJS)
    // http://localhost:3023 — адрес сервера, где крутится gateway
    // transports: ['websocket'] — говорим использовать чистый WebSocket,
    // без fallback на long-polling (иначе socket.io может попытаться использовать HTTP)
    const socket: Socket = io('http://localhost:3023', { transports: ['websocket'] });

    // Возвращаем объект, который Nuxt автоматически добавит в контекст приложения
    // Теперь в любом месте можно получить сокет через:
    // const {$socket} = useNuxtApp()
    return { provide: { socket } };
});