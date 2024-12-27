import { helpers, required } from "@vuelidate/validators";

export const useDisplayNameRules = () => ({
  required: helpers.withMessage("Отображаемое имя не может быть пустым", required)
})