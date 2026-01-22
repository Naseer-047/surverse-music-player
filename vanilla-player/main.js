// State Management
let isPlaying = false;
let isFullScreen = false;
let isLiked = false;
let progress = 0;
const songData = {
    title: "Bones",
    artist: "Imagine Dragons",
    duration: 222 // seconds
};

// UI Elements
const miniPlayer = document.getElementById('mini-player');
const fullPlayer = document.getElementById('full-player');
const miniPlayPauseBtn = document.getElementById('mini-play-pause-btn');
const fullPlayPauseBtn = document.getElementById('full-play-pause-btn');
const progressBar = document.getElementById('progress-bar');
const seekSlider = document.getElementById('seek-slider');
const currentTimeEl = document.getElementById('current-time');
const favBtn = document.getElementById('fav-btn');

/**
 * Initialize Lucide Icons
 */
function initIcons() {
    lucide.createIcons();
}

/**
 * Toggle Play/Pause State
 */
function togglePlay() {
    isPlaying = !isPlaying;
    updatePlayUI();
}

function updatePlayUI() {
    const playIcon = '<i data-lucide="play" fill="currentColor"></i>';
    const pauseIcon = '<i data-lucide="pause" fill="currentColor"></i>';
    
    const icon = isPlaying ? pauseIcon : playIcon;
    miniPlayPauseBtn.innerHTML = icon;
    fullPlayPauseBtn.innerHTML = icon;
    
    initIcons(); // Re-initialize icons for the new HTML
}

/**
 * Toggle Full Screen Overlay
 */
function toggleFullScreen(show) {
    isFullScreen = show;
    if (show) {
        fullPlayer.classList.remove('hidden');
        miniPlayer.style.transform = 'translateY(100px)';
        miniPlayer.style.opacity = '0';
    } else {
        fullPlayer.classList.add('hidden');
        miniPlayer.style.transform = 'translateY(0)';
        miniPlayer.style.opacity = '1';
    }
}

/**
 * Handle Progress Updates (Mock)
 */
function updateProgress() {
    if (isPlaying && progress < 100) {
        progress += 0.5;
        syncProgressUI();
    }
}

function syncProgressUI() {
    progressBar.style.width = `${progress}%`;
    seekSlider.value = progress;
    
    const currentSeconds = Math.floor((progress / 100) * songData.duration);
    const mins = Math.floor(currentSeconds / 60);
    const secs = currentSeconds % 60;
    currentTimeEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Handle Like Toggle
 */
function toggleLike() {
    isLiked = !isLiked;
    favBtn.style.color = isLiked ? '#ff4d4d' : '#ffffff';
    favBtn.querySelector('i').setAttribute('fill', isLiked ? 'currentColor' : 'none');
    initIcons();
}

// Event Listeners
miniPlayPauseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlay();
});

fullPlayPauseBtn.addEventListener('click', togglePlay);

seekSlider.addEventListener('input', (e) => {
    progress = parseFloat(e.target.value);
    syncProgressUI();
});

favBtn.addEventListener('click', toggleLike);

// Mock Progress Loop
setInterval(updateProgress, 1000);

// Initialize
initIcons();

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isFullScreen) {
        toggleFullScreen(false);
    }
});
