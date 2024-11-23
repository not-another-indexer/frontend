import { helpers, required } from "@vuelidate/validators";

export const useCountRules = () => ({
  required: helpers.withMessage("The count must not be empty", required),
  minLength: helpers.withMessage(
    "The count must be greater then 0", 
    (value: bigint) => value > 0n,
  ),
})