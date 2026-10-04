<script setup>
import { ref } from 'vue'
import PageBanner from '../components/PageBanner.vue'

const title = 'PETITION TO SECURE A PERMANENT HOME FOR THE WATFORD HINDU COMMUNITY'

const paragraphs = [
  'As the only Hindu temple in Watford, the Watford Velmurugan Hindu Temple is more than a place of worship. It is a vital community space, particularly for senior citizens and families who rely on it for emotional support, cultural connection and social interaction.',
  'If the temple were to close, it would have a significant impact on the wellbeing of our community.',
  'We believe the temple can contribute even more through an asset-based community approach by providing space for community activities, supporting food distribution, running cultural and educational programmes, and hosting health awareness initiatives, including diabetes and mental health support.',
  'The temple is also keen to support unpaid carers by connecting them with local services and providing a place where they feel recognised, supported and connected to the wider community.',
  'As the Council has now put the property up for open bidding, we respectfully request that the Council consider selling the property to the Temple Trust. This would enable us to establish a permanent home for the Hindu community while continuing and expanding the social, cultural, educational and community support work we provide in Watford.',
  'We are not just asking for support — we believe we are part of the solution to Watford’s community challenges.',
]

const emptyForm = () => ({
  name: '',
  phone: '',
  email: '',
  agreed: false,
  website: '',
})

const form = ref(emptyForm())
const submitted = ref(false)
const sending = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''

  if (!form.value.agreed) {
    error.value = 'Please tick I agree.'
    return
  }

  if (form.value.website) {
    submitted.value = true
    form.value = emptyForm()
    return
  }

  sending.value = true

  try {
    const response = await fetch('/api/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.value.name,
        phone: form.value.phone,
        email: form.value.email,
        agreed: form.value.agreed,
        website: form.value.website,
      }),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Submission failed')
    }

    submitted.value = true
    form.value = emptyForm()
  } catch (err) {
    console.error('Consent submission failed:', err)
    error.value =
      err instanceof Error && err.message !== 'Submission failed'
        ? err.message
        : 'Sorry, your consent could not be sent. Please try again.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div>
    <PageBanner class="consent-banner" :title="title" />

    <section class="content">
      <div class="petition">
        <p v-for="paragraph in paragraphs" :key="paragraph">{{ paragraph }}</p>
      </div>

      <div class="form-card">
        <div v-if="submitted" class="success" role="status">
          <h2>Thank you.</h2>
          <p>Your consent has been submitted.</p>
        </div>

        <form v-else class="consent-form" @submit.prevent="handleSubmit">
          <label class="botcheck" aria-hidden="true">
            Website
            <input v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
          </label>

          <label>
            <span>Name <span class="required" aria-hidden="true">*</span></span>
            <input v-model.trim="form.name" type="text" autocomplete="name" required />
          </label>

          <label>
            <span>Phone number <span class="required" aria-hidden="true">*</span></span>
            <input v-model.trim="form.phone" type="tel" autocomplete="tel" inputmode="tel" required />
          </label>

          <label>
            <span>Email <span class="required" aria-hidden="true">*</span></span>
            <input v-model.trim="form.email" type="email" autocomplete="email" required />
          </label>

          <label class="agree">
            <input v-model="form.agreed" type="checkbox" required />
            <span>I agree and support this petition.</span>
          </label>

          <p v-if="error" class="error" role="alert">{{ error }}</p>

          <button type="submit" :disabled="sending">
            {{ sending ? 'Submitting...' : 'Submit consent' }}
          </button>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped>
.consent-banner.consent-banner {
  min-height: 11.5rem;
  padding: 2.85rem 1.35rem 2.35rem;
}

.consent-banner.consent-banner :deep(h1) {
  max-width: 16em;
  margin: 0;
  padding-bottom: 0.95rem;
  border-bottom: 1px solid rgba(224, 194, 122, 0.9);
  letter-spacing: -0.045em;
  line-height: 1.12;
}

.content {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.35rem 1rem 3rem;
}

.petition p {
  margin: 0 0 0.95rem;
  color: var(--ink);
  font-size: 1.02rem;
  line-height: 1.65;
}

.form-card {
  margin-top: 0.4rem;
  border: 1px solid var(--line);
  border-top: 4px solid var(--gold);
  border-radius: 1.15rem;
  background: var(--paper);
  padding: 1.25rem 1rem 1.35rem;
}

.consent-form {
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: var(--ink);
  font-size: 0.92rem;
  font-weight: 600;
}

.required {
  color: var(--maroon);
}

input:not([type='checkbox']) {
  width: 100%;
  min-height: 48px;
  border: 1px solid var(--line);
  border-radius: 0.7rem;
  padding: 0.7rem 0.85rem;
  background: #fffdf9;
  color: var(--ink);
  font: inherit;
  font-size: 16px;
  font-weight: 400;
}

input:not([type='checkbox']):focus {
  border-color: var(--maroon);
  outline: none;
  box-shadow: 0 0 0 3px rgba(110, 28, 36, 0.12);
}

.agree {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.7rem;
  min-height: 48px;
  font-weight: 600;
}

.agree input {
  width: 1.15rem;
  height: 1.15rem;
  margin: 0;
  accent-color: var(--maroon);
}

button {
  min-height: 48px;
  border: 0;
  border-radius: 0.2rem;
  background: var(--maroon);
  color: #fffaf3;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.success {
  border-left: 4px solid #2e7d32;
  border-radius: 0.5rem;
  background: #f1f8f2;
  padding: 1rem 1.05rem;
}

.success h2 {
  margin: 0 0 0.35rem;
  color: #2e7d32;
  font-size: 1.45rem;
}

.success p,
.error {
  margin: 0;
}

.error {
  color: var(--maroon);
  font-weight: 600;
}

.botcheck {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (min-width: 720px) {
  .consent-banner.consent-banner {
    min-height: 13.5rem;
    padding: 3.6rem 2rem 2.85rem;
  }

  .content {
    padding: 2.25rem 1.5rem 4rem;
  }

  .form-card {
    padding: 1.6rem 1.5rem 1.5rem;
  }

  button {
    align-self: flex-start;
    padding: 0 1.75rem;
  }
}
</style>
