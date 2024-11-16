<script setup lang="ts">
import { useNotification } from '@kyvg/vue3-notification';
import { useUserStore } from '../../stores/UserStore';
import { GetImageContentRequest, GetImageContentResponse } from 'protos/gen/nai';
import { galleryServiceClient } from '../../transport';
import { handleRpcError } from '../../utils/error_handler';

const notification = useNotification()
const userStore = useUserStore()

const props = defineProps<{
  id: string
}>()

const getImageContent = async (id: string): Promise<GetImageContentResponse> => {

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

const imageContent = await getImageContent(props.id)

const makeImageUrl = () => {
  return 'data:image/jpeg;base64,' + btoa(
    new Uint8Array(imageContent.pChunkData)
      .reduce((data, byte) => data + String.fromCharCode(byte), '')
  );
}

</script>

<template>
  <div v-if="imageContent">
    <img :src="makeImageUrl()" />
  </div>
</template>

<style scoped lang="scss">
</style>