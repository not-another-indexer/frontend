import { helpers, required } from "@vuelidate/validators";

export const useDescriptionRules = () => ({
  required: helpers.withMessage("The description must not be empty", required),
})