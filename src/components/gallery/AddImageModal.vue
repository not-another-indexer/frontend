<script setup lang="ts">
import { useNotification } from '@kyvg/vue3-notification';
import { ref } from 'vue';

const notification = useNotification()

const isOpened = defineModel('isOpened', { required: true })
const props = defineProps<{
  galleryId: string,
}>()

const description = ref("")
const file = ref<File | null>()

const onFileChange = (e: Event) => {
  if (e.target === null) {
    notification.notify({
      text: "Unexpected behaviour",
      type: "warn",
    })

    return
  }

  const target = e.target as HTMLInputElement
  if (target && target.files) {
    file.value = target.files[0];
  }
}

const addImageAction = () => {

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