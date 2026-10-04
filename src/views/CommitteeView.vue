<script setup>
import PageBanner from '../components/PageBanner.vue'
import { boardOfTrustees, committeeMembers, executiveCommittee } from '../data/temple'
</script>

<template>
  <div>
    <PageBanner title="Temple Committee" />

    <section class="content">
      <p class="intro">
        Our committee and trustees work together to manage the temple and serve our community on
        behalf of its beneficiaries.
      </p>

      <section class="committee-section" aria-labelledby="executive-committee-heading">
        <h2 id="executive-committee-heading">Executive Committee</h2>
        <div class="grid">
          <article v-for="member in executiveCommittee" :key="member.name" class="card">
            <h3>{{ member.name }}</h3>
            <p class="role">{{ member.role }}</p>
          </article>
        </div>
      </section>

      <section class="committee-section" aria-labelledby="committee-members-heading">
        <h2 id="committee-members-heading">Committee Members</h2>
        <div class="grid grid--names">
          <article v-for="member in committeeMembers" :key="member" class="card card--name">
            <h3>{{ member }}</h3>
          </article>
        </div>
      </section>

      <section class="committee-section" aria-labelledby="trustees-heading">
        <h2 id="trustees-heading">Board of Trustees</h2>
        <div class="grid grid--names">
          <article v-for="trustee in boardOfTrustees" :key="trustee" class="card card--name">
            <h3>{{ trustee }}</h3>
          </article>
        </div>
      </section>
    </section>
  </div>
</template>

<style scoped>
.content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.intro {
  text-align: center;
  max-width: 650px;
  margin: 0 auto 3rem;
  line-height: 1.7;
  color: #3a2b26;
}

.committee-section + .committee-section {
  margin-top: 3rem;
}

.committee-section h2 {
  margin: 0 0 1.5rem;
  color: #7a1512;
  text-align: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.grid--names {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.card {
  background: #fdf6ef;
  border-top: 3px solid #d4a017;
  border-radius: 6px;
  padding: 1.5rem;
  text-align: center;
}

.card h3 {
  margin: 0 0 0.4rem;
  color: #7a1512;
  font-size: 1.05rem;
}

.role {
  margin: 0;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.78rem;
  letter-spacing: 0.05em;
  color: #3a2b26;
}

.card--name {
  display: grid;
  min-height: 86px;
  place-items: center;
}

.card--name h3 {
  margin: 0;
}
</style>
