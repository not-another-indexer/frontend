import { helpers, maxLength, required } from "@vuelidate/validators";

export const useGalleryNameRules = () => ({
  required: helpers.withMessage("Имя галлереи не может быть пустым", required),
  maxLength: helpers.withMessage("Имя галереи должно быть не длиннее 128 символов", maxLength(128))
})