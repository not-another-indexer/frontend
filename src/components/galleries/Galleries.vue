<script setup lang="ts">
import { ref } from 'vue';
import SingleGallery from './SingleGallery.vue';
import CreateGalleryModal from './CreateGalleryModal.vue';
import { useGalleries } from '../../queries/galleries';
import { countScreenType } from '../../utils/window';
import { screenTypeToNumberOfCols } from '../../utils/columns';
import { useUserStore } from '../../stores/UserStore';
import { useRouter } from 'vue-router';

const router = useRouter()

const userStore = useUserStore()

const { data, asyncStatus } = useGalleries()

const isCreateButtonHovered = ref(false)
// const isSearchButtonHovered = ref(false)
const isUserButtonHovered = ref(false)

const isCreateGalleryModalOpened = ref(false)

window.addEventListener('resize', () => {
  numOfCols.value = screenTypeToNumberOfCols(countScreenType())
})
const numOfCols = ref(screenTypeToNumberOfCols(countScreenType()))

const logoutAction = () => {
  userStore.logout() 
  router.push("/sign-in")
}

</script>

<template>
  <CreateGalleryModal v-model:is-opened="isCreateGalleryModalOpened" />
  <section class="hero is-small">
    <div class="hero-body">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <button class="button is-search-desktop is-icon" :class="{ 'has-background-warning-85': isUserButtonHovered, 'has-text-warning-85-invert': isUserButtonHovered }" @click="logoutAction" v-on:mouseenter="isUserButtonHovered = true" v-on:mouseleave="isUserButtonHovered = false">
              <span class="icon">
                <i class="pi pi-angle-left" />
              </span>
              <span>
                Logout
              </span>
            </button>
          </div>
          <!-- <div class="level-item">
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
          </div> -->
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
          </nav>
        </div>
      </nav>
    </div>
  </section>

  <div v-if="asyncStatus === 'idle' && data" class="container is-fluid">
    <div v-if="data.pContent.length === 0" class="has-text-centered">
      No available galleries.
    </div>
    <div v-else>
      <div class="fixed-grid" :class="{ 'has-1-cols': numOfCols === 1, 'has-2-cols': numOfCols === 2, 'has-3-cols': numOfCols === 3}">
        <div class="grid">
          <div class="cell" v-for="galleryPreview in data.pContent">
            <SingleGallery :name="galleryPreview.pGalleryName" :id="galleryPreview.pGalleryUuid" :image-ids="galleryPreview.pPreview" />
          </div> 
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// .grid {
//   grid-template-columns: repeat(auto-fit, minmax(var(--bulma-grid-column-min), max-content));
// }

// .cell {
//   max-width: 15rem;
// }
</style>
