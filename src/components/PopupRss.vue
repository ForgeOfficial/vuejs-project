<script setup>
import {ref, watch} from "vue";
const feeds = ref(localStorage.getItem('rssFeeds') ? JSON.parse(localStorage.getItem('rssFeeds')) : []);
const props = defineProps(['show', 'close', 'feed']);

const feedData = ref(props.feed ?? { name: "", url: "" });
watch(() => props.feed, (newFeed) => {
  feedData.value = newFeed ?? { name: "", url: "" };
}, { deep: true });

const close = () => {
  feedData.value = { name: "", url: "" };
  props.close();
}
const saveFeed = () => {
  if (feedData.value.name && feedData.value.url) {
    if (feedData.value.index !== undefined) {
      feeds.value[feedData.value.index] = feedData.value;
    }else
      feeds.value.push(feedData.value);
    localStorage.setItem('rssFeeds', JSON.stringify(feeds.value));
    close();
  }
};
</script>

<template>
  <main>
    <div v-if="props.show" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4">Ajouter un flux RSS</h2>
        <input v-model="feedData.name" type="text" placeholder="Nom du flux" class="w-full p-2 border rounded mb-2">
        <input v-model="feedData.url" type="url" placeholder="URL du flux" class="w-full p-2 border rounded mb-4">
        <div class="flex justify-end gap-2">
          <button @click="close" class="px-4 py-2 bg-gray-300 rounded">Annuler</button>
          <button @click="saveFeed" class="px-4 py-2 bg-blue-500 text-white rounded">Enregistrer</button>
        </div>
      </div>
    </div>
  </main>
</template>