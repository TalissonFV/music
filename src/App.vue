<template>
  <div class="flex flex-col h-screen w-screen bg-brand-dark text-white font-sans overflow-hidden select-none">
    <!-- Top Main Workspace -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar Navigation -->
      <Sidebar />

      <!-- Main Content View -->
      <main class="flex-1 flex flex-col bg-brand-dark overflow-hidden relative">
        <SongsView v-if="libraryStore.activeView === 'songs'" />
        <AlbumsView v-else-if="libraryStore.activeView === 'albums'" />
        <ArtistsView v-else-if="libraryStore.activeView === 'artists'" />
        <PlaylistsView v-else-if="libraryStore.activeView === 'playlist-detail'" />
      </main>

      <!-- Right Queue Drawer -->
      <QueueDrawer />
    </div>

    <!-- Bottom Fixed Player Bar -->
    <PlayerBar />

    <!-- Spotify / YTM Import Modal -->
    <ImportPlaylistModal />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Sidebar from './components/Sidebar.vue';
import PlayerBar from './components/PlayerBar.vue';
import QueueDrawer from './components/QueueDrawer.vue';
import ImportPlaylistModal from './components/ImportPlaylistModal.vue';

import SongsView from './views/SongsView.vue';
import AlbumsView from './views/AlbumsView.vue';
import ArtistsView from './views/ArtistsView.vue';
import PlaylistsView from './views/PlaylistsView.vue';

import { useLibraryStore } from './stores/libraryStore';
import { usePlayerStore } from './stores/playerStore';

const libraryStore = useLibraryStore();
const playerStore = usePlayerStore();

onMounted(async () => {
  playerStore.initAudio();
  await libraryStore.loadLibrary();
});
</script>
