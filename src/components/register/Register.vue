<script setup lang="ts">
import { useNotification } from '@kyvg/vue3-notification';
import LoginField from '../../assets/LoginField.vue';
import PasswordField from '../../assets/PasswordField.vue';
import { computed, ref } from 'vue';
import { useLoginRules } from '../../validations/login';
import { usePasswordRules } from '../../validations/password';
import useVuelidate from '@vuelidate/core';
import FieldButton from '../../assets/FieldButton.vue';

const notification = useNotification()

const login = ref("")
const password = ref("")
const repeatedPassword = ref("")

const loginRules = useLoginRules()
const passwordRules = usePasswordRules()
const repeatedPasswordRules = usePasswordRules()

const v = useVuelidate(
  {
    login: loginRules,
    password: passwordRules,
    repeatedPassword: repeatedPasswordRules,
  },
  {
    login,
    password,
    repeatedPassword,
  }
)

const loginErrorMessages = computed(() => v.value.login.$silentErrors.map(e => e.$message))
const passwordErrorMessages = computed(() => v.value.password.$silentErrors.map(e => e.$message))
const repeatedPasswordErrorMessages = computed(() => v.value.password.$silentErrors.map(e => e.$message))

const registerAction = () => {
  if (v.value.$invalid) {
    notification.notify({
      text: "Not expected it to be called when fields are invalid",
      type: "error"
    })

    return
  }

  notification.notify({
    text: "login: " + login + "; password: " + password,
    type: "success",
  })
}

const registerButtonText = "Register"

</script>

<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-6">
            <div class="box">
              <h2 class="title is-2 has-text-centered">Registration</h2>
              <LoginField v-model:login="login" :error-messages="loginErrorMessages" :is-invalid="v.login.$invalid"/>
						  <PasswordField v-model:password="password" :error-messages="passwordErrorMessages" :is-invalid="v.password.$invalid" />
						  <PasswordField v-model:password="repeatedPassword" :error-messages="repeatedPasswordErrorMessages" :is-invalid="v.repeatedPassword.$invalid" />
              <FieldButton v-on:action="registerAction" :is-disabled="v.$invalid" :button-text="registerButtonText" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
</style>