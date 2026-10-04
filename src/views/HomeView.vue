<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { temple, landAppeal } from '../data/temple'
import { sevas } from '../data/sevas'
import ImageCarousel from '../components/ImageCarousel.vue'
import LandAppeal from '../components/LandAppeal.vue'
import RegisterAppeal from '../components/RegisterAppeal.vue'
import SocialLinks from '../components/SocialLinks.vue'
import heroImage from '../assets/carousel/7.jpg'
import desktopHero from '../assets/home-banner.jpg'
import storyImage from '../assets/carousel/5.jpg'
import worshipImage from '../assets/carousel/2.jpg'

const openingCard = ref(null)
const visitCard = ref(null)
let cardObserver

onMounted(() => {
  const nodes = [openingCard.value, visitCard.value].filter(Boolean)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    nodes.forEach((node) => node.classList.add('is-in'))
    return
  }

  cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-in')
        cardObserver.unobserve(entry.target)
      })
    },
    { threshold: 0.18 },
  )
  nodes.forEach((node) => cardObserver.observe(node))
})

onUnmounted(() => {
  cardObserver?.disconnect()
})

// Every image in assets/carousel becomes a slide, ordered by filename number.
// These are web-sized copies made by `npm run images` from the originals in photos/carousel.
const images = import.meta.glob('../assets/carousel/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
})

const slides = Object.entries(images)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, src]) => ({ src, alt: 'Inside Watford Velmurugan Temple' }))

const poojaSeva = sevas.find((seva) => seva.slug === 'regular-pooja-sevas')
const dailyWorship = poojaSeva?.sections.find((section) =>
  section.heading.startsWith('Daily Pooja'),
)
const dailySchedule = dailyWorship?.schedule ?? []

const archana = sevas.find((seva) => seva.slug === 'archana')
const archanaVisit = archana?.sections
  .flatMap((section) => section.paragraphs ?? [])
  .find((paragraph) => paragraph.startsWith('Devotees can come directly'))

const mapQuery = encodeURIComponent(`${temple.name}, ${temple.address}`)
const mapEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&output=embed`
const mapLinkUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`
const tel = (value) => `tel:${value.replace(/\s/g, '')}`

const story = [
  'Watford Velmurugan Temple began with small weekly Friday services at a local community centre. As the congregation grew, the temple moved to premises leased from Watford Borough Council in central Watford.',
  'In March 2019, the temple relocated to its current site at The Owls Bowls Club. The lease with Watford Borough Council is imminently due to expire, and the trustees are actively searching for new premises to continue serving the community.',
  'Watford Velmurugan Temple was the first temple to be consecrated in Watford. It celebrates all Hindu festivals, holidays, and special occasions, following Saivite traditions of pujas, agamas and worship. Everyone is welcome.',
]

const faqs = [
  {
    q: 'When is the temple open?',
    a: `${temple.hours.morning}. ${temple.hours.evening}. ${temple.hours.note}`,
  },
  {
    q: dailyWorship?.heading ?? 'Daily worship',
    a: dailySchedule.map((entry) => `${entry.label}: ${entry.detail}`).join('. '),
  },
  {
    q: 'Where is the temple?',
    a: `${temple.locationNote}. ${temple.address}.`,
  },
  {
    q: 'How do I ask for an Archana?',
    a: archanaVisit ?? archana?.summary ?? '',
  },
  {
    q: 'How can I support the temple?',
    a: `${landAppeal.goal}. ${landAppeal.note}`,
  },
]
</script>

<template>
  <div class="home">
    <section class="hero">
      <picture>
        <source media="(min-width: 900px)" :srcset="desktopHero" />
        <img
          :src="heroImage"
          alt="Lord Murugan with Valli and Deivanai during worship at Watford Velmurugan Temple"
          class="hero__photo"
          width="1600"
          height="1000"
          fetchpriority="high"
          decoding="async"
        />
      </picture>
      <div class="hero__copy">
        <h1>{{ temple.name }}</h1>
        <p class="hero__line">
          Watford Velmurugan Temple was the first temple to be consecrated in Watford.
        </p>
      </div>
    </section>

    <LandAppeal />

    <section id="visit" class="block hours">
      <div class="block__inner hours__grid">
        <article ref="openingCard" class="info-card">
          <p class="kicker">Opening times</p>
          <h2>Open daily</h2>
          <p class="lede">{{ temple.hours.note }}</p>
          <ul class="hours__list">
            <li>{{ temple.hours.morning }}</li>
            <li>{{ temple.hours.evening }}</li>
          </ul>
          <h3 v-if="dailyWorship">{{ dailyWorship.heading }}</h3>
          <dl v-if="dailySchedule.length" class="schedule">
            <div v-for="entry in dailySchedule" :key="entry.label">
              <dt>{{ entry.label }}</dt>
              <dd>{{ entry.detail }}</dd>
            </div>
          </dl>
        </article>
        <article ref="visitCard" class="info-card hours__reach">
          <p class="kicker">Visit</p>
          <p class="hours__address">{{ temple.address }}</p>
          <p>
            <a :href="tel(temple.phone)">{{ temple.phone }}</a>
          </p>
          <p>
            <a :href="tel(temple.mobile)">{{ temple.mobile }}</a>
          </p>
          <p>
            <a :href="`mailto:${temple.email}`">{{ temple.email }}</a>
          </p>
          <a class="text-link" :href="mapLinkUrl" target="_blank" rel="noopener">
            View on Google Maps
          </a>
        </article>
      </div>
    </section>

    <section class="petition-link" aria-labelledby="petition-link-title">
      <div class="petition-link__card">
        <h2 id="petition-link-title">PETITION TO SECURE A PERMANENT HOME FOR THE WATFORD HINDU COMMUNITY</h2>
        <p>Sign to ask the Council to sell the property to the Temple Trust.</p>
        <RouterLink to="/consent" class="btn btn--gold">Sign the petition</RouterLink>
      </div>
    </section>

    <section class="block story">
      <div class="block__inner story__grid">
        <figure>
          <img
            :src="storyImage"
            alt="Lord Murugan holding the vel, with peacock feathers at the crown"
            width="900"
            height="1200"
            decoding="async"
          />
        </figure>
        <div>
          <p class="kicker">Our story</p>
          <h2>Our Story</h2>
          <p v-for="paragraph in story" :key="paragraph">{{ paragraph }}</p>
          <RouterLink class="text-link" to="/about-us">Our Story</RouterLink>
        </div>
      </div>
    </section>

    <section id="poojas-and-sevas" class="block worship">
      <div class="block__inner">
        <p class="kicker">Worship</p>
        <h2>Poojas and Sevas</h2>
        <p class="lede">Select a pooja or seva to learn more.</p>
        <div class="worship__grid">
          <figure>
            <img
              :src="worshipImage"
              alt="The Shiva shrine dressed with flowers, fruit and a lamp"
              width="900"
              height="1200"
              decoding="async"
            />
          </figure>
          <ul class="worship__list">
            <li v-for="seva in sevas" :key="seva.slug">
              <RouterLink :to="{ name: 'seva', params: { slug: seva.slug } }">
                <span>{{ seva.title }}</span>
                <span class="worship__go" aria-hidden="true">›</span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="block shrine" aria-label="Photographs of the shrine">
      <div class="block__inner shrine__heading">
        <p class="kicker">The shrine</p>
        <h2>{{ temple.shortName }}</h2>
      </div>
      <ImageCarousel :images="slides" class="shrine__carousel" />
    </section>

    <RegisterAppeal />


    <section class="block faq">
      <div class="block__inner faq__inner">
        <p class="kicker">Before you come</p>
        <h2>Common questions</h2>
        <div class="faq__list">
          <details v-for="item in faqs" :key="item.q">
            <summary>{{ item.q }}</summary>
            <p>{{ item.a }}</p>
          </details>
        </div>
      </div>
    </section>

    <section class="block find">
      <div class="block__inner find__grid">
        <div>
          <p class="kicker">Find us</p>
          <h2>{{ temple.locationNote }}</h2>
          <p>{{ temple.address }}</p>
          <p>
            <a :href="tel(temple.phone)">{{ temple.phone }}</a><br />
            <a :href="tel(temple.mobile)">{{ temple.mobile }}</a>
          </p>
          <a class="text-link" :href="mapLinkUrl" target="_blank" rel="noopener">
            View on Google Maps
          </a>
          <h3>Stay in Touch</h3>
          <SocialLinks class="home-social" />
        </div>
        <div>
          <iframe
            :src="mapEmbedUrl"
            class="find__map"
            title="Map showing the temple location"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>

    <section class="block bank">
      <div class="block__inner">
        <p class="kicker">Online Bank Transfer</p>
        <h2>Ways to Donate</h2>
        <dl class="bank__list">
          <div>
            <dt>Account Name</dt>
            <dd>{{ temple.bank.accountName }}</dd>
          </div>
          <div>
            <dt>Bank</dt>
            <dd>{{ temple.bank.bankName }}</dd>
          </div>
          <div>
            <dt>Account Number</dt>
            <dd>{{ temple.bank.accountNumber }}</dd>
          </div>
          <div>
            <dt>Sort Code</dt>
            <dd>{{ temple.bank.sortCode }}</dd>
          </div>
        </dl>
        <p class="bank__charity">
          {{ temple.trustName }} is a registered charity, number {{ temple.charityNumber }}.
        </p>
        <RouterLink class="text-link" to="/donate">Ways to Donate</RouterLink>
      </div>
    </section>

    <section class="closing">
      <div class="block__inner">
        <p class="kicker kicker--light">Temple land appeal</p>
        <h2>{{ landAppeal.title }}</h2>
        <p>{{ landAppeal.note }}</p>
        <a
          class="btn btn--gold"
          :href="landAppeal.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          Support Our Temple
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  background: var(--cream);
}

.kicker {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin: 0 0 0.55rem;
  color: var(--gold);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.kicker::after {
  content: "";
  width: 2rem;
  height: 1px;
  background: currentColor;
}

.kicker--light {
  color: var(--gold-bright);
}

h2 {
  margin: 0 0 0.75rem;
  color: var(--maroon-deep);
  font-size: clamp(1.85rem, 7vw, 3rem);
  line-height: 1.08;
}

h3 {
  margin: 1.5rem 0 0.7rem;
  color: var(--maroon);
  font-size: 1.25rem;
}

.lede,
.story p,
.find p,
.hours__reach p,
.bank__charity,
.closing p,
.faq p {
  margin: 0 0 0.85rem;
  color: var(--ink-soft);
  font-size: 1.02rem;
  line-height: 1.65;
}

.block {
  padding: 2.35rem 1.25rem;
}

.block__inner {
  max-width: 1080px;
  margin: 0 auto;
}

.hero {
  background: var(--cream);
  color: var(--ink);
}

.hero picture {
  display: block;
}

.hero__photo {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 10;
  max-height: 250px;
  object-fit: cover;
  object-position: center 42%;
}

.hero__copy {
  max-width: 1080px;
  margin: 0 auto;
  padding: 1.15rem 1.25rem 0.35rem;
}

.hero h1 {
  margin: 0;
  max-width: 16ch;
  color: var(--maroon-deep);
  font-size: clamp(1.85rem, 8vw, 3.4rem);
  font-weight: 560;
  line-height: 1.05;
}

.hero__line {
  max-width: 34rem;
  margin: 0.55rem 0 0;
  color: var(--ink-soft);
  font-size: 1.02rem;
  line-height: 1.45;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0.75rem 1.25rem;
  border-radius: 0.2rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
}

.btn--gold {
  background: var(--gold-bright);
  color: var(--maroon-deep);
}

.hours {
  scroll-margin-top: 7.5rem;
}

.hours__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  align-items: stretch;
}

.info-card {
  border: 1px solid var(--line);
  border-radius: 1.15rem;
  background: var(--paper);
  padding: 1.35rem 1.2rem 1.15rem;
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.info-card.is-in {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .info-card {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

.hours__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.hours__list li {
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--line);
  color: var(--maroon-deep);
  font-family: var(--serif);
  font-size: 1.25rem;
}

.schedule {
  margin: 0;
}

.schedule div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--line);
}

.schedule dt {
  color: var(--ink-soft);
}

.schedule dd {
  margin: 0;
  color: var(--maroon-deep);
  font-weight: 600;
  text-align: right;
}

.hours__reach {
  margin-top: 0;
}

.hours__address {
  color: var(--maroon-deep);
  font-family: var(--serif);
  font-size: 1.45rem;
  line-height: 1.25;
}

.hours__reach a,
.find a {
  color: var(--maroon);
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.hours__reach .text-link,
.find .text-link,
.story .text-link,
.bank .text-link,
.text-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: var(--maroon);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid var(--gold);
}

.petition-link {
  padding: 0 1.25rem 2.75rem;
}

.petition-link__card {
  max-width: 1080px;
  margin: 0 auto;
  border: 1px solid rgba(224, 194, 122, 0.55);
  border-top: 4px solid var(--gold-bright);
  border-radius: 1.15rem;
  background: var(--maroon-deep);
  padding: 1.35rem 1.15rem 1.25rem;
}

.petition-link h2 {
  margin: 0 0 0.65rem;
  color: #fffaf3;
  font-size: clamp(1.25rem, 4.6vw, 1.7rem);
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.petition-link p {
  margin: 0 0 1rem;
  color: #f6ead8;
  line-height: 1.5;
}

.petition-link .btn {
  width: 100%;
}

.story__grid figure,
.worship__grid figure {
  margin: 0 0 1.35rem;
}

.story__grid img,
.worship__grid img {
  display: block;
  width: 100%;
  height: 240px;
  object-fit: cover;
  object-position: center 28%;
  border-radius: 1.25rem;
}

.story p:last-of-type {
  margin-bottom: 1rem;
}

.worship {
  scroll-margin-top: 7.5rem;
  background: var(--paper);
}

.worship__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.worship__list a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 56px;
  border-bottom: 1px solid var(--line);
  color: var(--maroon-deep);
  font-family: var(--serif);
  font-size: 1.2rem;
  text-decoration: none;
}

.worship__go {
  color: var(--gold);
  font-family: var(--sans);
  font-size: 1.5rem;
  line-height: 1;
}

.shrine {
  padding-top: 0;
  padding-left: 0;
  padding-right: 0;
  background: var(--paper);
}

.shrine__heading {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

.shrine__carousel {
  width: 100%;
  max-width: none;
  margin-top: 0.85rem;
}


.faq__inner {
  max-width: 760px;
}

.faq__list details {
  border-bottom: 1px solid var(--line);
}

.faq__list summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 56px;
  color: var(--maroon-deep);
  font-weight: 600;
  cursor: pointer;
  list-style: none;
}

.faq__list summary::-webkit-details-marker {
  display: none;
}

.faq__list summary::after {
  content: '+';
  color: var(--gold);
  font-family: var(--serif);
  font-size: 1.4rem;
  font-weight: 500;
}

.faq__list details[open] summary::after {
  content: '–';
}

.faq__list p {
  margin-top: 0;
  padding-bottom: 1rem;
}

.find__map {
  display: block;
  width: 100%;
  height: 260px;
  margin-top: 1.25rem;
  border: 0;
  border-radius: 1.1rem;
}

.home-social {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem 1.25rem;
}

.bank {
  background: var(--paper);
}

.bank__list {
  display: grid;
  gap: 0.9rem;
  margin: 0 0 1.25rem;
}

.bank__list div {
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--line);
}

.bank__list dt {
  color: var(--gold);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.bank__list dd {
  margin: 0.2rem 0 0;
  color: var(--maroon-deep);
  font-family: var(--serif);
  font-size: 1.2rem;
}

.closing {
  background: var(--maroon-deep);
  color: #f6efe4;
  padding: 2.75rem 1.25rem 3.25rem;
}

.closing h2 {
  color: #fffaf3;
}

.closing p {
  max-width: 36rem;
  color: #f0e2cc;
}

.closing .btn {
  margin-top: 0.4rem;
}

@media (min-width: 900px) {
  .hero {
    position: relative;
    display: grid;
    height: clamp(580px, 48vw, 680px);
    overflow: hidden;
    background: #2a1214;
  }

  .hero picture {
    position: absolute;
    inset: 0;
  }

  .hero__photo {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    max-height: none;
    aspect-ratio: auto;
    object-fit: cover;
    object-position: center 32%;
  }

  .hero::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(
      to top,
      rgba(28, 8, 12, 0.8) 0%,
      rgba(28, 8, 12, 0.42) 28%,
      rgba(28, 8, 12, 0) 58%
    );
  }

  .hero__copy {
    position: relative;
    z-index: 2;
    align-self: end;
    width: min(1080px, 100%);
    padding: 0 1.5rem 2.1rem;
  }

  .hero h1 {
    color: #fffaf3;
  }

  .hero__line {
    color: #f6ead8;
  }
}

@media (min-width: 720px) {
  .btn {
    min-width: 11rem;
  }

  .story__grid img,
  .worship__grid img {
    height: 320px;
  }

  .block {
    padding: 3.6rem 1.5rem;
  }

  .petition-link {
    padding: 0 1.5rem 4.5rem;
  }

  .petition-link__card {
    padding: 1.75rem 1.75rem 1.6rem;
  }

  .petition-link .btn {
    width: auto;
    min-width: 11rem;
  }

  .block.shrine {
    padding-left: 0;
    padding-right: 0;
  }

  .shrine__heading {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .hours__grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

  .story__grid,
  .worship__grid,
  .find__grid {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 3rem;
    align-items: center;
  }

  .story__grid figure,
  .worship__grid figure {
    margin-top: 0;
  }

  .story__grid {
    grid-template-columns: 0.82fr 1.18fr;
  }

  .find__map {
    height: 380px;
    margin-top: 0;
  }

  .bank__list {
    grid-template-columns: 1fr 1fr;
    gap: 0 2rem;
  }

}
</style>
