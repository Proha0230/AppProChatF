// Основной composable для WebRTC логики — подключение, создание peer connection,
// обмен SDP (offer/answer) и ICE-кандидатами через WebSocket
export function useWebRTC(roomId: string) {
    // Поток с камеры/микрофона пользователя (локальный)
    const localStream = ref<MediaStream|null>(null);

    // Поток от собеседника (удалённый)
    const remoteStream = ref<MediaStream|null>(null);

    // Создаём WebRTC соединение (PeerConnection)
    // iceServers нужны, чтобы устройства могли "найти" друг друга через NAT
    // STUN-сервер Google — самый простой вариант для старта
    const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    const { $socket } = useNuxtApp();

    // Когда собеседник отправляет нам медиапоток, он попадает сюда
    // Сохраняем поток, чтобы потом отобразить в <video :srcObject="remoteStream">
    pc.ontrack = (e) => {
        remoteStream.value = e.streams[0];
    };

    // Когда браузер находит новый ICE-кандидат (сетевой адрес),
    // отправляем его на сервер, чтобы тот передал другому участнику
    pc.onicecandidate = (e) => {
        if (e.candidate) {
            $socket.emit('signal', { type: 'ice', roomId, candidate: e.candidate });
        }
    };

    // Инициализация камеры и микрофона
    // navigator.mediaDevices.getUserMedia() запрашивает доступ у пользователя
    // потом добавляем все дорожки (видео/аудио) в peer connection
    async function initLocal(media: MediaStreamConstraints = { audio: true, video: true }) {
        localStream.value = await navigator.mediaDevices.getUserMedia(media);
        localStream.value.getTracks().forEach(t => pc.addTrack(t, localStream.value!));

        console.log(localStream.value, "localStream.value")
    }

    // Настраиваем слушатель socket.io — сюда приходят сигналы от другого клиента
    function setupSocket() {
        $socket.on('signal', async (msg: any) => {

            // Когда сервер сообщает, что мы вошли в комнату
            if (msg.type === 'joined') {
                // Если в комнате уже кто-то есть — мы инициатор, создаём offer
                if (msg.peers.length) await call();

                // Когда пришёл offer от собеседника
            } else if (msg.type === 'offer') {
                // Сохраняем offer как удалённое описание
                await pc.setRemoteDescription(msg.sdp);
                // Создаём answer в ответ
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                // Отправляем свой answer собеседнику через сервер
                $socket.emit('signal', { type: 'answer', roomId, sdp: pc.localDescription });

                // Когда пришёл answer — завершаем установку соединения
            } else if (msg.type === 'answer') {
                await pc.setRemoteDescription(msg.sdp);

                // Когда пришёл новый ICE-кандидат от собеседника
            } else if (msg.type === 'ice' && msg.candidate) {
                try { await pc.addIceCandidate(msg.candidate); } catch {}
            }
        });
    }

    // Подключаемся к комнате — начинаем слушать socket и уведомляем сервер
    async function join() {
        setupSocket()
        $socket.emit('signal', { type: 'join', roomId })
    }

    // Функция для создания нового соединения (инициатор)
    // Создаём offer, сохраняем как локальное описание и отправляем серверу
    async function call() {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        $socket.emit('signal', { type: 'offer', roomId, sdp: pc.localDescription });
    }

    // Возвращаем всё наружу, чтобы компонент мог вызывать join, call и получать потоки
    return { pc, localStream, remoteStream, initLocal, join, call };
}