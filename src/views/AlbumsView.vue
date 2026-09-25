<template>
  <div class="p-6 space-y-6 flex-1 overflow-y-auto select-none">
    <div>
      <h2 class="text-2xl font-bold text-white">Albums</h2>
      <p class="text-xs text-brand-subtext mt-1">{{ libraryStore.albums.length }} albums in your library</p>
    </div>

    <!-- Albums Grid -->
    <div v-if="libraryStore.albums.length === 0" class="py-20 text-center text-brand-subtext text-sm">
      No albums found. Scan a music folder to see albums here.
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      <div
        v-for="album in libraryStore.albums"
        :key="album.name"
        class="bg-brand-surface hover:bg-brand-card p-4 rounded-xl border border-brand-border group transition-all cursor-pointer flex flex-col justify-between"
      >
        <div class="aspect-square w-full rounded-lg bg-brand-dark overflow-hidden relative shadow border border-brand-border flex items-center justify-center mb-3">
          <img v-if="album.coverArt" :src="album.coverArt" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <DiscIcon v-else class="w-12 h-12 text-brand-subtext" />
        </div>

        <div>
          <h3 class="font-bold text-sm text-white truncate group-hover:text-brand-green">{{ album.name }}</h3>
          <p class="text-xs text-brand-subtext truncate mt-0.5">{{ album.artist }}</p>
          <span class="text-[11px] text-brand-subtext block mt-2 font-mono">{{ album.songCount }} tracks</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DiscIcon } from 'lucide-vue-next';
import { useLibraryStore } from '../stores/libraryStore';

const libraryStore = useLibraryStore();
</script>
