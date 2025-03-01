<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import Headers from "@/components/Headers.vue";
import PopupRss from "@/components/PopupRss.vue";

const route = useRoute();
const feeds = ref(localStorage.getItem('rssFeeds') ? JSON.parse(localStorage.getItem('rssFeeds')) : []);
const rssFeed = feeds.value[route.params.rssId];
const news = ref([]);
const loaded = ref(false);
const limit = ref('10');
const showPopup = ref(false);
const editFeedData = ref(null);
const errorMessage = ref(null);

const closePopup = () => {
  editFeedData.value = null;
  showPopup.value = false;
};

const parseRssFeed = async () => {
  try {
    const res = await fetch(rssFeed.url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const xml = await res.text();
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    loaded.value = true;
    return Array.from(doc.querySelectorAll("item")).map(item => {
      let desc = item.querySelector("description")?.textContent || '';
      let imgUrl = null;

      const title = item.querySelector("title")?.textContent || '';
      const link = item.querySelector("link")?.textContent || '';

      if (desc) {
        const descDoc = new DOMParser().parseFromString(desc, "text/html");
        const img = descDoc.querySelector('img');
        if (img) {
          imgUrl = img.getAttribute('src');
          img.remove();
          desc = descDoc.body.innerHTML;
        }
      }

      if (!imgUrl) {
        const enc = item.querySelector("enclosure");
        if (enc) imgUrl = enc.getAttribute('url');
      }

      return { title, link, desc, imgUrl };
    });
  } catch (err) {
    console.error("Error:", err);
    errorMessage.value = `${err.message} (maybe cors issue)`;
    throw err;
  }
}

const fetchNews = async () => {
  news.value = (await parseRssFeed()).slice(0, limit.value === 'all' ? news.value.length : parseInt(limit.value, 10));
}

onMounted(() => {
  fetchNews()
});
</script>

<template>
<main>
  <Headers @event-popup="showPopup = true;"/>
  <h1 class="text-2xl font-bold mt-6">Liste des news du Flux</h1>
  <select v-model="limit" @change="fetchNews">
    <option value="10">10</option>
    <option value="50">50</option>
    <option value="100">100</option>
    <option value="all">All</option>
  </select>
  <div v-if="!loaded">Loading</div>
  <div class="space-y-4 mt-4" v-if="loaded && !errorMessage">
    <div class="space-y-4 mt-4">
      <div v-for="newsElement in news" class="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
        <div>
          <p class="font-semibold">{{ newsElement.title }}</p>
          <a :href="newsElement.link" target="_blank" class="text-blue-500 hover:underline">{{ newsElement.link }}</a>
          <p v-html="newsElement.desc"></p>
          <img v-if="newsElement.imgUrl" :src="newsElement.imgUrl" alt="News Image" class="news-image">
        </div>
      </div>
    </div>
  </div>
  <div v-if="errorMessage" class="text-red-500">{{errorMessage}}</div>
  <PopupRss :show="showPopup" :close="closePopup" />
</main>
</template>