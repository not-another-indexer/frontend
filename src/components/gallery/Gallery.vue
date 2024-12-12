<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import AddImageModal from './AddImageModal.vue';
import ImageContent from './ImageContent.vue';
import { getGalleryImages } from '../../requests/getGalleryImages';
import { useQuery } from '@pinia/colada';
import { searchImages, SearchParameters } from '../../requests/searchImages';
import { useNotification } from '@kyvg/vue3-notification';
import { useQueryRules } from '../../validation/rules/search/query';
import { useCountRules } from '../../validation/rules/search/count';
import useVuelidate from '@vuelidate/core';
import { helpers } from '@vuelidate/validators';
import { SearchImagesResponse } from '../../protos/nai';
import { screenTypeToNumberOfCols } from '../../utils/columns';
import { countScreenType } from '../../utils/window';

const notification = useNotification()
const router = useRouter()
const route = useRoute()

const id = route.params["id"] as string
const size = ref(5)
const offset = ref(0)

const { data, asyncStatus, refresh } = useQuery({
  key: () => ['galleryImages', id, size.value, offset.value],
  query: () => getGalleryImages(id, size.value, offset.value),
})

const isAddImageButtonHovered = ref(false)
const isSearchDropdownActive = ref(false)
const isAddImageModalOpened = ref(false)

const semanticOnePeaceSimilarity = ref("0.5")
const recognizedTextSimilarity = ref("0.5")
const textualDescriptionSimilarity = ref("0.5")
const recognizedFaceSimilarity = ref("0.5")
const recognizedTextBm25Rank = ref("0.5")
const textualDescriptionBm25Rank = ref("0.5")
const query = ref("")
const count = ref<bigint>(10n)
const maxCount = computed(() => (data.value ? data.value.pTotal : 10n).toString())

const searchResult = ref<SearchImagesResponse | null>(null)

const queryRules = useQueryRules()
const countRules = useCountRules()

const v = useVuelidate(
  {
    query: queryRules,
    count: {
      ...countRules,
      maxValue: helpers.withMessage(
        "The count must be less then total count",
        (value: bigint) => data.value ? value <= data.value.pTotal : true,
      ),
    }
  },
  {
    query,
    count,
  }
)

const queryErrorMessages = computed(() => v.value.query.$silentErrors.map(e => e.$message))
const countErrorMessages = computed(() => v.value.count.$silentErrors.map(e => e.$message))

window.addEventListener('resize', () => {
  numOfCols.value = screenTypeToNumberOfCols(countScreenType())
})
const numOfCols = ref(screenTypeToNumberOfCols(countScreenType()))

const goToGalleries = () => {
  router.push("/user/galleries")
}

function safeValue(value: string) {
  const floatValue = Number(value)
  const validValue = isNaN(floatValue) ? 0.0 : floatValue;
  if (validValue > 1) {
    return 1.0;
  }
  if (validValue < 0 ) {
    return 0.0;
  }
  return validValue;
}

const searchAction = async () => {
  const semanticOnePeaceSimilaritySafe = safeValue(semanticOnePeaceSimilarity.value)
  const recognizedTextSimilaritySafe = safeValue(recognizedTextSimilarity.value)
  const textualDescriptionSimilaritySafe = safeValue(textualDescriptionSimilarity.value)
  const recognizedFaceSimilaritySafe = safeValue(recognizedFaceSimilarity.value)
  const recognizedTextBm25RankSafe = safeValue(recognizedTextBm25Rank.value)
  const textualDescriptionBm25RankSafe = safeValue(textualDescriptionBm25Rank.value)

  const sum = 
      semanticOnePeaceSimilaritySafe + 
      recognizedTextSimilaritySafe + 
      textualDescriptionSimilaritySafe + 
      recognizedFaceSimilaritySafe + 
      recognizedTextBm25RankSafe + 
      textualDescriptionBm25RankSafe

  

  const params: SearchParameters = {
    SEMANTIC_ONE_PEACE_SIMILARITY: sum !== 0 ? semanticOnePeaceSimilaritySafe / sum : semanticOnePeaceSimilaritySafe,
    RECOGNIZED_TEXT_SIMILARITY: sum !== 0 ? recognizedTextSimilaritySafe / sum : recognizedTextSimilaritySafe,
    TEXTUAL_DESCRIPTION_SIMILARITY: sum !== 0 ? textualDescriptionSimilaritySafe / sum : textualDescriptionSimilaritySafe,
    RECOGNIZED_FACE_SIMILARITY: sum !== 0 ? recognizedFaceSimilaritySafe / sum : recognizedFaceSimilaritySafe,
    RECOGNIZED_TEXT_BM25_RANK: sum !== 0 ? recognizedTextBm25RankSafe / sum : recognizedTextBm25RankSafe,
    TEXTUAL_DESCRIPTION_BM25_RANK: sum !== 0 ? textualDescriptionBm25RankSafe / sum : textualDescriptionBm25RankSafe,
  }

  try {
    searchResult.value = await searchImages(
      query.value,
      id,
      params,
      count.value,  
    )
  } catch (err: any) {
    if (err instanceof Error) {
      notification.notify({
        title: "Unable to show search result",
        type: "error",
        ignoreDuplicates: true,
      })
    } else {
      notification.notify({
        title: "Unable to show search result",
        type: "error",
        ignoreDuplicates: true,
      })
    }
  } 
}

const goToPageAction = (page: number) => {
  offset.value = (page - 1) * size.value
  refresh() 
}

const decrementPageAction = () => {
  offset.value -= size.value
  refresh()
}

const incrementPageAction = () => {
  offset.value += size.value
  refresh()
}

const normalizeCount = () => {
  if (count.value < 1n) {
    count.value = 1n
    return
  }

  if (data.value && data.value.pTotal < count.value) {
    count.value = data.value.pTotal
    return
  }

  if (Math.floor(Number(count.value)) !== Number(count.value)) {
    count.value = BigInt(Math.floor(Number(count.value)))
    return
  }
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
            <div v-if="searchResult === null" class="level-item">
              <button class="button" :class="{ 'is-primary': isAddImageButtonHovered }" v-on:mouseenter="isAddImageButtonHovered = true" v-on:mouseleave="isAddImageButtonHovered = false" @click="isAddImageModalOpened = true">
                Add image
              </button> 
            </div>
            <div v-else class="level-item">
              <button class="button is-danger" @click="searchResult = null">
                <span class="icon">
                  <i class="pi pi-times" />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </nav>
      <nav v-if="asyncStatus === 'idle' && data" class="pagination is-right" role="navigation" aria-label="pagination">
        <button class="pagination-previous" @click="decrementPageAction" :disabled="offset === 0">
          <span class="icon">
            <i class="pi pi-angle-left" />
          </span>
        </button>
        <button class="pagination-next" @click="incrementPageAction" :disabled="BigInt(offset + size) >= data.pTotal">
          <span class="icon">
            <i class="pi pi-angle-right"></i>
          </span>
        </button>
        <ul class="pagination-list">
          <li><button class="pagination-link" :class="{ 'is-current': Math.floor(offset / size) === 0 }" @click="goToPageAction(1)">1</button></li>
          <li><span v-if="Math.floor((offset - size) / size) > 2" class="pagination-ellipsis">&hellip;</span></li>
          <li><button v-if="Math.floor((offset - size) / size) > 0" class="pagination-link" @click="goToPageAction(Math.floor((offset - size) / size) + 1)">{{ Math.floor((offset - size) / size) + 1 }}</button></li>
          <li><button v-if="Math.floor(offset / size) > 0" class="pagination-link is-current" @click="goToPageAction(Math.floor(offset / size) + 1)">{{ Math.floor(offset / size) + 1 }}</button></li>
          <li><button v-if="data.pTotal - BigInt(offset + size) > 0" class="pagination-link" @click="goToPageAction(Math.floor((offset + size) / size) + 1)">{{ Math.floor((offset + size) / size) + 1 }}</button></li>
          <li><span v-if="(data.pTotal - BigInt(offset + size)) / BigInt(size) > 1" class="pagination-ellipsis">&hellip;</span></li>
          <li><button v-if="(data.pTotal - BigInt(offset + size)) / BigInt(size) > 0" class="pagination-link" :class="{ 'is-current': BigInt(offset + size) > data.pTotal }" @click="goToPageAction(Math.ceil(Number(data.pTotal) / size))">{{ Math.ceil(Number(data.pTotal) / size) }}</button></li>
        </ul>
      </nav>
    </div>
  </section>
  <section v-if="isSearchDropdownActive"class="hero is-small">
    <div class="hero-body pt-0">
      <button class="button is-fullwidth is-info mb-4" @click="searchAction" :disabled="v.query.$invalid || v.count.$invalid">
        Find images
      </button>
      <nav class="level">
        <div class="level-item">
          <div class="container is-fluid">
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
          <div class="container is-fluid">
            <div class="field">
              <label class="label is-small">
                Query
              </label>
              <textarea v-model="query" class="textarea" placeholder="e.g. black cat"></textarea>
              <p v-if="v.query.$invalid" v-for="m in queryErrorMessages" class="help is-danger">{{ m }}</p>
            </div>
            <div class="field">
              <label class="label is-small">
                Count
              </label>
              <div class="control">
                <input v-model="count" type="number" min="1" step="1" :max="maxCount" class="input" placeholder="e.g. 4" v-on:focusout="normalizeCount">
              </div>
              <p v-if="v.count.$invalid" v-for="m in countErrorMessages" class="help is-danger">{{ m }}</p>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </section>
  
  <div v-if="searchResult === null">
    <div v-if="asyncStatus === 'idle' && data" class="container is-fluid">
      <div v-if="data.pContent.length === 0" class="has-text-centered">
        No available images.
      </div>
      <div v-else class="fixed-grid" :class="{ 'has-1-cols': numOfCols === 1, 'has-2-cols': numOfCols === 2, 'has-3-cols': numOfCols === 3}">
        <div class="grid">
          <div class="cell" v-for="imageData in data.pContent">
            <ImageContent :id="imageData.pImageId" :gallery-id="id" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="container is-fluid">
    <div v-if="searchResult.pContent.length === 0" class="has-text-centered">
      No images found.
    </div>
    <div v-else class="fixed-grid" :class="{ 'has-1-cols': numOfCols === 1, 'has-2-cols': numOfCols === 2, 'has-3-cols': numOfCols === 3}">
      <div class="grid">
        <div class="cell" v-for="imageData in searchResult.pContent">
          <ImageContent :id="imageData.pImage!!.pImageId" :gallery-id="id" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>