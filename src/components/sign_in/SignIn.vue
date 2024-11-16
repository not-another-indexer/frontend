<script setup lang="ts">
import { computed, ref } from 'vue';
import { useNotification } from '@kyvg/vue3-notification';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { RpcError } from '@protobuf-ts/runtime-rpc';
import { useUserStore } from '../../stores/UserStore';
import { router } from '../../router';

const notification = useNotification()

const userStore = useUserStore()

const isGoToRegisterButtonHovered = ref(false)

const username = ref("")
const password = ref("")

const usernameRules = {
  required: helpers.withMessage("Login cannot be empty", required),
}
const passwordRules = {
  required: helpers.withMessage("Password cannot be empty", required),
}

const v = useVuelidate(
	{ 
		username: usernameRules,
		password: passwordRules
	}, 
	{ 
		username, 
		password 
	},
)

const usernameErrorMessages = computed(() => v.value.username.$silentErrors.map(e => e.$message))
const passwordErrorMessages = computed(() => v.value.password.$silentErrors.map(e => e.$message))

const signInAction = () => {
	if (v.value.$invalid) {
		notification.notify({
			text: "Not expected it to be called when fields are invalid",
			type: "error",
		})

		return
	}

	userStore.signIn(username.value, password.value).then(
		_ => handleSignInResponse(),
		err => handleSignInError(err),
	)	
}

const handleSignInResponse = () => {
	notification.notify({
		text: "Signed in successfully",
		type: "success",	
	})

	router.push("/user/galleries")
}

const handleSignInError = (err: any) => {
	let message = ""	
	if (err instanceof RpcError) {
		const rpcErr = err as RpcError
		message = "Cannot login: " + rpcErr.message
	} else {
		message = "Cannot login due to unknown error"
	}

	notification.notify({
		text: message,
		type: "error",
	})
}

const goToRegister = () => {
	router.push("/register")
}

</script>

<template>
	<section class="hero is-fullheight">

		<div class="hero-head">
			<section class="hero is-small">
				<div class="hero-body">
					<div class="container is-fluid">
						<nav class="level">
							<div class="level-left"></div>
							<div class="level-right">
								<div class="level-item">
									<nav class="level is-mobile">
										<div class="level-item">
											Not registered yet?
										</div>
										<div class="level-item">
											<button @click="goToRegister" class="button" :class="{ 'is-primary': isGoToRegisterButtonHovered }" v-on:mouseenter="isGoToRegisterButtonHovered = true" v-on:mouseleave="isGoToRegisterButtonHovered = false">
												Register
											</button>
										</div>
									</nav>
								</div>
							</div>
						</nav>
					</div>
				</div>
			</section>
		</div>

		<div class="hero-body">
			<div class="container">
				<div class="columns is-centered">
					<div class="column is-6">
   	 				<div class="box">
							<h2 class="title is-2 has-text-centered">Sign in</h2>

              <div class="field">
                <label class="label">Username</label>
                <div class="control">
                  <input type="text" v-model="username" :class="{ 'is-danger': v.username.$invalid, 'input': true }" placeholder="For example: john_doe">
                </div>
                <p v-if="v.username.$invalid" v-for="m in usernameErrorMessages" class="help is-danger">{{ m }}</p>
              </div>

              <div class="field">
                <label class="label">Password</label>
                <div class="control">
                  <input type="password" v-model="password" :class="{ 'is-danger': v.password.$invalid, 'input': true }" placeholder="For example: ********">
                </div>
                <p v-if="v.password.$invalid" v-for="m in passwordErrorMessages" class="help is-danger">{{ m }}</p>
              </div>

              <div class="field has-text-centered">
                <button class="button is-link" @click="signInAction" :disabled="v.$invalid">
									Sign in
								</button>
              </div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss" scoped>
</style>