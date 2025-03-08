<script setup>
import {ref} from "vue";
import router from "@/router/index.js";
import Headers from "@/components/Headers.vue";
import PopupRss from "@/components/PopupRss.vue";
import {Settings} from "@/settings.js";

const feeds = ref(localStorage.getItem('rssFeeds') ? JSON.parse(localStorage.getItem('rssFeeds')) : []);
const showPopup = ref(false);
const editFeedData = ref(null);
const settings = ref(new Settings());

const closePopup = () => {
  editFeedData.value = null;
  feeds.value = JSON.parse(localStorage.getItem('rssFeeds'));
  showPopup.value = false;
};
const deleteFeed = (index) => {
  feeds.value = feeds.value.filter((_feed, i) => i !== index);
  localStorage.setItem('rssFeeds', JSON.stringify(feeds.value));
};
const editFeed = (feed, index) => {
  editFeedData.value = {index, ...feed};
  showPopup.value = true;
};
</script>

<template>
  <main>
    <Headers @event-popup="showPopup = true;"/>

    <h1 class="text-2xl font-bold mt-6">Liste des flux RSS</h1>
    <div class="space-y-4 mt-4">
      <div class="space-y-4 mt-4">
        <div v-for="(feed,index) in feeds" class="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
          <div>
            <p class="font-semibold">{{ feed.name }}</p>
            <a :href="feed.url" target="_blank" class="text-blue-500 hover:underline">{{ feed.url }}</a>
          </div>
          <div class="flex gap-2">
            <button :class="[settings.hasFlux(feed) ? 'bg-red-400' : 'bg-cyan-400']" @click="settings[settings.hasFlux(feed) ? 'removeFlux': 'addFlux'](feed)" class="px-3 py-1 text-white rounded cursor-pointer">
              {{settings.hasFlux(feed) ? 'Ne plus suivre' : 'Suivre'}}
            </button>
            <button @click="router.push({name: 'rss-page', params: {rssId: index}})"
                    class="px-3 py-1 bg-cyan-400 text-white rounded cursor-pointer">Voir
            </button>
            <button @click="editFeed(feed, index)" class="px-3 py-1 bg-yellow-400 text-white rounded cursor-pointer">
              Edit
            </button>
            <button @click="deleteFeed(index)" class="px-3 py-1 bg-red-500 text-white rounded cursor-pointer">Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <PopupRss :show="showPopup" :close="closePopup" :feed="editFeedData"/>

  </main>
</template>
