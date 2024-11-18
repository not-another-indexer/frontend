<script setup lang="ts">
import { useNotification } from '@kyvg/vue3-notification';
import { useAddImage } from '../../mutations/addImage';
import useVuelidate from '@vuelidate/core';
import { useDescriptionRules } from '../../validation/rules/description';
import { useExtensionRules } from '../../validation/rules/extension';
import { computed, ref } from 'vue';
import { helpers } from '@vuelidate/validators';

const notification = useNotification()

const isOpened = defineModel('isOpened', { required: true })
const props = defineProps<{
  galleryId: string,
}>()
const isFileLoaded = ref(false)
const fileName = ref("")

const { mutate, imageBytes, galleryId, description, extension} = useAddImage()
galleryId.value = props.galleryId

const descriptionRules = useDescriptionRules()
const extensionRules = useExtensionRules()

const v = useVuelidate(
  {
    description: descriptionRules,
    extension: extensionRules,
    imageBytes: {
      required: helpers.withMessage("The file cannot be empty", (value: Uint8Array) => value.length > 0)
    },
  },
  {
    description,
    extension,
    imageBytes,
  },
)

const descriptionErrorMessages = computed(() => v.value.description.$silentErrors.map(e => e.$message))
const imageBytesErrorMessages = computed(() => v.value.description.$silentErrors.map(e => e.$message))

const onFileChange = (e: Event) => {
  notification.notify({
    clean: true
  })

  if (e.target === null) {
    notification.notify({
      text: "Unexpected behaviour",
      type: "warn",
    })

    return
  }

  const target = e.target as HTMLInputElement
  if (!target || !target.files) {
    notification.notify({
      "text": "Expected file",
      "type": "warn",
    })
    
    return
  }

  if (target.files.length === 0) {
    return
  }

  isFileLoaded.value = false
  fileName.value = ""

  const file = target.files[0]
  extension.value = file.name.slice(file.name.lastIndexOf(".") + 1)
  if (v.value.extension.$invalid) {
    notification.notify({
      title: "Selected invalid file",
      text: "Possibly you selected file with wrong extension",
      duration: -1,
    })

    extension.value = ""
    return
  }

  const reader = new FileReader();
  reader.onload = (_) => {
    const arrayBuffer = reader.result as ArrayBuffer
    const bytes = new Uint8Array(arrayBuffer)
    imageBytes.value = bytes
    fileName.value = file.name
    isFileLoaded.value = true
  }
  reader.onerror = (_) => {
    notification.notify({
      text: "Failed to load file",
      type: "error",
      duration: -1,
    })

    extension.value = ""
  }
  reader.readAsArrayBuffer(file)
}

const addImageAction = () => {
  mutate()

  isOpened.value = false
  isFileLoaded.value = false
  // imageBytes.value = new Uint8Array
  description.value = ""
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
          <textarea v-model="description" class="textarea" placeholder="e.g. Sunny morning" />
          <p v-if="v.description.$invalid" v-for="m in descriptionErrorMessages" class="help is-danger">{{ m }}</p>
        </div>

        <div class="field">
          <div v-if="isFileLoaded" class="file is-success has-name is-centered is-boxed is-fullwidth">
            <label class="file-label">
              <input v-on:change="onFileChange" class="file-input" type="file" name="resume" accept=".jpg,.png,.jpeg">
              <span class="file-cta">
                <span class="file-icon">
                  <i class="pi pi-cloud-upload" />
                </span>
                <span class="file-label has-text-centered">Change file</span>
              </span>
              <span class="file-name has-text-centered">{{ fileName }}</span>
            </label>
            <p v-if="v.imageBytes.$invalid" v-for="m in imageBytesErrorMessages" class="help is-danger">{{ m }}</p>
          </div>

          <div v-else class="file is-success is-centered is-boxed is-fullwidth">
            <label class="file-label">
              <input v-on:change="onFileChange" class="file-input" type="file" name="resume" accept=".jpg,.png,.jpeg">
              <span class="file-cta">
                <span class="file-icon">
                  <i class="pi pi-cloud-upload" />
                </span>
                <span class="file-label has-text-centered">Select file</span>
              </span>
            </label>
          </div>
        </div>

        <div class="field has-text-centered">
          <button class="button is-primary" @click="addImageAction" :disabled="v.$invalid">Add image</button>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" @click="isOpened = false" />
  </div>
</template>

<style lang="scss" scoped>
</style>