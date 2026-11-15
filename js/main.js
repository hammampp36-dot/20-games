/**
 * HAMMA ARCADE - Core Platform & Interactive UI Engine
 * Controls navigation, canvas ambient particles, modals, sound effects, and settings.
 */

(function () {
  'use strict';

  // State
  const AppState = {
    soundEnabled: true,
    audioCtx: null,
    activeModal: null
  };

  /* ==========================================================================
     1. Web Audio API Procedural SFX (Zero External Sound Files Needed)
     ========================================================================== */
  function initAudioContext() {
    if (!AppState.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        AppState.audioCtx = new AudioContext();
      }
    }
    if (AppState.audioCtx && AppState.audioCtx.state === 'suspended') {
      AppState.audioCtx.resume();
    }
  }

  function playSfx(type) {
    if (!AppState.soundEnabled) return;
    try {
      initAudioContext();
      if (!AppState.audioCtx) return;

      const ctx = AppState.audioCtx;
      const now = ctx.currentTime;

      if (type === 'click') {
        // High-tech cyber click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.05);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'boop') {
        // Soft confirmation boop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'launch') {
        // Arcade power-up synth chord
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + i * 0.04);

          gain.gain.setValueAtTime(0.05, now + i * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.04);
          osc.stop(now + i * 0.04 + 0.2);
        });
      }
    } catch (e) {
      // Audio autoplay policy catch
    }
  }

  /* ==========================================================================
     2. Ambient Particle & Grid Canvas Engine
     ========================================================================== */
  function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: width / 2, y: height / 2, isHover: false };
    const particles = [];
    const particleCount = Math.min(Math.floor(width / 22), 65);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#a855f7' : '#06b6d4';
        this.alpha = Math.random() * 0.4 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Subtle reaction to mouse
        if (mouse.isHover) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            this.x -= (dx / dist) * 0.8;
            this.y -= (dy / dist) * 0.8;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw constellation connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#a855f7';
            ctx.globalAlpha = (1 - dist / 110) * 0.12;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Update & Draw particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isHover = true;
    });

    document.addEventListener('mouseleave', () => {
      mouse.isHover = false;
    });

    animate();
  }

  /* ==========================================================================
     3. Header Scroll Effect & Navigation Drawer
     ========================================================================== */
  function initNavigation() {
    const header = document.querySelector('.site-header');
    const navToggle = document.querySelector('.nav-toggle');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-menu-link');

    // Sticky Header Scroll Effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    });

    // Mobile Hamburger Toggle
    if (navToggle && mobileDrawer) {
      navToggle.addEventListener('click', () => {
        const isOpen = navToggle.classList.toggle('open');
        mobileDrawer.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
        playSfx('click');
      });

      // Close mobile drawer on link click
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          navToggle.classList.remove('open');
          mobileDrawer.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }

    // Nav Category shortcut links
    const catLinks = document.querySelectorAll('[data-nav-category]');
    catLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = link.getAttribute('data-nav-category');
        if (window.ArcadeSearch) {
          window.ArcadeSearch.setCategory(cat);
          const gamesSection = document.getElementById('games');
          if (gamesSection) {
            gamesSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
        playSfx('click');
      });
    });
  }

  /* ==========================================================================
     4. Modals Management (Preview, Leaderboard, Settings)
     ========================================================================== */
  const previewModal = document.getElementById('game-preview-modal');
  const leaderboardModal = document.getElementById('leaderboard-modal');
  const settingsModal = document.getElementById('settings-modal');

  function openModal(modalEl) {
    if (!modalEl) return;
    closeAllModals();
    modalEl.classList.add('active');
    document.body.style.overflow = 'hidden';
    AppState.activeModal = modalEl;
    playSfx('click');
  }

  let activePreviewGameId = null;

  function closeAllModals() {
    // Stop any running in-modal game
    if (window.ArcadeRunner && window.ArcadeRunner.getCurrent() && window.ArcadeRunner.getCurrent().stop) {
      window.ArcadeRunner.getCurrent().stop();
    }
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
    AppState.activeModal = null;
  }

  function openGamePreview(gameId) {
    if (!window.ArcadeData) return;
    const game = window.ArcadeData.getGameById(gameId);
    if (!game) return;

    activePreviewGameId = gameId;
    const modal = document.getElementById('game-preview-modal');
    if (!modal) return;

    // Populate modal details
    const titleEl = modal.querySelector('#preview-game-title');
    const catEl = modal.querySelector('#preview-game-category');
    const hintEl = modal.querySelector('#modal-controls-hint');
    const standaloneBtn = modal.querySelector('#preview-standalone-btn');

    if (titleEl) titleEl.textContent = game.title;
    if (catEl) {
      catEl.textContent = `${(game.eduCategory || game.category).toUpperCase()} • KONTROL AKTIF`;
    }
    if (hintEl) hintEl.textContent = game.controls || 'Gunakan Panah / WASD & Spasi';

    if (standaloneBtn) {
      standaloneBtn.href = `games/placeholder.html?id=${encodeURIComponent(game.id)}`;
    }

    if (window.lucide) window.lucide.createIcons();

    openModal(modal);

    // Launch game immediately inside the modal!
    const screenContainer = modal.querySelector('#modal-screen-container');
    const canvasEl = modal.querySelector('#modal-game-canvas');
    if (window.ArcadeRunner && screenContainer && canvasEl) {
      window.ArcadeRunner.launch(gameId, screenContainer, canvasEl);
    }

    playSfx('launch');
  }

  function initModals() {
    // Close modal on click backdrop or close button
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.modal-close-btn') || e.target.closest('.modal-dismiss-btn')) {
          closeAllModals();
          playSfx('click');
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && AppState.activeModal) {
        closeAllModals();
      }
    });

    // Leaderboard Trigger
    document.querySelectorAll('.trigger-leaderboard').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(leaderboardModal);
      });
    });

    // Settings Trigger
    document.querySelectorAll('.trigger-settings').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(settingsModal);
      });
    });

    // Sound toggle in settings
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
      soundToggle.addEventListener('change', (e) => {
        AppState.soundEnabled = e.target.checked;
        if (AppState.soundEnabled) {
          playSfx('boop');
        }
      });
    }

    // Hero Featured Game Quick Play
    const heroPlayFeatured = document.getElementById('hero-play-featured');
    if (heroPlayFeatured) {
      heroPlayFeatured.addEventListener('click', () => {
        openGamePreview('pixel-adventure');
      });
    }

    const featuredCardBtn = document.getElementById('featured-card-btn');
    if (featuredCardBtn) {
      featuredCardBtn.addEventListener('click', () => {
        openGamePreview('pixel-adventure');
      });
    }

    // Modal Restart Button
    const modalRestartBtn = document.getElementById('modal-restart-btn');
    if (modalRestartBtn) {
      modalRestartBtn.addEventListener('click', () => {
        if (!activePreviewGameId || !window.ArcadeRunner) return;
        const screenContainer = document.getElementById('modal-screen-container');
        const canvasEl = document.getElementById('modal-game-canvas');
        window.ArcadeRunner.launch(activePreviewGameId, screenContainer, canvasEl);
        playSfx('launch');
      });
    }

    // Modal Virtual D-Pad / Controls Dispatcher
    function triggerGameKey(key) {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: key }));
      setTimeout(() => {
        window.dispatchEvent(new KeyboardEvent('keyup', { key: key }));
      }, 80);
    }

    const dpadUp = document.getElementById('m-dpad-up');
    const dpadDown = document.getElementById('m-dpad-down');
    const dpadLeft = document.getElementById('m-dpad-left');
    const dpadRight = document.getElementById('m-dpad-right');
    const btnActA = document.getElementById('m-btn-action-a');
    const btnActB = document.getElementById('m-btn-action-b');

    if (dpadUp) dpadUp.addEventListener('pointerdown', (e) => { e.preventDefault(); triggerGameKey('ArrowUp'); });
    if (dpadDown) dpadDown.addEventListener('pointerdown', (e) => { e.preventDefault(); triggerGameKey('ArrowDown'); });
    if (dpadLeft) dpadLeft.addEventListener('pointerdown', (e) => { e.preventDefault(); triggerGameKey('ArrowLeft'); });
    if (dpadRight) dpadRight.addEventListener('pointerdown', (e) => { e.preventDefault(); triggerGameKey('ArrowRight'); });
    if (btnActA) btnActA.addEventListener('pointerdown', (e) => { e.preventDefault(); triggerGameKey(' '); });
    if (btnActB) btnActB.addEventListener('pointerdown', (e) => { e.preventDefault(); triggerGameKey('z'); });
  }

  /* ==========================================================================
     5. Initialization
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initParticleCanvas();
    initNavigation();
    initModals();

    // Initialize Lucide Icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  // Public API
  window.ArcadeUI = {
    openGamePreview,
    playSfx,
    openModal,
    closeAllModals
  };
})();

