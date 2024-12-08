import { useNotification } from "@kyvg/vue3-notification";
import { useUserStore } from "../stores/UserStore";
import { galleryServiceClient } from "../transport";
import { handleRpcError } from "../utils/error_handler";
import { defineMutation, useMutation, useQueryCache } from "@pinia/colada";
import { ref } from "vue";
import { AddImageResponse, AddImageRequest } from "../protos/nai";

const notification = useNotification()

const addImage = async (
  imageBytes: Uint8Array, 
  galleryId: string, 
  description: string,
  extension: string,
): Promise<AddImageResponse> => {
  const userStore = useUserStore()

  const promise = userStore.withActualToken<AddImageRequest, AddImageResponse>(token => {
    const opts = {
      meta: {
        "Authorization": "Bearer " + token,
      }
    }

    const request = {
      pChunkData: imageBytes,
      pMetadata: {
        pGalleryUuid: galleryId,
        pDescription: description,
        pExtension: extension,
      }
    }

    return galleryServiceClient.addImage(request, opts)
  })

  try {
    return await promise
  } catch (err: any) {
    handleRpcError(err, (unknownErr: any) => {
      notification.notify({
        text: "Unexpected error",
        type: "error",
      })

      console.log(unknownErr);
    })

    throw err;
  }
}

export const useAddImage = defineMutation(() => {
  const imageBytes = ref<Uint8Array>(new Uint8Array)
  const galleryId = ref("")
  const description = ref("")
  const extension = ref("")
  const { mutate, ...mutation } = useMutation({
    mutation: () => addImage(
      imageBytes.value, 
      galleryId.value, 
      description.value, 
      extension.value,
    ),
    onSettled: async () => {
      const queryCache = useQueryCache()
      await queryCache.invalidateQueries({ key: ['galleryImages', galleryId.value] })
      await queryCache.invalidateQueries({ key: ['galleries'], exact: true })
    }
  })

  return {
    imageBytes,
    galleryId,
    description,
    extension,
    mutate,
    ...mutation,
  }
})