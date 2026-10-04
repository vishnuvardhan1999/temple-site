<script setup>
import PageBanner from '../components/PageBanner.vue'
import { landAppealUrl, temple } from '../data/temple'
import offering from '../assets/carousel/10.jpg'
</script>

<template>
  <div>
    <PageBanner title="Ways to Donate" :image="offering" />

    <section class="content">
      <p class="intro">
        Your generosity helps us maintain a place of worship, support elderly
        care, and build a cultural legacy for our youth &mdash; preserving
        community, service and shared values for generations to come.
      </p>

      <section class="land-appeal" aria-labelledby="land-appeal-heading">
        <div>
          <p class="land-appeal__eyebrow">Help secure our future</p>
          <h2 id="land-appeal-heading">Donate to Our Land Purchase</h2>
          <p>
            Support Watford Velmurugan Hindu Temple in purchasing a permanent home for worship,
            culture and community.
          </p>
        </div>
        <a
          :href="landAppealUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="land-appeal__button"
        >
          Donate securely with Zeffy
        </a>
      </section>

      <div class="grid">
        <div class="card">
          <h3>Online Bank Transfer</h3>
          <dl>
            <dt>Account Name</dt>
            <dd>{{ temple.bank.accountName }}</dd>
            <dt>Bank</dt>
            <dd>{{ temple.bank.bankName }}</dd>
            <dt>Account Number</dt>
            <dd>{{ temple.bank.accountNumber }}</dd>
            <dt>Sort Code</dt>
            <dd>{{ temple.bank.sortCode }}</dd>
          </dl>
        </div>

        <div class="card">
          <h3>In Person</h3>
          <p>Visit us during temple opening hours to donate in person.</p>
        </div>

        <div class="card">
          <h3>By Post</h3>
          <p>Cheques can be mailed to:</p>
          <p>
            {{ temple.name }}<br />
            {{ temple.address }}
          </p>
        </div>
      </div>

      <p class="charity-note">
        {{ temple.trustName }} is a registered charity, number
        {{ temple.charityNumber }}.
      </p>

      <p class="signoff">With thanks for your generosity,<br />Temple Board of Trustees</p>
    </section>
  </div>
</template>

<style scoped>
.content {
  max-width: 950px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.intro {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
  color: #3a2b26;
}

.land-appeal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2.5rem;
  border: 1px solid #ead5a2;
  border-left: 5px solid #d4a017;
  border-radius: 10px;
  background: #fff9e8;
  padding: 1.5rem;
}

.land-appeal h2 {
  margin: 0 0 0.5rem;
  color: #7a1512;
}

.land-appeal p {
  margin: 0;
  color: #3a2b26;
  line-height: 1.6;
}

.land-appeal__eyebrow {
  margin-bottom: 0.25rem !important;
  color: #9a6810 !important;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.land-appeal__button {
  flex-shrink: 0;
  border-radius: 0.2rem;
  background: #b3211e;
  padding: 0.8rem 1.35rem;
  color: #fff;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.land-appeal__button:hover {
  background: #8f1a17;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.card {
  background: #fdf6ef;
  border-top: 3px solid #d4a017;
  border-radius: 6px;
  padding: 1.5rem;
}

.card h3 {
  margin-top: 0;
  color: #7a1512;
}

dl {
  margin: 0;
}

dt {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.65;
  margin-top: 0.75rem;
}

dt:first-child {
  margin-top: 0;
}

dd {
  margin: 0.15rem 0 0;
  font-weight: 600;
  color: #3a2b26;
}

.charity-note {
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.75;
}

.signoff {
  text-align: center;
  margin-top: 2rem;
  font-style: italic;
  color: #3a2b26;
}

@media (max-width: 700px) {
  .land-appeal {
    align-items: stretch;
    flex-direction: column;
    gap: 1.25rem;
  }

  .land-appeal__button {
    text-align: center;
  }
}
</style>
