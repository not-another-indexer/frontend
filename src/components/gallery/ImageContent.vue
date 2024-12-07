<script setup lang="ts">
import { ref } from 'vue';
import Image from '../../assets/Image.vue';
import { useMutation, useQueryCache } from '@pinia/colada';
import { deleteImage } from '../../requests/deleteImage';


const props = defineProps<{
  id: string,
  galleryId: string,
}>()

const isDeleteHovered = ref(false)

const { mutate } = useMutation({
  mutation: () => deleteImage(props.id),
  onSettled: async () => {
    const queryCache = useQueryCache()
    await queryCache.invalidateQueries({ key: ['galleryImages', props.galleryId] })
    await queryCache.invalidateQueries({ key: ['galleries'], exact: true })
  }
})

const deleteImageAction = () => {
  mutate()  
}

</script>

<template>
  <div :style="{ maxWidth: '350px', maxHeight: '250px' }" class="box">
    <figure class="image has-radius-normal has-text-centered mb-3 has-background-text-90">
      <Image  :id="id" />
    </figure>

    <button @click="deleteImageAction" class="button is-small is-fullwidth" :class="{'is-danger': isDeleteHovered}" v-on:mouseenter="isDeleteHovered = true" v-on:mouseleave="isDeleteHovered = false">
      <span>
        Delete
      </span>
      <span class="icon">
        <i class="pi pi-trash" />
      </span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
</style>