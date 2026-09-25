import { defineStore } from 'pinia';
import { toRaw } from 'vue';
import { useLibraryStore } from './libraryStore';

export const useImportStore = defineStore('import', {
  state: () => ({
    showModal: false,
    url: '',
    isLoading: false,
    errorMessage: '',
    importResult: null, // { playlistTitle, totalTracks, matchedCount, missingCount, matchedTracks, missingTracks }
    isDownloading: false,
    downloadProgress: { current: 0, total: 0, trackName: '', status: '' }
  }),

  actions: {
    openModal() {
      this.showModal = true;
      this.url = '';
      this.errorMessage = '';
      this.importResult = null;
    },

    closeModal() {
      if (this.isDownloading) return; // don't close while downloading
      this.showModal = false;
    },

    async importUrl() {
      if (!this.url || !window.api) return;
      this.isLoading = true;
      this.errorMessage = '';
      this.importResult = null;

      try {
        const result = await window.api.importPlaylistUrl(this.url);
        this.importResult = result;
      } catch (err) {
        console.error('Failed to import playlist:', err);
        this.errorMessage = err.message || 'Failed to fetch playlist tracks from link.';
      } finally {
        this.isLoading = false;
      }
    },

    async downloadMissing() {
      if (!this.importResult || !window.api) return;
      this.isDownloading = true;

      const removeListener = window.api.onDownloadProgress((data) => {
        this.downloadProgress = data;
      });

      try {
        const rawResult = JSON.parse(JSON.stringify(toRaw(this.importResult)));
        await window.api.downloadMissingTracks({
          playlistName: rawResult.playlistTitle || 'Imported Playlist',
          missingTracks: rawResult.missingTracks || []
        });
        
        const libraryStore = useLibraryStore();
        await libraryStore.loadLibrary();
        
        this.closeModal();
      } catch (err) {
        console.error('Download failed:', err);
        this.errorMessage = err.message || 'Failed to download missing tracks.';
      } finally {
        this.isDownloading = false;
        if (removeListener) removeListener();
      }
    }
  }
});
