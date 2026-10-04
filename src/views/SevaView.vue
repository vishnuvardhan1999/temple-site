<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PageBanner from '../components/PageBanner.vue'
import { getSevaBySlug } from '../data/sevas'
import archanaImage from '../assets/carousel/1.jpg'
import poojaImage from '../assets/carousel/7.jpg'
import festivalImage from '../assets/carousel/4.jpg'
import offeringImage from '../assets/carousel/10.jpg'

const route = useRoute()
const seva = computed(() => getSevaBySlug(route.params.slug))

const bannerImage = computed(() => {
  const pictures = {
    archana: archanaImage,
    'regular-pooja-sevas': poojaImage,
    'religious-events': festivalImage,
    'hundi-donations': offeringImage,
  }
  return pictures[route.params.slug] || ''
})
</script>

<template>
  <div>
    <PageBanner :title="seva?.title || 'Pooja and Seva'" :image="bannerImage" />

    <section v-if="seva" class="content">
      <RouterLink :to="{ path: '/', hash: '#poojas-and-sevas' }" class="back-link">
        &lsaquo; Back to Poojas and Sevas
      </RouterLink>

      <article class="seva-card">
        <p class="summary">{{ seva.summary }}</p>

        <section v-for="section in seva.sections" :key="section.heading" class="seva-section">
          <h2>{{ section.heading }}</h2>
          <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
          <dl v-if="section.schedule" class="schedule-list">
            <div v-for="entry in section.schedule" :key="entry.label" class="schedule-list__item">
              <dt>{{ entry.label }}</dt>
              <dd>{{ entry.detail }}</dd>
            </div>
          </dl>
          <ul v-if="section.items" class="deity-list">
            <li v-for="item in section.items" :key="item">{{ item }}</li>
          </ul>
        </section>

        <aside class="tradition-note">
          Ritual details and availability may vary according to the deity, occasion and the temple’s
          established tradition. Please confirm arrangements with the temple team.
        </aside>

        <RouterLink :to="seva.cta.to" class="cta">{{ seva.cta.label }}</RouterLink>
      </article>
    </section>

    <section v-else class="content not-found">
      <h2>Seva not found</h2>
      <p>The requested pooja or seva page is not available.</p>
      <RouterLink to="/" class="cta">Return to the home page</RouterLink>
    </section>
  </div>
</template>

<style scoped>
.content {
  max-width: 880px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
}

.back-link {
  display: inline-block;
  margin-bottom: 1.25rem;
  color: #7a1512;
  font-weight: 600;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.seva-card {
  border: 1px solid #eadfd9;
  border-top: 4px solid #d4a017;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 12px 36px rgba(74, 28, 20, 0.09);
  padding: clamp(1.5rem, 4vw, 3rem);
}

.summary {
  margin: 0;
  color: #5b3329;
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.75;
}

.seva-section {
  margin-top: 2rem;
}

.seva-section h2 {
  margin: 0 0 0.75rem;
  color: #7a1512;
  font-size: 1.35rem;
}

.seva-section p {
  margin: 0 0 0.85rem;
  color: #3a2b26;
  line-height: 1.75;
}

.schedule-list {
  display: grid;
  gap: 0.75rem;
  margin: 1rem 0 0;
}

.schedule-list__item {
  display: grid;
  grid-template-columns: minmax(180px, 0.8fr) minmax(0, 1.2fr);
  gap: 1rem;
  border: 1px solid #eadfd9;
  border-radius: 8px;
  background: #fdf6ef;
  padding: 0.9rem 1rem;
}

.schedule-list dt {
  color: #7a1512;
  font-weight: 700;
}

.schedule-list dd {
  margin: 0;
  color: #3a2b26;
  font-weight: 600;
}

.deity-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem 1.5rem;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}

.deity-list li {
  position: relative;
  padding-left: 1.35rem;
  color: #3a2b26;
  line-height: 1.5;
}

.deity-list li::before {
  content: '';
  position: absolute;
  top: 0.45em;
  left: 0;
  width: 0.55rem;
  height: 0.55rem;
  border: 2px solid #d4a017;
  border-radius: 50%;
}

.tradition-note {
  margin: 2rem 0;
  border-left: 4px solid #d4a017;
  border-radius: 6px;
  background: #fff9e8;
  padding: 1rem 1.15rem;
  color: #5a4640;
  font-size: 0.9rem;
  line-height: 1.6;
}

.cta {
  display: inline-block;
  border-radius: 0.2rem;
  background: #b3211e;
  padding: 0.8rem 1.4rem;
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}

.cta:hover {
  background: #8f1a17;
}

.not-found {
  text-align: center;
}

.not-found p {
  margin-bottom: 1.5rem;
}

@media (max-width: 600px) {
  .content {
    padding: 2rem 1rem 3rem;
  }

  .deity-list {
    grid-template-columns: 1fr;
  }

  .schedule-list__item {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
}
</style>
