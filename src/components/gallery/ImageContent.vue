<script setup lang="ts">
import { ref } from 'vue';
import Image from '../../assets/Image.vue';


const props = defineProps<{
  id: string,
}>()

const isDeleteHovered = ref(false)

const deleteImageAction = () => {

}

</script>

<template>
  <div class="box">
    <figure class="image has-radius-normal has-text-centered mb-3 has-background-text-90">
      <Image :id="id" />
    </figure>

    <button class="button is-small is-fullwidth" :class="{'is-danger': isDeleteHovered}" v-on:mouseenter="isDeleteHovered = true" v-on:mouseleave="isDeleteHovered = false">
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