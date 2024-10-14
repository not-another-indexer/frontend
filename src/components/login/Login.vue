<script setup lang="ts">
import { computed, ref } from 'vue';
import { useNotification } from '@kyvg/vue3-notification';
import useVuelidate from '@vuelidate/core';
import { useLoginRules } from '../../validations/login';
import LoginField from '../../assets/LoginField.vue';
import { usePasswordRules } from '../../validations/password';
import PasswordField from '../../assets/PasswordField.vue';
import FieldButton from '../../assets/FieldButton.vue';

const notification = useNotification()

const login = ref("")
const password = ref("")

const loginRules = useLoginRules()
const passwordRules = usePasswordRules()

const v = useVuelidate(
	{ 
		login: loginRules,
		password: passwordRules
	}, 
	{ 
		login, 
		password 
	},
)

const loginErrorMessages = computed(() => v.value.login.$silentErrors.map(e => e.$message))
const passwordErrorMessages = computed(() => v.value.password.$silentErrors.map(e => e.$message))

const loginAction = () => {
	if (v.value.$invalid) {
		notification.notify({
			text: "Not expected it to be called when fields are invalid",
			type: "error",
		})

		return
	}

	notification.notify({
		text: "login: " + login.value + "; password: " + password.value,
		type: "success",
	})
}

const loginButtonText = "Login"

</script>

<template>
	<section class="hero is-fullheight">
		<div class="hero-body">
			<div class="container">
				<div class="columns is-centered">
					<div class="column is-6">
   	 				<div class="box">
							<h2 class="title is-2 has-text-centered">Login</h2>
							<LoginField v-model:login="login" :error-messages="loginErrorMessages" :is-invalid="v.login.$invalid" />
							<PasswordField v-model:password="password" :error-messages="passwordErrorMessages" :is-invalid="v.password.$invalid" />
							<FieldButton v-on:action="loginAction" :is-disabled="v.$invalid" :button-text="loginButtonText"/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
</style>