import { GetImageContentResponse, GetImageContentRequest } from "../protos/nai"
import { useUserStore } from "../stores/UserStore"
import { galleryServiceClient } from "../transport"
import { handleRpcError } from "../utils/error_handler"
import { useNotification } from "@kyvg/vue3-notification"

const notification = useNotification()

export const getImageContent = async (id: string): Promise<GetImageContentResponse> => {
  const userStore = useUserStore()

  const promise = userStore.withActualToken<GetImageContentRequest, GetImageContentResponse>(token => {
    const opts = {
      meta: {
        "Authorization": "Bearer " + token,
      }
    }

    const request = {
      pImageUuid: id,
    }

    return galleryServiceClient.getImageContent(request, opts)
  })

  try {
    return await promise
  } catch (err: any) {
    handleRpcError(err, (unknownErr: any) => {
      notification.notify({
        text: "Unexpected error",
        type: "error",
      })

      console.log(unknownErr)
    })

    throw err
  }
}

