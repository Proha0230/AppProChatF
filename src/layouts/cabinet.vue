<template>
  <cabinetLayout>
    <template #content>
      <a-config-provider>
        <NuxtPage />
      </a-config-provider>
    </template>
  </cabinetLayout>
</template>

<script setup lang="ts">
import cabinetLayout from '~/components/layouts/cabinet/cabinetLayout.vue'
</script>

<style scoped lang="scss">

</style>