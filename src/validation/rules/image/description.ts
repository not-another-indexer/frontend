import { helpers, required } from "@vuelidate/validators";

export const useDescriptionRules = () => ({
  required: helpers.withMessage("Описание не может быть пустым", required),
})