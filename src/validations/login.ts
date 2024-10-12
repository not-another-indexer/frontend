import { helpers, required } from "@vuelidate/validators";

export const useLoginRules = () => ({
  required: helpers.withMessage("Login cannot be empty", required),
})