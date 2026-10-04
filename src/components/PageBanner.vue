<script setup>
defineProps({
  title: { type: String, required: true },
  image: { type: String, default: '' },
})
</script>

<template>
  <div class="page-banner" :class="{ 'page-banner--photo': image }">
    <img v-if="image" :src="image" alt="" class="page-banner__img" decoding="async" />
    <div v-if="image" class="page-banner__shade" aria-hidden="true"></div>
    <h1>{{ title }}</h1>
  </div>
</template>

<style scoped>
.page-banner {
  position: relative;
  display: grid;
  min-height: 148px;
  place-items: end start;
  overflow: hidden;
  background: var(--maroon-deep);
  color: #fffaf3;
  padding: 2.25rem 1.25rem 1.5rem;
}

.page-banner--photo {
  min-height: 220px;
  align-items: end;
}

.page-banner__img,
.page-banner__shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.page-banner__img {
  object-fit: cover;
  object-position: center 30%;
}

.page-banner__shade {
  background: linear-gradient(to top, rgba(28, 8, 12, 0.78), rgba(28, 8, 12, 0.28));
}

.page-banner h1 {
  position: relative;
  z-index: 1;
  max-width: 1080px;
  margin: 0 auto;
  width: 100%;
  font-size: clamp(2rem, 8vw, 3.4rem);
  font-weight: 560;
  line-height: 1.05;
  letter-spacing: -0.03em;
  text-transform: none;
}

@media (min-width: 720px) {
  .page-banner {
    min-height: 180px;
    padding: 3.25rem 1.5rem 2rem;
  }

  .page-banner--photo {
    min-height: 300px;
  }
}
</style>
