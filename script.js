// ==================== NAVIGASI SATU HALAMAN ====================
const navButtons = document.querySelectorAll('.nav-btn');
const pageSections = document.querySelectorAll('.page-section');
const backToTopBtn = document.getElementById('back-to-top');
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

function scrollToSection(targetId) {
    const section = document.getElementById(targetId);
    if (!section) return;

    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setActiveNav(targetId) {
    navButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.target === targetId);
    });
}

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.dataset.target;
        setActiveNav(targetId);
        scrollToSection(targetId);
    });
});

const sectionObserver = new IntersectionObserver((entries) => {
    const visibleEntry = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visibleEntry) {
        setActiveNav(visibleEntry.target.id);
    }
}, {
    root: null,
    threshold: [0.35, 0.55, 0.75],
    rootMargin: '-15% 0px -45% 0px',
});

pageSections.forEach(section => sectionObserver.observe(section));

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

if (!isMobile && cursor) {
    let cursorVisible = true;

    document.addEventListener('mousemove', (event) => {
        if (!cursorVisible) {
            cursor.style.opacity = '0.7';
            cursorVisible = true;
        }
        cursor.style.left = event.clientX + 'px';
        cursor.style.top = event.clientY + 'px';
    });

    const hoverTargets = document.querySelectorAll('a, button, .nav-btn, .project-link-card, .design-card, .social-link, .badge, #back-to-top');

    hoverTargets.forEach(element => {
        element.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        element.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
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
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

if (bgMusic && musicPlayBtn && musicProgressFill && musicProgressBar && musicTimeEl && musicCloseBtn && musicPlayer && musicTitle && musicDragHandle) {
    musicPlayBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicPlayBtn.textContent = '▶️';
            musicTitle.textContent = 'beauty and a beat (Paused)';
        } else {
            bgMusic.play().then(() => {
                musicPlayBtn.textContent = '⏸️';
                musicTitle.textContent = 'beauty and a beat';
            }).catch(() => {
                musicTitle.textContent = 'Klik lagi untuk mulai musik 🎵';
            });
        }
        isMusicPlaying = !isMusicPlaying;
    });

    bgMusic.addEventListener('timeupdate', () => {
        if (bgMusic.duration) {
            const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
            musicProgressFill.style.width = progress + '%';
            musicTimeEl.textContent = formatTime(bgMusic.currentTime);
        }
    });

    musicProgressBar.addEventListener('click', (event) => {
        const rect = musicProgressBar.getBoundingClientRect();
        const ratio = (event.clientX - rect.left) / rect.width;
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
        musicPlayer.style.left = (clientX - dragOffsetX) + 'px';
        musicPlayer.style.top = (clientY - dragOffsetY) + 'px';
    }

    function stopDrag() {
        if (!musicDrag) return;
        musicDrag = false;
        musicPlayer.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    }

    musicDragHandle.addEventListener('mousedown', (event) => {
        event.preventDefault();
        startDrag(event.clientX, event.clientY);
    });

    document.addEventListener('mousemove', (event) => movePlayer(event.clientX, event.clientY));
    document.addEventListener('mouseup', stopDrag);

    musicDragHandle.addEventListener('touchstart', (event) => {
        event.preventDefault();
        startDrag(event.touches[0].clientX, event.touches[0].clientY);
    }, { passive: false });

    document.addEventListener('touchmove', (event) => {
        if (!musicDrag) return;
        movePlayer(event.touches[0].clientX, event.touches[0].clientY);
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
            left: musicPlayer.style.left || (window.innerWidth - rect.right) + 'px',
            top: musicPlayer.style.top || (window.innerHeight - rect.bottom) + 'px'
        }));
    });
}
