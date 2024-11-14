<script setup lang="ts">
import { ref } from 'vue';
import { useDeleteGallery } from '../../mutations/deleteGallery';
import { useRouter } from 'vue-router';

const props = defineProps<{
  name: string,
  id: string,
}>();

const router = useRouter()

const { mutate } = useDeleteGallery()

const isDeleteHovered = ref(false);

const deleteGalleryAction = () => {
  mutate(props.id) 
}

const openGalleryAction = () => {
  router.push("/user/galleries/" + props.id)
}

</script>

<template>
  <div class="box">

    <figure class="image is-16by9 has-radius-normal has-text-centered mb-3 has-background-text-90" @click="openGalleryAction">
      <div class="is-fullheight">
        <div class="container">
          Nothing to show
        </div>
      </div>
    </figure>

    <div class="field is-grouped">

      <p class="is-text-overflow" v-on:mouseenter="">
        {{ name }}
      </p>

      <button class="button is-small" :class="{ 'is-danger': isDeleteHovered}" v-on:mouseenter="isDeleteHovered = true" v-on:mouseleave="isDeleteHovered = false" @click="deleteGalleryAction">
        <span class="icon">
          <i class="pi pi-trash" />
        </span>
      </button>

    </div>

  </div>
</template>

<style scoped lang="scss">
.is-fullheight {
  height: 100%;
  text-align: center;
  align-items: center;
  display: flex;
}

.is-text-overflow {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
}

.image {
  cursor: pointer;
}
</style>