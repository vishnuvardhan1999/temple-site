<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { nav, landAppealUrl, temple } from "../data/temple";
import logo from "../assets/logo-wvmt.jpeg";

const menuOpen = ref(false);
const callOpen = ref(false);
const callMenu = ref(null);
const phoneNumbers = [
  { label: "Temple", value: temple.phone },
  { label: "Mobile", value: temple.mobile },
].filter((number) => number.value);

const telLink = (value) => `tel:${value.replace(/\s/g, "")}`;

function toggleNavigation() {
  callOpen.value = false;
  menuOpen.value = !menuOpen.value;
}

function onDocumentClick(event) {
  if (!callMenu.value?.contains(event.target)) callOpen.value = false;
}

function onKeydown(event) {
  if (event.key === "Escape") {
    callOpen.value = false;
    menuOpen.value = false;
  }
}

watch(menuOpen, (open) => {
  document.body.classList.toggle("nav-lock", open);
});

onMounted(() => {
  document.addEventListener("click", onDocumentClick);
  document.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  document.removeEventListener("click", onDocumentClick);
  document.removeEventListener("keydown", onKeydown);
  document.body.classList.remove("nav-lock");
});
</script>

<template>
  <header class="site-header">
    <div class="site-header__bar">
      <RouterLink
        to="/"
        class="brand"
        aria-label="Watford Velmurugan Hindu Temple home"
        @click="menuOpen = false"
      >
        <img :src="logo" alt="" class="brand__logo" />
        <span class="brand__name">
          <span class="brand__line">Watford Velmurugan</span>
          <span class="brand__line brand__line--sub">Hindu Temple</span>
        </span>
      </RouterLink>

      <nav class="nav" :class="{ 'nav--open': menuOpen }">
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="nav__link"
          @click="
            menuOpen = false;
            callOpen = false;
          "
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="header-actions">
        <a
          :href="landAppealUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="nav__donate nav__donate--land"
          @click="
            menuOpen = false;
            callOpen = false;
          "
        >
          Help buy the land
        </a>

        <button
          class="menu-toggle"
          type="button"
          :aria-expanded="menuOpen"
          aria-label="Toggle navigation"
          @click="toggleNavigation"
        >
          <span class="menu-toggle__icon" aria-hidden="true">
            <template v-if="!menuOpen">
              <span></span> <span></span> <span></span>
            </template>
            <template v-else>
              <span class="menu-toggle__close"></span>
              <span class="menu-toggle__close"></span>
            </template>
          </span>
        </button>

        <div ref="callMenu" class="mobile-call">
          <button
            type="button"
            class="mobile-call__trigger"
            aria-label="Choose a number to call"
            aria-controls="mobile-call-numbers"
            :aria-expanded="callOpen"
            @click="
              menuOpen = false;
              callOpen = !callOpen;
            "
          >
            <span class="mobile-call__icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path
                  d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"
                />
              </svg>
            </span>
          </button>

          <ul
            v-show="callOpen"
            id="mobile-call-numbers"
            class="mobile-call__numbers"
          >
            <li v-for="number in phoneNumbers" :key="number.value">
              <a
                :href="telLink(number.value)"
                :aria-label="`Call ${number.label} ${number.value}`"
                @click="callOpen = false"
              >
                <span>{{ number.label }}</span>
                <strong>{{ number.value }}</strong>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: relative;
  background: var(--paper);
  border-bottom: 1px solid var(--line);
}

.site-header__bar {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.65rem 1.25rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
  text-decoration: none;
  color: var(--maroon-deep);
}

.brand__logo {
  display: block;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 0 1px var(--line);
}

.brand__name {
  display: flex;
  flex-direction: column;
  font-family: var(--serif);
  font-weight: 600;
  font-size: 1.02rem;
  letter-spacing: -0.02em;
  line-height: 1.05;
}

.brand__line--sub {
  font-size: 0.78em;
  font-weight: 500;
}

.menu-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  color: var(--maroon);
}

.menu-toggle__icon {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 18px;
  height: 18px;
}

.menu-toggle__icon span {
  display: block;
  width: 18px;
  height: 1.5px;
  background: currentColor;
}

.menu-toggle__close {
  position: absolute;
  left: 0;
  top: 50%;
}

.menu-toggle__close:first-child {
  transform: translateY(-50%) rotate(45deg);
}

.menu-toggle__close:last-child {
  transform: translateY(-50%) rotate(-45deg);
}

.mobile-call {
  display: none;
}

.mobile-call__trigger {
  border: 0;
  background: none;
  padding: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-shrink: 0;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.35rem;
}

.nav__link {
  color: var(--ink);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  white-space: nowrap;
}

.nav__link:hover,
.nav__link.router-link-exact-active {
  color: var(--maroon);
}

.nav__donate {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  background: var(--maroon);
  color: #fffaf3;
  padding: 0.45rem 1rem;
  border-radius: 0.2rem;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.84rem;
  white-space: nowrap;
}

.nav__donate:hover {
  background: var(--maroon-deep);
}

.nav__donate--land {
  background: var(--gold);
  color: #2a160c;
}

.nav__donate--land:hover {
  background: #8d6824;
  color: #fffaf3;
}

@media (max-width: 1050px) {
  .menu-toggle {
    display: flex;
  }

  .mobile-call {
    display: block;
  }

  .mobile-call {
    position: relative;
  }

  .mobile-call__trigger {
    display: flex;
    cursor: pointer;
  }

  .mobile-call__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: 1px solid var(--line);
    border-radius: 50%;
    background: transparent;
    color: var(--maroon);
  }

  .nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 30;
    background: var(--paper);
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    max-height: 0;
    overflow: hidden;
    border-bottom: 1px solid var(--line);
  }

  .nav--open {
    max-height: calc(100dvh - 6.5rem);
    overflow: auto;
    box-shadow: 0 18px 30px rgba(42, 16, 16, 0.12);
  }

  .nav__link {
    display: flex;
    align-items: center;
    min-height: 52px;
    padding: 0.35rem 1.25rem;
    border-top: 1px solid var(--line);
    font-family: var(--serif);
    font-size: 1.2rem;
    box-sizing: border-box;
  }

  .mobile-call__numbers {
    position: absolute;
    top: calc(100% + 0.55rem);
    right: 0;
    z-index: 40;
    min-width: 220px;
    margin: 0;
    border: 1px solid var(--line);
    border-radius: 0.9rem;
    background: #fffdf9;
    box-shadow: 0 12px 28px rgba(42, 16, 16, 0.16);
    padding: 0.3rem;
    list-style: none;
  }

  .mobile-call__numbers a {
    display: grid;
    gap: 0.1rem;
    min-height: 48px;
    border-radius: 0.6rem;
    color: var(--ink);
    padding: 0.55rem 0.75rem;
    text-decoration: none;
  }

  .mobile-call__numbers a span {
    color: var(--gold);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .mobile-call__numbers li + li {
    border-top: 1px solid var(--line);
  }
}

@media (max-width: 720px) {
  .site-header__bar {
    gap: 0.4rem;
    padding: 0.5rem 0.75rem;
  }

  .brand__logo {
    width: 42px;
    height: 42px;
  }

  .brand__name {
    font-size: 0.78rem;
  }

  .nav__donate {
    min-height: 40px;
    padding: 0 0.7rem;
    font-size: 0.72rem;
  }
}
</style>
