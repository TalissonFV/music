# Aura Music Player 🎵

A modern, fast, and feature-rich **offline desktop music player** built with **Electron**, **Vue 3**, **Vite**, **Pinia**, **Tailwind CSS**, and **yt-dlp**.

![Aura Music Player](https://img.shields.io/badge/Electron-35.0-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)

---

## ✨ Features

- 📂 **Local Audio Folder Scanning**: Recursively scans folders for `.mp3`, `.flac`, `.wav`, `.m4a`, `.ogg`, `.aac`, and `.opus` files.
- 🏷️ **ID3 & Metadata Extraction**: Automatically parses embedded cover artwork, album names, artists, titles, and track durations via `music-metadata`.
- 💾 **Persistent Library Storage**: Caches your songs, albums, artists, and custom playlists for instant app startup.
- 🔗 **Spotify & YouTube Music Playlist Importer**: Paste playlist links from Spotify or YouTube Music to match tracks against your local music library.
- 📥 **1-Click Missing Track Downloader**: Automatically downloads missing playlist tracks as audio using `yt-dlp`, embeds metadata, and indexes them into your local library.
- 🎛️ **Full Playback Controls**: Interactive seek slider, volume bar with mute toggle, shuffle mode, repeat mode (`Off`, `All`, `One`), and track queue drawer.
- 🔍 **Instant Search & Filter**: Real-time searching across song titles, artist names, and albums.
- 🎨 **Spotify-Inspired Dark UI**: Modern dark theme layout with custom scrollbars, responsive views, and sleek animations.

---

## 🛠️ Project Architecture

```
d:/Antigravity/music/
├── electron/
│   ├── main.js          # Electron main process & IPC command handlers
│   ├── preload.js       # Secure context bridge between Node and Vue frontend
│   ├── db.js            # Persistent JSON/SQLite library data storage
│   ├── scanner.js       # Audio folder recursive scanner & tag parser
│   ├── importer.js      # Spotify & YouTube Music playlist link analyzer
│   └── downloader.js    # yt-dlp missing track downloader engine
├── src/
│   ├── components/
│   │   ├── Sidebar.vue            # Navigation sidebar & scan/import buttons
│   │   ├── PlayerBar.vue          # Spotify-style bottom playback bar
│   │   ├── QueueDrawer.vue        # Up Next queue drawer panel
│   │   └── ImportPlaylistModal.vue# Playlist import & 1-click download modal
│   ├── views/
│   │   ├── SongsView.vue          # Track list view with search filter
│   │   ├── AlbumsView.vue         # Grid view of albums
│   │   ├── ArtistsView.vue        # Grid view of artists
│   │   └── PlaylistsView.vue      # Playlist track list & manager
│   ├── stores/
│   │   ├── playerStore.js         # Audio element playback & queue store
│   │   ├── libraryStore.js        # Songs, albums, artists, & scanner store
│   │   └── importStore.js         # Link importing & download progress store
│   ├── App.vue                    # Root application layout
│   └── main.js                    # Vue 3 application entrypoint
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:
- **Node.js** (v18.0.0 or higher) & **npm** (v9.0.0 or higher)
- **Python** (3.10 or higher) with `yt-dlp` installed:
  ```bash
  pip install yt-dlp
  ```

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd d:/Antigravity/music
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

---

## 💻 Usage & Scripts

### Run Development Mode

Launch the app in desktop development mode with live hot reloading (Vite + Electron):

```bash
npm run electron:dev
```

### Build Production App Bundle

To compile the Vite web frontend and build the production desktop application:

```bash
npm run electron:build
```

---

## 🎧 How Spotify / YouTube Music Import Works

1. Open **Aura Music** and click **Import Playlist** in the left sidebar.
2. Paste a Spotify playlist URL or YouTube Music playlist link (e.g. `https://music.youtube.com/playlist?list=...`).
3. Click **Analyze Link**. Aura Music extracts the track titles and artists using `yt-dlp`'s flat playlist extractor.
4. Tracks are matched against your local music library.
5. Click **Download Missing (1-Click)** to fetch missing audio tracks directly into your local library folder. Downloaded tracks are automatically tagged and added to your new playlist.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
