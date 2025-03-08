<script setup>
import {useRoute} from "vue-router";
import {ref} from "vue";
import Headers from "@/components/Headers.vue";
import {Settings} from "@/settings.js";
import router from "@/router/index.js";
import PopupRss from "@/components/PopupRss.vue";

const feeds = ref(localStorage.getItem('rssFeeds') ? JSON.parse(localStorage.getItem('rssFeeds')) : []);
const settings = ref(new Settings());
const showPopup = ref(false);
const editFeedData = ref(null);
const searchNews = ref("");
const closePopup = () => {
  editFeedData.value = null;
  showPopup.value = false;
};

</script>

<template>
<main>
  <Headers @event-popup="showPopup = true;"/>
  <h1 class="text-2xl font-bold mt-6">Liste des flux save</h1>
  <div class="space-y-4 mt-4">
    <div class="space-y-4 mt-4">
      <div v-for="flux in settings.fluxSaved" class="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
        <div>
          <p class="font-semibold">{{ flux.name }}</p>
          <a :href="flux.url" target="_blank" class="text-blue-500 hover:underline">{{ flux.url }}</a>
        </div>
        <div class="flex gap-2">
          <button :class="[settings.hasFlux(flux) ? 'bg-red-400' : 'bg-cyan-400']" @click="settings[settings.hasFlux(flux) ? 'removeFlux': 'addFlux'](flux)" class="px-3 py-1 text-white rounded cursor-pointer">
            {{settings.hasFlux(flux) ? 'Ne plus suivre' : 'Suivre'}}
          </button>
          <button @click="router.push({name: 'rss-page', params: {rssId: feeds.findIndex(feed => feed.url === flux.url && feed.name === flux.name)}})"
                  class="px-3 py-1 bg-cyan-400 text-white rounded cursor-pointer">Voir
          </button>
        </div>
      </div>
    </div>
  </div>
  <h1 class="text-2xl font-bold mt-6">Liste des news save</h1>
  <input v-model="searchNews" placeholder="search news" class="bg-pink-300">
  <div class="space-y-4 mt-4">
    <div class="space-y-4 mt-4">
      <div v-for="news in settings.newsSaved.filter(n => (searchNews.length > 0) ? n.title.toLowerCase().split(' ').some(word => word.startsWith(searchNews.toLowerCase())) : true)" class="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
        <div>
          <p class="font-semibold">{{ news.title }}</p>
          <a :href="news.link" target="_blank" class="text-blue-500 hover:underline">{{ news.link }}</a>
        </div>
        <div class="flex gap-2">
          <button :class="[settings.hasNews(news.link) ? 'bg-red-400' : 'bg-cyan-400']" @click="settings[settings.hasNews(news.link) ? 'removeNews': 'addNews'](news, rssFeed)" class="px-3 py-1 text-white rounded cursor-pointer">
            {{settings.hasNews(news.link) ? 'Ne plus suivre' : 'Suivre'}}
          </button>
          <button @click="router.push({name: 'news-page', params: {rssId: feeds.findIndex(feed => feed.url === news.rssUrl), newsUrl: news.link}})"
                  class="px-3 py-1 bg-cyan-400 text-white rounded cursor-pointer">Voir
          </button>
        </div>
      </div>
    </div>
  </div>
  <PopupRss :show="showPopup" :close="closePopup" />
</main>
</template>