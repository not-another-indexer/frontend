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
const isSearchDropdownActive = ref(false)
const isAddImageModalOpened = ref(false)

const semanticOnePeaceSimilarity = ref(0.5)
const recognizedTextSimilarity = ref(0.5)
const textualDescriptionSimilarity = ref(0.5)
const recognizedFaceSimilarity = ref(0.5)
const recognizedTextBm25Rank = ref(0.5)
const textualDescriptionBm25Rank = ref(0.5)
const query = ref("")

const goToGalleries = () => {
  router.push("/user/galleries")
}

</script>

<template>
  <AddImageModal v-model:is-opened="isAddImageModalOpened" :gallery-id="id" />
  <section class="hero is-small">
    <div class="hero-body">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <nav class="level is-mobile">
              <div class="level-item">
                <button class="button" @click="goToGalleries">
                  <span class="icon is-small">
                    <i class="pi pi-angle-left" />
                  </span>
                  <span>Back to galleries</span>
                </button>
                {{ asyncStatus }}
              </div>
              <div class="level-item">
                <div class="dropdown">
                  <div class="dropdown-trigger">
                    <button class="button is-info" aria-haspopup="true" aria-controls="dropdown-menu1" @click="isSearchDropdownActive = !isSearchDropdownActive">
                      <span class="icon is-small">
                        <i class="pi pi-search"></i>
                      </span>
                      <span>Search</span>
                      <span class="icon is-small">
                        <i class="pi" :class="{ 'pi-angle-right': !isSearchDropdownActive, 'pi-angle-down': isSearchDropdownActive }" aria-hidden="true"></i>
                      </span>
                    </button>
                  </div>
                  <div class="dropdown-menu" id="dropdown-menu1" role="menu">
                    <div class="dropdown-content">
                      <div class="dropdown-item">
                      </div>
                      <div class="dropdown-item">
                        <div class="field">

                        </div>
                      </div>
                      <hr class="dropdown-divider" />
                      <div class="dropdown-item">
                        <textarea class="textarea"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
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
    </div>
  </section>
  <section v-if="isSearchDropdownActive"class="hero is-small">
    <div class="hero-body">
      <nav class="level">
        <div class="level-item">
          <div class="container">
            <label class="label is-small my-0">Semantic one peace similarity</label>
            <input v-model="semanticOnePeaceSimilarity" class="slider is-small is-fullwidth is-primary is-circle has-output my-0" step="0.001" min="0" max="1" value="0.5" type="range" />
            <output class="has-text-primary-invert">{{ semanticOnePeaceSimilarity }}</output>

            <label class="label is-small my-0">Recognized text similarity</label>
            <input v-model="recognizedTextSimilarity" class="slider is-small is-fullwidth is-primary is-circle has-output my-0" step="0.001" min="0" max="1" value="0.5" type="range" />
            <output class="has-text-primary-invert">{{ recognizedTextSimilarity }}</output>

            <label class="label is-small my-0">Textual description similarity</label>
            <input v-model="textualDescriptionSimilarity" class="slider is-small is-fullwidth is-primary is-circle has-output my-0" step="0.001" min="0" max="1" value="0.5" type="range" />
            <output class="has-text-primary-invert">{{ textualDescriptionSimilarity }}</output>

            <label class="label is-small my-0">Recognized face similarity</label>
            <input v-model="recognizedFaceSimilarity" class="slider is-small is-fullwidth is-primary is-circle has-output my-0" step="0.001" min="0" max="1" value="0.5" type="range" />
            <output class="has-text-primary-invert">{{ recognizedFaceSimilarity }}</output>

            <label class="label is-small my-0">Recognized text BM25 rank</label>
            <input v-model="recognizedTextBm25Rank" class="slider is-small is-fullwidth is-primary is-circle has-output my-0" step="0.001" min="0" max="1" value="0.5" type="range" />
            <output class="has-text-primary-invert">{{ recognizedTextBm25Rank }}</output>

            <label class="label is-small my-0">Textual description BM25 rank</label>
            <input v-model="textualDescriptionBm25Rank" class="slider is-small is-fullwidth is-primary is-circle has-output my-0" step="0.001" min="0" max="1" value="0.5" type="range" />
            <output class="has-text-primary-invert">{{ textualDescriptionBm25Rank }}</output>
          </div>
        </div>
        <div class="level-item">
          <div class="container">
            <label class="label is-small">Query</label>
            <textarea v-model="query" class="textarea" placeholder="e.g. black cat"></textarea>
          </div>
        </div>
      </nav>
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