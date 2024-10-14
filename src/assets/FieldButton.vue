<script setup lang="ts">

const props = defineProps<{
  isDisabled: boolean,
  buttonText: string,
}>()

const emits = defineEmits<{
  (e: 'action'): void
}>()

</script>

<template>
  <div class="field has-text-centered">
    <button class="button is-link" @click="$emit('action')" :disabled="isDisabled">{{ buttonText }}</button>
  </div>
</template>

<style lang="scss" scoped></style>