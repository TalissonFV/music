import { defineStore } from 'pinia';

export const usePlayerStore = defineStore('player', {
  state: () => ({
    audio: new Audio(),
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    isShuffle: false,
    repeatMode: 'none', // 'none' | 'all' | 'one'
    queue: [],
    queueIndex: -1,
    showQueue: false,
  }),
  
  actions: {
    initAudio() {
      this.audio.volume = this.volume;

      this.audio.addEventListener('timeupdate', () => {
        this.currentTime = this.audio.currentTime || 0;
      });

      this.audio.addEventListener('loadedmetadata', () => {
        this.duration = this.audio.duration || 0;
      });

      this.audio.addEventListener('ended', () => {
        this.handleSongEnded();
      });

      this.audio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        this.isPlaying = false;
      });
    },

    playSong(song, playlist = null) {
      if (!song) return;

      if (playlist && Array.isArray(playlist)) {
        this.queue = [...playlist];
        this.queueIndex = this.queue.findIndex(s => s.id === song.id);
      } else if (!this.queue.some(s => s.id === song.id)) {
        this.queue.push(song);
        this.queueIndex = this.queue.length - 1;
      } else {
        this.queueIndex = this.queue.findIndex(s => s.id === song.id);
      }

      this.currentSong = song;
      // Convert file path to file:// protocol URL if window.api is available
      const audioUrl = song.path ? `file:///${song.path.replace(/\\/g, '/')}` : '';
      this.audio.src = audioUrl;
      this.audio.play()
        .then(() => {
          this.isPlaying = true;
        })
        .catch(err => {
          console.error('Failed to play audio:', err);
          this.isPlaying = false;
        });
    },

    togglePlay() {
      if (!this.currentSong && this.queue.length > 0) {
        this.playSong(this.queue[0]);
        return;
      }
      if (!this.currentSong) return;

      if (this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
      } else {
        this.audio.play().then(() => {
          this.isPlaying = true;
        });
      }
    },

    seek(time) {
      if (this.audio) {
        this.audio.currentTime = time;
        this.currentTime = time;
      }
    },

    setVolume(val) {
      this.volume = val;
      this.audio.volume = val;
      if (val > 0) this.isMuted = false;
    },

    toggleMute() {
      this.isMuted = !this.isMuted;
      this.audio.volume = this.isMuted ? 0 : this.volume;
    },

    toggleShuffle() {
      this.isShuffle = !this.isShuffle;
    },

    cycleRepeat() {
      if (this.repeatMode === 'none') this.repeatMode = 'all';
      else if (this.repeatMode === 'all') this.repeatMode = 'one';
      else this.repeatMode = 'none';
    },

    nextTrack() {
      if (this.queue.length === 0) return;

      if (this.isShuffle) {
        const randomIndex = Math.floor(Math.random() * this.queue.length);
        this.playSong(this.queue[randomIndex]);
        return;
      }

      if (this.queueIndex < this.queue.length - 1) {
        this.queueIndex++;
        this.playSong(this.queue[this.queueIndex]);
      } else if (this.repeatMode === 'all') {
        this.queueIndex = 0;
        this.playSong(this.queue[0]);
      }
    },

    prevTrack() {
      if (this.currentTime > 3) {
        this.seek(0);
        return;
      }

      if (this.queueIndex > 0) {
        this.queueIndex--;
        this.playSong(this.queue[this.queueIndex]);
      } else {
        this.seek(0);
      }
    },

    handleSongEnded() {
      if (this.repeatMode === 'one') {
        this.audio.currentTime = 0;
        this.audio.play();
      } else {
        this.nextTrack();
      }
    },

    toggleQueueDrawer() {
      this.showQueue = !this.showQueue;
    }
  }
});
