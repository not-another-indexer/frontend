import { defineQuery } from "@pinia/colada";
import { useUserStore } from "../stores/UserStore";
import { GetGalleriesRequest, GetGalleriesResponse } from "protos/gen/nai";
import { mainServiceClient } from "../transport";
import { useNotification } from "@kyvg/vue3-notification";
import { handleRpcError } from "../utils/error_handler";

const notification = useNotification()

const getGalleries = async (): Promise<GetGalleriesResponse> => {
  const userStore = useUserStore()

  const promise = userStore.withActualToken<GetGalleriesRequest, GetGalleriesResponse>(token => {
    const opts = {
      meta: {
        "Authorization": "Bearer " + token,
      } 
    }

    return mainServiceClient.getGalleries({}, opts)
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

export const useGalleries = defineQuery({
  key: ['galleries'],
  query: getGalleries,
})