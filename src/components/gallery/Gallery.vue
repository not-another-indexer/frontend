<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useGalleryImages } from '../../queries/gallery';
import { useNotification } from '@kyvg/vue3-notification';
import { ref } from 'vue';
import AddImageModal from './AddImageModal.vue';

const notification = useNotification()

const route = useRoute()
const idParam = route.params["id"] as string

const { data, refresh, id, size, offset } = useGalleryImages()
id.value = idParam
size.value = 5
offset.value = 0

refresh()

const isAddImageModalOpened = ref(true)

</script>

<template>
  <AddImageModal v-model:is-opened="isAddImageModalOpened" :gallery-id="idParam" />
</template>

<style lang="scss" scoped>
</style>