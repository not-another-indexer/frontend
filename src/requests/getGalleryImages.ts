import { useNotification } from "@kyvg/vue3-notification"
import { useUserStore } from "../stores/UserStore"
import { GetGalleryImagesRequest, GetGalleryImagesResponse } from "protos/gen/nai"
import { galleryServiceClient } from "../transport"
import { handleRpcError } from "../utils/error_handler"

const notification = useNotification()

export const getGalleryImages = async (id: string, size: number, offset: number): Promise<GetGalleryImagesResponse> => {
  const userStore = useUserStore()
  
  const promise = userStore.withActualToken<GetGalleryImagesRequest, GetGalleryImagesResponse>(token => {
    const opts = {
      meta: {
        "Authorization": "Bearer " + token,
      }
    }

    const request = {
      pGalleryUuid: id,
      pSize: size,
      pOffset: offset,
    }

    return galleryServiceClient.getGalleryImages(request, opts)
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