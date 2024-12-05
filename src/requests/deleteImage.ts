import { useNotification } from "@kyvg/vue3-notification";
import { useUserStore } from "../stores/UserStore";
import { galleryServiceClient } from "../transport";
import { handleRpcError } from "../utils/error_handler";
import { DeleteImageRequest, Empty } from "../protos/nai";

const notification = useNotification()

export const deleteImage = async (id: string) : Promise<Empty> => {
  const userStore = useUserStore()

  const promise = userStore.withActualToken<DeleteImageRequest, Empty>(token => {
    const opts = {
      meta: {
        "Authorization": "Bearer " + token
      }
    }

    const request = {
      pImageUuid: id,
    }

    return galleryServiceClient.deleteImage(request, opts)
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
