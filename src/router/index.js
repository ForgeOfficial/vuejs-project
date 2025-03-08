import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RssPageView from "@/views/RssPageView.vue";
import NewsPageView from "@/views/NewsPageView.vue";
import SettingsPage from "@/views/SettingsPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/:rssId',
      name: 'rss-page',
      component: RssPageView
    },
    {
      path: '/:rssId/:newsUrl',
      name: 'news-page',
      component: NewsPageView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage
    }
  ],
})

export default router
