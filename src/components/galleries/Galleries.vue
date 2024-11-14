<script setup lang="ts">
import { ref } from 'vue';
import SingleGallery from './SingleGallery.vue';
import CreateGalleryModal from './CreateGalleryModal.vue';
import { useGalleries } from '../../queries/galleries';

const { data, refresh } = useGalleries()

refresh()

const isCreateButtonHovered = ref(false)
const isSearchButtonHovered = ref(false)
const isUserButtonHovered = ref(false)
const isCreateGalleryModalOpened = ref(false)

</script>

<template>
  <CreateGalleryModal v-model:is-opened="isCreateGalleryModalOpened" />
  <section class="hero is-small">
    <div class="hero-body">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <div class="field has-addons">
              <p class="control">
                <input type="text" class="input" placeholder="Find a gallery">
              </p>
              <p class="control">
                <button class="button" :class="{ 'is-info': isSearchButtonHovered }" v-on:mouseenter="isSearchButtonHovered = true" v-on:mouseleave="isSearchButtonHovered = false">
                  Search
                </button>
              </p>
            </div>
          </div>
        </div>
        <div class="level-right">
          <nav class="level is-mobile">
            <div class="level-item">
              Want to add another gallery?
            </div>
            <div class="level-item">
              <button class="button" :class="{ 'is-primary': isCreateButtonHovered }" v-on:mouseenter="isCreateButtonHovered = true" v-on:mouseleave="isCreateButtonHovered = false" @click="isCreateGalleryModalOpened = true">
                Create
              </button>
            </div>
            <div class="level-item">
              <button class="button is-search-desktop is-icon" :class="{ 'has-background-warning-85': isUserButtonHovered, 'has-text-warning-85-invert': isUserButtonHovered }" v-on:mouseenter="isUserButtonHovered = true" v-on:mouseleave="isUserButtonHovered = false">
                <span class="icon">
                  <i class="pi pi-user" />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </nav>
    </div>
  </section>

  <div v-if="data" class="container is-fluid">
    <div v-if="data.pContent.length === 0" class="has-text-centered">
      No available galleries.
    </div>
    <div v-else class="grid">
      <div class="cell" v-for="galleryPreview in data.pContent">
        <SingleGallery :name="galleryPreview.pGalleryName" :id="galleryPreview.pGalleryUuid" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// .grid {
//   grid-template-columns: repeat(auto-fit, minmax(var(--bulma-grid-column-min), max-content));
// }

.cell {
  max-width: 15rem;
}
</style>
