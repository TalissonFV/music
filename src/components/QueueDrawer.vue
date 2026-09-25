<template>
  <aside
    v-if="playerStore.showQueue"
    class="w-80 bg-brand-surface border-l border-brand-border flex flex-col h-full z-20 select-none animate-in slide-in-from-right duration-200"
  >
    <!-- Header -->
    <div class="p-4 border-b border-brand-border flex items-center justify-between">
      <h3 class="font-bold text-base text-white">Play Queue</h3>
      <button @click="playerStore.toggleQueueDrawer()" class="text-brand-subtext hover:text-white">
        <XIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- Currently Playing -->
    <div v-if="playerStore.currentSong" class="p-4 border-b border-brand-border space-y-2">
      <span class="text-xs font-bold text-brand-subtext uppercase tracking-wider">Now Playing</span>
      <div class="flex items-center gap-3 p-2 bg-brand-card/60 rounded-xl border border-brand-border">
        <div class="w-10 h-10 rounded bg-brand-dark overflow-hidden shrink-0 flex items-center justify-center">
          <img v-if="playerStore.currentSong.coverArt" :src="playerStore.currentSong.coverArt" class="w-full h-full object-cover" />
          <MusicIcon v-else class="w-5 h-5 text-brand-subtext" />
        </div>
        <div class="truncate">
          <h4 class="font-bold text-sm text-brand-green truncate">{{ playerStore.currentSong.title }}</h4>
          <p class="text-xs text-brand-subtext truncate">{{ playerStore.currentSong.artist }}</p>
        </div>
      </div>
    </div>

    <!-- Up Next Queue List -->
    <div class="flex-1 overflow-y-auto p-4 space-y-2">
      <span class="text-xs font-bold text-brand-subtext uppercase tracking-wider">Next In Queue</span>
      <div v-if="upNextSongs.length === 0" class="text-sm text-brand-subtext py-4 text-center">
        No songs queued next
      </div>
      <div
        v-for="(song, idx) in upNextSongs"
        :key="song.id + '_' + idx"
        @click="playerStore.playSong(song, playerStore.queue)"
        class="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-card cursor-pointer group transition-colors"
      >
        <div class="w-9 h-9 rounded bg-brand-dark overflow-hidden shrink-0 flex items-center justify-center">
          <img v-if="song.coverArt" :src="song.coverArt" class="w-full h-full object-cover" />
          <MusicIcon v-else class="w-4 h-4 text-brand-subtext" />
        </div>
        <div class="truncate flex-1">
          <h5 class="font-semibold text-xs text-white truncate group-hover:text-brand-green">{{ song.title }}</h5>
          <p class="text-[11px] text-brand-subtext truncate">{{ song.artist }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { XIcon, MusicIcon } from 'lucide-vue-next';
import { usePlayerStore } from '../stores/playerStore';

const playerStore = usePlayerStore();

const upNextSongs = computed(() => {
  if (playerStore.queueIndex < 0 || playerStore.queueIndex >= playerStore.queue.length - 1) {
    return [];
  }
  return playerStore.queue.slice(playerStore.queueIndex + 1);
});
</script>
