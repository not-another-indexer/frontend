import { useNotification } from "@kyvg/vue3-notification";
import { GetGalleryImagesRequest, GetGalleryImagesResponse } from "protos/gen/nai";
import { useUserStore } from "../stores/UserStore";
import { galleryServiceClient } from "../transport";
import { handleRpcError } from "../utils/error_handler";
import { ref } from "vue";
import { defineQuery, useQuery } from "@pinia/colada";

const notification = useNotification()

const getGalleryImages = async (id: string, size: number, offset: number): Promise<GetGalleryImagesResponse> => {
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

export const useGalleryImages = defineQuery(() => {
  const id = ref("")
  const size = ref(0)
  const offset = ref(0)

  const { state, ...rest } = useQuery({
    key: ['galleryImages'],
    query: () => getGalleryImages(id.value, size.value, offset.value)
  })

  return {
    ...rest,
    galleryImages: state,
    id,
    size,
    offset,
  }
})