/**
 * HAMMA ARCADE - PS2 Dark / Retro Edition Search & Rendering Engine
 * Connects with js/games-data.js to render 20 PS2 Memory Card game tiles
 * with educational categorization (Logika, Matematika, Bahasa, Sains & Refleks).
 */

(function () {
  'use strict';

  // State
  let currentSearchQuery = '';
  let currentCategory = 'Semua Game';
  let currentSort = 'featured';

  // DOM Elements
  const gamesGridEl = document.getElementById('games-grid');
  const searchInputEl = document.getElementById('game-search-input');
  const searchClearBtnEl = document.getElementById('search-clear-btn');
  const categoryPillsContainerEl = document.getElementById('category-pills-row');
  const sortSelectEl = document.getElementById('sort-select');
  const resultsCountEl = document.getElementById('results-count');
  const resetFiltersBtnEl = document.getElementById('reset-filters-btn');

  /**
   * Initialize Category Pills with counts
   */
  function initCategoryPills() {
    if (!categoryPillsContainerEl || !window.ArcadeData) return;

    const categories = window.ArcadeData.getCategories();
    const allGames = window.ArcadeData.games;

    categoryPillsContainerEl.innerHTML = '';

    categories.forEach(cat => {
      const button = document.createElement('button');
      button.className = `cat-pill ${cat === currentCategory ? 'active' : ''}`;
      button.setAttribute('data-category', cat);
      button.setAttribute('type', 'button');

      // Calculate count
      const count = (cat === 'Semua Game' || cat === 'All Games')
        ? allGames.length 
        : allGames.filter(g => (g.eduCategory && g.eduCategory.toLowerCase() === cat.toLowerCase()) || (g.category && g.category.toLowerCase() === cat.toLowerCase())).length;

      // Icon for educational category
      let iconClass = 'gamepad-2';
      if (cat === 'Logika') iconClass = 'brain';
      if (cat === 'Matematika') iconClass = 'binary';
      if (cat === 'Bahasa') iconClass = 'book-open';
      if (cat === 'Sains & Refleks') iconClass = 'zap';

      button.innerHTML = `
        <i data-lucide="${iconClass}"></i>
        <span>${cat}</span>
        <span class="cat-count" style="padding: 2px 7px; background: rgba(0,0,0,0.4); border-radius: 999px; font-size: 0.72rem; font-family: var(--font-mono);">${count}</span>
      `;

      button.addEventListener('click', () => {
        setCategory(cat);
        if (window.ArcadeUI && window.ArcadeUI.playSfx) {
          window.ArcadeUI.playSfx('click');
        }
      });

      categoryPillsContainerEl.appendChild(button);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /**
   * Filter and Sort games based on current state
   */
  function getFilteredGames() {
    if (!window.ArcadeData) return [];

    let list = [...window.ArcadeData.games];

    // 1. Category Filter (Matching eduCategory or category)
    if (currentCategory && currentCategory !== 'Semua Game' && currentCategory !== 'All Games') {
      const catLower = currentCategory.toLowerCase();
      list = list.filter(game => {
        return (
          (game.eduCategory && game.eduCategory.toLowerCase() === catLower) ||
          (game.category && game.category.toLowerCase() === catLower)
        );
      });
    }

    // 2. Search Query Filter
    if (currentSearchQuery.trim()) {
      const query = currentSearchQuery.toLowerCase().trim();
      list = list.filter(game => {
        return (
          game.title.toLowerCase().includes(query) ||
          (game.eduCategory && game.eduCategory.toLowerCase().includes(query)) ||
          (game.eduFocus && game.eduFocus.toLowerCase().includes(query)) ||
          game.category.toLowerCase().includes(query) ||
          game.description.toLowerCase().includes(query) ||
          (game.slot && game.slot.toLowerCase().includes(query)) ||
          (game.badge && game.badge.toLowerCase().includes(query))
        );
      });
    }

    // 3. Sorting
    switch (currentSort) {
      case 'az':
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'plays':
        list.sort((a, b) => {
          const valA = parseFloat(a.plays) * (a.plays.includes('K') ? 1000 : 1);
          const valB = parseFloat(b.plays) * (b.plays.includes('K') ? 1000 : 1);
          return valB - valA;
        });
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
        break;
    }

    return list;
  }

  /**
   * Render Game Cards into the DOM with PS2 Memory Card Styling
   */
  function renderGames() {
    if (!gamesGridEl) return;

    const filteredGames = getFilteredGames();
    const totalGames = window.ArcadeData ? window.ArcadeData.games.length : 20;

    // Update Results Counter
    if (resultsCountEl) {
      resultsCountEl.textContent = `Menampilkan ${filteredGames.length} dari ${totalGames} game (Memory Card 8MB)`;
    }

    // Handle Empty State
    if (filteredGames.length === 0) {
      gamesGridEl.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 70px 20px; background: var(--bg-card); border: 1px dashed var(--border-subtle); border-radius: var(--radius-xl);">
          <div style="font-size: 2.8rem; color: var(--ps2-cyan); margin-bottom: 14px;"><i data-lucide="help-circle"></i></div>
          <h3 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 8px;">Data Game Tidak Ditemukan</h3>
          <p style="color: var(--text-secondary); max-width: 440px; margin: 0 auto 20px;">
            Tidak ada game yang cocok dengan pencarian "<strong>${escapeHtml(currentSearchQuery)}</strong>" dalam kategori <em>${escapeHtml(currentCategory)}</em>.
          </p>
          <button type="button" class="btn btn-primary" id="empty-reset-btn">
            <i data-lucide="rotate-ccw"></i> Reset Filter
          </button>
        </div>
      `;

      const emptyResetBtn = document.getElementById('empty-reset-btn');
      if (emptyResetBtn) {
        emptyResetBtn.addEventListener('click', resetFilters);
      }

      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // Render 20 PS2 Memory Card Tiles
    gamesGridEl.innerHTML = filteredGames.map((game, index) => {
      const slotName = game.slot || `SLOT ${index + 1 < 10 ? '0' + (index + 1) : index + 1}`;
      const memorySize = game.size || '96 KB';
      const statusText = game.status || 'Fase 2: Interactive';
      const eduCategory = game.eduCategory || game.category;

      return `
        <article class="game-card" data-game-id="${game.id}" style="animation: fadeIn 0.35s ease ${index * 0.03}s forwards;">
          <!-- PS2 Memory Card Slot Banner -->
          <div class="card-slot-bar">
            <span>${slotName} // MEMORY DATA</span>
            <span>${memorySize}</span>
          </div>

          <!-- Card Thumbnail Area -->
          <div class="game-thumb-wrapper">
            <img 
              src="${game.image}" 
              alt="${escapeHtml(game.title)} icon" 
              class="game-thumb-img" 
              loading="lazy" 
              onerror="this.src='assets/icons/logo.svg'"
            />
            <div class="card-badges">
              <span class="category-tag">${escapeHtml(eduCategory)}</span>
              <span class="status-pill">
                <span class="status-dot"></span>
                ${statusText}
              </span>
            </div>
          </div>

          <!-- Card Content Area -->
          <div class="game-content">
            <h3 class="game-title">${escapeHtml(game.title)}</h3>
            <div class="game-edu-focus">
              <i data-lucide="sparkles" style="width: 12px; height: 12px; display: inline-block;"></i>
              ${escapeHtml(game.eduFocus || game.badge || 'Edukasi & Refleks')}
            </div>
            <p class="game-desc">${escapeHtml(game.description)}</p>

            <!-- Card Action Footer -->
            <div class="game-card-footer">
              <span style="font-family: var(--font-mono); font-size: 0.74rem; color: #fbbf24; display: flex; align-items: center; gap: 4px;">
                <i data-lucide="star" style="width: 12px; height: 12px; fill: currentColor;"></i>
                ${game.rating.toFixed(1)} ★
              </span>
              <button 
                type="button" 
                class="btn-play launch-game-btn" 
                data-game-id="${game.id}" 
                aria-label="Play ${escapeHtml(game.title)}"
              >
                <span>Mainkan</span>
                <i data-lucide="play" style="width: 14px; height: 14px;"></i>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Attach Event Listeners to Play buttons
    const playButtons = gamesGridEl.querySelectorAll('.launch-game-btn');
    playButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const gameId = btn.getAttribute('data-game-id');
        if (window.ArcadeUI && window.ArcadeUI.openGamePreview) {
          window.ArcadeUI.openGamePreview(gameId);
        } else {
          window.location.href = `games/placeholder.html?id=${encodeURIComponent(gameId)}`;
        }
      });
    });

    // Clicking anywhere on the card opens preview / launch
    const cards = gamesGridEl.querySelectorAll('.game-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const gameId = card.getAttribute('data-game-id');
        if (window.ArcadeUI && window.ArcadeUI.openGamePreview) {
          window.ArcadeUI.openGamePreview(gameId);
        }
      });
    });
  }

  function setCategory(category) {
    currentCategory = category;

    if (categoryPillsContainerEl) {
      const pills = categoryPillsContainerEl.querySelectorAll('.cat-pill');
      pills.forEach(pill => {
        if (pill.getAttribute('data-category') === category) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });
    }

    renderGames();
  }

  function resetFilters() {
    currentSearchQuery = '';
    currentCategory = 'Semua Game';
    currentSort = 'featured';

    if (searchInputEl) searchInputEl.value = '';
    if (searchClearBtnEl) searchClearBtnEl.classList.remove('visible');
    if (sortSelectEl) sortSelectEl.value = 'featured';

    initCategoryPills();
    renderGames();

    if (window.ArcadeUI && window.ArcadeUI.playSfx) {
      window.ArcadeUI.playSfx('boop');
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function bindEvents() {
    if (searchInputEl) {
      searchInputEl.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        if (searchClearBtnEl) {
          if (currentSearchQuery.length > 0) {
            searchClearBtnEl.classList.add('visible');
          } else {
            searchClearBtnEl.classList.remove('visible');
          }
        }
        renderGames();
      });
    }

    if (searchClearBtnEl) {
      searchClearBtnEl.addEventListener('click', () => {
        currentSearchQuery = '';
        if (searchInputEl) {
          searchInputEl.value = '';
          searchInputEl.focus();
        }
        searchClearBtnEl.classList.remove('visible');
        renderGames();
      });
    }

    if (sortSelectEl) {
      sortSelectEl.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderGames();
      });
    }

    if (resetFiltersBtnEl) {
      resetFiltersBtnEl.addEventListener('click', resetFilters);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInputEl) {
        e.preventDefault();
        if (searchInputEl) {
          searchInputEl.focus();
          searchInputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCategoryPills();
    renderGames();
    bindEvents();
  });

  window.ArcadeSearch = {
    setCategory,
    resetFilters,
    renderGames
  };
})();
