import { helpers, maxLength, minLength, required } from "@vuelidate/validators";

export const usePasswordRules = () => ({
  minLength: helpers.withMessage("The password must contain at least 8 characters", minLength(8)),
  maxLength: helpers.withMessage("The password must not exceed 128 characters", maxLength(128)),
  required: helpers.withMessage("The password must not be empty", required),
  withoutSpaces: helpers.withMessage("The password must not contain spaces", (value: string) => value.indexOf(' ') < 0),
  atLeastOneDigit: helpers.withMessage(
    "The password must contain at least 1 digit", 
    (value: string) => /\d/.test(value)
  ),
  atLeastOneCapitalLetter: helpers.withMessage(
    "The password must contain at least 1 capital letter",
    (value: string) => /[A-Z]/.test(value)
  ),
  atLeastOneLowercaseLetter: helpers.withMessage(
    "The password must contain at least 1 lowercase letter",
    (value: string) => /[a-z]/.test(value)
  ),
  atLeastOneSpecialChar: helpers.withMessage(
    "The password must contain at least 1 special character $ # % &",
    (value: string) => /[$#%&]/.test(value)
  )
})