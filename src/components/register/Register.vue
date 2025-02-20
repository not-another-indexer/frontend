<script setup lang="ts">
import { useNotification } from '@kyvg/vue3-notification';
import { computed, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { helpers, required, sameAs } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import { authServiceClient } from '../../transport';
import { RpcError } from '@protobuf-ts/runtime-rpc';
import { useUsernameRules } from '../../validation/rules/user/username';
import { usePasswordRules } from '../../validation/rules/user/password';
import { useDisplayNameRules } from '../../validation/rules/user/display_name';

const notification = useNotification()
const router = useRouter()

const isGoToSignInButtonHovered = ref(false)
const isPasswordHidden = ref(true)
const isRepeatedPasswordHidden = ref(true)
const isLoading = ref(false)

const username = ref("")
const displayName = ref("")
const password = ref("")
const repeatedPassword = ref("")

const usernameRules = useUsernameRules()
const displayNameRules = useDisplayNameRules() 
const passwordRules = usePasswordRules()
const repeatedPasswordRules = {
  required: helpers.withMessage("Повторите пароль", required),
  passwordsEqual: helpers.withMessage("Пароли должны совпадать", sameAs(password)),
} 

const v = useVuelidate(
  {
    username: usernameRules,
    displayName: displayNameRules,
    password: passwordRules,
    repeatedPassword: repeatedPasswordRules,
  },
  {
    username,
    displayName,
    password,
    repeatedPassword,
  }
)

const usernameErrorMessages = computed(() => v.value.username.$silentErrors.map(e => e.$message))
const displayNameErrorMessages = computed(() => v.value.displayName.$silentErrors.map(e => e.$message))
const passwordErrorMessages = computed(() => v.value.password.$silentErrors.map(e => e.$message))
const repeatedPasswordErrorMessages = computed(() => v.value.repeatedPassword.$silentErrors.map(e => e.$message))

const registerAction = async () => {
  if (v.value.$invalid) {
    notification.notify({
      text: "Not expected it to be called when fields are invalid",
      type: "error"
    })

    return
  }

  isLoading.value = true

  const request = {
    pUsername: username.value,
    pDisplayName: displayName.value,
    pRawPassword: password.value,
  }

  authServiceClient.register(request, {}).then(
    _ => {
      handleRegisterResponse()
    }
  ).catch(
    err => {
      handleRegisterError(err)
    }
  ).finally(
    () => {
      isLoading.value = false
    }
  )
}

const handleRegisterResponse = () => {
  notification.notify({
    text: "Регистрация прошла успешно",
    type: "success",
  })

  router.push("/sign-in")
}

const handleRegisterError = (err: any) => {
  let message = ""
  if (err instanceof RpcError) {
    const rpcErr = err as RpcError
    message = "Не удалось зарегистрироваться: " + rpcErr.message
  } else {
    message = "Не удалось зарегистрироваться из-за неожиданной ошибки. Повторите позже" 
  }

  notification.notify({
    text: message,
    type: "error",
  })

  throw err
}

const goToSignIn = () => {
  router.push("/sign-in")
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
                      Уже зарегистрированы
										</div>
										<div class="level-item">
											<button @click="goToSignIn" class="button" :class="{ 'is-primary': isGoToSignInButtonHovered }" v-on:mouseenter="isGoToSignInButtonHovered = true" v-on:mouseleave="isGoToSignInButtonHovered = false">
                        Войти
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
              <h2 class="title is-2 has-text-centered">Регистрация</h2>

              <div class="field">
                <label class="label">Логин</label>
                <div class="control">
                  <input type="text" v-model="username" :class="{ 'is-danger': v.username.$invalid, 'input': true }" placeholder="Например: john_doe">
                </div>
                <p v-if="v.username.$invalid" v-for="m in usernameErrorMessages" class="help is-danger">{{ m }}</p>
              </div>

              <div class="field">
                <label class="label">Отображаемое имя</label>
                <div class="control">
                  <input type="text" v-model="displayName" :class="{ 'is-danger': v.displayName.$invalid, 'input': true }" placeholder="Например: John">
                </div>
                <p v-if="v.displayName.$invalid" v-for="m in displayNameErrorMessages" class="help is-danger">{{ m }}</p>
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

              <div class="field">
                <label class="label">Подтвердите пароль</label>
                <nav class="level is-mobile">
                  <input :type="isRepeatedPasswordHidden ? 'password' : 'text'" v-model="repeatedPassword" :class="{ 'is-danger': v.repeatedPassword.$invalid, 'input': true }" placeholder="Например: ********">
    							<button class="button" @click="isRepeatedPasswordHidden = !isRepeatedPasswordHidden">
										<span class="icon is-small">
      								<i v-if="isRepeatedPasswordHidden" class="pi pi-eye-slash" />
											<i v-else class="pi pi-eye" />
										</span>
                  </button>
                </nav>
                <p v-if="v.repeatedPassword.$invalid" v-for="m in repeatedPasswordErrorMessages" class="help is-danger">{{ m }}</p>
              </div>

              <div class="field has-text-centered">
                <button class="button is-link" :class="{ 'is-loading': isLoading }" @click="registerAction" :disabled="v.$invalid">Register</button>
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