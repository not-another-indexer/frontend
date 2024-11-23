import { helpers, required } from "@vuelidate/validators";

export const useDisplayNameRules = () => ({
  required: helpers.withMessage("The display name must not be empty", required)
})