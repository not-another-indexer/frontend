import { useNotification } from "@kyvg/vue3-notification";
import { defineMutation, useQueryCache } from "@pinia/colada";
import { useUserStore } from "../stores/UserStore";
import { mainServiceClient } from "../transport";
import { handleRpcError } from "../utils/error_handler";
import { CreateGalleryResponse, CreateGalleryRequest } from "../protos/nai";

const notification = useNotification()

const createGallery = async (galleryName: string): Promise<CreateGalleryResponse> => {
  const userStore = useUserStore()

  const promise = userStore.withActualToken<CreateGalleryRequest, CreateGalleryResponse>(token => {
    const opts = {
      meta: {
        "Authorization": "Bearer " + token,
      }
    }

    const request = {
      pGalleryName: galleryName,
    }

    return mainServiceClient.createGallery(request, opts)
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

export const useCreateGallery = defineMutation({
  mutation: (galleryName: string) => createGallery(galleryName),
  onSettled: async () => {
    const queryCache = useQueryCache()
    await queryCache.invalidateQueries({ key: ['galleries'], exact: true })
  }
})