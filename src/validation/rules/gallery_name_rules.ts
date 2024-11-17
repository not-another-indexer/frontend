import { helpers, maxLength, required } from "@vuelidate/validators";

export const useGalleryNameRules = () => ({
  required: helpers.withMessage("Gallery name must not be empty", required),
  maxLength: helpers.withMessage("Gallery name must have a length of 128 characters or fewer.", maxLength(128))
})