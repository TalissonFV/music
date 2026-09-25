<template>
  <div class="p-6 space-y-6 flex-1 overflow-y-auto select-none">
    <!-- Header -->
    <div v-if="currentPlaylist" class="flex items-center justify-between border-b border-brand-border pb-6">
      <div class="flex items-center gap-5">
        <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-green/30 to-brand-surface border border-brand-border flex items-center justify-center text-brand-green shadow-xl">
          <ListMusicIcon class="w-10 h-10" />
        </div>
        <div>
          <span class="text-xs font-bold text-brand-subtext uppercase tracking-wider">Playlist</span>
          <h2 class="text-3xl font-extrabold text-white mt-1">{{ currentPlaylist.name }}</h2>
          <p class="text-xs text-brand-subtext mt-1.5 font-mono">{{ playlistSongs.length }} tracks</p>
        </div>
      </div>

      <button
        v-if="currentPlaylist.id !== 'favorites'"
        @click="libraryStore.deletePlaylist(currentPlaylist.id)"
        class="text-xs text-red-400 hover:text-red-300 font-semibold px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition-all"
      >
        Delete Playlist
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="playlistSongs.length === 0" class="py-20 text-center text-brand-subtext text-sm space-y-2">
      <p>This playlist has no songs yet.</p>
      <p class="text-xs">Import a playlist from Spotify / YouTube Music or scan local files.</p>
    </div>

    <!-- Playlist Songs List -->
    <div v-else class="space-y-1">
      <div
        v-for="(song, index) in playlistSongs"
        :key="song.id"
        @click="playerStore.playSong(song, playlistSongs)"
        :class="['grid grid-cols-12 gap-4 px-4 py-3 rounded-xl items-center text-xs font-medium cursor-pointer group transition-colors',
          playerStore.currentSong?.id === song.id ? 'bg-brand-card text-brand-green' : 'hover:bg-brand-card/60 text-white']"
      >
        <div class="col-span-1 text-brand-subtext flex items-center">
          <span v-if="playerStore.currentSong?.id === song.id && playerStore.isPlaying" class="text-brand-green animate-pulse">▶</span>
          <span v-else class="group-hover:hidden">{{ index + 1 }}</span>
          <PlayIcon class="w-3.5 h-3.5 hidden group-hover:block fill-current" />
        </div>

        <div class="col-span-5 flex items-center gap-3 truncate">
          <div class="w-9 h-9 rounded bg-brand-surface overflow-hidden shrink-0 flex items-center justify-center border border-brand-border">
            <img v-if="song.coverArt" :src="song.coverArt" class="w-full h-full object-cover" />
            <MusicIcon v-else class="w-4 h-4 text-brand-subtext" />
          </div>
          <span class="truncate font-semibold text-sm">{{ song.title }}</span>
        </div>

        <div class="col-span-3 text-brand-subtext truncate">{{ song.artist }}</div>
        <div class="col-span-2 text-brand-subtext truncate">{{ song.album }}</div>
        <div class="col-span-1 text-right font-mono text-brand-subtext">{{ formatDuration(song.duration) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { ListMusicIcon, PlayIcon, MusicIcon } from 'lucide-vue-next';
import { useLibraryStore } from '../stores/libraryStore';
import { usePlayerStore } from '../stores/playerStore';

const libraryStore = useLibraryStore();
const playerStore = usePlayerStore();

const playlistSongs = ref([]);

const currentPlaylist = computed(() => {
  return libraryStore.playlists.find(p => p.id === libraryStore.selectedPlaylistId);
});

const loadPlaylistSongs = async () => {
  if (libraryStore.selectedPlaylistId && window.api) {
    playlistSongs.value = await window.api.getPlaylistSongs(libraryStore.selectedPlaylistId) || [];
  }
};

watch(() => libraryStore.selectedPlaylistId, () => {
  loadPlaylistSongs();
}, { immediate: true });

const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};
</script>
