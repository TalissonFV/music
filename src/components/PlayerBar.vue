<template>
  <footer class="h-24 bg-brand-surface border-t border-brand-border px-4 flex items-center justify-between select-none z-30">
    <!-- Left: Current Track Info -->
    <div class="flex items-center gap-3 w-1/4 min-w-[200px]">
      <div class="w-14 h-14 rounded-lg bg-brand-card overflow-hidden shrink-0 shadow border border-brand-border flex items-center justify-center">
        <img
          v-if="playerStore.currentSong?.coverArt"
          :src="playerStore.currentSong.coverArt"
          class="w-full h-full object-cover"
          alt="Album Art"
        />
        <MusicIcon v-else class="w-6 h-6 text-brand-subtext" />
      </div>

      <div class="truncate">
        <h4 class="font-semibold text-sm text-white truncate">
          {{ playerStore.currentSong ? playerStore.currentSong.title : 'No song selected' }}
        </h4>
        <p class="text-xs text-brand-subtext truncate mt-0.5">
          {{ playerStore.currentSong ? playerStore.currentSong.artist : 'Select a track to play' }}
        </p>
      </div>
    </div>

    <!-- Center: Playback Controls & Progress Slider -->
    <div class="flex flex-col items-center gap-1.5 w-2/4 max-w-2xl">
      <!-- Buttons -->
      <div class="flex items-center gap-5">
        <!-- Shuffle -->
        <button
          @click="playerStore.toggleShuffle()"
          :class="['p-1.5 rounded-full transition-colors', playerStore.isShuffle ? 'text-brand-green' : 'text-brand-subtext hover:text-white']"
          title="Shuffle"
        >
          <ShuffleIcon class="w-4 h-4" />
        </button>

        <!-- Previous -->
        <button
          @click="playerStore.prevTrack()"
          class="text-brand-subtext hover:text-white transition-colors"
          title="Previous"
        >
          <SkipBackIcon class="w-5 h-5 fill-current" />
        </button>

        <!-- Play / Pause -->
        <button
          @click="playerStore.togglePlay()"
          class="w-10 h-10 rounded-full bg-white hover:scale-105 transition-transform flex items-center justify-center text-black shadow"
          title="Play/Pause"
        >
          <PauseIcon v-if="playerStore.isPlaying" class="w-5 h-5 fill-current" />
          <PlayIcon v-else class="w-5 h-5 fill-current ml-0.5" />
        </button>

        <!-- Next -->
        <button
          @click="playerStore.nextTrack()"
          class="text-brand-subtext hover:text-white transition-colors"
          title="Next"
        >
          <SkipForwardIcon class="w-5 h-5 fill-current" />
        </button>

        <!-- Repeat -->
        <button
          @click="playerStore.cycleRepeat()"
          :class="['p-1.5 rounded-full transition-colors relative', playerStore.repeatMode !== 'none' ? 'text-brand-green' : 'text-brand-subtext hover:text-white']"
          title="Repeat"
        >
          <RepeatIcon class="w-4 h-4" />
          <span v-if="playerStore.repeatMode === 'one'" class="absolute -top-1 -right-1 text-[9px] font-bold">1</span>
        </button>
      </div>

      <!-- Time Slider -->
      <div class="w-full flex items-center gap-3 text-xs font-mono text-brand-subtext">
        <span>{{ formatTime(playerStore.currentTime) }}</span>
        <input
          type="range"
          min="0"
          :max="playerStore.duration || 100"
          :value="playerStore.currentTime"
          @input="onSeek"
          class="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-green hover:accent-brand-green-hover"
        />
        <span>{{ formatTime(playerStore.duration) }}</span>
      </div>
    </div>

    <!-- Right: Volume & Queue Toggle -->
    <div class="flex items-center justify-end gap-3 w-1/4 min-w-[180px]">
      <button @click="playerStore.toggleQueueDrawer()" :class="['p-2 rounded-lg transition-colors', playerStore.showQueue ? 'bg-brand-card text-brand-green' : 'text-brand-subtext hover:text-white']" title="Queue">
        <ListMusicIcon class="w-5 h-5" />
      </button>

      <div class="flex items-center gap-2">
        <button @click="playerStore.toggleMute()" class="text-brand-subtext hover:text-white transition-colors">
          <VolumeXIcon v-if="playerStore.isMuted || playerStore.volume === 0" class="w-5 h-5" />
          <Volume1Icon v-else-if="playerStore.volume < 0.5" class="w-5 h-5" />
          <Volume2Icon v-else class="w-5 h-5" />
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          :value="playerStore.isMuted ? 0 : playerStore.volume"
          @input="onVolumeChange"
          class="w-24 h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-green hover:accent-brand-green-hover"
        />
      </div>
    </div>
  </footer>
</template>

<script setup>
import {
  MusicIcon, PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon,
  ShuffleIcon, RepeatIcon, Volume2Icon, Volume1Icon, VolumeXIcon, ListMusicIcon
} from 'lucide-vue-next';
import { usePlayerStore } from '../stores/playerStore';

const playerStore = usePlayerStore();

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const onSeek = (e) => {
  playerStore.seek(parseFloat(e.target.value));
};

const onVolumeChange = (e) => {
  playerStore.setVolume(parseFloat(e.target.value));
};
</script>
