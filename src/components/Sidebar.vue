<template>
  <aside class="w-64 bg-brand-dark border-r border-brand-border flex flex-col justify-between p-4 h-full select-none">
    <!-- Top Section -->
    <div class="space-y-6">
      <!-- App Header -->
      <div class="flex items-center gap-3 px-2">
        <div class="w-9 h-9 rounded-xl bg-brand-green flex items-center justify-center text-black shadow-lg shadow-brand-green/20">
          <MusicIcon class="w-5 h-5 fill-current" />
        </div>
        <div>
          <h1 class="font-bold text-lg leading-none tracking-tight">Aura Music</h1>
          <span class="text-xs text-brand-subtext font-medium">Offline Player</span>
        </div>
      </div>

      <!-- Main Navigation -->
      <nav class="space-y-1">
        <button
          @click="libraryStore.setView('songs')"
          :class="['w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
            libraryStore.activeView === 'songs' ? 'bg-brand-card text-white' : 'text-brand-subtext hover:text-white hover:bg-brand-surface']"
        >
          <Music2Icon class="w-5 h-5" />
          <span>All Songs</span>
          <span class="ml-auto text-xs bg-brand-border px-2 py-0.5 rounded-full text-brand-subtext">{{ libraryStore.songs.length }}</span>
        </button>

        <button
          @click="libraryStore.setView('albums')"
          :class="['w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
            libraryStore.activeView === 'albums' ? 'bg-brand-card text-white' : 'text-brand-subtext hover:text-white hover:bg-brand-surface']"
        >
          <DiscIcon class="w-5 h-5" />
          <span>Albums</span>
        </button>

        <button
          @click="libraryStore.setView('artists')"
          :class="['w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors',
            libraryStore.activeView === 'artists' ? 'bg-brand-card text-white' : 'text-brand-subtext hover:text-white hover:bg-brand-surface']"
        >
          <UserIcon class="w-5 h-5" />
          <span>Artists</span>
        </button>
      </nav>

      <!-- Action Buttons -->
      <div class="space-y-2 pt-2 border-t border-brand-border">
        <!-- Scan Folder Button -->
        <button
          @click="libraryStore.selectFolderAndScan()"
          :disabled="libraryStore.isScanning"
          class="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-brand-surface hover:bg-brand-card text-sm font-semibold border border-brand-border text-white transition-all"
        >
          <FolderPlusIcon class="w-4 h-4 text-brand-green" />
          <span>{{ libraryStore.isScanning ? 'Scanning...' : 'Scan Music Folder' }}</span>
        </button>

        <!-- Import Spotify/YTM Playlist Button -->
        <button
          @click="importStore.openModal()"
          class="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-brand-green/10 hover:bg-brand-green/20 text-brand-green border border-brand-green/30 text-sm font-semibold transition-all"
        >
          <DownloadCloudIcon class="w-4 h-4" />
          <span>Import Playlist</span>
        </button>
      </div>

      <!-- Playlists Section -->
      <div class="space-y-2 pt-2 border-t border-brand-border">
        <div class="flex items-center justify-between px-2 text-xs font-bold text-brand-subtext tracking-wider uppercase">
          <span>Your Playlists</span>
          <button @click="handleCreatePlaylist" class="hover:text-white transition-colors" title="Create Playlist">
            <PlusIcon class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-0.5 max-h-52 overflow-y-auto pr-1">
          <button
            v-for="playlist in libraryStore.playlists"
            :key="playlist.id"
            @click="libraryStore.setView('playlist-detail', playlist.id)"
            :class="['w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left font-medium transition-colors',
              libraryStore.selectedPlaylistId === playlist.id ? 'bg-brand-card text-white font-semibold' : 'text-brand-subtext hover:text-white hover:bg-brand-surface']"
          >
            <div class="flex items-center gap-2.5 truncate">
              <ListMusicIcon class="w-4 h-4 shrink-0 text-brand-subtext" />
              <span class="truncate">{{ playlist.name }}</span>
            </div>
            <span class="text-xs text-brand-subtext">{{ playlist.songCount }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Scan Progress Indicator (if active) -->
    <div v-if="libraryStore.isScanning" class="p-3 bg-brand-surface rounded-xl border border-brand-border space-y-2">
      <div class="flex items-center justify-between text-xs text-brand-subtext">
        <span>Scanning library</span>
        <span>{{ libraryStore.scanProgress.current }}/{{ libraryStore.scanProgress.total }}</span>
      </div>
      <div class="w-full bg-brand-border h-1.5 rounded-full overflow-hidden">
        <div
          class="bg-brand-green h-full transition-all duration-200"
          :style="{ width: `${(libraryStore.scanProgress.current / (libraryStore.scanProgress.total || 1)) * 100}%` }"
        ></div>
      </div>
      <p class="text-[11px] text-brand-subtext truncate">{{ libraryStore.scanProgress.file }}</p>
    </div>
  </aside>
</template>

<script setup>
import {
  MusicIcon, Music2Icon, DiscIcon, UserIcon, FolderPlusIcon,
  DownloadCloudIcon, PlusIcon, ListMusicIcon
} from 'lucide-vue-next';
import { useLibraryStore } from '../stores/libraryStore';
import { useImportStore } from '../stores/importStore';

const libraryStore = useLibraryStore();
const importStore = useImportStore();

const handleCreatePlaylist = () => {
  const name = prompt('Enter playlist name:');
  if (name) {
    libraryStore.createPlaylist(name);
  }
};
</script>
