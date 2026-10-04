<script setup>
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import NewsTicker from './components/NewsTicker.vue'
import CallButton from './components/CallButton.vue'
import { landAppeal } from './data/temple'
</script>

<template>
  <!-- Banner and header stay pinned to the top together while scrolling -->
  <div class="site-top">
    <NewsTicker v-if="landAppeal.url" :appeal="landAppeal" />
    <SiteHeader />
  </div>
  <main>
    <RouterView />
  </main>
  <SiteFooter />
  <CallButton />
</template>

<style scoped>
.site-top {
  position: sticky;
  top: 0;
  z-index: 50;
}
</style>
