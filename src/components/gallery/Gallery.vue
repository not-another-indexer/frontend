<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import AddImageModal from './AddImageModal.vue';
import ImageContent from './ImageContent.vue';
import { getGalleryImages } from '../../requests/getGalleryImages';
import { useQuery } from '@pinia/colada';

const router = useRouter()
const route = useRoute()

const id = route.params["id"] as string
const size = ref(5)
const offset = ref(0)

const { data } = useQuery({
  key: () => ['galleryImages', id],
  query: () => getGalleryImages(id, size.value, offset.value),
})


const isAddImageButtonHovered = ref(false)

const isAddImageModalOpened = ref(false)

const goToGalleries = () => {
  router.push("/user/galleries")
}

</script>

<template>
  <AddImageModal v-model:is-opened="isAddImageModalOpened" :gallery-id="id" />
  <section class="hero is-small">
    <div class="hero-body">
      <section class="hero is-small">
        <nav class="level">
          <div class="level-left">
            <div class="level-item">
              <button class="button" @click="goToGalleries">
                <span class="icon is-small">
                  <i class="pi pi-angle-left" />
                </span>
                <span>Back to galleries</span>
              </button>
            </div>
          </div>
 
          <div class="level-right">
            <nav class="level is-mobile">
              <div class="level-item">
                <button class="button" :class="{ 'is-primary': isAddImageButtonHovered }" v-on:mouseenter="isAddImageButtonHovered = true" v-on:mouseleave="isAddImageButtonHovered = false" @click="isAddImageModalOpened = true">
                  Add image
                </button> 
              </div>
            </nav>
          </div>
        </nav>
      </section>
    </div>
  </section>
  
  <div v-if="data" class="container is-fluid">
    <div v-if="data.pContent.length === 0" class="has-text-centered">
      No available images.
    </div>
    <div v-else class="grid">
      <div class="cell" v-for="imageData in data.pContent">
        <ImageContent :id="imageData.pImageId" :gallery-id="id" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>