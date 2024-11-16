<script setup lang="ts">
import { useNotification } from '@kyvg/vue3-notification';
import { useAddImage } from '../../mutations/addImage';

const notification = useNotification()

const isOpened = defineModel('isOpened', { required: true })
const props = defineProps<{
  galleryId: string,
}>()

const { mutate, imageBytes, galleryId, description, extension} = useAddImage()

galleryId.value = props.galleryId

const onFileChange = (e: Event) => {
  if (e.target === null) {
    notification.notify({
      text: "Unexpected behaviour",
      type: "warn",
    })

    return
  }

  const target = e.target as HTMLInputElement
  if (!target || !target.files || target.files.length === 0) {
    notification.notify({
      "text": "Expected file",
      "type": "warn",
    })
    
    return
  }

  const file = target.files[0]

  const reader = new FileReader();
  reader.onload = (_) => {
    const arrayBuffer = reader.result as ArrayBuffer
    const bytes = new Uint8Array(arrayBuffer)
    imageBytes.value = bytes
  }
  reader.readAsArrayBuffer(file)

  extension.value = file.name.slice(file.name.lastIndexOf(".") + 1)
}

const addImageAction = () => {
  mutate()
  console.log("I DID")
}

</script>

<template>
  <div class="modal" :class="{ 'is-active': isOpened }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <h3 class="title id-3 has-text-centered">Add new image</h3>

        <div class="field">
          <label class="label">Image description</label>
          <textarea v-model="description" class="textarea" placeholder="e.g. Sunny morning"></textarea>
        </div>

        <div class="field">
          <div class="file is-centered is-boxed has-name">
            <label class="file-label">
              <input v-on:change="onFileChange" class="file-input" type="file" name="resume" accept=".jpg,.png,.jpeg">
              <span class="file-cta">
                <span class="file-icon">
                  <i class="pi pi-cloud-upload" />
                </span>
                <span class="file-label">Upload file</span>
              </span>
            </label>
          </div>
        </div>

        <div class="field has-text-centered">
          <button class="button is-primary" @click="addImageAction">Add image</button>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" @click="isOpened = false" />
  </div>
</template>

<style lang="scss" scoped>
</style>