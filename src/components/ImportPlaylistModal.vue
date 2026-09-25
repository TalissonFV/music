<template>
  <div
    v-if="importStore.showModal"
    class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none"
  >
    <div class="bg-brand-surface border border-brand-border rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
      <!-- Modal Header -->
      <div class="p-6 border-b border-brand-border flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-brand-green/20 text-brand-green flex items-center justify-center">
            <DownloadCloudIcon class="w-5 h-5" />
          </div>
          <div>
            <h3 class="font-bold text-lg text-white">Import External Playlist</h3>
            <p class="text-xs text-brand-subtext">Paste Spotify or YouTube Music link to match with your local files</p>
          </div>
        </div>
        <button
          @click="importStore.closeModal()"
          :disabled="importStore.isDownloading"
          class="text-brand-subtext hover:text-white transition-colors"
        >
          <XIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 space-y-6 overflow-y-auto flex-1">
        <!-- Input URL Form -->
        <div class="space-y-2">
          <label class="block text-xs font-bold text-brand-subtext uppercase tracking-wider">Playlist URL</label>
          <div class="flex gap-3">
            <input
              type="text"
              v-model="importStore.url"
              placeholder="e.g. https://music.youtube.com/playlist?list=... or Spotify link"
              class="flex-1 bg-brand-card border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-brand-subtext focus:outline-none focus:border-brand-green"
              :disabled="importStore.isLoading || importStore.isDownloading"
            />
            <button
              @click="importStore.importUrl()"
              :disabled="importStore.isLoading || !importStore.url || importStore.isDownloading"
              class="bg-brand-green hover:bg-brand-green-hover text-black font-bold text-sm px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shrink-0"
            >
              <Loader2Icon v-if="importStore.isLoading" class="w-4 h-4 animate-spin" />
              <span>Analyze Link</span>
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="importStore.errorMessage" class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3">
          <AlertCircleIcon class="w-5 h-5 shrink-0" />
          <span>{{ importStore.errorMessage }}</span>
        </div>

        <!-- Results Display -->
        <div v-if="importStore.importResult" class="space-y-5">
          <!-- Summary Header -->
          <div class="bg-brand-card p-4 rounded-xl border border-brand-border flex items-center justify-between">
            <div>
              <h4 class="font-bold text-base text-white">{{ importStore.importResult.playlistTitle }}</h4>
              <p class="text-xs text-brand-subtext mt-0.5">Total tracks found: {{ importStore.importResult.totalTracks }}</p>
            </div>
            <div class="flex gap-2">
              <span class="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold">
                {{ importStore.importResult.matchedCount }} Matched locally
              </span>
              <span class="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-semibold">
                {{ importStore.importResult.missingCount }} Missing
              </span>
            </div>
          </div>

          <!-- Missing Tracks Action Bar -->
          <div v-if="importStore.importResult.missingCount > 0" class="flex items-center justify-between bg-brand-surface p-4 rounded-xl border border-brand-border">
            <div>
              <p class="text-sm font-semibold text-white">Missing {{ importStore.importResult.missingCount }} songs in local library</p>
              <p class="text-xs text-brand-subtext">Automatically download missing audio via yt-dlp into your library</p>
            </div>
            <button
              @click="importStore.downloadMissing()"
              :disabled="importStore.isDownloading"
              class="bg-brand-green hover:bg-brand-green-hover text-black font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2"
            >
              <DownloadIcon class="w-4 h-4" />
              <span>Download Missing (1-Click)</span>
            </button>
          </div>

          <!-- Download Progress Indicator -->
          <div v-if="importStore.isDownloading" class="p-4 bg-brand-card rounded-xl border border-brand-green/30 space-y-3">
            <div class="flex items-center justify-between text-xs font-semibold">
              <span class="text-brand-green">{{ importStore.downloadProgress.status || 'Downloading audio...' }}</span>
              <span class="text-white">{{ importStore.downloadProgress.current }} / {{ importStore.downloadProgress.total }}</span>
            </div>
            <div class="w-full bg-brand-border h-2 rounded-full overflow-hidden">
              <div
                class="bg-brand-green h-full transition-all duration-300"
                :style="{ width: `${(importStore.downloadProgress.current / (importStore.downloadProgress.total || 1)) * 100}%` }"
              ></div>
            </div>
            <p class="text-xs text-brand-subtext truncate">{{ importStore.downloadProgress.trackName }}</p>
          </div>

          <!-- Matched & Missing Track Lists -->
          <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
            <!-- Matched Tracks -->
            <div v-for="item in importStore.importResult.matchedTracks" :key="item.trackName" class="flex items-center justify-between p-2.5 bg-brand-card/40 rounded-lg text-xs">
              <div class="truncate">
                <span class="font-semibold text-white">{{ item.trackName }}</span>
                <span class="text-brand-subtext ml-2">— {{ item.artistName }}</span>
              </div>
              <span class="text-emerald-400 font-bold shrink-0">✓ Matched</span>
            </div>

            <!-- Missing Tracks -->
            <div v-for="item in importStore.importResult.missingTracks" :key="item.trackName" class="flex items-center justify-between p-2.5 bg-amber-500/5 rounded-lg text-xs border border-amber-500/20">
              <div class="truncate">
                <span class="font-semibold text-amber-200">{{ item.trackName }}</span>
                <span class="text-brand-subtext ml-2">— {{ item.artistName }}</span>
              </div>
              <span class="text-amber-400 font-bold shrink-0">Missing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DownloadCloudIcon, XIcon, Loader2Icon, AlertCircleIcon, DownloadIcon } from 'lucide-vue-next';
import { useImportStore } from '../stores/importStore';

const importStore = useImportStore();
</script>
