import { helpers, or, required, sameAs } from "@vuelidate/validators";

export const useExtensionRules = () => ({
  required: helpers.withMessage("The extension must not be empty", required),
  oneOfImageExtensions: helpers.withMessage("The extension must be 'jpg', 'jpeg' or 'png'", or(
    sameAs("jpg"),
    sameAs("jpeg"),
    sameAs("png"),
  )),
})