import { useNotification } from "@kyvg/vue3-notification";
import { useUserStore } from "../stores/UserStore";
import { mainServiceClient } from "../transport";
import { handleRpcError } from "../utils/error_handler";
import { defineMutation, useQueryCache } from "@pinia/colada";
import { DeleteGalleryRequest } from "../protos/nai";
import { Empty } from "../protos/nai_auth";

const notification = useNotification()

const deleteGallery = async (galleryId: string): Promise<Empty> => {
  const userStore = useUserStore()

  const promise = userStore.withActualToken<DeleteGalleryRequest, Empty>(token => {
    const opts = {
      meta: {
        "Authorization": "Bearer " + token,
      }
    }

    const request = {
      pGalleryUuid: galleryId
    }

    return mainServiceClient.deleteGallery(request, opts)
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

export const useDeleteGallery = defineMutation({
  mutation: (galleryId: string) => deleteGallery(galleryId),
  onSettled: async () => {
    const queryCache = useQueryCache()
    await queryCache.invalidateQueries({ key: ['galleries'], exact: true })
  }
})