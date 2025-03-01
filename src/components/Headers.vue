<script setup>
import {CogIcon, ListBulletIcon, PlusIcon} from "@heroicons/vue/24/solid/index.js";
import {useRoute} from "vue-router";
import router from "@/router/index.js";
const route = useRoute();
</script>

<template>
  <nav class="bg-white p-4 rounded-xl shadow-md flex justify-between">
    <button @click="$emit('eventPopup')" class="flex items-center gap-2 text-gray-700 hover:text-black cursor-pointer">
      <PlusIcon class="w-5 h-5" /> Enregistrer un flux
    </button>
    <button @click="router.push({name: 'home'})" :class="{'border-b': route.name === 'home'}" class="flex items-center gap-2 text-gray-700 hover:text-black cursor-pointer">
      <ListBulletIcon class="w-5 h-5" /> Liste des flux
    </button>
    <button :class="{'border-b': route.name === 'settings'}" class="flex items-center gap-2 text-gray-700 hover:text-black cursor-pointer">
      <CogIcon class="w-5 h-5" /> Préférences
    </button>
  </nav>
</template>