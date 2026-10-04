<script setup>
import { temple } from '../data/temple'
import logo from '../assets/logo-wvmt.jpeg'
import SocialLinks from './SocialLinks.vue'
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__logo">
        <img :src="logo" :alt="temple.name" />
      </div>

      <div class="site-footer__col">
        <h3>{{ temple.name }}</h3>
        <p class="muted">{{ temple.locationNote }}</p>
        <p>{{ temple.address }}</p>
        <p><a :href="`tel:${temple.phone.replace(/\s/g, '')}`">{{ temple.phone }}</a></p>
        <p><a :href="`tel:${temple.mobile.replace(/\s/g, '')}`">{{ temple.mobile }}</a></p>
        <p><a :href="`mailto:${temple.email}`">{{ temple.email }}</a></p>
      </div>

      <div class="site-footer__col">
        <h3>Stay in Touch</h3>
        <SocialLinks class="social-links" />
      </div>

      <div class="site-footer__col">
        <h3>Temple Opening Time</h3>
        <p>{{ temple.hours.morning }}</p>
        <p>{{ temple.hours.evening }}</p>
        <p class="muted">{{ temple.hours.note }}</p>
      </div>

      <div class="site-footer__col">
        <h3>Online Bank Transfer</h3>
        <p>{{ temple.bank.accountName }}</p>
        <p>{{ temple.bank.bankName }}</p>
        <p>{{ temple.bank.accountNumber }}</p>
        <p>Sort code {{ temple.bank.sortCode }}</p>
      </div>
    </div>

    <div class="site-footer__bottom">
      <p>&copy; {{ new Date().getFullYear() }} {{ temple.name }}</p>
      <p>{{ temple.trustName }} is a registered charity, number {{ temple.charityNumber }}.</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--maroon-deep);
  color: #f3e7da;
  margin-top: 0;
}

.site-footer__inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 1.5rem;
  display: grid;
  gap: 1.75rem;
}

.site-footer__logo img {
  display: block;
  width: 92px;
  height: auto;
  border-radius: 50%;
}

.site-footer__col h3 {
  color: var(--gold-bright);
  font-family: var(--serif);
  font-size: 1.05rem;
  font-weight: 560;
  letter-spacing: 0;
  text-transform: none;
  margin: 0 0 0.7rem;
}

.site-footer__col p {
  margin: 0.28rem 0;
  font-size: 0.92rem;
  line-height: 1.5;
}

.site-footer__col a {
  color: inherit;
  text-decoration: none;
}

.site-footer__col a:hover {
  color: var(--gold-bright);
}

.muted {
  opacity: 0.75;
}

.social-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.55rem;
  font-size: 0.92rem;
}

.site-footer__bottom {
  border-top: 1px solid rgba(224, 194, 122, 0.22);
  text-align: left;
  padding: 1.1rem 1.25rem 5.5rem;
  font-size: 0.82rem;
  line-height: 1.5;
  opacity: 0.8;
}

.site-footer__bottom p {
  margin: 0.15rem 0;
}

@media (min-width: 800px) {
  .site-footer__inner {
    grid-template-columns: auto 1.3fr 0.8fr 1fr 1.1fr;
    align-items: start;
    gap: 1.75rem;
    padding: 3rem 1.5rem 2rem;
  }

  .site-footer__logo img {
    width: 120px;
  }

  .site-footer__bottom {
    text-align: center;
    padding-bottom: 1.25rem;
  }
}
</style>
