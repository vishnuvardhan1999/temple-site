<script setup>
defineProps({
  appeal: { type: Object, required: true },
})
</script>

<template>
  <aside class="appeal-strip" aria-label="Temple land appeal">
    <span class="appeal-strip__label">Appeal</span>
    <p>{{ appeal.shortText }}</p>
  </aside>
</template>

<style scoped>
.appeal-strip {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  min-height: 2.75rem;
  align-items: stretch;
  background: #651b24;
  color: #fff5db;
}

.appeal-strip__label {
  display: flex;
  align-items: center;
  background: #d4a017;
  color: #35110e;
  padding: 0.6rem 1rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.appeal-strip p {
  align-self: center;
  margin: 0;
  padding: 0.55rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
}

@media (max-width: 600px) {
  .appeal-strip__label {
    justify-content: center;
    padding: 0.55rem 0.6rem;
    font-size: 0.62rem;
  }

  .appeal-strip p {
    padding: 0.5rem 0.65rem;
    font-size: 0.85rem;
    text-align: left;
  }

}
</style>
