import { useNotification } from "@kyvg/vue3-notification";
import { useUserStore } from "../stores/UserStore";
import { galleryServiceClient } from "../transport";
import { handleRpcError } from "../utils/error_handler";
import { SearchImagesResponse, SearchImagesRequest } from "../protos/nai";

const notification = useNotification()

export interface SearchParameters {
  'SEMANTIC_ONE_PEACE_SIMILARITY': number
  'RECOGNIZED_TEXT_SIMILARITY': number
  'TEXTUAL_DESCRIPTION_SIMILARITY': number
  'RECOGNIZED_FACE_SIMILARITY': number
  'RECOGNIZED_TEXT_BM25_RANK': number
  'TEXTUAL_DESCRIPTION_BM25_RANK': number
  [key: string]: number
}

export const searchImages = async (
  query: string,
  galleryId: string,
  parameters: SearchParameters,
  count: bigint,
): Promise<SearchImagesResponse> => {
  const userStore = useUserStore()

  const promise = userStore.withActualToken<SearchImagesRequest, SearchImagesResponse>(token => {
    const opts = {
      meta: {
        "Authorization": "Bearer " + token,
      }
    }

    const request = {
      pQuery: query,
      pGalleryUuid: galleryId,
      pParameters: parameters,
      pCount: count,
    }

    return galleryServiceClient.searchImages(request, opts)
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