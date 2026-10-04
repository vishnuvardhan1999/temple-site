<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { temple } from '../data/temple'

const numbers = [
  { label: 'Temple', value: temple.phone },
  { label: 'Mobile', value: temple.mobile },
].filter((n) => n.value)

const telLink = (value) => `tel:${value.replace(/\s/g, '')}`

// On phones only the round icon shows; tapping it opens the list of numbers
const open = ref(false)
const root = ref(null)

function onDocumentClick(event) {
  if (!root.value?.contains(event.target)) open.value = false
}

function onKeydown(event) {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <!-- Floating contact numbers, pinned to the bottom-right of every page -->
  <div ref="root" class="call-button" :class="{ 'call-button--open': open }">
    <button
      type="button"
      class="call-button__icon"
      aria-label="Call the temple"
      aria-controls="call-button-numbers"
      :aria-expanded="open"
      @click="open = !open"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
      </svg>
    </button>

    <ul id="call-button-numbers" class="call-button__numbers">
      <li v-for="(number, index) in numbers" :key="number.value">
        <span v-if="index > 0" class="call-button__separator" aria-hidden="true">/</span>
        <a :href="telLink(number.value)" :aria-label="`Call ${number.label} ${number.value}`">
          {{ number.value }}
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.call-button {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #fff;
  color: #2a1a17;
  padding: 0.6rem 1.4rem 0.6rem 0.6rem;
  border-radius: 999px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  font-weight: 700;
}

.call-button:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
}

.call-button__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  border-radius: 50%;
  background: var(--maroon);
  color: #fff;
  padding: 0;
  cursor: pointer;
}

.call-button__numbers {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
}

.call-button__numbers a {
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
}

.call-button__numbers a:hover {
  color: #b3211e;
}

.call-button__separator {
  margin: 0 0.5rem;
  font-weight: 400;
  opacity: 0.5;
}

@media (max-width: 600px) {
  .call-button {
    right: 0.8rem;
    bottom: calc(0.8rem + env(safe-area-inset-bottom));
    padding: 0.35rem;
  }

  .call-button__icon {
    width: 3.25rem;
    height: 3.25rem;
  }

  .call-button__numbers {
    display: none;
  }

  .call-button--open .call-button__numbers {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    position: absolute;
    right: 0;
    bottom: calc(100% + 0.55rem);
    min-width: 220px;
    margin: 0;
    padding: 0.35rem;
    border-radius: 0.9rem;
    background: #fffdf9;
    box-shadow: 0 12px 28px rgba(42, 16, 16, 0.2);
  }

  .call-button__separator {
    display: none;
  }

  .call-button__numbers a {
    display: flex;
    align-items: center;
    min-height: 48px;
    padding: 0.35rem 0.8rem;
  }
}
</style>
