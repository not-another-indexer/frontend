import { helpers, maxLength, minLength, required } from "@vuelidate/validators";

export const usePasswordRules = () => ({
  minLength: helpers.withMessage("Пароль должен содержать как минимум 8 символов", minLength(8)),
  maxLength: helpers.withMessage("Пароль не должен привышать 128 символов", maxLength(128)),
  required: helpers.withMessage("Пароль не может быть пустым", required),
  withoutSpaces: helpers.withMessage("Пароль не должен содержать пробелы", (value: string) => value.indexOf(' ') < 0),
  atLeastOneDigit: helpers.withMessage(
    "Пароль должен содержать как минимум одну цифру", 
    (value: string) => /\d/.test(value)
  ),
  atLeastOneCapitalLetter: helpers.withMessage(
    "Пароль должен содержать как минимум одну заглавную латинскую букву",
    (value: string) => /[A-Z]/.test(value)
  ),
  atLeastOneLowercaseLetter: helpers.withMessage(
    "Пароль должен содержать как минимум одну строчную латинскую букву",
    (value: string) => /[a-z]/.test(value)
  ),
  atLeastOneSpecialChar: helpers.withMessage(
    "Пароль должен содержать 1 специальный символ: $ # % &",
    (value: string) => /[$#%&]/.test(value)
  )
})