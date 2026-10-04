import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import CommitteeView from '../views/CommitteeView.vue'
import ContactView from '../views/ContactView.vue'
import DonateView from '../views/DonateView.vue'
import RegisterView from '../views/RegisterView.vue'
import ConsentView from '../views/ConsentView.vue'
import SevaView from '../views/SevaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/about-us', name: 'about', component: AboutView },
    { path: '/committee', name: 'committee', component: CommitteeView },
    { path: '/contact-us', name: 'contact', component: ContactView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/consent', name: 'consent', component: ConsentView },
    { path: '/donate', name: 'donate', component: DonateView },
    { path: '/sevas/:slug', name: 'seva', component: SevaView },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }

    return { top: 0 }
  },
})

export default router
