<template>
  <div class="grid gap-4">
<!--    <video v-if="localStream" :srcObject="localStream" autoplay playsinline muted />-->
<!--    <video v-if="remoteStream" :srcObject="remoteStream" autoplay playsinline />-->
  </div>
</template>

<script setup lang="ts">
import {useWebRTC} from "~/composables/useWebRTC"

const roomId = 'demo-room-1';
const { localStream, remoteStream, initLocal, join } = useWebRTC(roomId)

onMounted(async () => {
  // await initLocal({ audio: true, video: true });
  await join();
});
</script>

<style scoped lang="scss">

</style>