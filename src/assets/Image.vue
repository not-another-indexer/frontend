<script setup lang="ts">
import { useQuery } from '@pinia/colada';
import { getImageContent } from '../requests/getImageContent';
import { makeImageUrl } from '../utils/image';
import { computed } from 'vue';

const props = defineProps<{
  id: string
}>()

const { data, asyncStatus, status } = useQuery({
  key: () => ['imageContent', props.id],
  query: () => getImageContent(props.id)
})

const imageUrl = computed(() => {
  if (data.value) {
    return makeImageUrl(data.value.pChunkData)
  }
  
  return ""
})

</script>

<template>
  <div v-if="asyncStatus === 'loading'">
    <img class="is-skeleton" />
  </div>
  <div v-else-if="status === 'error'">
  </div>
  <div v-else>
    <img class="image-content" :src="imageUrl" />
  </div>
</template>

<!-- :style="{ 'background-image': `url(${imageUrl})`, 'background-size': 'cover' }" -->

<style scoped lang="scss">
.image-content {
  object-fit: contain;
}
</style>