<template>
  <div class="p-6 space-y-6 flex-1 overflow-y-auto select-none">
    <!-- Header & Search Bar -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-white">All Songs</h2>
        <p class="text-xs text-brand-subtext mt-1">
          {{ libraryStore.filteredSongs.length }} songs available in local library
        </p>
      </div>

      <!-- Search Input -->
      <div class="relative w-72">
        <SearchIcon class="w-4 h-4 text-brand-subtext absolute left-3 top-3" />
        <input
          type="text"
          v-model="libraryStore.searchQuery"
          placeholder="Search by title, artist, or album..."
          class="w-full bg-brand-surface border border-brand-border rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-brand-subtext focus:outline-none focus:border-brand-green"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="libraryStore.filteredSongs.length === 0" class="py-20 text-center space-y-4">
      <div class="w-16 h-16 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center mx-auto text-brand-subtext">
        <MusicIcon class="w-8 h-8" />
      </div>
      <div class="space-y-1">
        <h3 class="font-bold text-white text-base">No audio files found</h3>
        <p class="text-xs text-brand-subtext max-w-sm mx-auto">
          Scan your local music folder or import playlists from Spotify / YouTube Music to start listening.
        </p>
      </div>
      <button
        @click="libraryStore.selectFolderAndScan()"
        class="bg-brand-green hover:bg-brand-green-hover text-black font-bold text-xs px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2"
      >
        <FolderPlusIcon class="w-4 h-4" />
        <span>Scan Music Folder</span>
      </button>
    </div>

    <!-- Songs Table List -->
    <div v-else class="space-y-1">
      <!-- Table Header -->
      <div class="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-brand-subtext uppercase tracking-wider border-b border-brand-border">
        <div class="col-span-1">#</div>
        <div class="col-span-5">Title</div>
        <div class="col-span-3">Artist</div>
        <div class="col-span-2">Album</div>
        <div class="col-span-1 text-right">Time</div>
      </div>

      <!-- Table Rows -->
      <div
        v-for="(song, index) in libraryStore.filteredSongs"
        :key="song.id"
        @click="playerStore.playSong(song, libraryStore.filteredSongs)"
        :class="['grid grid-cols-12 gap-4 px-4 py-3 rounded-xl items-center text-xs font-medium cursor-pointer group transition-colors',
          playerStore.currentSong?.id === song.id ? 'bg-brand-card text-brand-green' : 'hover:bg-brand-card/60 text-white']"
      >
        <!-- # / Play Icon -->
        <div class="col-span-1 text-brand-subtext flex items-center">
          <span v-if="playerStore.currentSong?.id === song.id && playerStore.isPlaying" class="text-brand-green animate-pulse">▶</span>
          <span v-else class="group-hover:hidden">{{ index + 1 }}</span>
          <PlayIcon class="w-3.5 h-3.5 hidden group-hover:block fill-current" />
        </div>

        <!-- Title & Cover Art -->
        <div class="col-span-5 flex items-center gap-3 truncate">
          <div class="w-9 h-9 rounded bg-brand-surface overflow-hidden shrink-0 flex items-center justify-center border border-brand-border">
            <img v-if="song.coverArt" :src="song.coverArt" class="w-full h-full object-cover" />
            <MusicIcon v-else class="w-4 h-4 text-brand-subtext" />
          </div>
          <span class="truncate font-semibold text-sm">{{ song.title }}</span>
        </div>

        <!-- Artist -->
        <div class="col-span-3 text-brand-subtext truncate">{{ song.artist }}</div>

        <!-- Album -->
        <div class="col-span-2 text-brand-subtext truncate">{{ song.album }}</div>

        <!-- Duration -->
        <div class="col-span-1 text-right font-mono text-brand-subtext">{{ formatDuration(song.duration) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { SearchIcon, MusicIcon, PlayIcon, FolderPlusIcon } from 'lucide-vue-next';
import { useLibraryStore } from '../stores/libraryStore';
import { usePlayerStore } from '../stores/playerStore';

const libraryStore = useLibraryStore();
const playerStore = usePlayerStore();

const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};
</script>
