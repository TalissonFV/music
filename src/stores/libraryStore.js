import { defineStore } from 'pinia';

export const useLibraryStore = defineStore('library', {
  state: () => ({
    songs: [],
    albums: [],
    artists: [],
    playlists: [],
    activeView: 'songs', // 'songs' | 'albums' | 'artists' | 'playlists' | 'playlist-detail'
    selectedPlaylistId: null,
    searchQuery: '',
    isScanning: false,
    scanProgress: { current: 0, total: 0, file: '' },
    activeFolder: ''
  }),

  actions: {
    async loadLibrary() {
      if (window.api) {
        this.songs = await window.api.getSongs() || [];
        this.albums = await window.api.getAlbums() || [];
        this.artists = await window.api.getArtists() || [];
        this.playlists = await window.api.getPlaylists() || [];
      }
    },

    async selectFolderAndScan() {
      if (!window.api) return;
      const folder = await window.api.selectMusicFolder();
      if (!folder) return;

      this.activeFolder = folder;
      this.isScanning = true;

      const removeListener = window.api.onScanProgress((data) => {
        this.scanProgress = data;
      });

      try {
        await window.api.scanDirectory(folder);
        await this.loadLibrary();
      } catch (err) {
        console.error('Scanning failed:', err);
      } finally {
        this.isScanning = false;
        if (removeListener) removeListener();
      }
    },

    async createPlaylist(name) {
      if (!window.api || !name) return;
      await window.api.createPlaylist(name);
      await this.loadLibrary();
    },

    async deletePlaylist(id) {
      if (!window.api) return;
      await window.api.deletePlaylist(id);
      await this.loadLibrary();
      if (this.selectedPlaylistId === id) {
        this.activeView = 'songs';
        this.selectedPlaylistId = null;
      }
    },

    async addSongToPlaylist(playlistId, songId) {
      if (!window.api) return;
      await window.api.addSongToPlaylist(playlistId, songId);
      await this.loadLibrary();
    },

    async removeSongFromPlaylist(playlistId, songId) {
      if (!window.api) return;
      await window.api.removeSongFromPlaylist(playlistId, songId);
      await this.loadLibrary();
    },

    setView(view, playlistId = null) {
      this.activeView = view;
      this.selectedPlaylistId = playlistId;
    }
  },

  getters: {
    filteredSongs: (state) => {
      if (!state.searchQuery) return state.songs;
      const q = state.searchQuery.toLowerCase();
      return state.songs.filter(s =>
        (s.title && s.title.toLowerCase().includes(q)) ||
        (s.artist && s.artist.toLowerCase().includes(q)) ||
        (s.album && s.album.toLowerCase().includes(q))
      );
    }
  }
});
