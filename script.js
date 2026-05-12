// ==================== NAVIGASI SATU HALAMAN ====================
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.page-section');
const backToTopBtn = document.getElementById('back-to-top');

function setActiveNav(targetId) {
    navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.target === targetId);
    });
}

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);

        if (!targetSection) return;

        setActiveNav(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

const observer = new IntersectionObserver((entries) => {
    const visibleEntries = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visibleEntries[0]) {
        setActiveNav(visibleEntries[0].target.id);
    }
}, {
    rootMargin: '-35% 0px -45% 0px',
    threshold: [0.15, 0.35, 0.6],
});

sections.forEach(section => observer.observe(section));

window.addEventListener('scroll', () => {
    backToTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// CUSTOM CURSOR
// ============================================================
const cursor = document.getElementById('custom-cursor');
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

if (!isTouchDevice && cursor) {
    let cursorVisible = true;

    document.addEventListener('mousemove', (e) => {
        if (!cursorVisible) {
            cursor.style.opacity = '0.7';
            cursorVisible = true;
        }
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const hoverTargets = document.querySelectorAll('a, button, .nav-btn, .project-link-card, .design-card, .social-link, .badge, #back-to-top');

    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorVisible = false;
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '0.7';
        cursorVisible = true;
    });
}

// ============================================================
// MUSIC PLAYER
// ============================================================
const bgMusic = document.getElementById('bg-music');
const musicPlayBtn = document.getElementById('music-play');
const musicProgressFill = document.getElementById('music-progress-fill');
const musicProgressBar = document.getElementById('music-progress-bar');
const musicTimeEl = document.getElementById('music-time');
const musicCloseBtn = document.getElementById('music-close');
const musicPlayer = document.getElementById('music-player');
const musicTitle = document.getElementById('music-title');
const musicDragHandle = document.getElementById('music-drag-handle');

let isMusicPlaying = false;
let musicDrag = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

musicPlayBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicPlayBtn.textContent = '▶️';
        musicTitle.textContent = 'beauty and a beat (Paused)';
        isMusicPlaying = false;
        return;
    }

    bgMusic.play().then(() => {
        musicPlayBtn.textContent = '⏸️';
        musicTitle.textContent = 'beauty and a beat';
        isMusicPlaying = true;
    }).catch(() => {
        alert('Klik lagi untuk mulai musik 🎵');
    });
});

bgMusic.addEventListener('timeupdate', () => {
    if (bgMusic.duration) {
        const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
        musicProgressFill.style.width = progress + '%';
        musicTimeEl.textContent = formatTime(bgMusic.currentTime);
    }
});

musicProgressBar.addEventListener('click', (e) => {
    const rect = musicProgressBar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;

    if (bgMusic.duration) {
        bgMusic.currentTime = ratio * bgMusic.duration;
    }
});

musicCloseBtn.addEventListener('click', () => {
    musicPlayer.classList.toggle('minimized');
    musicCloseBtn.textContent = musicPlayer.classList.contains('minimized') ? '+' : '×';
});

function startDrag(clientX, clientY) {
    musicDrag = true;
    const rect = musicPlayer.getBoundingClientRect();
    dragOffsetX = clientX - rect.left;
    dragOffsetY = clientY - rect.top;
    musicPlayer.style.transition = 'none';
}

function movePlayer(clientX, clientY) {
    if (!musicDrag) return;

    musicPlayer.style.right = 'auto';
    musicPlayer.style.bottom = 'auto';
    musicPlayer.style.left = `${clientX - dragOffsetX}px`;
    musicPlayer.style.top = `${clientY - dragOffsetY}px`;
}

function stopDrag() {
    if (!musicDrag) return;

    musicDrag = false;
    musicPlayer.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
}

musicDragHandle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
});

document.addEventListener('mousemove', (e) => movePlayer(e.clientX, e.clientY));
document.addEventListener('mouseup', stopDrag);

musicDragHandle.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (!musicDrag) return;
    movePlayer(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

document.addEventListener('touchend', stopDrag);

const savedPlayerPos = JSON.parse(localStorage.getItem('enji-player-pos') || 'null');
if (savedPlayerPos) {
    musicPlayer.style.right = 'auto';
    musicPlayer.style.bottom = 'auto';
    musicPlayer.style.left = savedPlayerPos.left;
    musicPlayer.style.top = savedPlayerPos.top;
}

window.addEventListener('beforeunload', () => {
    const rect = musicPlayer.getBoundingClientRect();
    localStorage.setItem('enji-player-pos', JSON.stringify({
        left: musicPlayer.style.left || `${window.innerWidth - rect.right}px`,
        top: musicPlayer.style.top || `${window.innerHeight - rect.bottom}px`,
    }));
});
