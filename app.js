// ========================================
// Brain Hack - Music Player Application
// ========================================

// Music Library Data
const musicLibrary = {
    sleeping: [
        { id: 'sleep-1', name: 'Afterthought', file: 'music/sleeping/Afterthought.mp3', genre: 'sleeping' },
        { id: 'sleep-2', name: 'Astral Clouds', file: 'music/sleeping/AstralClouds.mp3', genre: 'sleeping' },
        { id: 'sleep-3', name: 'Consolation', file: 'music/sleeping/Consolation.mp3', genre: 'sleeping' },
        { id: 'sleep-4', name: 'Crystal Prism', file: 'music/sleeping/CrystalPrism.mp3', genre: 'sleeping' },
        { id: 'sleep-5', name: 'Dark Moon', file: 'music/sleeping/DarkMoon.mp3', genre: 'sleeping' },
        { id: 'sleep-6', name: 'Dreams', file: 'music/sleeping/Dreams.mp3', genre: 'sleeping' },
        { id: 'sleep-7', name: 'Earth Below', file: 'music/sleeping/EarthBelow.mp3', genre: 'sleeping' },
        { id: 'sleep-8', name: 'Floating On Dreams', file: 'music/sleeping/FloatingOnDreams.mp3', genre: 'sleeping' },
        { id: 'sleep-9', name: 'Growing Season', file: 'music/sleeping/GrowingSeason.mp3', genre: 'sleeping' },
        { id: 'sleep-10', name: 'Lunaris', file: 'music/sleeping/Lunaris.mp3', genre: 'sleeping' }
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
    // Remove if already exists
    state.recentTracks = state.recentTracks.filter(t => t.id !== track.id);
    
    // Add to beginning
    state.recentTracks.unshift(track);
    
    // Keep only max recent tracks
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
    
    // Add click listeners
    recentTracksContainer.querySelectorAll('.track-card').forEach(card => {
        card.addEventListener('click', () => {
            const trackId = card.dataset.trackId;
            const track = findTrackById(trackId);
            if (track) {
                playTrack(track);
            }
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
        container.innerHTML = `
            <div class="empty-state">
                <p style="color: var(--text-secondary); text-align: center; padding: 40px;">
                    No ${genre} tracks available yet. Check back soon!
                </p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = tracks.map(track => createTrackCard(track)).join('');
    
    // Add click listeners
    container.querySelectorAll('.track-card').forEach(card => {
        card.addEventListener('click', () => {
            const trackId = card.dataset.trackId;
            const track = findTrackById(trackId);
            if (track) {
                playTrack(track);
            }
        });
    });
}

// Create track card HTML
function createTrackCard(track) {
    const icon = track.genre === 'sleeping' ? '🌙' : '⚡';
    return `
        <div class="track-card ${track.genre}" data-track-id="${track.id}">
            <div class="track-card-content">
                <div class="track-artwork ${track.genre}">
                    <span class="track-artwork-icon">${icon}</span>
                    <div class="track-play-overlay">
                        <div class="play-icon-overlay">
                            <svg viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="track-info">
                    <h3 class="track-name">${track.name}</h3>
                    <p class="track-genre ${track.genre}">${track.genre === 'sleeping' ? 'Sleep Music' : 'Focus Music'}</p>
                </div>
            </div>
        </div>
    `;
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateTo(page);
        });
    });
    
    // Hero buttons
    document.querySelectorAll('[data-navigate]').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.navigate;
            navigateTo(page);
        });
    });
    
    // Back button
    document.getElementById('back-btn').addEventListener('click', () => {
        navigateTo(state.currentGenre || 'home');
    });
    
    // Player controls
    document.getElementById('play-btn').addEventListener('click', togglePlay);
    document.getElementById('prev-btn').addEventListener('click', playPrevious);
    document.getElementById('next-btn').addEventListener('click', playNext);
    document.getElementById('shuffle-btn').addEventListener('click', toggleShuffle);
    document.getElementById('repeat-btn').addEventListener('click', toggleRepeat);
    
    // Progress bar
    const progressBar = document.getElementById('progress-bar');
    progressBar.addEventListener('click', seekTo);
    
    // Volume control
    const volumeBar = document.getElementById('volume-bar');
    volumeBar.addEventListener('click', setVolume);
    
    // Audio events
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    audioPlayer.addEventListener('ended', handleTrackEnd);
    audioPlayer.addEventListener('play', () => updatePlayButton(true));
    audioPlayer.addEventListener('pause', () => updatePlayButton(false));
}

// Navigation
function navigateTo(page) {
    // Update state
    state.currentPage = page;
    
    // Update nav links
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });
    
    // Show/hide pages
    pages.forEach(p => {
        p.classList.remove('active');
    });
    
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Play track
function playTrack(track) {
    state.currentTrack = track;
    state.currentGenre = track.genre;
    
    // Find track index in genre playlist
    const playlist = musicLibrary[track.genre];
    state.currentTrackIndex = playlist.findIndex(t => t.id === track.id);
    
    // Update player UI
    document.getElementById('player-title').textContent = track.name;
    document.getElementById('player-genre').textContent = track.genre === 'sleeping' ? 'Sleep Music' : 'Focus Music';
    
    // Update artwork color based on genre
    const artworkGlow = document.querySelector('.artwork-glow');
    if (track.genre === 'sleeping') {
        artworkGlow.style.background = 'var(--gradient-sleeping)';
    } else {
        artworkGlow.style.background = 'var(--gradient-focus)';
    }
    
    // Load and play audio
    audioPlayer.src = track.file;
    audioPlayer.play();
    state.isPlaying = true;
    
    // Add to recent tracks
    addToRecentTracks(track);
    
    // Update recommendation
    updateRecommendation();
    
    // Navigate to player page
    navigateTo('player');
    
    // Start vinyl animation
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
    
    let newIndex;
    if (state.isShuffle) {
        newIndex = Math.floor(Math.random() * playlist.length);
    } else {
        newIndex = state.currentTrackIndex - 1;
        if (newIndex < 0) newIndex = playlist.length - 1;
    }
    
    playTrack(playlist[newIndex]);
}

// Play next track
function playNext() {
    if (!state.currentGenre) return;
    
    const playlist = musicLibrary[state.currentGenre];
    if (playlist.length === 0) return;
    
    let newIndex;
    if (state.isShuffle) {
        newIndex = Math.floor(Math.random() * playlist.length);
    } else {
        newIndex = state.currentTrackIndex + 1;
        if (newIndex >= playlist.length) newIndex = 0;
    }
    
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
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-handle').style.left = `${progress}%`;
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
    document.getElementById('volume-fill').style.width = `${state.volume * 100}%`;
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Update recommendation
function updateRecommendation() {
    if (!state.currentTrack) return;
    
    const playlist = musicLibrary[state.currentGenre];
    if (playlist.length <= 1) {
        document.getElementById('recommendation-section').style.display = 'none';
        return;
    }
    
    // Get a random track from the same genre (excluding current)
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
    recommendationCard.innerHTML = `
        <div class="recommendation-artwork ${recommendedTrack.genre}">
            ${icon}
        </div>
        <div class="recommendation-info">
            <h4 class="recommendation-name">${recommendedTrack.name}</h4>
            <p class="recommendation-genre">${genreLabel}</p>
        </div>
        <div class="recommendation-play">
            <svg viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
            </svg>
        </div>
    `;
    
    recommendationCard.onclick = () => playTrack(recommendedTrack);
}

// Export for potential external use
window.BrainHack = {
    playTrack,
    navigateTo,
    musicLibrary,
    state
};
