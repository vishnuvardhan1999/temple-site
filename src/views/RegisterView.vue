<script setup>
import { ref } from 'vue'
import PageBanner from '../components/PageBanner.vue'

const gdprConsentText =
  'Yes, I explicitly consent to the Watford Vel Murugan Trust storing and processing my personal details to manage my connection with the temple in accordance with the privacy statement above.'

const yesUpdatesPreference = 'Yes, I would like to receive updates.'
const noUpdatesPreference =
  'No, I only wish to register my data and do not want updates.'
const communicationChannels = ['Email', 'WhatsApp / Text Message']

const emptyForm = () => ({
  fullName: '',
  email: '',
  postcode: '',
  phone: '',
  address: '',
  comments: '',
  gdprConsent: false,
  updatesPreference: '',
  communicationPreferences: [],
  website: '',
})

const form = ref(emptyForm())
const submitted = ref(false)
const sending = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''

  if (
    form.value.updatesPreference === yesUpdatesPreference &&
    form.value.communicationPreferences.length === 0
  ) {
    error.value = 'Please select at least one way to receive temple updates.'
    return
  }

  // Honeypot: bots commonly fill this hidden field.
  if (form.value.website) {
    submitted.value = true
    form.value = emptyForm()
    return
  }

  sending.value = true

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: form.value.fullName,
        email: form.value.email,
        postcode: form.value.postcode,
        phone: form.value.phone,
        address: form.value.address,
        comments: form.value.comments,
        gdprConsent: form.value.gdprConsent,
        updatesPreference: form.value.updatesPreference,
        communicationPreferences: form.value.communicationPreferences,
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
    console.error('Registration submission failed:', err)
    error.value =
      err instanceof Error && err.message !== 'Submission failed'
        ? err.message
        : 'Sorry, your registration could not be sent. Please try again.'
  } finally {
    sending.value = false
  }
}

function registerAnother() {
  submitted.value = false
  error.value = ''
}

function selectUpdatesPreference(preference) {
  form.value.updatesPreference = preference
  if (preference === noUpdatesPreference) {
    form.value.communicationPreferences = []
  }
}
</script>

<template>
  <div>
    <PageBanner title="Register" />

    <section class="content">
      <div class="form-card">
        <div class="intro">
          <p class="eyebrow">Devotee registration</p>
          <h2>Register for Watford Vel Murugan Hindu Temple</h2>
          <p>
            Your registration helps demonstrate the strength of our temple community. Fields marked
            with <span aria-hidden="true">*</span><span class="sr-only">an asterisk</span> are required.
          </p>
        </div>

        <aside class="privacy-notice" aria-labelledby="privacy-heading">
          <h3 id="privacy-heading">Data Protection &amp; Privacy Notice (UK GDPR)</h3>
          <p>
            The Watford Vel Murugan Trust is committed to protecting the privacy of our congregation.
            By completing this form, you acknowledge and agree that we may process your personal data
            (and any sensitive religious data provided) in accordance with the UK Data Protection Act
            2018.
          </p>
          <p>
            <strong>Who We Are:</strong> We are the Watford Velmurugan Hindu Temple, located at 453 St
            Albans Road, Watford, WD24 7RZ.
          </p>
          <p>
            <strong>Purpose of Collection:</strong> This information is strictly collected to maintain
            our devotee database, process donations/gift aid, coordinate temple volunteering, and share
            important temple updates (such as our ongoing building fundraisers).
          </p>
          <p>
            <strong>Data Security:</strong> Your data is kept secure digitally, is only accessible by
            authorized temple management, and will never be shared with or sold to outside
            organisations.
          </p>
          <p>
            <strong>Your Rights:</strong> You have the right to view, amend, or request the immediate
            deletion of your details at any time by emailing us at
            <a href="mailto:temple@watfordvelmurugan.org">temple@watfordvelmurugan.org</a>.
          </p>
        </aside>

        <div v-if="submitted" class="success" role="status">
          <h2>Thanks for submitting your contact info!</h2>
          <p>Your details have been securely added to our devotee register.</p>
          <button type="button" class="secondary-button" @click="registerAnother">
            Register another person
          </button>
        </div>

        <form v-else class="register-form" @submit.prevent="handleSubmit">
          <label class="botcheck" aria-hidden="true">
            Website
            <input v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
          </label>

          <label>
            <span class="label-text">Full Name <span class="required" aria-hidden="true">*</span></span>
            <input v-model.trim="form.fullName" type="text" autocomplete="name" required />
          </label>

          <div class="row">
            <label>
              <span class="label-text">Email <span class="required" aria-hidden="true">*</span></span>
              <input v-model.trim="form.email" type="email" autocomplete="email" required />
            </label>

            <label>
              <span class="label-text">Phone Number <span class="required" aria-hidden="true">*</span></span>
              <input
                v-model.trim="form.phone"
                type="tel"
                autocomplete="tel"
                inputmode="tel"
                required
              />
            </label>
          </div>

          <label>
            <span class="label-text">Postcode <span class="required" aria-hidden="true">*</span></span>
            <input
              v-model.trim="form.postcode"
              type="text"
              autocomplete="postal-code"
              autocapitalize="characters"
              required
            />
          </label>

          <label>
            <span class="label-text">Address <span class="optional">Optional</span></span>
            <textarea
              v-model.trim="form.address"
              rows="3"
              autocomplete="street-address"
              placeholder="Your address"
            />
          </label>

          <label>
            <span class="label-text">Comments <span class="optional">Optional</span></span>
            <textarea
              v-model.trim="form.comments"
              rows="5"
              placeholder="Anything else you would like us to know..."
            />
          </label>

          <fieldset>
            <legend>
              UK GDPR Consent <span class="required" aria-hidden="true">*</span>
            </legend>
            <label class="checkbox-option">
              <input v-model="form.gdprConsent" type="checkbox" required />
              <span>{{ gdprConsentText }}</span>
            </label>
          </fieldset>

          <fieldset>
            <legend>
              Would you like to receive news, festival updates, or event details from the temple?
              <span class="optional">Optional</span>
            </legend>
            <label class="checkbox-option">
              <input
                :checked="form.updatesPreference === yesUpdatesPreference"
                type="radio"
                name="updates-preference"
                @change="selectUpdatesPreference(yesUpdatesPreference)"
              />
              <span>{{ yesUpdatesPreference }}</span>
            </label>
            <label class="checkbox-option">
              <input
                :checked="form.updatesPreference === noUpdatesPreference"
                type="radio"
                name="updates-preference"
                @change="selectUpdatesPreference(noUpdatesPreference)"
              />
              <span>{{ noUpdatesPreference }}</span>
            </label>
          </fieldset>

          <fieldset v-if="form.updatesPreference === yesUpdatesPreference">
            <legend>
              How would you prefer to receive these updates? (Select all that apply)
              <span class="required" aria-hidden="true">*</span>
            </legend>
            <label v-for="option in communicationChannels" :key="option" class="checkbox-option">
              <input v-model="form.communicationPreferences" type="checkbox" :value="option" />
              <span>{{ option }}</span>
            </label>
          </fieldset>

          <p v-if="error" class="error" role="alert">{{ error }}</p>

          <button type="submit" :disabled="sending">
            {{ sending ? 'Submitting...' : 'Submit Registration' }}
          </button>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped>
.content {
  max-width: 820px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

.form-card {
  background: #fff;
  border: 1px solid #eadfd9;
  border-radius: 16px;
  box-shadow: 0 12px 36px rgba(74, 28, 20, 0.1);
  padding: clamp(1.5rem, 4vw, 3rem);
}

.intro {
  margin-bottom: 1.5rem;
}

.eyebrow {
  margin: 0 0 0.35rem;
  color: #b3211e;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h2 {
  margin: 0 0 0.75rem;
  color: #7a1512;
}

.intro p:last-child,
.success p {
  margin-bottom: 0;
  color: #5a4640;
  line-height: 1.7;
}

.privacy-notice {
  margin-bottom: 2rem;
  border-left: 4px solid #d4a017;
  border-radius: 6px;
  background: #fff9e8;
  padding: 1.25rem 1.35rem;
}

.privacy-notice h3 {
  margin: 0 0 0.75rem;
  color: #6d321f;
  font-size: 1.05rem;
}

.privacy-notice p {
  margin: 0 0 0.65rem;
  color: #4d3b35;
  font-size: 0.88rem;
  line-height: 1.6;
}

.privacy-notice p:last-child {
  margin-bottom: 0;
}

.privacy-notice a {
  color: #7a1512;
  font-weight: 600;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  color: #3a2b26;
  font-size: 0.88rem;
  font-weight: 600;
}

fieldset {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
  border: 1px solid #d8cbc5;
  border-radius: 8px;
  padding: 1rem;
}

legend {
  max-width: 100%;
  padding: 0 0.35rem;
  color: #3a2b26;
  font-size: 0.88rem;
  font-weight: 600;
}

.field-help {
  margin: -0.1rem 0 0.15rem;
  color: #6c5a54;
  font-size: 0.82rem;
  line-height: 1.5;
}

.checkbox-option {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: 0.65rem;
  font-weight: 400;
  line-height: 1.5;
}

.checkbox-option input {
  width: 1.05rem;
  height: 1.05rem;
  margin: 0.2rem 0 0;
  accent-color: #b3211e;
}

.required {
  color: #b3211e;
}

.optional {
  margin-left: 0.35rem;
  color: #76645e;
  font-size: 0.75rem;
  font-weight: 500;
}

input:not([type='checkbox']):not([type='radio']),
textarea {
  width: 100%;
  border: 1px solid #d8cbc5;
  border-radius: 7px;
  padding: 0.75rem 0.85rem;
  background: #fff;
  color: #2a1a17;
  font: inherit;
  font-size: 16px;
  font-weight: 400;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

input:not([type='checkbox']):not([type='radio']):focus,
textarea:focus {
  border-color: #b3211e;
  box-shadow: 0 0 0 3px rgba(179, 33, 30, 0.12);
  outline: none;
}

textarea {
  resize: vertical;
}

button {
  align-self: flex-start;
  border: 0;
  border-radius: 0.2rem;
  padding: 0.8rem 2rem;
  background: var(--maroon);
  color: #fffaf3;
  min-height: 48px;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  transition: background 0.15s ease;
}

button:hover:not(:disabled) {
  background: #8f1a17;
}

button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.success {
  border-left: 4px solid #2e7d32;
  border-radius: 6px;
  background: #f1f8f2;
  padding: 1.5rem;
}

.success h2 {
  color: #2e7d32;
}

.secondary-button {
  margin-top: 1.25rem;
  border: 2px solid #7a1512;
  background: transparent;
  color: #7a1512;
}

.secondary-button:hover:not(:disabled) {
  background: #7a1512;
  color: #fff;
}

.error {
  margin: 0;
  color: #b3211e;
  font-weight: 600;
}

.botcheck,
.sr-only {
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

@media (max-width: 700px) {
  .content {
    padding: 2rem 1rem 3rem;
  }

  .row {
    grid-template-columns: 1fr;
  }

  button {
    align-self: stretch;
    width: 100%;
  }
}
</style>
