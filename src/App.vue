<script setup lang="ts">
import { Notifications } from '@kyvg/vue3-notification';
import { RouterView } from 'vue-router';

</script>

<template>
  <RouterView />
  <Notifications position="bottom center" width="100%"/>
</template>

<style lang="scss" scoped>
</style>