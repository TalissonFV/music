<template>
  <div class="p-6 space-y-6 flex-1 overflow-y-auto select-none">
    <div>
      <h2 class="text-2xl font-bold text-white">Artists</h2>
      <p class="text-xs text-brand-subtext mt-1">{{ libraryStore.artists.length }} artists in your library</p>
    </div>

    <!-- Artists Grid -->
    <div v-if="libraryStore.artists.length === 0" class="py-20 text-center text-brand-subtext text-sm">
      No artists found. Scan a music folder to see artists here.
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      <div
        v-for="artist in libraryStore.artists"
        :key="artist.name"
        class="bg-brand-surface hover:bg-brand-card p-5 rounded-2xl border border-brand-border text-center group transition-all cursor-pointer"
      >
        <div class="w-24 h-24 rounded-full bg-brand-dark border border-brand-border mx-auto flex items-center justify-center mb-3 shadow">
          <UserIcon class="w-10 h-10 text-brand-subtext group-hover:text-brand-green transition-colors" />
        </div>

        <h3 class="font-bold text-sm text-white truncate group-hover:text-brand-green">{{ artist.name }}</h3>
        <p class="text-xs text-brand-subtext mt-1 font-mono">{{ artist.songCount }} songs</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { UserIcon } from 'lucide-vue-next';
import { useLibraryStore } from '../stores/libraryStore';

const libraryStore = useLibraryStore();
</script>
