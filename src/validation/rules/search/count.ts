import { helpers, required } from "@vuelidate/validators";

export const useCountRules = () => ({
  required: helpers.withMessage("Количество не выбрано", required),
  minLength: helpers.withMessage(
    "Количество должно быть больше 0", 
    (value: bigint) => value > 0n,
  ),
  isInteger: helpers.withMessage(
    "Количество должно быть целым",
    (value: bigint) => Math.floor(Number(value)) === Number(value)
  ),
})