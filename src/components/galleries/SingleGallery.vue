<script setup lang="ts">
import { ref } from 'vue';
import { useDeleteGallery } from '../../mutations/deleteGallery';
import { useRouter } from 'vue-router';
import Image from '../../assets/Image.vue';

const props = defineProps<{
  name: string,
  id: string,
  imageIds: string[],
}>();

const router = useRouter()

const { mutate } = useDeleteGallery()

const isDeleteHovered = ref(false)

const deleteGalleryAction = () => {
  mutate(props.id) 
}

const openGalleryAction = () => {
  router.push("/user/galleries/" + props.id)
}

</script>

<template>
  <div class="box has-tooltip-bottom" :data-tooltip="name" @click="openGalleryAction">

    <figure class="image is-16by9 has-radius-normal has-text-centered mb-3 has-background-text-90">
      <div v-if="imageIds.length === 0" class="has-content-fullheight">
        <div class="container">
          Nothing to show
        </div>
      </div>
      
      <Image v-else :id="imageIds[0]" />
    </figure>

    <div class="field is-grouped">

      <p class="is-text-overflow">
        {{ name }}
      </p>

      <button class="button is-small" :class="{ 'is-danger': isDeleteHovered}" v-on:mouseenter="isDeleteHovered = true" v-on:mouseleave="isDeleteHovered = false" @click.stop="deleteGalleryAction">
        <span class="icon">
          <i class="pi pi-trash" />
        </span>
      </button>

    </div>

  </div>
</template>

<style scoped lang="scss">
.is-text-overflow {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
}
</style>