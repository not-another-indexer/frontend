import { helpers, required } from "@vuelidate/validators"

export const usePasswordRules = () => ({
  required: helpers.withMessage("Password cannot be empty", required)
})