<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  images: { type: Array, required: true },
})

const paused = ref(false)
const loop = computed(() => [...props.images, ...props.images])

function pause() {
  paused.value = true
}

function resume() {
  paused.value = false
}
</script>

<template>
  <div
    class="strip"
    :class="{ 'strip--paused': paused }"
    @mouseenter="pause"
    @mouseleave="resume"
    @touchstart.passive="pause"
    @touchend="resume"
    @touchcancel="resume"
  >
    <div class="strip__track">
      <figure v-for="(image, index) in loop" :key="index" class="strip__card">
        <img
          :src="image.src"
          :alt="index < images.length ? image.alt : ''"
          decoding="async"
        />
      </figure>
    </div>
  </div>
</template>

<style scoped>
.strip {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to right, transparent, #000 9%, #000 91%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 9%, #000 91%, transparent);
}

.strip__track {
  display: flex;
  gap: 0.85rem;
  width: max-content;
  animation: strip-move 52s linear infinite;
}

.strip:hover .strip__track,
.strip--paused .strip__track {
  animation-play-state: paused;
}

.strip__card {
  flex: 0 0 280px;
  height: 400px;
  margin: 0;
  overflow: hidden;
  border-radius: 1.15rem;
}

.strip__card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 22%;
}

@keyframes strip-move {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

@media (max-width: 700px) {
  .strip__track {
    gap: 0.65rem;
  }

  .strip__card {
    flex-basis: 190px;
    height: 260px;
    border-radius: 0.95rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .strip {
    overflow-x: auto;
    -webkit-mask-image: none;
    mask-image: none;
  }

  .strip__track {
    animation: none;
  }
}
</style>
