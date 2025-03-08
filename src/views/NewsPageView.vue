<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {parseRssFeed} from "@/rssFetch.js";
import Headers from "@/components/Headers.vue";
import PopupRss from "@/components/PopupRss.vue";
import {Settings} from "@/settings.js";

const route = useRoute();
const settings = ref(new Settings());
const feeds = ref(localStorage.getItem('rssFeeds') ? JSON.parse(localStorage.getItem('rssFeeds')) : []);
const rssFeed = feeds.value[route.params.rssId];

const loaded = ref(false);
const showPopup = ref(false);
const news = ref(null);
const editFeedData = ref(null);
const errorMessage = ref(null);

const closePopup = () => {
  editFeedData.value = null;
  showPopup.value = false;
};

const fetchNews = async () => {
  news.value = (await parseRssFeed(rssFeed.url, loaded, errorMessage)).find((feed) => feed.link === route.params.newsUrl);
}

onMounted(() => {
  fetchNews()
});
</script>

<template>
  <main>
    <Headers @event-popup="showPopup = true;"/>
    <h1 class="text-2xl font-bold mt-6">Flux rss: {{rssFeed?.name ?? 'Loading'}}</h1>
    <div v-if="!loaded">Loading</div>
    <div class="space-y-4 mt-4" v-if="loaded && !errorMessage && news">
      <div class="space-y-4 mt-4">
        <div class="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
          <div>
            <p class="font-semibold">{{ news.title }}</p>
            <a :href="news.link" target="_blank" class="text-blue-500 hover:underline">{{ news.link }}</a>
            <p v-html="news.desc"></p>
            <img v-if="news.imgUrl" :src="news.imgUrl" alt="News Image" class="news-image">
          </div>
          <div class="flex gap-2">
            <button :class="[settings.hasNews(news.link) ? 'bg-red-400' : 'bg-cyan-400']" @click="settings[settings.hasNews(news.link) ? 'removeNews': 'addNews'](news, rssFeed)" class="px-3 py-1 text-white rounded cursor-pointer">
              {{settings.hasNews(news.link) ? 'Ne plus suivre' : 'Suivre'}}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="errorMessage" class="text-red-500">{{errorMessage}}</div>
    <PopupRss :show="showPopup" :close="closePopup" />
  </main>
</template>