<script setup lang="ts">
import { useNotification } from '@kyvg/vue3-notification';
import { computed, ref } from 'vue';
import { useLoginRules } from '../../validations/login';
import { usePasswordRules } from '../../validations/password';
import useVuelidate from '@vuelidate/core';
import FieldButton from '../../assets/FieldButton.vue';
import InputField from '../../assets/InputField.vue';
import { helpers, sameAs } from '@vuelidate/validators';

const notification = useNotification()

const login = ref("")
const password = ref("")
const repeatedPassword = ref("")

const loginRules = useLoginRules()
const passwordRules = usePasswordRules()
const repeatedPasswordRules = {
  rule: helpers.withMessage("Password should be equal", sameAs(password))
} 

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
const repeatedPasswordErrorMessages = computed(() => v.value.repeatedPassword.$silentErrors.map(e => e.$message))

const registerAction = () => {
  if (v.value.$invalid) {
    notification.notify({
      text: "Not expected it to be called when fields are invalid",
      type: "error"
    })

    return
  }

  notification.notify({
    text: "login: " + login.value + "; password: " + password.value,
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
              <InputField :label="'Login'" v-model:input="login" :error-messages="loginErrorMessages" :is-invalid="v.login.$invalid" :type="'text'" :placeholder="'for example: john_doe'"/>
						  <InputField :label="'Password'" v-model:input="password" :error-messages="passwordErrorMessages" :is-invalid="v.password.$invalid" :type="'password'" :placeholder="'for example: ********'"/>
						  <InputField :label="'Repeat password'" v-model:input="repeatedPassword" :error-messages="repeatedPasswordErrorMessages" :is-invalid="v.repeatedPassword.$invalid" :type="'password'" :placeholder="'********'"/>
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