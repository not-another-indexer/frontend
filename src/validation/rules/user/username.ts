import { helpers, maxLength, minLength, required } from "@vuelidate/validators";

export const useUsernameRules = () => ({
  minLength: helpers.withMessage("The username must contain at least 3 characters", minLength(3)),
  maxLength: helpers.withMessage("The user name must not exceed 64 characters", maxLength(64)),
  required: helpers.withMessage("The username must not be empty", required),
  regex: helpers.withMessage(
    "The user name can contain only letters, numbers, '-', or '_'", 
    helpers.regex(/^[a-zA-Z0-9_-]+$/)
  ),
})
