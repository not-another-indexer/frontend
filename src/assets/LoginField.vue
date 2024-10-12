<script setup lang="ts">
import { Ref } from 'vue';

const login = defineModel<string>('login', { required: true })
const _ = defineProps<{
  isInvalid: boolean,
	errorMessages: (string | Ref<string, string>)[],
}>()

</script>

<template>
  <div class="field">
		<label class="label">Login</label>
		<div class="control">
			<input type="text" v-model="login" :class="{ 'is-danger': isInvalid, 'input': true }" placeholder="for example: john_doe">
		</div>
		<p v-if="isInvalid" v-for="m in errorMessages" class="help is-danger">{{ m }}</p>
  </div>
</template>

<style lang="scss" scoped>
</style>