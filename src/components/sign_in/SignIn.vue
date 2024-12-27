<script setup lang="ts">
import { computed, ref } from 'vue';
import { useNotification } from '@kyvg/vue3-notification';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { RpcError } from '@protobuf-ts/runtime-rpc';
import { useUserStore } from '../../stores/UserStore';
import { router } from '../../router';
import { GrpcStatusCode } from '@protobuf-ts/grpcweb-transport';

const notification = useNotification()

const userStore = useUserStore()

const isGoToRegisterButtonHovered = ref(false)
const isPasswordHidden = ref(true)
const isLoading = ref(false)

const username = ref("")
const password = ref("")

const usernameRules = {
  required: helpers.withMessage("Логин не может быть пуст", required),
}
const passwordRules = {
  required: helpers.withMessage("Пароль не может быть пуст", required),
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
	notification.notify({
		clean: true,
	})

	if (v.value.$invalid) {
		notification.notify({
			text: "Not expected it to be called when fields are invalid",
			type: "error",
		})

		return
	}

	isLoading.value = true

	userStore.signIn(username.value, password.value).then(
		_ => {
			handleSignInResponse()
		}
	).catch(
		err => {
			handleSignInError(err)
		},
	).finally(
		() => {
			isLoading.value = false
		}
	)	
}

const handleSignInResponse = () => {
	notification.notify({
		text: "Успешно",
		type: "success",	
	})

	router.push("/user/galleries")
}

const handleSignInError = (err: any) => {
	if (err instanceof RpcError) {
		handleRpcError(err)
		return
	} 

	notification.notify({
		text: "Не удалось войти в систему из-за непредвиденной ошибки",
		duration: -1,
		type: "error",
	})
}

const handleRpcError = (err: RpcError) => {
	switch (err.code) {
		case GrpcStatusCode[GrpcStatusCode.UNAUTHENTICATED]: {
			notification.notify({
				title: "Не удалось войти",
				text: "Неправильный логин или пароль",
				type: "error",
				duration: -1,
				ignoreDuplicates: true,
			})			
			break

		}
		default: {
			notification.notify({
				text: "Неожиданная ошибка: не удалось войти",
				duration: -1,
				type: "error",
			})
		}
	}

	throw err
}

const goToRegister = () => {
	notification.notify({
		clean: true,
	})

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
											Еще не зарегистрированы?
										</div>
										<div class="level-item">
											<button @click="goToRegister" class="button" :class="{ 'is-primary': isGoToRegisterButtonHovered }" v-on:mouseenter="isGoToRegisterButtonHovered = true" v-on:mouseleave="isGoToRegisterButtonHovered = false">
												Зарегистрироваться
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

		<div class="hero-body has-background-image">
			<div class="container">
				<div class="columns is-centered">
					<div class="column is-6">
   	 				<div class="box">
							<h2 class="title is-2 has-text-centered">Войти</h2>

              <div class="field">
                <label class="label">Логин</label>
                <div class="control">
                  <input type="text" v-model="username" :class="{ 'is-danger': v.username.$invalid, 'input': true }" placeholder="Например: john_doe">
                </div>
                <p v-if="v.username.$invalid" v-for="m in usernameErrorMessages" class="help is-danger">{{ m }}</p>
              </div>

              <div class="field">
                <label class="label">Пароль</label>
								<nav class="level is-mobile">
                  <input :type="isPasswordHidden ? 'password' : 'text'" v-model="password" :class="{ 'is-danger': v.password.$invalid, 'input': true }" placeholder="Например: ********">
    							<button class="button" @click="isPasswordHidden = !isPasswordHidden">
										<span class="icon is-small">
      								<i v-if="isPasswordHidden" class="pi pi-eye-slash" />
											<i v-else class="pi pi-eye" />
										</span>
									</button>
								</nav>
                <p v-if="v.password.$invalid" v-for="m in passwordErrorMessages" class="help is-danger">{{ m }}</p>
              </div>

              <div class="field has-text-centered">
                <button class="button is-link" :class="{ 'is-loading': isLoading }" @click="signInAction" :disabled="v.$invalid">
									Войти
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
// .has-background-image {
//  background-image: url(https://baldezh.top/uploads/posts/2022-08/1659657022_3-funart-pro-p-fon-dlya-kollazha-iz-fotografii-krasivo-3.jpg);
//  background-size: contain;
//  background-repeat: no-repeat;
// }
</style>