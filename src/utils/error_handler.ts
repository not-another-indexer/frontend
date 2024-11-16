import { useNotification } from "@kyvg/vue3-notification"
import { TokenRefreshError, UserUndefinedError } from "../stores/UserStore"
import { router } from "../router"

const notification = useNotification()

export const handleRpcError = (
  err: any, 
  unkonwnErrorHandler: (unknownErr: any) => void,
) => {
  if (err instanceof UserUndefinedError) {
    notification.notify({
      text: "You are not signed in. Please, do it",
      type: "warn",
      duration: -1, 
    })

    router.push("/sign-in")
  } else if (err instanceof TokenRefreshError) {
    notification.notify({
      text: "Cannot keep you signed in: " + err.message,
      type: "warn",
      duration: -1,
    })

    router.push("/sign-in")
  } else {
    unkonwnErrorHandler(err)
  }
}

