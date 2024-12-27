import { helpers, maxLength, minLength, required } from "@vuelidate/validators";

export const useUsernameRules = () => ({
  minLength: helpers.withMessage("Логин должен содержать как минимум из 3 символов", minLength(3)),
  maxLength: helpers.withMessage("Логин не может быть длиннее 64 символов", maxLength(64)),
  required: helpers.withMessage ("Логин не может быть пустым", required),
  regex: helpers.withMessage(
    "Логин может содержать только латинские символы, числа, '-', или '_'", 
    helpers.regex(/^[a-zA-Z0-9_-]+$/)
  ),
})
