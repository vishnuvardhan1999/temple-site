<script setup>
import { devoteeRegistration as reg } from '../data/temple'
</script>

<template>
  <section v-if="reg.url" id="register" class="register">
    <div class="register__inner">
      <div class="register__text">
        <h2>{{ reg.title }}</h2>
        <p>{{ reg.text }}</p>
        <p class="register__note">{{ reg.note }}</p>
      </div>
      <div class="register__actions">
        <RouterLink :to="reg.url" class="register__button">Register Now</RouterLink>
        <RouterLink to="/donate" class="register__button register__button--quiet">Donate</RouterLink>
        <RouterLink to="/contact-us" class="register__button register__button--quiet">Contact Us</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.register {
  background: transparent;
  padding: 0 1.25rem 2.75rem;
  scroll-margin-top: 7rem;
}

.register__inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 1.35rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.15rem;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 1.25rem;
}

.register h2 {
  margin: 0 0 0.55rem;
  color: var(--maroon-deep);
  font-size: clamp(1.7rem, 6vw, 2.4rem);
}

.register p {
  margin: 0 0 0.45rem;
  line-height: 1.6;
  max-width: 62ch;
  color: var(--ink-soft);
}

.register__note {
  font-size: 0.95rem;
}

.register__actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.6rem;
  width: 100%;
}

.register__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0.75rem 1.25rem;
  border-radius: 0.2rem;
  font: inherit;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  background: var(--maroon);
  color: #fffaf3;
  border: 1px solid var(--maroon);
}

.register__button--quiet {
  background: transparent;
  color: var(--maroon-deep);
  border-color: var(--line);
}

@media (min-width: 800px) {
  .register {
    padding: 0 1.5rem 4.5rem;
  }

  .register__inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding: 2rem 2rem;
  }

  .register__actions {
    width: auto;
    flex-shrink: 0;
    min-width: 200px;
  }
}
</style>
