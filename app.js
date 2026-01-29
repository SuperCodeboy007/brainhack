// ========================================
// Brain Hack - Music Player Application
// ========================================

// Music Library Data with CDN URLs
const musicLibrary = {
    sleeping: [
        { id: 'sleep-1', name: 'Afterthought', file: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663274665583/RKdBaWUHQMvipQle.mp3', genre: 'sleeping' },
        { id: 'sleep-2', name: 'Astral Clouds', file: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663274665583/kCQIMxtladoJjKMt.mp3', genre: 'sleeping' },
        { id: 'sleep-3', name: 'Consolation', file: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663274665583/OvjbGUubpmgGDQGL.mp3', genre: 'sleeping' },
        { id: 'sleep-4', name: 'Crystal Prism', file: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663274665583/rjmHnTmPtLJsaBZx.mp3', genre: 'sleeping' },
        { id: 'sleep-5', name: 'Dark Moon', file: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663274665583/ETddbYVToGpMOdYE.mp3', genre: 'sleeping' },
        { id: 'sleep-6', name: 'Dreams', file: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663274665583/zoDPGrnsdZcEHpTN.mp3', genre: 'sleeping' },
        { id: 'sleep-7', name: 'Earth Below', file: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663274665583/gfhZHtRwisWRLPLa.mp3', genre: 'sleeping' },
        { id: 'sleep-8', name: 'Floating On Dreams', file: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663274665583/ggUVREKdVxdAPJwk.mp3', genre: 'sleeping' },
        { id: 'sleep-9', name: 'Growing Season', file: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663274665583/biuHVHgkyknZqfUm.mp3', genre: 'sleeping' },
        { id: 'sleep-10', name: 'Lunaris', file: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663274665583/BDfajItwqGxsICYT.mp3', genre: 'sleeping' }
    ],
    focus: [
        // Focus tracks will be added later
    ]
};

// Application State
const state = {
    currentPage: 'home',
    currentTrack: null,
    currentTrackIndex: -1,
    currentGenre: null,
    isPlaying: false,
    isShuffle: false,
    isRepeat: false,
    volume: 0.7,
    recentTracks: [],
    maxRecentTracks: 6
};

// DOM Elements
const audioPlayer = document.getElementById('audio-player');
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    loadRecentTracks();
    renderTracks();
    setupEventListeners();
    updateRecentTracksDisplay();
    audioPlayer.volume = state.volume;
    updateVolumeDisplay();
});

// Load recent tracks from localStorage
function loadRecentTracks() {
    const saved = localStorage.getItem('brainHackRecentTracks');
    if (saved) {
        state.recentTracks = JSON.parse(saved);
    }
}

// Save recent tracks to localStorage
function saveRecentTracks() {
    localStorage.setItem('brainHackRecentTracks', JSON.stringify(state.recentTracks));
}

// Add track to recent tracks
function addToRecentTracks(track) {
    state.recentTracks = state.recentTracks.filter(t => t.id !== track.id);
    state.recentTracks.unshift(track);
    if (state.recentTracks.length > state.maxRecentTracks) {
        state.recentTracks = state.recentTracks.slice(0, state.maxRecentTracks);
    }
    saveRecentTracks();
    updateRecentTracksDisplay();
}

// Update recent tracks display
function updateRecentTracksDisplay() {
    const recentSection = document.getElementById('recent-section');
    const recentTracksContainer = document.getElementById('recent-tracks');
    
    if (state.recentTracks.length === 0) {
        recentSection.classList.remove('has-tracks');
        return;
    }
    
    recentSection.classList.add('has-tracks');
    recentTracksContainer.innerHTML = state.recentTracks.map(track => createTrackCard(track)).join('');
    
    recentTracksContainer.querySelectorAll('.track-card').forEach(card => {
        card.addEventListener('click', () => {
            const trackId = card.dataset.trackId;
            const track = findTrackById(trackId);
            if (track) playTrack(track);
        });
    });
}

// Find track by ID
function findTrackById(id) {
    const allTracks = [...musicLibrary.sleeping, ...musicLibrary.focus];
    return allTracks.find(t => t.id === id);
}

// Render tracks for each genre page
function renderTracks() {
    renderGenreTracks('sleeping', document.getElementById('sleeping-tracks'));
    renderGenreTracks('focus', document.getElementById('focus-tracks'));
}

function renderGenreTracks(genre, container) {
    const tracks = musicLibrary[genre];
    
    if (tracks.length === 0) {
        container.innerHTML = '<div class="empty-state"><p style="color: var(--text-secondary); text-align: center; padding: 40px;">No ' + genre + ' tracks available yet. Check back soon!</p></div>';
        return;
    }
    
    container.innerHTML = tracks.map(track => createTrackCard(track)).join('');
    
    container.querySelectorAll('.track-card').forEach(card => {
        card.addEventListener('click', () => {
            const trackId = card.dataset.trackId;
            const track = findTrackById(trackId);
            if (track) playTrack(track);
        });
    });
}

// Create track card HTML
function createTrackCard(track) {
    const icon = track.genre === 'sleeping' ? '🌙' : '⚡';
    return '<div class="track-card ' + track.genre + '" data-track-id="' + track.id + '"><div class="track-card-content"><div class="track-artwork ' + track.genre + '"><span class="track-artwork-icon">' + icon + '</span><div class="track-play-overlay"><div class="play-icon-overlay"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div></div></div><div class="track-info"><h3 class="track-name">' + track.name + '</h3><p class="track-genre ' + track.genre + '">' + (track.genre === 'sleeping' ? 'Sleep Music' : 'Focus Music') + '</p></div></div></div>';
}

// Setup Event Listeners
function setupEventListeners() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });
    
    document.querySelectorAll('[data-navigate]').forEach(btn => {
        btn.addEventListener('click', () => navigateTo(btn.dataset.navigate));
    });
    
    document.getElementById('back-btn').addEventListener('click', () => navigateTo(state.currentGenre || 'home'));
    document.getElementById('play-btn').addEventListener('click', togglePlay);
    document.getElementById('prev-btn').addEventListener('click', playPrevious);
    document.getElementById('next-btn').addEventListener('click', playNext);
    document.getElementById('shuffle-btn').addEventListener('click', toggleShuffle);
    document.getElementById('repeat-btn').addEventListener('click', toggleRepeat);
    document.getElementById('progress-bar').addEventListener('click', seekTo);
    document.getElementById('volume-bar').addEventListener('click', setVolume);
    
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    audioPlayer.addEventListener('ended', handleTrackEnd);
    audioPlayer.addEventListener('play', () => updatePlayButton(true));
    audioPlayer.addEventListener('pause', () => updatePlayButton(false));
}

// Navigation
function navigateTo(page) {
    state.currentPage = page;
    navLinks.forEach(link => link.classList.toggle('active', link.dataset.page === page));
    pages.forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(page + '-page');
    if (targetPage) targetPage.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Play track
function playTrack(track) {
    state.currentTrack = track;
    state.currentGenre = track.genre;
    const playlist = musicLibrary[track.genre];
    state.currentTrackIndex = playlist.findIndex(t => t.id === track.id);
    
    document.getElementById('player-title').textContent = track.name;
    document.getElementById('player-genre').textContent = track.genre === 'sleeping' ? 'Sleep Music' : 'Focus Music';
    
    const artworkGlow = document.querySelector('.artwork-glow');
    artworkGlow.style.background = track.genre === 'sleeping' ? 'var(--gradient-sleeping)' : 'var(--gradient-focus)';
    
    audioPlayer.src = track.file;
    audioPlayer.play();
    state.isPlaying = true;
    
    addToRecentTracks(track);
    updateRecommendation();
    navigateTo('player');
    document.getElementById('player-artwork').classList.add('playing');
}

// Toggle play/pause
function togglePlay() {
    if (!state.currentTrack) return;
    if (state.isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.play();
    }
    state.isPlaying = !state.isPlaying;
}

// Update play button appearance
function updatePlayButton(isPlaying) {
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    const artwork = document.getElementById('player-artwork');
    
    if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        artwork.classList.add('playing');
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        artwork.classList.remove('playing');
    }
}

// Play previous track
function playPrevious() {
    if (!state.currentGenre) return;
    const playlist = musicLibrary[state.currentGenre];
    if (playlist.length === 0) return;
    let newIndex = state.isShuffle ? Math.floor(Math.random() * playlist.length) : state.currentTrackIndex - 1;
    if (newIndex < 0) newIndex = playlist.length - 1;
    playTrack(playlist[newIndex]);
}

// Play next track
function playNext() {
    if (!state.currentGenre) return;
    const playlist = musicLibrary[state.currentGenre];
    if (playlist.length === 0) return;
    let newIndex = state.isShuffle ? Math.floor(Math.random() * playlist.length) : state.currentTrackIndex + 1;
    if (newIndex >= playlist.length) newIndex = 0;
    playTrack(playlist[newIndex]);
}

// Toggle shuffle
function toggleShuffle() {
    state.isShuffle = !state.isShuffle;
    document.getElementById('shuffle-btn').classList.toggle('active', state.isShuffle);
}

// Toggle repeat
function toggleRepeat() {
    state.isRepeat = !state.isRepeat;
    document.getElementById('repeat-btn').classList.toggle('active', state.isRepeat);
}

// Handle track end
function handleTrackEnd() {
    if (state.isRepeat) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        playNext();
    }
}

// Update progress bar
function updateProgress() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('progress-handle').style.left = progress + '%';
    document.getElementById('current-time').textContent = formatTime(audioPlayer.currentTime);
}

// Update duration display
function updateDuration() {
    document.getElementById('duration').textContent = formatTime(audioPlayer.duration);
}

// Seek to position
function seekTo(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
}

// Set volume
function setVolume(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    state.volume = Math.max(0, Math.min(1, percent));
    audioPlayer.volume = state.volume;
    updateVolumeDisplay();
}

// Update volume display
function updateVolumeDisplay() {
    document.getElementById('volume-fill').style.width = (state.volume * 100) + '%';
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + secs.toString().padStart(2, '0');
}

// Update recommendation
function updateRecommendation() {
    if (!state.currentTrack) return;
    const playlist = musicLibrary[state.currentGenre];
    if (playlist.length <= 1) {
        document.getElementById('recommendation-section').style.display = 'none';
        return;
    }
    
    const otherTracks = playlist.filter(t => t.id !== state.currentTrack.id);
    const recommendedTrack = otherTracks[Math.floor(Math.random() * otherTracks.length)];
    
    if (!recommendedTrack) {
        document.getElementById('recommendation-section').style.display = 'none';
        return;
    }
    
    document.getElementById('recommendation-section').style.display = 'block';
    const icon = recommendedTrack.genre === 'sleeping' ? '🌙' : '⚡';
    const genreLabel = recommendedTrack.genre === 'sleeping' ? 'Sleep Music' : 'Focus Music';
    
    const recommendationCard = document.getElementById('recommendation-card');
    recommendationCard.innerHTML = '<div class="recommendation-artwork ' + recommendedTrack.genre + '">' + icon + '</div><div class="recommendation-info"><h4 class="recommendation-name">' + recommendedTrack.name + '</h4><p class="recommendation-genre">' + genreLabel + '</p></div><div class="recommendation-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>';
    recommendationCard.onclick = () => playTrack(recommendedTrack);
}

// Export for potential external use
window.BrainHack = { playTrack, navigateTo, musicLibrary, state };
