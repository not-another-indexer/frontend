<script setup lang="ts">
import { InputTypeHTMLAttribute, Ref } from 'vue';

const input = defineModel<string>('input', { required: true })
const _ = defineProps<{
  isInvalid: boolean,
	errorMessages: (string | Ref<string, string>)[],
  label: string,
  type: InputTypeHTMLAttribute,
  placeholder: string,
}>()

</script>

<template>
  <div class="field">
		<label class="label">{{ label }}</label>
		<div class="control">
			<input :type="type" v-model="input" :class="{ 'is-danger': isInvalid, 'input': true }" :placeholder="placeholder">
		</div>
		<p v-if="isInvalid" v-for="m in errorMessages" class="help is-danger">{{ m }}</p>
  </div>
</template>

<style lang="scss" scoped>
</style>