import { helpers, or, required, sameAs } from "@vuelidate/validators";

export const useExtensionRules = () => ({
  required: helpers.withMessage("Расширение файла не может быть пустым", required),
  oneOfImageExtensions: helpers.withMessage("Расширение должно быть одним из: 'jpg', 'jpeg' or 'png'", or(
    sameAs("jpg"),
    sameAs("jpeg"),
    sameAs("png"),
  )),
})