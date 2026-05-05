import * as THREE from 'three';

// ==================== SETUP DASAR ====================
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 2 : 2.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#080818');
scene.fog = new THREE.Fog('#080818', 5, 32);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.3, 50);
camera.position.set(0, 2.2, 9);
camera.lookAt(0, 0.5, 0);

// ==================== PENCERAHAN ====================
const ambient = new THREE.AmbientLight('#3a3060', 1.0);
scene.add(ambient);

const spotLight1 = new THREE.SpotLight('#ffffff', 40, 30, Math.PI / 4.5, 0.2, 0.4);
spotLight1.position.set(5, 8, 3);
spotLight1.castShadow = true;
spotLight1.shadow.mapSize.set(1024, 1024);
spotLight1.shadow.bias = -0.00015;
spotLight1.shadow.normalBias = 0.02;
scene.add(spotLight1);

const spotLight2 = new THREE.SpotLight('#7c5cfc', 22, 28, Math.PI / 5.5, 0.3, 0.5);
spotLight2.position.set(-4, 7, -2);
spotLight2.castShadow = true;
spotLight2.shadow.mapSize.set(1024, 1024);
spotLight2.shadow.bias = -0.0001;
scene.add(spotLight2);

const pointLight1 = new THREE.PointLight('#5ce0d4', 10, 12);
pointLight1.position.set(2.5, 1.8, 4.5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight('#fc5c9c', 8, 10);
pointLight2.position.set(-2.5, 1.2, 5);
scene.add(pointLight2);

// ==================== WARNA 3D (disinkronkan dengan CSS) ====================
const COL = {
    bg: '#080818',
    surface: '#0d0d20',
    accent: '#7c5cfc',
    accent2: '#5ce0d4',
    accent3: '#fc5c9c',
    dim: '#1f1f3a',
};

// ==================== RUANGAN & LANTAI ====================
const roomWidth = 15, roomHeight = 6.8, roomDepth = 17;

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(roomWidth, roomDepth),
    new THREE.MeshStandardMaterial({ color: '#0a0a1a', roughness: 0.25, metalness: 0.4 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2.3;
floor.receiveShadow = true;
scene.add(floor);

const gridHelper = new THREE.PolarGridHelper(7.5, 40, 24, 256, COL.dim, COL.dim);
gridHelper.position.y = -2.29;
scene.add(gridHelper);

const wallMat = new THREE.MeshStandardMaterial({ color: COL.surface, roughness: 0.55, metalness: 0.08, side: THREE.DoubleSide });

const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomHeight), wallMat);
backWall.position.set(0, roomHeight / 2 - 2.3, -roomDepth / 2);
backWall.receiveShadow = true;
scene.add(backWall);

const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, roomHeight), wallMat);
leftWall.position.set(-roomWidth / 2, roomHeight / 2 - 2.3, 0);
leftWall.rotation.y = Math.PI / 2;
scene.add(leftWall);

const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, roomHeight), wallMat);
rightWall.position.set(roomWidth / 2, roomHeight / 2 - 2.3, 0);
rightWall.rotation.y = -Math.PI / 2;
scene.add(rightWall);

const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(roomWidth, roomDepth),
    new THREE.MeshStandardMaterial({ color: '#0a0a16', roughness: 0.7, side: THREE.DoubleSide })
);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = roomHeight - 2.3;
scene.add(ceiling);

// ==================== GRUP OBJEK ====================
// --- Home: Podium & Hero ---
const podiumGroup = new THREE.Group();
podiumGroup.position.set(0, -2.3, -1.5);
scene.add(podiumGroup);

const pillar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.95, 1.8, 32),
    new THREE.MeshStandardMaterial({ color: '#1a1a35', roughness: 0.25, metalness: 0.7 })
);
pillar.position.y = 0.9;
pillar.castShadow = true;
pillar.receiveShadow = true;
podiumGroup.add(pillar);

const topDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(1.05, 0.85, 0.2, 32),
    new THREE.MeshStandardMaterial({ color: '#292950', roughness: 0.15, metalness: 0.85 })
);
topDisc.position.y = 1.9;
topDisc.castShadow = true;
topDisc.receiveShadow = true;
podiumGroup.add(topDisc);

const heroObj = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.65, 0.16, 200, 28),
    new THREE.MeshPhysicalMaterial({ color: COL.accent, metalness: 0.04, roughness: 0.09, clearcoat: 0.65, clearcoatRoughness: 0.04, emissive: '#140830', emissiveIntensity: 0.6 })
);
heroObj.position.y = 2.3;
heroObj.castShadow = true;
heroObj.receiveShadow = true;
podiumGroup.add(heroObj);

const heroRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.0, 0.02, 32, 200),
    new THREE.MeshStandardMaterial({ color: COL.accent2, metalness: 0.95, roughness: 0.1, emissive: '#052520', emissiveIntensity: 0.9 })
);
heroRing.position.y = 2.3;
heroRing.castShadow = true;
podiumGroup.add(heroRing);

const heroRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.15, 0.018, 32, 160),
    new THREE.MeshStandardMaterial({ color: COL.accent3, metalness: 0.95, roughness: 0.1, emissive: '#200810', emissiveIntensity: 0.7 })
);
heroRing2.position.y = 2.3;
heroRing2.rotation.x = Math.PI / 2;
heroRing2.castShadow = true;
podiumGroup.add(heroRing2);

// --- Works: Proyek ---
const projectsGroup = new THREE.Group();
projectsGroup.position.set(5.8, -0.5, 2.2);
scene.add(projectsGroup);

const projMeshes = [];
const projShapes = [
    new THREE.ConeGeometry(0.35, 0.85, 16),
    new THREE.CylinderGeometry(0.3, 0.3, 0.95, 16),
    new THREE.TorusKnotGeometry(0.28, 0.08, 80, 8),
];
const projColors = [COL.accent, COL.accent2, COL.accent3];

projShapes.forEach((geo, i) => {
    const ped = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.25, 0.9), new THREE.MeshStandardMaterial({ color: COL.dim, roughness: 0.3, metalness: 0.7 }));
    ped.position.set(0, i * 2.0, 0);
    ped.castShadow = true;
    ped.receiveShadow = true;
    projectsGroup.add(ped);

    const mat = new THREE.MeshStandardMaterial({ color: projColors[i], roughness: 0.2, metalness: 0.4, emissive: new THREE.Color(projColors[i]).multiplyScalar(0.3) });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, i * 2.0 + 0.6, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { baseY: i * 2.0 + 0.6, phase: i * 2.1 };
    projectsGroup.add(mesh);
    projMeshes.push(mesh);
});

const projSpot = new THREE.SpotLight('#ffffff', 10, 10, Math.PI / 6, 0.3, 0.6);
projSpot.position.set(5.8, 3.8, 2.8);
projSpot.target.position.set(5.8, 0.8, 2.2);
scene.add(projSpot);
scene.add(projSpot.target);

// --- Stack: Skill Bars ---
const skillsGroup = new THREE.Group();
skillsGroup.position.set(-6.0, -1.7, 2.8);
scene.add(skillsGroup);

const skillLevels = [0.95, 0.90, 0.88, 0.85, 0.92, 0.96];
const skillColors = [COL.accent, '#6e4ff0', COL.accent2, '#48c9b8', COL.accent3, '#e84a88'];
const skillBars = [];

skillLevels.forEach((lvl, i) => {
    const height = 0.9 + lvl * 2.4;
    const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, height, 0.3),
        new THREE.MeshStandardMaterial({ color: skillColors[i], roughness: 0.2, metalness: 0.55, emissive: new THREE.Color(skillColors[i]).multiplyScalar(0.3) })
    );
    bar.position.set(i * 0.75 - 1.85, height / 2, 0);
    bar.castShadow = true;
    bar.receiveShadow = true;
    bar.userData = { targetHeight: height, phase: i * 0.8 };
    skillsGroup.add(bar);
    skillBars.push(bar);
});

// --- Journey: Kontak Sphere ---
const contactGroup = new THREE.Group();
contactGroup.position.set(0, -1.1, -5.8);
scene.add(contactGroup);

const contactSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.85, 64, 64),
    new THREE.MeshPhysicalMaterial({ color: COL.accent, metalness: 0.04, roughness: 0.07, clearcoat: 0.75, emissive: '#100830', emissiveIntensity: 0.8 })
);
contactSphere.castShadow = true;
contactSphere.receiveShadow = true;
contactGroup.add(contactSphere);

const orbitMat = new THREE.MeshStandardMaterial({ color: COL.accent3, metalness: 0.9, roughness: 0.1, emissive: '#200810', emissiveIntensity: 0.9 });
const contactOrbit = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.03, 32, 200), orbitMat);
contactOrbit.rotation.x = Math.PI / 2;
contactOrbit.castShadow = true;
contactGroup.add(contactOrbit);

const contactOrbit2 = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.025, 32, 180), orbitMat);
contactOrbit2.rotation.x = Math.PI / 3;
contactOrbit2.rotation.y = Math.PI / 4;
contactOrbit2.castShadow = true;
contactGroup.add(contactOrbit2);

// --- Partikel debu ---
const dustGeo = new THREE.BufferGeometry();
const dustCount = 600;
const dustPositions = new Float32Array(dustCount * 3);
for (let i = 0; i < dustCount; i++) {
    dustPositions[i * 3] = (Math.random() - 0.5) * roomWidth;
    dustPositions[i * 3 + 1] = Math.random() * roomHeight - 2.3;
    dustPositions[i * 3 + 2] = (Math.random() - 0.5) * roomDepth;
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
const dustParticles = new THREE.Points(dustGeo, new THREE.PointsMaterial({ size: 0.028, color: '#b8b8ff', blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.6 }));
scene.add(dustParticles);

// ==================== KAMERA TARGET PER TAB ====================
const cameraTargets = {
    home: { pos: new THREE.Vector3(0, 1.1, 6.5), look: new THREE.Vector3(0, 0.9, 0) },
    works: { pos: new THREE.Vector3(4.8, 1.8, 5.5), look: new THREE.Vector3(4.8, 1.1, 2.2) },
    stack: { pos: new THREE.Vector3(-4.8, 2.0, 5.5), look: new THREE.Vector3(-4.8, 0.9, 2.8) },
    journey: { pos: new THREE.Vector3(0, 0.9, 7.5), look: new THREE.Vector3(0, 0.3, -4.5) },
};

let activeTab = 'home';

// ==================== VISIBILITAS GRUP BERDASARKAN TAB ====================
const groupsForTab = {
    home: [podiumGroup],
    works: [projectsGroup],
    stack: [skillsGroup],
    journey: [contactGroup],
};

function setVisibleGroups(tab) {
    [podiumGroup, projectsGroup, skillsGroup, contactGroup].forEach(g => g.visible = false);
    if (groupsForTab[tab]) {
        groupsForTab[tab].forEach(g => g.visible = true);
    }
}
setVisibleGroups(activeTab);

// ==================== MOUSE / SENTUH PARALLAX ====================
const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, enabled: !isMobile };

if (!isMobile) {
    document.addEventListener('mousemove', (e) => {
        mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
}

// ==================== RESIZE (DENGAN DEBOUNCE) ====================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 2 : 2.5));
    }, 150);
});

// ==================== NAVIGASI TAB ====================
const navButtons = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) return;
        const targetId = btn.getAttribute('data-target');

        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === targetId) {
                content.classList.add('active');
            }
        });

        activeTab = targetId;
        setVisibleGroups(activeTab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ==================== TOMBOL KEMBALI KE ATAS ====================
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = 'flex';
    } else {
        backToTopBtn.style.display = 'none';
    }
});
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// 1. MODE REDUCE MOTION
// ============================================================
const motionToggle = document.getElementById('motion-toggle');
const motionIcon = motionToggle.querySelector('.motion-icon');
let reducedMotion = localStorage.getItem('enji-reduced-motion') === 'true';

function applyReducedMotion(reduced) {
    if (reduced) {
        document.body.classList.add('reduced-motion');
        motionIcon.textContent = '🌙';
        motionToggle.classList.add('motion-reduced');
        mouse.enabled = false;
    } else {
        document.body.classList.remove('reduced-motion');
        motionIcon.textContent = '✨';
        motionToggle.classList.remove('motion-reduced');
        mouse.enabled = !isMobile;
    }
}

applyReducedMotion(reducedMotion);

motionToggle.addEventListener('click', () => {
    reducedMotion = !reducedMotion;
    localStorage.setItem('enji-reduced-motion', reducedMotion);
    applyReducedMotion(reducedMotion);
});

// ============================================================
// 2. CUSTOM CURSOR
// ============================================================
const cursor = document.getElementById('custom-cursor');

if (!isMobile) {
    let cursorVisible = true;

    document.addEventListener('mousemove', (e) => {
        if (!cursorVisible) {
            cursor.style.opacity = '0.7';
            cursorVisible = true;
        }
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const hoverTargets = document.querySelectorAll('a, button, .nav-btn, .list-item, .social-link, .badge, #back-to-top, #motion-toggle');

    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
        });
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
// 3. MUSIC PLAYER
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
let dragOffsetX = 0, dragOffsetY = 0;

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

musicPlayBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicPlayBtn.textContent = '▶️';
        musicTitle.textContent = 'Lo-Fi Chill (Paused)';
    } else {
        bgMusic.play().catch(() => {
            alert('Klik lagi untuk mulai musik 🎵');
        });
        musicPlayBtn.textContent = '⏸️';
        musicTitle.textContent = 'Lo-Fi Chill';
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

// Drag player (mouse)
musicDragHandle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    musicDrag = true;
    const rect = musicPlayer.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    musicPlayer.style.transition = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (!musicDrag) return;
    musicPlayer.style.right = 'auto';
    musicPlayer.style.bottom = 'auto';
    musicPlayer.style.left = (e.clientX - dragOffsetX) + 'px';
    musicPlayer.style.top = (e.clientY - dragOffsetY) + 'px';
});

document.addEventListener('mouseup', () => {
    if (musicDrag) {
        musicDrag = false;
        musicPlayer.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    }
});

// Drag player (touch)
musicDragHandle.addEventListener('touchstart', (e) => {
    e.preventDefault();
    musicDrag = true;
    const rect = musicPlayer.getBoundingClientRect();
    dragOffsetX = e.touches[0].clientX - rect.left;
    dragOffsetY = e.touches[0].clientY - rect.top;
    musicPlayer.style.transition = 'none';
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (!musicDrag) return;
    musicPlayer.style.right = 'auto';
    musicPlayer.style.bottom = 'auto';
    musicPlayer.style.left = (e.touches[0].clientX - dragOffsetX) + 'px';
    musicPlayer.style.top = (e.touches[0].clientY - dragOffsetY) + 'px';
}, { passive: false });

document.addEventListener('touchend', () => {
    if (musicDrag) {
        musicDrag = false;
        musicPlayer.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    }
});

// Simpan posisi player
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

// ==================== ANIMASI LOOP ====================
const clock = new THREE.Clock();
function animate() {
    const dt = Math.min(clock.getDelta(), 0.1);
    const elapsed = clock.elapsedTime;

    if (reducedMotion) {
        // Mode reduce motion: render statis
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
        return;
    }

    if (mouse.enabled) {
        mouse.x += (mouse.targetX - mouse.x) * 3.5 * dt;
        mouse.y += (mouse.targetY - mouse.y) * 3.5 * dt;
    }

    heroObj.rotation.x += 0.3 * dt;
    heroObj.rotation.y += 0.45 * dt;
    heroObj.position.y = 2.3 + Math.sin(elapsed * 0.7) * 0.25;
    heroRing.rotation.z += 0.45 * dt;
    heroRing2.rotation.y += 0.55 * dt;

    projMeshes.forEach(m => {
        m.rotation.y += 0.8 * dt;
        m.position.y = m.userData.baseY + Math.sin(elapsed * 2.4 + m.userData.phase) * 0.25;
    });

    skillBars.forEach(bar => {
        bar.scale.y = 0.85 + Math.sin(elapsed * 2.8 + bar.userData.phase) * 0.15;
    });

    contactSphere.rotation.y += 0.3 * dt;
    contactOrbit.rotation.z += 0.6 * dt;
    contactOrbit2.rotation.z -= 0.45 * dt;

    dustParticles.rotation.y += 0.02 * dt;

    pointLight1.intensity = 9 + Math.sin(elapsed * 1.4) * 2;
    pointLight2.intensity = 7 + Math.cos(elapsed * 1.8) * 1.8;

    const target = cameraTargets[activeTab];
    const targetPos = target.pos.clone();
    const targetLook = target.look.clone();

    if (mouse.enabled) {
        targetPos.x += mouse.x * 0.65;
        targetPos.y += mouse.y * 0.35;
        targetLook.x += mouse.x * 0.3;
        targetLook.y += mouse.y * 0.25;
    }

    camera.position.lerp(targetPos, 2.5 * dt);
    const currentLook = new THREE.Vector3();
    camera.getWorldDirection(currentLook);
    const desiredLook = targetLook.clone().sub(camera.position).normalize();
    const lerpedLook = new THREE.Vector3().copy(currentLook).lerp(desiredLook, 3.2 * dt).normalize();
    camera.lookAt(camera.position.clone().add(lerpedLook));

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
