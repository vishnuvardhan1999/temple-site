<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { landAppeal } from '../data/temple'

const REFRESH_INTERVAL_MS = 5 * 60 * 1000
const progress = ref(null)
let refreshTimer
let activeRequest

const progressPercent = computed(() => {
  if (!progress.value?.goal) return 0
  return (progress.value.raised / progress.value.goal) * 100
})

const progressPercentLabel = computed(() => {
  if (progressPercent.value > 0 && progressPercent.value < 1) return '<1'
  return Math.round(progressPercent.value)
})

const progressBarWidth = computed(() => {
  if (progressPercent.value <= 0) return 0
  return Math.min(100, Math.max(1.5, progressPercent.value))
})

const remainingAmount = computed(() => {
  if (!progress.value) return 0
  return Math.max(0, progress.value.goal - progress.value.raised)
})

function formatCurrency(amount, currency) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

async function loadProgress() {
  if (activeRequest) return

  activeRequest = new AbortController()

  try {
    const response = await fetch('/api/land-appeal-progress', {
      headers: { Accept: 'application/json' },
      signal: activeRequest.signal,
    })
    const data = await response.json()

    if (
      response.ok &&
      data.success &&
      Number.isFinite(data.raised) &&
      Number.isFinite(data.goal) &&
      data.goal > 0
    ) {
      progress.value = data
    }
  } catch {
    // Keep the existing appeal visible when live progress is unavailable.
  } finally {
    activeRequest = null
  }
}

onMounted(() => {
  loadProgress()
  refreshTimer = window.setInterval(loadProgress, REFRESH_INTERVAL_MS)
})

onUnmounted(() => {
  window.clearInterval(refreshTimer)
  activeRequest?.abort()
})
</script>

<template>
  <section class="land-appeal" aria-labelledby="land-appeal-heading">
    <div class="land-appeal__inner">
      <div class="land-appeal__content">
        <p class="land-appeal__badge">Temple land appeal</p>
        <h2 id="land-appeal-heading">{{ landAppeal.title }}</h2>
        <p class="land-appeal__text">{{ landAppeal.text }}</p>
        <p class="land-appeal__note">{{ landAppeal.note }}</p>
      </div>

      <div class="land-appeal__actions">
        <div class="land-appeal__progress">
          <template v-if="progress">
            <p class="land-appeal__progress-eyebrow">Help us reach</p>
            <strong class="land-appeal__progress-goal">
              {{ formatCurrency(progress.goal, progress.currency) }}
            </strong>
            <p class="land-appeal__progress-description">
              Together, we can secure a permanent home for our temple.
            </p>
            <p class="land-appeal__progress-raised">
              <strong>{{ formatCurrency(progress.raised, progress.currency) }}</strong>
              <span>raised so far</span>
            </p>
            <div
              class="land-appeal__progress-track"
              role="progressbar"
              aria-label="Land appeal fundraising progress"
              aria-valuemin="0"
              :aria-valuemax="progress.goal"
              :aria-valuenow="Math.min(progress.raised, progress.goal)"
              :aria-valuetext="`${formatCurrency(progress.raised, progress.currency)} raised of ${formatCurrency(progress.goal, progress.currency)}`"
            >
              <span
                class="land-appeal__progress-fill"
                :style="{ width: `${progressBarWidth}%` }"
              />
            </div>
            <div class="land-appeal__progress-labels">
              <strong>{{ progressPercentLabel }}% funded</strong>
              <span v-if="remainingAmount > 0">
                {{ formatCurrency(remainingAmount, progress.currency) }} still needed
              </span>
              <strong v-else>Goal reached!</strong>
            </div>
          </template>

          <template v-else>
            <p class="land-appeal__progress-eyebrow">Help us reach our</p>
            <strong class="land-appeal__progress-goal">{{ landAppeal.goal }}</strong>
            <p class="land-appeal__progress-description">
              Every contribution moves us closer to a permanent home.
            </p>
          </template>

          <a
            :href="landAppeal.url"
            target="_blank"
            rel="noopener noreferrer"
            class="land-appeal__button land-appeal__button--primary"
          >
            Support Our Temple
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.land-appeal {
  position: relative;
  overflow: hidden;
  border-top: 4px solid #d4a017;
  background:
    radial-gradient(circle at 90% 20%, rgba(212, 160, 23, 0.18), transparent 28%),
    linear-gradient(135deg, #4b121a, #721f29);
  color: #fff5db;
}

.land-appeal__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 440px);
  max-width: 1200px;
  align-items: center;
  gap: 2.5rem;
  margin: 0 auto;
  padding: 2.25rem 1.5rem;
}

.land-appeal__badge {
  display: inline-block;
  margin: 0 0 0.65rem;
  border-radius: 0.15rem;
  background: #d4a017;
  color: #35110e;
  padding: 0.35rem 0.7rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.land-appeal h2 {
  max-width: 720px;
  margin: 0 0 0.75rem;
  color: #fff;
  font-family: var(--serif);
  font-weight: 560;
  font-size: clamp(1.7rem, 7vw, 2.6rem);
  line-height: 1.12;
}

.land-appeal__text {
  max-width: 680px;
  margin: 0;
  color: #f8e9cf;
  line-height: 1.65;
}

.land-appeal__progress {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(255, 228, 161, 0.7);
  border-top: 5px solid #d4a017;
  border-radius: 1rem;
  background: #fffaf0;
  box-shadow: 0 12px 30px rgba(36, 5, 10, 0.2);
  color: #271b1d;
  padding: 1.35rem 1.5rem;
}

.land-appeal__progress-eyebrow {
  margin: 0 0 0.5rem;
  color: #8a2433;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.land-appeal__progress-goal {
  display: block;
  color: #4b121a;
  font-family: var(--serif);
  font-weight: 560;
  font-size: clamp(1.65rem, 7vw, 2.7rem);
  line-height: 1.05;
}

.land-appeal__progress-description {
  margin: 0.45rem 0 1.3rem;
  color: #3d3032;
  font-size: 1rem;
  line-height: 1.4;
}

.land-appeal__progress-raised {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  margin: 0 0 0.65rem;
  color: #69565a;
}

.land-appeal__progress-raised strong {
  color: #4b121a;
  font-size: 1.35rem;
}

.land-appeal__progress-track {
  height: 0.95rem;
  overflow: hidden;
  border-radius: 999px;
  background: #eadfe0;
  box-shadow: inset 0 1px 2px rgba(75, 18, 26, 0.12);
}

.land-appeal__progress-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #8a2433, #c33d4f 72%, #d4a017);
  transition: width 0.5s ease;
}

.land-appeal__progress-labels {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.7rem;
  color: #4b121a;
  font-size: 0.9rem;
}

.land-appeal__note {
  max-width: 680px;
  margin: 1.25rem 0 0;
  color: #ffe4a1;
  font-weight: 700;
  line-height: 1.5;
}

.land-appeal__actions {
  display: grid;
  width: 100%;
  justify-self: end;
  gap: 1rem;
}

.land-appeal__button {
  border: 1px solid #d4a017;
  border-radius: 0.2rem;
  padding: 0.8rem 1.25rem;
  font-weight: 800;
  text-align: center;
  text-decoration: none;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    transform 0.15s ease;
}

.land-appeal__progress .land-appeal__button {
  display: block;
  margin-top: 1.35rem;
  box-sizing: border-box;
  width: 100%;
}

.land-appeal__button:hover,
.land-appeal__button:focus-visible {
  transform: translateY(-2px);
}

.land-appeal__button--primary {
  background: #d4a017;
  color: #35110e;
}

.land-appeal__button--primary:hover,
.land-appeal__button--primary:focus-visible {
  background: #f3c64f;
}

.land-appeal__secondary-link {
  justify-self: center;
  color: #fff5db;
  font-size: 0.9rem;
  font-weight: 700;
  text-underline-offset: 4px;
}

.land-appeal__secondary-link:hover,
.land-appeal__secondary-link:focus-visible {
  color: #f3c64f;
}

@media (max-width: 760px) {
  .land-appeal__inner {
    grid-template-columns: 1fr;
    gap: 1.75rem;
    padding: 2.25rem 1rem;
  }

  .land-appeal__actions {
    width: 100%;
    min-width: 0;
  }

  .land-appeal__button {
    width: 100%;
    box-sizing: border-box;
  }

  .land-appeal__progress {
    padding: 1.15rem;
  }

  .land-appeal__progress-labels {
    font-size: 0.8rem;
  }
}
</style>
