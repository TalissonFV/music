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

      <div class="flex items-center gap-3">
        <!-- Range Delete Button -->
        <button
          v-if="libraryStore.filteredSongs.length > 0"
          @click="openRangeModal"
          class="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
          title="Remove range of songs from app"
        >
          <Trash2Icon class="w-3.5 h-3.5" />
          <span>Remover Intervalo (#74...)</span>
        </button>

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
        <div class="col-span-4">Title</div>
        <div class="col-span-3">Artist</div>
        <div class="col-span-2">Album</div>
        <div class="col-span-1 text-center">Time</div>
        <div class="col-span-1 text-right">Actions</div>
      </div>

      <!-- Table Rows -->
      <div
        v-for="(song, index) in libraryStore.filteredSongs"
        :key="song.id"
        :class="['grid grid-cols-12 gap-4 px-4 py-3 rounded-xl items-center text-xs font-medium group transition-colors',
          playerStore.currentSong?.id === song.id ? 'bg-brand-card text-brand-green' : 'hover:bg-brand-card/60 text-white']"
      >
        <!-- # / Play Icon -->
        <div class="col-span-1 text-brand-subtext flex items-center cursor-pointer" @click="playerStore.playSong(song, libraryStore.filteredSongs)">
          <span v-if="playerStore.currentSong?.id === song.id && playerStore.isPlaying" class="text-brand-green animate-pulse">▶</span>
          <span v-else class="group-hover:hidden">{{ index + 1 }}</span>
          <PlayIcon class="w-3.5 h-3.5 hidden group-hover:block fill-current" />
        </div>

        <!-- Title & Cover Art -->
        <div class="col-span-4 flex items-center gap-3 truncate cursor-pointer" @click="playerStore.playSong(song, libraryStore.filteredSongs)">
          <div class="w-9 h-9 rounded bg-brand-surface overflow-hidden shrink-0 flex items-center justify-center border border-brand-border">
            <img v-if="song.coverArt" :src="song.coverArt" class="w-full h-full object-cover" />
            <MusicIcon v-else class="w-4 h-4 text-brand-subtext" />
          </div>
          <span class="truncate font-semibold text-sm">{{ song.title }}</span>
        </div>

        <!-- Artist -->
        <div class="col-span-3 text-brand-subtext truncate cursor-pointer" @click="playerStore.playSong(song, libraryStore.filteredSongs)">{{ song.artist }}</div>

        <!-- Album -->
        <div class="col-span-2 text-brand-subtext truncate cursor-pointer" @click="playerStore.playSong(song, libraryStore.filteredSongs)">{{ song.album }}</div>

        <!-- Duration -->
        <div class="col-span-1 text-center font-mono text-brand-subtext cursor-pointer" @click="playerStore.playSong(song, libraryStore.filteredSongs)">{{ formatDuration(song.duration) }}</div>

        <!-- Actions (Edit / Remove from app) -->
        <div class="col-span-1 flex items-center justify-end gap-2 text-brand-subtext">
          <button @click.stop="openEditModal(song)" class="hover:text-white p-1 transition-colors" title="Edit Metadata">
            <Edit3Icon class="w-3.5 h-3.5" />
          </button>
          <button @click.stop="openSingleDeleteModal(song)" class="hover:text-red-400 p-1 transition-colors" title="Remove from App (Keeps File)">
            <Trash2Icon class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Range Delete Custom Modal -->
    <div v-if="showRangeModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-brand-surface border border-brand-border rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
        <div class="flex items-center justify-between border-b border-brand-border pb-3">
          <h3 class="font-bold text-base text-white flex items-center gap-2">
            <Trash2Icon class="w-4 h-4 text-red-400" />
            <span>Remover Intervalo de Músicas</span>
          </h3>
          <button @click="showRangeModal = false" class="text-brand-subtext hover:text-white">
            <XIcon class="w-5 h-5" />
          </button>
        </div>

        <div class="space-y-4 text-xs">
          <p class="text-brand-subtext">
            Selecione o intervalo de números das músicas que deseja remover da visualização do app.
            <strong class="text-emerald-400 font-normal block mt-1">Os arquivos físicos no seu computador NÃO serão deletados.</strong>
          </p>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-brand-subtext font-semibold mb-1">A partir da música #</label>
              <input
                type="number"
                v-model.number="startRange"
                min="1"
                :max="libraryStore.filteredSongs.length"
                class="w-full bg-brand-card border border-brand-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-green"
              />
            </div>
            <div>
              <label class="block text-brand-subtext font-semibold mb-1">Até a música #</label>
              <input
                type="number"
                v-model.number="endRange"
                min="1"
                :max="libraryStore.filteredSongs.length"
                class="w-full bg-brand-card border border-brand-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-green"
              />
            </div>
          </div>

          <div class="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 font-medium">
            Músicas a serem removidas do app: <span class="font-bold text-white">{{ computedRangeCount }}</span> (da #{{ startRange }} até #{{ endRange }})
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <button @click="showRangeModal = false" class="px-4 py-2 rounded-xl text-xs font-semibold text-brand-subtext hover:text-white bg-brand-card">
            Cancelar
          </button>
          <button
            @click="confirmBulkDeleteRange"
            :disabled="computedRangeCount <= 0"
            class="px-4 py-2 rounded-xl text-xs font-bold text-black bg-red-400 hover:bg-red-300 transition-all disabled:opacity-50"
          >
            Confirmar Remoção
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Metadata Custom Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-brand-surface border border-brand-border rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
        <div class="flex items-center justify-between border-b border-brand-border pb-3">
          <h3 class="font-bold text-base text-white flex items-center gap-2">
            <Edit3Icon class="w-4 h-4 text-brand-green" />
            <span>Editar Informações da Música</span>
          </h3>
          <button @click="showEditModal = false" class="text-brand-subtext hover:text-white">
            <XIcon class="w-5 h-5" />
          </button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-brand-subtext font-semibold mb-1">Título</label>
            <input
              type="text"
              v-model="editForm.title"
              class="w-full bg-brand-card border border-brand-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-green"
            />
          </div>

          <div>
            <label class="block text-brand-subtext font-semibold mb-1">Artista</label>
            <input
              type="text"
              v-model="editForm.artist"
              class="w-full bg-brand-card border border-brand-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-green"
            />
          </div>

          <div>
            <label class="block text-brand-subtext font-semibold mb-1">Álbum</label>
            <input
              type="text"
              v-model="editForm.album"
              class="w-full bg-brand-card border border-brand-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-green"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <button @click="showEditModal = false" class="px-4 py-2 rounded-xl text-xs font-semibold text-brand-subtext hover:text-white bg-brand-card">
            Cancelar
          </button>
          <button @click="saveEdit" class="px-4 py-2 rounded-xl text-xs font-bold text-black bg-brand-green hover:bg-brand-green-hover transition-all">
            Salvar
          </button>
        </div>
      </div>
    </div>

    <!-- Single Delete Modal -->
    <div v-if="showSingleDeleteModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-brand-surface border border-brand-border rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
        <h3 class="font-bold text-base text-white">Remover Música do App</h3>
        <p class="text-xs text-brand-subtext">
          Deseja remover "<strong class="text-white">{{ targetDeleteSong?.title }}</strong>" da visualização do app?
          <span class="block mt-2 text-emerald-400">O arquivo de áudio no seu computador NÃO será deletado.</span>
        </p>
        <div class="flex items-center justify-end gap-3 pt-2">
          <button @click="showSingleDeleteModal = false" class="px-4 py-2 rounded-xl text-xs font-semibold text-brand-subtext hover:text-white bg-brand-card">
            Cancelar
          </button>
          <button @click="confirmSingleDelete" class="px-4 py-2 rounded-xl text-xs font-bold text-black bg-red-400 hover:bg-red-300 transition-all">
            Remover
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { SearchIcon, MusicIcon, PlayIcon, FolderPlusIcon, Edit3Icon, Trash2Icon, XIcon } from 'lucide-vue-next';
import { useLibraryStore } from '../stores/libraryStore';
import { usePlayerStore } from '../stores/playerStore';

const libraryStore = useLibraryStore();
const playerStore = usePlayerStore();

// Range Modal State
const showRangeModal = ref(false);
const startRange = ref(74);
const endRange = ref(100);

// Edit Modal State
const showEditModal = ref(false);
const editForm = ref({ id: '', title: '', artist: '', album: '' });

// Single Delete Modal State
const showSingleDeleteModal = ref(false);
const targetDeleteSong = ref(null);

const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const openRangeModal = () => {
  const total = libraryStore.filteredSongs.length;
  startRange.value = 74 > total ? Math.max(1, total) : 74;
  endRange.value = total;
  showRangeModal.value = true;
};

const computedRangeCount = computed(() => {
  const s = startRange.value;
  const e = endRange.value;
  if (!s || !e || s > e) return 0;
  return e - s + 1;
});

const confirmBulkDeleteRange = async () => {
  const total = libraryStore.filteredSongs.length;
  const s = Math.max(1, startRange.value);
  const e = Math.min(total, endRange.value);

  if (s > e) return;

  const songsToRemove = libraryStore.filteredSongs.slice(s - 1, e);
  const idsToRemove = songsToRemove.map(song => song.id);

  await libraryStore.deleteMultipleSongs(idsToRemove);
  showRangeModal.value = false;
};

const openEditModal = (song) => {
  editForm.value = {
    id: song.id,
    title: song.title,
    artist: song.artist,
    album: song.album
  };
  showEditModal.value = true;
};

const saveEdit = async () => {
  await libraryStore.updateSong(editForm.value.id, {
    title: editForm.value.title,
    artist: editForm.value.artist,
    album: editForm.value.album
  });
  showEditModal.value = false;
};

const openSingleDeleteModal = (song) => {
  targetDeleteSong.value = song;
  showSingleDeleteModal.value = true;
};

const confirmSingleDelete = async () => {
  if (targetDeleteSong.value) {
    await libraryStore.deleteSong(targetDeleteSong.value.id);
  }
  showSingleDeleteModal.value = false;
};
</script>
