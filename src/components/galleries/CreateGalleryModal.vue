<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { computed, ref } from 'vue';
import { useCreateGallery } from '../../mutations/createGallery';
import { useNotification } from '@kyvg/vue3-notification';
import { useGalleryNameRules } from '../../validation/rules/gallery_name_rules';
import { useGalleries } from '../../queries/galleries';
import { helpers } from '@vuelidate/validators';

const notification = useNotification()

const { data } = useGalleries()
const usedGalleryNames = computed(() => data.value ? data.value.pContent.map(v => v.pGalleryName) : [])

const isOpened = defineModel('isOpened', { required: true })

const galleryName = ref("");
const galleryNameRules = useGalleryNameRules() 

const v = useVuelidate(
  {
    galleryName: {
      ...galleryNameRules,
      unique: helpers.withMessage(
        "Gallery name must be unique", 
        (value: string) => usedGalleryNames.value.indexOf(value) === -1
      )
    },
  },
  {
    galleryName,
  }
)
const galleryNameErrorMessages = computed(() => v.value.galleryName.$silentErrors.map(e => e.$message))

const { mutate } = useCreateGallery()

const createGalleryAction = () => {
  if (v.value.$invalid) {
    notification.notify({
      text: "Not expected it to be called when fields are invalid",
      type: "error",
    })

    return
  }

  mutate(galleryName.value)

  isOpened.value = false
  galleryName.value = ""
}

</script>

<template>
  <div class="modal" :class="{ 'is-active': isOpened }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <h3 class="title is-3 has-text-centered">Create new gallery</h3>

        <div class="field">
          <label class="label">Gallery name</label>
          <div class="control">
            <input type="text" class="input" v-model="galleryName">
          </div>
          <p v-if="v.galleryName.$invalid" v-for="m in galleryNameErrorMessages" class="help is-danger">{{ m }}</p>
        </div>

        <div class="field has-text-centered">
          <button class="button is-primary" :disabled="v.$invalid" @click="createGalleryAction">Create</button>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" @click="isOpened = false" />
  </div>
</template>

<style lang="scss" scoped>
</style>