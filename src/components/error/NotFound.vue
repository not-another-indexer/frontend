<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()

const goToGalleriesPage = () => {
  router.push("/user/galleries")
}

</script>

<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="field">
          <p class="title is-1">
            Уууууууууупс.....
          </p>
        </div>
        <div class="field">
          <p class="subtitle is-3">
            Что-то пошло не так, и вы оказались на несуществующей странице
          </p>
        </div>
        <div class="field has-text-centered">
          <button @click="goToGalleriesPage" class="button is-primary is-large is-fullwidth">
            Перейти на страницу с галлереями
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
</style>