<script setup lang="ts">
import { Ref } from 'vue';

const password = defineModel<string>('password', { required: true })
const _ = defineProps<{
  isInvalid: boolean,
	errorMessages: (string | Ref<string, string>)[],
}>()

</script>

<template>
  <div class="field">
		<label class="label">Password</label>
		<div class="control">
			<input type="password" v-model="password" :class="{ 'is-danger': isInvalid, 'input': true }" placeholder="for example: ********">
		</div>
		<p v-if="isInvalid" v-for="m in errorMessages" class="help is-danger">{{ m }}</p>
  </div>
</template>

<style lang="scss" scoped>
</style>