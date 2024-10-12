<script setup lang="ts">

const _ = defineProps<{
  isDisabled: boolean,
  action: () => void,
  buttonText: string,
}>()

</script>

<template>
  <div class="field has-text-centered">
    <button class="button is-link" @click="action()" :disabled="isDisabled">{{ buttonText }}</button>
  </div>
</template>

<style lang="scss" scoped></style>