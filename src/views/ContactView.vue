<script setup>
import { ref } from 'vue'
import PageBanner from '../components/PageBanner.vue'
import SocialLinks from '../components/SocialLinks.vue'
import { temple } from '../data/temple'

// Web3Forms emails each submission to the address the access key was created with.
// Set VITE_WEB3FORMS_KEY in .env (get a free key at https://web3forms.com using the temple email).
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY

const emptyForm = () => ({ firstName: '', lastName: '', email: '', subject: '', message: '', botcheck: false })

const form = ref(emptyForm())
const submitted = ref(false)
const sending = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''

  if (!WEB3FORMS_KEY) {
    error.value = `The contact form is not set up yet. Please email us at ${temple.email}.`
    return
  }

  const { firstName, lastName, email, subject, message, botcheck } = form.value

  // Honeypot ticked means a bot filled the form: pretend it worked but send nothing
  if (botcheck) {
    submitted.value = true
    return
  }

  sending.value = true
  const name = `${firstName} ${lastName}`.trim()

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `Website enquiry: ${subject || 'No subject'}`,
        from_name: 'Temple Website',
        replyto: email,
        Name: name,
        Email: email,
        Subject: subject || '-',
        Message: message,
      }),
    })
    const data = await res.json()

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Submission failed')
    }

    submitted.value = true
    form.value = emptyForm()
  } catch (err) {
    console.error('Contact form submission failed:', err)
    error.value = `Sorry, your message could not be sent. Please try again or email us at ${temple.email}.`
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div>
    <PageBanner title="Contact Us" />

    <section class="content">
      <div class="grid">
        <div class="form-col">
          <h2>Leave us a message and we will get back to you.</h2>

          <p v-if="submitted" class="success">Thanks for submitting!</p>

          <form v-else class="contact-form" @submit.prevent="handleSubmit">
            <!-- Honeypot: hidden from people, bots that fill it are rejected by Web3Forms -->
            <input
              v-model="form.botcheck"
              type="checkbox"
              class="botcheck"
              tabindex="-1"
              autocomplete="off"
              aria-hidden="true"
            />
            <div class="row">
              <label>
                First Name
                <input v-model="form.firstName" type="text" required />
              </label>
              <label>
                Last Name
                <input v-model="form.lastName" type="text" required />
              </label>
            </div>
            <label>
              Email
              <input v-model="form.email" type="email" required />
            </label>
            <label>
              Subject
              <input v-model="form.subject" type="text" />
            </label>
            <label>
              Message
              <textarea
                v-model="form.message"
                rows="5"
                placeholder="Type your message here..."
                required
              />
            </label>
            <p v-if="error" class="error" role="alert">{{ error }}</p>
            <button type="submit" :disabled="sending">
              {{ sending ? 'Sending...' : 'Submit' }}
            </button>
          </form>
        </div>

        <div class="info-col">
          <h2>{{ temple.name }}</h2>
          <p class="muted">{{ temple.locationNote }}</p>
          <p>{{ temple.address }}</p>
          <p><a :href="`tel:${temple.phone.replace(/\s/g, '')}`">{{ temple.phone }}</a></p>
          <p><a :href="`tel:${temple.mobile.replace(/\s/g, '')}`">{{ temple.mobile }}</a></p>
          <p><a :href="`mailto:${temple.email}`">{{ temple.email }}</a></p>

          <h3>Stay in Touch</h3>
          <SocialLinks class="social-links" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 3rem;
}

h2 {
  color: #7a1512;
  margin-top: 0;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: #3a2b26;
  font-weight: 600;
}

input,
textarea {
  font: inherit;
  font-size: 16px;
  min-height: 48px;
  padding: 0.7rem 0.8rem;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fffdf9;
  font-weight: normal;
}

button {
  align-self: stretch;
  background: var(--maroon);
  color: #fffaf3;
  border: none;
  min-height: 48px;
  padding: 0.75rem 2rem;
  border-radius: 0.2rem;
  font-weight: 600;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: var(--maroon-deep);
}

button:disabled {
  opacity: 0.7;
  cursor: wait;
}

.success {
  color: #2e7d32;
  font-weight: 600;
}

.error {
  color: #b3211e;
  font-weight: 600;
  margin: 0;
}

.botcheck {
  display: none;
}

.info-col p {
  line-height: 1.6;
  color: #3a2b26;
}

.info-col a {
  color: #3a2b26;
  text-decoration: none;
}

.muted {
  opacity: 0.7;
}

.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  color: #b3211e;
  font-weight: 600;
}

@media (max-width: 700px) {
  .grid,
  .row {
    grid-template-columns: 1fr;
  }
}
</style>
