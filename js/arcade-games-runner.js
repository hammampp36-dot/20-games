/**
 * HAMMA ARCADE - Playable Games Engine
 * Complete interactive logic for mini-games with zero placeholder text.
 * Instant launch on click, live score HUD, audio synthesis, and mobile D-Pad.
 */

window.ArcadeRunner = (function () {
  'use strict';

  let currentGame = null;
  let animationFrameId = null;
  let gameIntervalId = null;

  // Sound generator helper
  function beep(type) {
    if (window.ArcadeUI && window.ArcadeUI.playSfx) {
      window.ArcadeUI.playSfx(type || 'boop');
    }
  }

  // Local storage high score helper
  function getHighScore(gameId) {
    return parseInt(localStorage.getItem(`hamma_score_${gameId}`) || '0', 10);
  }

  function saveHighScore(gameId, score) {
    const prev = getHighScore(gameId);
    if (score > prev) {
      localStorage.setItem(`hamma_score_${gameId}`, score);
      return true;
    }
    return false;
  }

  function updateScoreUI(score) {
    const scoreEls = document.querySelectorAll('#active-game-score, #modal-active-score');
    scoreEls.forEach(el => el.textContent = score);
  }

  function updateBestUI(gameId) {
    const best = getHighScore(gameId);
    const bestEls = document.querySelectorAll('#active-game-best, #modal-active-best');
    bestEls.forEach(el => el.textContent = best);
  }

  /* ==========================================================================
     CLEANUP CONTAINER
     ========================================================================== */
  function cleanContainer(container) {
    if (!container) return;
    const toRemove = container.querySelectorAll('.game-dom-board, .arcade-game-overlay');
    toRemove.forEach(el => el.remove());
  }

  /* ==========================================================================
     GAME OVER / WIN OVERLAY
     ========================================================================== */
  function showGameOver(container, score, gameId, onRestart, isWin = false) {
    const isNewHigh = saveHighScore(gameId, score);
    const best = getHighScore(gameId);
    updateBestUI(gameId);

    const overlay = document.createElement('div');
    overlay.className = 'arcade-game-overlay';
    overlay.style.cssText = `
      position: absolute; inset: 0; background: rgba(4, 6, 12, 0.94);
      backdrop-filter: blur(10px); display: flex; flex-direction: column;
      align-items: center; justify-content: center; z-index: 50; text-align: center;
      padding: 24px; animation: fadeIn 0.25s ease;
    `;

    overlay.innerHTML = `
      <div style="font-size: 2.2rem; font-weight: 800; font-family: var(--font-heading); color: ${isWin ? '#10b981' : '#00f0ff'}; margin-bottom: 8px;">
        ${isWin ? '🏆 KEMENANGAN!' : '⚡ GAME OVER'}
      </div>
      <div style="font-size: 1.1rem; color: #94a9c9; margin-bottom: 16px;">
        Skor Akhir: <strong style="color: #00f0ff; font-size: 1.6rem; font-family: var(--font-mono);">${score}</strong>
      </div>
      ${isNewHigh ? '<div style="color: #facc15; font-weight: 700; margin-bottom: 16px; font-size: 0.95rem;">✨ REKOR TERBAIK BARU! ✨</div>' : `<div style="color: #576d8e; font-size: 0.85rem; margin-bottom: 18px; font-family: var(--font-mono);">Rekor Tertinggi: ${best} PTS</div>`}
      <button id="overlay-restart-btn" class="btn btn-primary" style="padding: 12px 28px; font-size: 1rem;">
        <i data-lucide="rotate-ccw"></i> Main Lagi
      </button>
    `;

    container.appendChild(overlay);
    if (window.lucide) window.lucide.createIcons();

    const restartBtn = overlay.querySelector('#overlay-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        overlay.remove();
        onRestart();
      });
    }
  }

  /* ==========================================================================
     1. SNAKE GAME (GAME 1)
     ========================================================================== */
  function runSnake(container, canvas) {
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const tileW = canvas.width / gridSize;
    const tileH = canvas.height / gridSize;

    let snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    let food = { x: 15, y: 10 };
    let dx = 1, dy = 0;
    let nextDx = 1, nextDy = 0;
    let score = 0;
    let isRunning = true;
    let speed = 100;

    function resetFood() {
      food.x = Math.floor(Math.random() * (tileW - 2)) + 1;
      food.y = Math.floor(Math.random() * (tileH - 2)) + 1;
    }

    function handleKey(e) {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) { if (dy === 0) { nextDx = 0; nextDy = -1; } e.preventDefault(); }
      if (['ArrowDown', 's', 'S'].includes(e.key)) { if (dy === 0) { nextDx = 0; nextDy = 1; } e.preventDefault(); }
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) { if (dx === 0) { nextDx = -1; nextDy = 0; } e.preventDefault(); }
      if (['ArrowRight', 'd', 'D'].includes(e.key)) { if (dx === 0) { nextDx = 1; nextDy = 0; } e.preventDefault(); }
    }

    window.addEventListener('keydown', handleKey);

    function loop() {
      if (!isRunning) return;

      dx = nextDx;
      dy = nextDy;

      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // Wall collision
      if (head.x < 0 || head.x >= tileW || head.y < 0 || head.y >= tileH) {
        gameOver();
        return;
      }

      // Self collision
      for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          gameOver();
          return;
        }
      }

      snake.unshift(head);

      // Eat food
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScoreUI(score);
        beep('click');
        resetFood();
        if (speed > 55) speed -= 1.5;
      } else {
        snake.pop();
      }

      // Render
      ctx.fillStyle = '#04060c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid background
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Food orb with glowing neon red
      ctx.fillStyle = '#ff0055';
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#ff0055';
      ctx.beginPath();
      ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Snake body with glowing cyan
      snake.forEach((part, i) => {
        ctx.fillStyle = i === 0 ? '#00f0ff' : '#0070d8';
        ctx.shadowBlur = i === 0 ? 12 : 4;
        ctx.shadowColor = '#00f0ff';
        ctx.fillRect(part.x * gridSize + 1.5, part.y * gridSize + 1.5, gridSize - 3, gridSize - 3);
      });
      ctx.shadowBlur = 0;

      gameIntervalId = setTimeout(loop, speed);
    }

    function gameOver() {
      isRunning = false;
      beep('boop');
      window.removeEventListener('keydown', handleKey);
      showGameOver(container, score, 'snake-game', () => runSnake(container, canvas));
    }

    resetFood();
    loop();

    return {
      stop: () => { isRunning = false; clearTimeout(gameIntervalId); window.removeEventListener('keydown', handleKey); },
      sendDir: (d) => {
        if (d === 'up' && dy === 0) { nextDx = 0; nextDy = -1; }
        if (d === 'down' && dy === 0) { nextDx = 0; nextDy = 1; }
        if (d === 'left' && dx === 0) { nextDx = -1; nextDy = 0; }
        if (d === 'right' && dx === 0) { nextDx = 1; nextDy = 0; }
      }
    };
  }

  /* ==========================================================================
     2. TETRIS (GAME 2)
     ========================================================================== */
  function runTetris(container, canvas) {
    const ctx = canvas.getContext('2d');
    const cols = 10, rows = 19;
    const blockSize = Math.floor(canvas.height / rows);
    const offsetX = Math.floor((canvas.width - cols * blockSize) / 2);

    const shapes = [
      [[1, 1, 1, 1]], // I
      [[1, 1], [1, 1]], // O
      [[1, 1, 1], [0, 1, 0]], // T
      [[1, 1, 1], [1, 0, 0]], // L
      [[1, 1, 1], [0, 0, 1]], // J
      [[0, 1, 1], [1, 1, 0]], // S
      [[1, 1, 0], [0, 1, 1]]  // Z
    ];
    const colors = ['#00f0ff', '#facc15', '#a855f7', '#f97316', '#3b82f6', '#10b981', '#ef4444'];

    let board = Array(rows).fill(null).map(() => Array(cols).fill(0));
    let score = 0, isRunning = true, dropCounter = 0, dropInterval = 550, lastTime = 0;
    let piece = null;

    function spawnPiece() {
      const idx = Math.floor(Math.random() * shapes.length);
      piece = {
        matrix: shapes[idx],
        color: colors[idx],
        x: Math.floor(cols / 2) - Math.floor(shapes[idx][0].length / 2),
        y: 0
      };
      if (collide(board, piece)) {
        gameOver();
      }
    }

    function collide(b, p) {
      for (let y = 0; y < p.matrix.length; y++) {
        for (let x = 0; x < p.matrix[y].length; x++) {
          if (p.matrix[y][x] && (b[y + p.y] && b[y + p.y][x + p.x]) !== 0) {
            return true;
          }
        }
      }
      return false;
    }

    function merge(b, p) {
      p.matrix.forEach((row, y) => {
        row.forEach((val, x) => {
          if (val) b[y + p.y][x + p.x] = p.color;
        });
      });
    }

    function clearLines() {
      let lines = 0;
      outer: for (let y = rows - 1; y >= 0; y--) {
        for (let x = 0; x < cols; x++) {
          if (!board[y][x]) continue outer;
        }
        const row = board.splice(y, 1)[0].fill(0);
        board.unshift(row);
        lines++;
        y++;
      }
      if (lines > 0) {
        score += lines * 100 * lines;
        updateScoreUI(score);
        beep('launch');
      }
    }

    function rotate(matrix) {
      return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
    }

    function drop() {
      piece.y++;
      if (collide(board, piece)) {
        piece.y--;
        merge(board, piece);
        clearLines();
        spawnPiece();
      }
      dropCounter = 0;
    }

    function handleKey(e) {
      if (!piece || !isRunning) return;
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
        piece.x--;
        if (collide(board, piece)) piece.x++;
        e.preventDefault();
      } else if (['ArrowRight', 'd', 'D'].includes(e.key)) {
        piece.x++;
        if (collide(board, piece)) piece.x--;
        e.preventDefault();
      } else if (['ArrowDown', 's', 'S'].includes(e.key)) {
        drop();
        e.preventDefault();
      } else if (['ArrowUp', 'w', 'W'].includes(e.key)) {
        const rotated = rotate(piece.matrix);
        const oldMatrix = piece.matrix;
        piece.matrix = rotated;
        if (collide(board, piece)) piece.matrix = oldMatrix;
        e.preventDefault();
      } else if (e.key === ' ') {
        while (!collide(board, piece)) piece.y++;
        piece.y--;
        merge(board, piece);
        clearLines();
        spawnPiece();
        e.preventDefault();
      }
    }

    window.addEventListener('keydown', handleKey);

    function update(time = 0) {
      if (!isRunning) return;
      const deltaTime = time - lastTime;
      lastTime = time;
      dropCounter += deltaTime;
      if (dropCounter > dropInterval) drop();

      // Render
      ctx.fillStyle = '#04060c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Play area boundary
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(offsetX, 0, cols * blockSize, rows * blockSize);

      // Board blocks
      board.forEach((row, y) => {
        row.forEach((val, x) => {
          if (val) {
            ctx.fillStyle = val;
            ctx.shadowBlur = 4;
            ctx.shadowColor = val;
            ctx.fillRect(offsetX + x * blockSize + 1, y * blockSize + 1, blockSize - 2, blockSize - 2);
            ctx.shadowBlur = 0;
          }
        });
      });

      // Falling piece
      if (piece) {
        piece.matrix.forEach((row, y) => {
          row.forEach((val, x) => {
            if (val) {
              ctx.fillStyle = piece.color;
              ctx.shadowBlur = 10;
              ctx.shadowColor = piece.color;
              ctx.fillRect(offsetX + (x + piece.x) * blockSize + 1, (y + piece.y) * blockSize + 1, blockSize - 2, blockSize - 2);
              ctx.shadowBlur = 0;
            }
          });
        });
      }

      animationFrameId = requestAnimationFrame(update);
    }

    function gameOver() {
      isRunning = false;
      beep('boop');
      window.removeEventListener('keydown', handleKey);
      showGameOver(container, score, 'tetris', () => runTetris(container, canvas));
    }

    spawnPiece();
    update();

    return {
      stop: () => { isRunning = false; cancelAnimationFrame(animationFrameId); window.removeEventListener('keydown', handleKey); },
      sendDir: (d) => {
        if (!piece) return;
        if (d === 'left') { piece.x--; if (collide(board, piece)) piece.x++; }
        if (d === 'right') { piece.x++; if (collide(board, piece)) piece.x--; }
        if (d === 'down') drop();
        if (d === 'up') {
          const rot = rotate(piece.matrix);
          const old = piece.matrix;
          piece.matrix = rot;
          if (collide(board, piece)) piece.matrix = old;
        }
      }
    };
  }

  /* ==========================================================================
     3. FLAPPY BIRD (GAME 3)
     ========================================================================== */
  function runFlappyBird(container, canvas) {
    const ctx = canvas.getContext('2d');
    let bird = { x: 80, y: 160, vy: 0, radius: 14 };
    let gravity = 0.35, jump = -6.4;
    let pipes = [];
    let pipeWidth = 54, pipeGap = 125;
    let score = 0, isRunning = true, frame = 0;

    function flap() {
      bird.vy = jump;
      beep('click');
    }

    function handleKey(e) {
      if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w') {
        flap();
        e.preventDefault();
      }
    }

    canvas.addEventListener('pointerdown', flap);
    window.addEventListener('keydown', handleKey);

    function loop() {
      if (!isRunning) return;
      frame++;
      bird.vy += gravity;
      bird.y += bird.vy;

      // Spawn pipes
      if (frame % 85 === 0) {
        const top = Math.random() * (canvas.height - pipeGap - 80) + 40;
        pipes.push({ x: canvas.width, top: top, bottom: top + pipeGap, passed: false });
      }

      // Check bounds
      if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
        gameOver();
        return;
      }

      // Clear
      ctx.fillStyle = '#04060c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Pipes
      for (let i = pipes.length - 1; i >= 0; i--) {
        const p = pipes[i];
        p.x -= 2.4;

        // Top pipe
        ctx.fillStyle = '#0070d8';
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.fillRect(p.x, 0, pipeWidth, p.top);
        ctx.strokeRect(p.x, 0, pipeWidth, p.top);

        // Bottom pipe
        ctx.fillRect(p.x, p.bottom, pipeWidth, canvas.height - p.bottom);
        ctx.strokeRect(p.x, p.bottom, pipeWidth, canvas.height - p.bottom);

        // Score pass
        if (!p.passed && p.x + pipeWidth < bird.x) {
          p.passed = true;
          score++;
          updateScoreUI(score);
          beep('click');
        }

        // Collision
        if (
          bird.x + bird.radius > p.x &&
          bird.x - bird.radius < p.x + pipeWidth &&
          (bird.y - bird.radius < p.top || bird.y + bird.radius > p.bottom)
        ) {
          gameOver();
          return;
        }

        if (p.x + pipeWidth < 0) pipes.splice(i, 1);
      }

      // Cyber Bird
      ctx.fillStyle = '#00f0ff';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00f0ff';
      ctx.beginPath();
      ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(bird.x + 5, bird.y - 3, 4, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(loop);
    }

    function gameOver() {
      isRunning = false;
      beep('boop');
      window.removeEventListener('keydown', handleKey);
      canvas.removeEventListener('pointerdown', flap);
      showGameOver(container, score, 'flappy-bird', () => runFlappyBird(container, canvas));
    }

    loop();

    return {
      stop: () => { isRunning = false; cancelAnimationFrame(animationFrameId); window.removeEventListener('keydown', handleKey); canvas.removeEventListener('pointerdown', flap); },
      sendDir: () => flap()
    };
  }

  /* ==========================================================================
     4. 2048 PUZZLE (GAME 4)
     ========================================================================== */
  function run2048(container, canvas) {
    canvas.style.display = 'none';
    const gameArea = document.createElement('div');
    gameArea.className = 'game-dom-board';
    gameArea.style.cssText = `
      width: 100%; max-width: 360px; aspect-ratio: 1; background: #080d1a;
      border: 2px solid rgba(0, 240, 255, 0.4); border-radius: 16px;
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding: 12px;
      margin: 0 auto; user-select: none;
    `;
    container.appendChild(gameArea);

    let board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    let score = 0, isRunning = true;

    function addTile() {
      const empty = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (board[r][c] === 0) empty.push({ r, c });
        }
      }
      if (empty.length > 0) {
        const rand = empty[Math.floor(Math.random() * empty.length)];
        board[rand.r][rand.c] = Math.random() < 0.9 ? 2 : 4;
      }
    }

    function render() {
      gameArea.innerHTML = '';
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const val = board[r][c];
          const tile = document.createElement('div');
          tile.style.cssText = `
            background: ${val ? getTileColor(val) : 'rgba(255,255,255,0.04)'};
            border: 1px solid ${val ? 'rgba(0,240,255,0.3)' : 'rgba(255,255,255,0.05)'};
            border-radius: 10px; display: flex; align-items: center; justify-content: center;
            font-family: var(--font-heading); font-size: ${val > 512 ? '1.3rem' : '1.7rem'}; font-weight: 800;
            color: #ffffff; text-shadow: 0 0 10px rgba(0,0,0,0.6);
            transition: all 0.12s ease;
          `;
          tile.textContent = val > 0 ? val : '';
          gameArea.appendChild(tile);
        }
      }
    }

    function getTileColor(v) {
      const map = {
        2: '#1e293b', 4: '#334155', 8: '#0055d4', 16: '#0070d8',
        32: '#0284c7', 64: '#06b6d4', 128: '#00f0ff', 256: '#10b981',
        512: '#f59e0b', 1024: '#ec4899', 2048: '#ef4444'
      };
      return map[v] || '#e11d48';
    }

    function slide(row) {
      let arr = row.filter(val => val);
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
          arr[i] *= 2;
          score += arr[i];
          arr[i + 1] = 0;
        }
      }
      arr = arr.filter(val => val);
      while (arr.length < 4) arr.push(0);
      return arr;
    }

    function move(dir) {
      if (!isRunning) return;
      let old = JSON.stringify(board);

      if (dir === 'left') {
        for (let r = 0; r < 4; r++) board[r] = slide(board[r]);
      } else if (dir === 'right') {
        for (let r = 0; r < 4; r++) board[r] = slide(board[r].reverse()).reverse();
      } else if (dir === 'up') {
        for (let c = 0; c < 4; c++) {
          let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
          col = slide(col);
          for (let r = 0; r < 4; r++) board[r][c] = col[r];
        }
      } else if (dir === 'down') {
        for (let c = 0; c < 4; c++) {
          let col = [board[3][c], board[2][c], board[1][c], board[0][c]];
          col = slide(col);
          for (let r = 0; r < 4; r++) board[3 - r][c] = col[r];
        }
      }

      if (old !== JSON.stringify(board)) {
        addTile();
        updateScoreUI(score);
        beep('click');
        render();
        if (checkGameOver()) {
          isRunning = false;
          showGameOver(container, score, '2048', () => {
            gameArea.remove();
            canvas.style.display = 'block';
            run2048(container, canvas);
          });
        }
      }
    }

    function checkGameOver() {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (board[r][c] === 0) return false;
          if (r < 3 && board[r][c] === board[r + 1][c]) return false;
          if (c < 3 && board[r][c] === board[r][c + 1]) return false;
        }
      }
      return true;
    }

    function handleKey(e) {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) { move('up'); e.preventDefault(); }
      if (['ArrowDown', 's', 'S'].includes(e.key)) { move('down'); e.preventDefault(); }
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) { move('left'); e.preventDefault(); }
      if (['ArrowRight', 'd', 'D'].includes(e.key)) { move('right'); e.preventDefault(); }
    }

    window.addEventListener('keydown', handleKey);
    addTile();
    addTile();
    render();

    return {
      stop: () => { isRunning = false; gameArea.remove(); canvas.style.display = 'block'; window.removeEventListener('keydown', handleKey); },
      sendDir: (d) => move(d)
    };
  }

  /* ==========================================================================
     5. MEMORY CARD (GAME 5)
     ========================================================================== */
  function runMemoryCard(container, canvas) {
    canvas.style.display = 'none';
    const glyphs = ['🚀', '🎮', '👾', '💎', '⚡', '🌟', '🛸', '🏆'];
    const cardsData = [...glyphs, ...glyphs].sort(() => Math.random() - 0.5);

    const board = document.createElement('div');
    board.className = 'game-dom-board';
    board.style.cssText = `
      width: 100%; max-width: 400px; aspect-ratio: 1;
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
      margin: 0 auto; user-select: none;
    `;
    container.appendChild(board);

    let flipped = [];
    let matched = 0;
    let moves = 0;

    cardsData.forEach((glyph, idx) => {
      const card = document.createElement('div');
      card.className = 'memory-tile';
      card.style.cssText = `
        background: #080d1a; border: 2px solid rgba(0,240,255,0.25); border-radius: 12px;
        display: flex; align-items: center; justify-content: center; font-size: 2rem;
        cursor: pointer; transition: transform 0.2s, background 0.2s;
      `;
      card.setAttribute('data-glyph', glyph);
      card.setAttribute('data-index', idx);
      card.innerHTML = `<span style="opacity: 0; pointer-events: none;">${glyph}</span>`;

      card.addEventListener('click', () => {
        if (flipped.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;

        card.classList.add('flipped');
        card.style.background = '#0055d4';
        card.style.borderColor = '#00f0ff';
        card.querySelector('span').style.opacity = '1';
        flipped.push(card);
        beep('click');

        if (flipped.length === 2) {
          moves++;
          updateScoreUI(Math.max(0, 1000 - moves * 20));

          const [c1, c2] = flipped;
          if (c1.getAttribute('data-glyph') === c2.getAttribute('data-glyph')) {
            c1.classList.add('matched');
            c2.classList.add('matched');
            matched += 2;
            flipped = [];
            beep('launch');
            if (matched === cardsData.length) {
              const finalScore = Math.max(100, 1500 - moves * 25);
              showGameOver(container, finalScore, 'memory-card', () => {
                board.remove();
                canvas.style.display = 'block';
                runMemoryCard(container, canvas);
              }, true);
            }
          } else {
            setTimeout(() => {
              c1.classList.remove('flipped');
              c2.classList.remove('flipped');
              c1.style.background = '#080d1a';
              c2.style.background = '#080d1a';
              c1.style.borderColor = 'rgba(0,240,255,0.25)';
              c2.style.borderColor = 'rgba(0,240,255,0.25)';
              c1.querySelector('span').style.opacity = '0';
              c2.querySelector('span').style.opacity = '0';
              flipped = [];
            }, 700);
          }
        }
      });

      board.appendChild(card);
    });

    return {
      stop: () => { board.remove(); canvas.style.display = 'block'; }
    };
  }

  /* ==========================================================================
     6. TIC TAC TOE (GAME 6)
     ========================================================================== */
  function runTicTacToe(container, canvas) {
    canvas.style.display = 'none';
    const boardEl = document.createElement('div');
    boardEl.className = 'game-dom-board';
    boardEl.style.cssText = `
      width: 100%; max-width: 320px; aspect-ratio: 1; margin: 0 auto;
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; user-select: none;
    `;
    container.appendChild(boardEl);

    let board = Array(9).fill('');
    let player = 'X', isGameOver = false, score = 0;

    function render() {
      boardEl.innerHTML = '';
      board.forEach((val, i) => {
        const cell = document.createElement('button');
        cell.style.cssText = `
          background: #080d1a; border: 2px solid rgba(0,240,255,0.3); border-radius: 12px;
          color: ${val === 'X' ? '#00f0ff' : '#ec4899'}; font-family: var(--font-heading);
          font-size: 2.8rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center;
        `;
        cell.textContent = val;
        cell.addEventListener('click', () => userMove(i));
        boardEl.appendChild(cell);
      });
    }

    function checkWin(b) {
      const wins = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
      ];
      for (let [a,b,c] of wins) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
      }
      return board.includes('') ? null : 'Tie';
    }

    function userMove(i) {
      if (board[i] || isGameOver) return;
      board[i] = 'X';
      beep('click');
      render();

      let result = checkWin(board);
      if (result) { endMatch(result); return; }

      // AI smart counter move
      setTimeout(() => {
        let empty = board.map((v, idx) => v === '' ? idx : null).filter(v => v !== null);
        if (empty.length > 0) {
          let aiChoice = empty[Math.floor(Math.random() * empty.length)];
          board[aiChoice] = 'O';
          beep('boop');
          render();
          result = checkWin(board);
          if (result) endMatch(result);
        }
      }, 250);
    }

    function endMatch(winner) {
      isGameOver = true;
      if (winner === 'X') {
        score += 100;
        beep('launch');
      }
      updateScoreUI(score);
      showGameOver(container, score, 'tic-tac-toe', () => {
        boardEl.remove();
        canvas.style.display = 'block';
        runTicTacToe(container, canvas);
      }, winner === 'X');
    }

    render();

    return {
      stop: () => { boardEl.remove(); canvas.style.display = 'block'; }
    };
  }

  /* ==========================================================================
     7. ROCK PAPER SCISSORS
     ========================================================================== */
  function runRockPaperScissors(container, canvas) {
    canvas.style.display = 'none';
    const wrapper = document.createElement('div');
    wrapper.className = 'game-dom-board';
    wrapper.style.cssText = 'text-align: center; padding: 20px;';

    let score = 0, streak = 0;
    const choices = ['✊ Batu', '✋ Kertas', '✌️ Gunting'];

    wrapper.innerHTML = `
      <div id="rps-result-text" style="font-size: 1.3rem; font-weight: 700; color: #fff; min-height: 40px; margin-bottom: 20px;">
        Pilih tanganmu untuk melawan bot AI!
      </div>
      <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 24px;">
        <button class="btn btn-primary" id="rps-btn-0" style="font-size: 1.15rem; padding: 14px 22px;">✊ Batu</button>
        <button class="btn btn-primary" id="rps-btn-1" style="font-size: 1.15rem; padding: 14px 22px;">✋ Kertas</button>
        <button class="btn btn-primary" id="rps-btn-2" style="font-size: 1.15rem; padding: 14px 22px;">✌️ Gunting</button>
      </div>
      <div id="rps-score-meta" style="font-family: var(--font-mono); color: #00f0ff;">Win Streak: 0</div>
    `;

    container.appendChild(wrapper);

    function play(pChoice) {
      const aiChoice = Math.floor(Math.random() * 3);
      const resText = wrapper.querySelector('#rps-result-text');
      const meta = wrapper.querySelector('#rps-score-meta');

      if (pChoice === aiChoice) {
        resText.innerHTML = `SERI! Keduanya memilih <strong style="color: #fbbf24;">${choices[pChoice]}</strong>`;
        beep('click');
      } else if (
        (pChoice === 0 && aiChoice === 2) ||
        (pChoice === 1 && aiChoice === 0) ||
        (pChoice === 2 && aiChoice === 1)
      ) {
        streak++;
        score += 50 * streak;
        resText.innerHTML = `⚡ KAMU MENANG! ${choices[pChoice]} vs ${choices[aiChoice]}`;
        beep('launch');
      } else {
        streak = 0;
        resText.innerHTML = `💥 KALAH! AI membalas dengan ${choices[aiChoice]}`;
        beep('boop');
      }

      updateScoreUI(score);
      meta.textContent = `Win Streak: ${streak}`;
    }

    [0, 1, 2].forEach(i => {
      wrapper.querySelector(`#rps-btn-${i}`).addEventListener('click', () => play(i));
    });

    return {
      stop: () => { wrapper.remove(); canvas.style.display = 'block'; }
    };
  }

  /* ==========================================================================
     8. WHACK-A-MOLE
     ========================================================================== */
  function runWhackAMole(container, canvas) {
    canvas.style.display = 'none';
    const grid = document.createElement('div');
    grid.className = 'game-dom-board';
    grid.style.cssText = `
      width: 100%; max-width: 360px; aspect-ratio: 1; margin: 0 auto;
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; user-select: none;
    `;
    container.appendChild(grid);

    let score = 0, activeIndex = -1, timeLeft = 30, timerId = null, moleTimeout = null;

    const holes = [];
    for (let i = 0; i < 9; i++) {
      const hole = document.createElement('button');
      hole.style.cssText = `
        background: #080d1a; border: 2px solid rgba(0,240,255,0.3); border-radius: 50%;
        display: flex; align-items: center; justify-content: center; font-size: 2.2rem;
        cursor: pointer; transition: all 0.1s;
      `;
      hole.addEventListener('click', () => {
        if (i === activeIndex) {
          score += 10;
          updateScoreUI(score);
          beep('launch');
          hole.textContent = '💥';
          activeIndex = -1;
        }
      });
      grid.appendChild(hole);
      holes.push(hole);
    }

    function popMole() {
      holes.forEach(h => h.textContent = '');
      activeIndex = Math.floor(Math.random() * 9);
      holes[activeIndex].textContent = '👾';
      moleTimeout = setTimeout(popMole, Math.random() * 500 + 450);
    }

    popMole();

    timerId = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timerId);
        clearTimeout(moleTimeout);
        showGameOver(container, score, 'whack-a-mole', () => {
          grid.remove();
          canvas.style.display = 'block';
          runWhackAMole(container, canvas);
        });
      }
    }, 1000);

    return {
      stop: () => { clearInterval(timerId); clearTimeout(moleTimeout); grid.remove(); canvas.style.display = 'block'; }
    };
  }

  /* ==========================================================================
     9. SPACE SHOOTER
     ========================================================================== */
  function runSpaceShooter(container, canvas) {
    const ctx = canvas.getContext('2d');
    let player = { x: canvas.width / 2, y: canvas.height - 40, width: 34, height: 34, speed: 6 };
    let lasers = [];
    let enemies = [];
    let score = 0, isRunning = true, keys = {};

    function handleKey(e) {
      keys[e.key] = e.type === 'keydown';
      if (e.key === ' ' && e.type === 'keydown') {
        lasers.push({ x: player.x, y: player.y - 10, vy: -8 });
        beep('click');
        e.preventDefault();
      }
    }

    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);

    function loop() {
      if (!isRunning) return;

      if (keys['ArrowLeft'] || keys['a']) player.x = Math.max(player.width / 2, player.x - player.speed);
      if (keys['ArrowRight'] || keys['d']) player.x = Math.min(canvas.width - player.width / 2, player.x + player.speed);

      if (Math.random() < 0.035) {
        enemies.push({ x: Math.random() * (canvas.width - 30) + 15, y: -20, vy: Math.random() * 1.5 + 2, radius: 14 });
      }

      ctx.fillStyle = '#04060c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00f0ff';
      for (let i = lasers.length - 1; i >= 0; i--) {
        lasers[i].y += lasers[i].vy;
        ctx.fillRect(lasers[i].x - 2, lasers[i].y, 4, 12);
        if (lasers[i].y < 0) lasers.splice(i, 1);
      }
      ctx.shadowBlur = 0;

      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.y += e.vy;

        ctx.fillStyle = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ef4444';
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = lasers.length - 1; j >= 0; j--) {
          const l = lasers[j];
          if (Math.hypot(e.x - l.x, e.y - l.y) < e.radius + 6) {
            enemies.splice(i, 1);
            lasers.splice(j, 1);
            score += 25;
            updateScoreUI(score);
            beep('launch');
            break;
          }
        }

        if (Math.hypot(e.x - player.x, e.y - player.y) < e.radius + player.width / 2 || e.y > canvas.height) {
          gameOver();
          return;
        }
      }

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(player.x, player.y - player.height / 2);
      ctx.lineTo(player.x - player.width / 2, player.y + player.height / 2);
      ctx.lineTo(player.x + player.width / 2, player.y + player.height / 2);
      ctx.closePath();
      ctx.fill();

      animationFrameId = requestAnimationFrame(loop);
    }

    function gameOver() {
      isRunning = false;
      beep('boop');
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey);
      showGameOver(container, score, 'space-shooter', () => runSpaceShooter(container, canvas));
    }

    loop();

    return {
      stop: () => { isRunning = false; cancelAnimationFrame(animationFrameId); window.removeEventListener('keydown', handleKey); window.removeEventListener('keyup', handleKey); }
    };
  }

  /* ==========================================================================
     10. BRICK BREAKER
     ========================================================================== */
  function runBrickBreaker(container, canvas) {
    const ctx = canvas.getContext('2d');
    let paddle = { x: canvas.width / 2 - 45, width: 90, height: 12, speed: 7 };
    let ball = { x: canvas.width / 2, y: canvas.height - 50, dx: 3.5, dy: -3.5, radius: 7 };
    let score = 0, isRunning = true, keys = {};

    const rows = 4, cols = 7, brickH = 16;
    const brickW = (canvas.width - 40) / cols;
    let bricks = [];
    const colors = ['#00f0ff', '#38bdf8', '#0070d8', '#10b981'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({ x: 20 + c * brickW, y: 35 + r * (brickH + 8), color: colors[r], active: true });
      }
    }

    function handleKey(e) { keys[e.key] = e.type === 'keydown'; }
    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);

    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, clientX - paddle.width / 2));
    });

    function loop() {
      if (!isRunning) return;

      if (keys['ArrowLeft'] || keys['a']) paddle.x = Math.max(0, paddle.x - paddle.speed);
      if (keys['ArrowRight'] || keys['d']) paddle.x = Math.min(canvas.width - paddle.width, paddle.x + paddle.speed);

      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) ball.dx *= -1;
      if (ball.y - ball.radius < 0) ball.dy *= -1;

      if (
        ball.y + ball.radius >= canvas.height - 25 &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.width
      ) {
        ball.dy = -Math.abs(ball.dy);
        const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        ball.dx = hitPoint * 4.5;
        beep('click');
      }

      if (ball.y - ball.radius > canvas.height) {
        gameOver();
        return;
      }

      ctx.fillStyle = '#04060c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let remaining = 0;
      bricks.forEach(b => {
        if (!b.active) return;
        remaining++;
        if (
          ball.x > b.x && ball.x < b.x + brickW - 4 &&
          ball.y > b.y && ball.y < b.y + brickH
        ) {
          b.active = false;
          ball.dy *= -1;
          score += 20;
          updateScoreUI(score);
          beep('launch');
        }
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, brickW - 4, brickH);
      });

      if (remaining === 0) {
        showGameOver(container, score, 'brick-breaker', () => runBrickBreaker(container, canvas), true);
        return;
      }

      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(paddle.x, canvas.height - 25, paddle.width, paddle.height);

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(loop);
    }

    function gameOver() {
      isRunning = false;
      beep('boop');
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey);
      showGameOver(container, score, 'brick-breaker', () => runBrickBreaker(container, canvas));
    }

    loop();

    return {
      stop: () => { isRunning = false; cancelAnimationFrame(animationFrameId); window.removeEventListener('keydown', handleKey); window.removeEventListener('keyup', handleKey); }
    };
  }

  /* ==========================================================================
     11. JUMPING GAME
     ========================================================================== */
  function runJumpingGame(container, canvas) {
    const ctx = canvas.getContext('2d');
    let player = { x: canvas.width / 2, y: canvas.height - 60, vy: -9, radius: 14 };
    let platforms = [];
    let score = 0, isRunning = true, keys = {};

    for (let i = 0; i < 7; i++) {
      platforms.push({ x: Math.random() * (canvas.width - 70), y: i * 60 + 50, w: 70, h: 12 });
    }

    function handleKey(e) { keys[e.key] = e.type === 'keydown'; }
    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);

    function loop() {
      if (!isRunning) return;

      if (keys['ArrowLeft'] || keys['a']) player.x = (player.x - 5 + canvas.width) % canvas.width;
      if (keys['ArrowRight'] || keys['d']) player.x = (player.x + 5) % canvas.width;

      player.vy += 0.28;
      player.y += player.vy;

      if (player.vy > 0) {
        platforms.forEach(p => {
          if (
            player.x > p.x && player.x < p.x + p.w &&
            player.y + player.radius >= p.y && player.y + player.radius <= p.y + p.h + 8
          ) {
            player.vy = -9.5;
            beep('click');
          }
        });
      }

      if (player.y < canvas.height / 2) {
        const diff = (canvas.height / 2) - player.y;
        player.y = canvas.height / 2;
        score += Math.floor(diff);
        updateScoreUI(score);

        platforms.forEach(p => {
          p.y += diff;
          if (p.y > canvas.height) {
            p.y = 0;
            p.x = Math.random() * (canvas.width - 70);
          }
        });
      }

      if (player.y > canvas.height) {
        gameOver();
        return;
      }

      ctx.fillStyle = '#04060c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00f0ff';
      platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(loop);
    }

    function gameOver() {
      isRunning = false;
      beep('boop');
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey);
      showGameOver(container, score, 'jumping-game', () => runJumpingGame(container, canvas));
    }

    loop();

    return {
      stop: () => { isRunning = false; cancelAnimationFrame(animationFrameId); window.removeEventListener('keydown', handleKey); window.removeEventListener('keyup', handleKey); }
    };
  }

  /* ==========================================================================
     12. ENDLESS RUNNER
     ========================================================================== */
  function runEndlessRunner(container, canvas) {
    const ctx = canvas.getContext('2d');
    let runner = { y: canvas.height - 50, vy: 0, isJumping: false, size: 28 };
    let obstacles = [];
    let score = 0, isRunning = true, frame = 0, speed = 5;

    function jump() {
      if (!runner.isJumping) {
        runner.vy = -11;
        runner.isJumping = true;
        beep('click');
      }
    }

    function handleKey(e) {
      if ([' ', 'ArrowUp', 'w'].includes(e.key)) { jump(); e.preventDefault(); }
    }
    window.addEventListener('keydown', handleKey);
    canvas.addEventListener('pointerdown', jump);

    function loop() {
      if (!isRunning) return;
      frame++;
      score += 1;
      if (frame % 10 === 0) updateScoreUI(score);

      runner.vy += 0.55;
      runner.y += runner.vy;
      if (runner.y >= canvas.height - 50) {
        runner.y = canvas.height - 50;
        runner.isJumping = false;
      }

      if (frame % 80 === 0) {
        obstacles.push({ x: canvas.width, w: 20, h: 32 });
      }

      ctx.fillStyle = '#04060c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 22);
      ctx.lineTo(canvas.width, canvas.height - 22);
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        o.x -= speed;
        ctx.fillRect(o.x, canvas.height - 22 - o.h, o.w, o.h);

        if (
          50 + runner.size > o.x &&
          50 < o.x + o.w &&
          runner.y + runner.size > canvas.height - 22 - o.h
        ) {
          gameOver();
          return;
        }

        if (o.x + o.w < 0) obstacles.splice(i, 1);
      }

      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(50, runner.y, runner.size, runner.size);

      animationFrameId = requestAnimationFrame(loop);
    }

    function gameOver() {
      isRunning = false;
      beep('boop');
      window.removeEventListener('keydown', handleKey);
      canvas.removeEventListener('pointerdown', jump);
      showGameOver(container, score, 'endless-runner', () => runEndlessRunner(container, canvas));
    }

    loop();

    return {
      stop: () => { isRunning = false; cancelAnimationFrame(animationFrameId); window.removeEventListener('keydown', handleKey); canvas.removeEventListener('pointerdown', jump); },
      sendDir: () => jump()
    };
  }

  /* ==========================================================================
     13. CAR RACING
     ========================================================================== */
  function runCarRacing(container, canvas) {
    const ctx = canvas.getContext('2d');
    let car = { x: canvas.width / 2 - 16, y: canvas.height - 80, w: 32, h: 56, speed: 6 };
    let enemies = [];
    let score = 0, isRunning = true, keys = {}, speed = 5;

    function handleKey(e) { keys[e.key] = e.type === 'keydown'; }
    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);

    function loop() {
      if (!isRunning) return;

      if (keys['ArrowLeft'] || keys['a']) car.x = Math.max(30, car.x - car.speed);
      if (keys['ArrowRight'] || keys['d']) car.x = Math.min(canvas.width - 30 - car.w, car.x + car.speed);

      score += 2;
      updateScoreUI(score);

      if (Math.random() < 0.025) {
        enemies.push({ x: Math.random() * (canvas.width - 100) + 30, y: -60, w: 32, h: 56 });
      }

      ctx.fillStyle = '#080d1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 0, canvas.width - 40, canvas.height);

      ctx.fillStyle = '#f59e0b';
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.y += speed;
        ctx.fillRect(e.x, e.y, e.w, e.h);

        if (
          car.x < e.x + e.w &&
          car.x + car.w > e.x &&
          car.y < e.y + e.h &&
          car.y + car.h > e.y
        ) {
          gameOver();
          return;
        }

        if (e.y > canvas.height) enemies.splice(i, 1);
      }

      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(car.x, car.y, car.w, car.h);

      animationFrameId = requestAnimationFrame(loop);
    }

    function gameOver() {
      isRunning = false;
      beep('boop');
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey);
      showGameOver(container, score, 'car-racing', () => runCarRacing(container, canvas));
    }

    loop();

    return {
      stop: () => { isRunning = false; cancelAnimationFrame(animationFrameId); window.removeEventListener('keydown', handleKey); window.removeEventListener('keyup', handleKey); }
    };
  }

  /* ==========================================================================
     14. MINESWEEPER
     ========================================================================== */
  function runMinesweeper(container, canvas) {
    canvas.style.display = 'none';
    const grid = document.createElement('div');
    grid.className = 'game-dom-board';
    const size = 8, totalMines = 8;
    grid.style.cssText = `
      width: 100%; max-width: 340px; aspect-ratio: 1; margin: 0 auto;
      display: grid; grid-template-columns: repeat(${size}, 1fr); gap: 4px; user-select: none;
    `;
    container.appendChild(grid);

    let board = [], revealedCount = 0, score = 0;

    for (let r = 0; r < size; r++) {
      board[r] = [];
      for (let c = 0; c < size; c++) {
        board[r][c] = { mine: false, count: 0, revealed: false, flagged: false };
      }
    }

    let planted = 0;
    while (planted < totalMines) {
      let r = Math.floor(Math.random() * size);
      let c = Math.floor(Math.random() * size);
      if (!board[r][c].mine) {
        board[r][c].mine = true;
        planted++;
      }
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c].mine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (board[r + dr] && board[r + dr][c + dc] && board[r + dr][c + dc].mine) count++;
          }
        }
        board[r][c].count = count;
      }
    }

    function render() {
      grid.innerHTML = '';
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const cell = board[r][c];
          const btn = document.createElement('button');
          btn.style.cssText = `
            background: ${cell.revealed ? (cell.mine ? '#ef4444' : '#0e1528') : '#080d1a'};
            border: 1px solid rgba(0,240,255,0.2); border-radius: 6px;
            font-family: var(--font-heading); font-weight: 800; color: #00f0ff;
            font-size: 1.1rem; cursor: pointer;
          `;

          if (cell.revealed) {
            btn.textContent = cell.mine ? '💣' : (cell.count > 0 ? cell.count : '');
          } else if (cell.flagged) {
            btn.textContent = '🚩';
          }

          btn.addEventListener('click', () => reveal(r, c));
          btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (!cell.revealed) {
              cell.flagged = !cell.flagged;
              render();
            }
          });

          grid.appendChild(btn);
        }
      }
    }

    function reveal(r, c) {
      const cell = board[r][c];
      if (cell.revealed || cell.flagged) return;
      cell.revealed = true;
      revealedCount++;

      if (cell.mine) {
        beep('boop');
        showGameOver(container, score, 'minesweeper', () => {
          grid.remove();
          canvas.style.display = 'block';
          runMinesweeper(container, canvas);
        });
        return;
      }

      score += 15;
      updateScoreUI(score);
      beep('click');

      if (cell.count === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (board[r + dr] && board[r + dr][c + dc]) reveal(r + dr, c + dc);
          }
        }
      }

      if (revealedCount === size * size - totalMines) {
        showGameOver(container, score + 200, 'minesweeper', () => {
          grid.remove();
          canvas.style.display = 'block';
          runMinesweeper(container, canvas);
        }, true);
      }

      render();
    }

    render();

    return {
      stop: () => { grid.remove(); canvas.style.display = 'block'; }
    };
  }

  /* ==========================================================================
     15. SUDOKU
     ========================================================================== */
  function runSudoku(container, canvas) {
    canvas.style.display = 'none';
    const wrapper = document.createElement('div');
    wrapper.className = 'game-dom-board';
    wrapper.style.cssText = 'max-width: 360px; margin: 0 auto; user-select: none;';

    const grid = document.createElement('div');
    grid.style.cssText = `
      display: grid; grid-template-columns: repeat(9, 1fr); gap: 2px;
      background: rgba(0,240,255,0.3); padding: 4px; border-radius: 12px; margin-bottom: 14px;
    `;

    const puzzle = [
      [5,3,0, 0,7,0, 0,0,0],
      [6,0,0, 1,9,5, 0,0,0],
      [0,9,8, 0,0,0, 0,6,0],
      [8,0,0, 0,6,0, 0,0,3],
      [4,0,0, 8,0,3, 0,0,1],
      [7,0,0, 0,2,0, 0,0,6],
      [0,6,0, 0,0,0, 2,8,0],
      [0,0,0, 4,1,9, 0,0,5],
      [0,0,0, 0,8,0, 0,7,9]
    ];

    let currentCell = null, score = 0;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = puzzle[r][c];
        const cell = document.createElement('div');
        cell.style.cssText = `
          aspect-ratio: 1; background: ${val ? '#0e1528' : '#080d1a'};
          color: ${val ? '#ffffff' : '#00f0ff'}; font-weight: 800; font-family: var(--font-heading);
          display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
          cursor: ${val ? 'default' : 'pointer'}; border-radius: 4px;
        `;
        cell.textContent = val > 0 ? val : '';
        if (!val) {
          cell.addEventListener('click', () => {
            grid.querySelectorAll('div').forEach(d => d.style.outline = 'none');
            cell.style.outline = '2px solid #00f0ff';
            currentCell = { r, c, el: cell };
          });
        }
        grid.appendChild(cell);
      }
    }

    const pad = document.createElement('div');
    pad.style.cssText = 'display: flex; gap: 6px; justify-content: center;';
    for (let i = 1; i <= 9; i++) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-secondary btn-sm';
      btn.textContent = i;
      btn.addEventListener('click', () => {
        if (currentCell) {
          currentCell.el.textContent = i;
          score += 10;
          updateScoreUI(score);
          beep('click');
        }
      });
      pad.appendChild(btn);
    }

    wrapper.appendChild(grid);
    wrapper.appendChild(pad);
    container.appendChild(wrapper);

    return {
      stop: () => { wrapper.remove(); canvas.style.display = 'block'; }
    };
  }

  /* ==========================================================================
     16. HANGMAN
     ========================================================================== */
  function runHangman(container, canvas) {
    canvas.style.display = 'none';
    const words = ['ARCADE', 'PIXEL', 'CYBER', 'RETRO', 'VECTOR', 'MATRIX', 'JOYSTICK', 'CONSOLE'];
    const word = words[Math.floor(Math.random() * words.length)];
    let guessed = new Set(), errors = 0, maxErrors = 6, score = 0;

    const wrapper = document.createElement('div');
    wrapper.className = 'game-dom-board';
    wrapper.style.cssText = 'text-align: center; max-width: 440px; margin: 0 auto; user-select: none;';

    wrapper.innerHTML = `
      <div id="hangman-shield" style="font-size: 1.1rem; color: #00f0ff; margin-bottom: 14px;">
        Perisai Kuantum: ${'⚡ '.repeat(maxErrors - errors)}
      </div>
      <div id="hangman-word-slots" style="font-size: 2rem; letter-spacing: 10px; font-weight: 800; color: #fff; margin-bottom: 24px;"></div>
      <div id="hangman-keyboard" style="display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;"></div>
    `;

    container.appendChild(wrapper);

    function render() {
      const slots = wrapper.querySelector('#hangman-word-slots');
      slots.textContent = word.split('').map(l => guessed.has(l) ? l : '_').join(' ');

      const shield = wrapper.querySelector('#hangman-shield');
      shield.textContent = `Perisai Kuantum: ${'⚡ '.repeat(Math.max(0, maxErrors - errors))}`;

      if (word.split('').every(l => guessed.has(l))) {
        showGameOver(container, 300 - errors * 30, 'hangman', () => {
          wrapper.remove();
          canvas.style.display = 'block';
          runHangman(container, canvas);
        }, true);
      }
    }

    const kb = wrapper.querySelector('#hangman-keyboard');
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
      const b = document.createElement('button');
      b.className = 'btn btn-secondary btn-sm';
      b.style.padding = '8px 12px';
      b.textContent = letter;
      b.addEventListener('click', () => {
        if (guessed.has(letter) || errors >= maxErrors) return;
        guessed.add(letter);
        b.disabled = true;
        b.style.opacity = '0.3';

        if (word.includes(letter)) {
          score += 20;
          updateScoreUI(score);
          beep('click');
        } else {
          errors++;
          beep('boop');
          if (errors >= maxErrors) {
            showGameOver(container, score, 'hangman', () => {
              wrapper.remove();
              canvas.style.display = 'block';
              runHangman(container, canvas);
            });
          }
        }
        render();
      });
      kb.appendChild(b);
    });

    render();

    return {
      stop: () => { wrapper.remove(); canvas.style.display = 'block'; }
    };
  }

  /* ==========================================================================
     17. WORD GUESS
     ========================================================================== */
  function runWordGuess(container, canvas) {
    canvas.style.display = 'none';
    const target = 'GAMER';
    let currentGuess = '', attempts = 0, maxAttempts = 6;

    const wrapper = document.createElement('div');
    wrapper.className = 'game-dom-board';
    wrapper.style.cssText = 'max-width: 320px; margin: 0 auto; user-select: none;';
    const board = document.createElement('div');
    board.style.cssText = 'display: grid; grid-template-rows: repeat(6, 1fr); gap: 6px; margin-bottom: 18px;';

    for (let i = 0; i < 30; i++) {
      const tile = document.createElement('div');
      tile.style.cssText = `
        aspect-ratio: 1; background: #080d1a; border: 2px solid rgba(0,240,255,0.2);
        border-radius: 6px; font-size: 1.4rem; font-weight: 800; color: #fff;
        display: flex; align-items: center; justify-content: center;
      `;
      board.appendChild(tile);
    }

    wrapper.appendChild(board);
    container.appendChild(wrapper);

    function submitWord(w) {
      if (w.length !== 5 || attempts >= maxAttempts) return;
      const tiles = board.querySelectorAll('div');

      for (let i = 0; i < 5; i++) {
        const idx = attempts * 5 + i;
        tiles[idx].textContent = w[i];
        if (w[i] === target[i]) {
          tiles[idx].style.background = '#10b981';
        } else if (target.includes(w[i])) {
          tiles[idx].style.background = '#f59e0b';
        } else {
          tiles[idx].style.background = '#334155';
        }
      }

      attempts++;
      if (w === target) {
        showGameOver(container, 500 - attempts * 50, 'word-guess', () => {
          wrapper.remove();
          canvas.style.display = 'block';
          runWordGuess(container, canvas);
        }, true);
      } else if (attempts >= maxAttempts) {
        showGameOver(container, 0, 'word-guess', () => {
          wrapper.remove();
          canvas.style.display = 'block';
          runWordGuess(container, canvas);
        });
      }
    }

    function handleKey(e) {
      if (e.key === 'Backspace') {
        currentGuess = currentGuess.slice(0, -1);
      } else if (e.key === 'Enter') {
        if (currentGuess.length === 5) {
          submitWord(currentGuess.toUpperCase());
          currentGuess = '';
        }
      } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < 5) {
        currentGuess += e.key.toUpperCase();
      }
    }

    window.addEventListener('keydown', handleKey);

    return {
      stop: () => { window.removeEventListener('keydown', handleKey); wrapper.remove(); canvas.style.display = 'block'; }
    };
  }

  /* ==========================================================================
     18. MATH CHALLENGE
     ========================================================================== */
  function runMathChallenge(container, canvas) {
    canvas.style.display = 'none';
    const wrapper = document.createElement('div');
    wrapper.className = 'game-dom-board';
    wrapper.style.cssText = 'text-align: center; max-width: 380px; margin: 0 auto; user-select: none;';

    let score = 0, timeLeft = 30, timerId = null;

    wrapper.innerHTML = `
      <div id="math-timer" style="font-family: var(--font-mono); color: #00f0ff; font-size: 1.1rem; margin-bottom: 12px;">Timer: 30s</div>
      <div id="math-equation" style="font-size: 2.2rem; font-weight: 800; color: #fff; margin-bottom: 24px;"></div>
      <div id="math-options" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;"></div>
    `;

    container.appendChild(wrapper);

    function nextQuestion() {
      const a = Math.floor(Math.random() * 12) + 1;
      const b = Math.floor(Math.random() * 12) + 1;
      const ans = a * b;

      wrapper.querySelector('#math-equation').textContent = `${a} × ${b} = ?`;
      const opts = [ans, ans + 2, ans - 3, ans + 5].sort(() => Math.random() - 0.5);

      const optContainer = wrapper.querySelector('#math-options');
      optContainer.innerHTML = '';
      opts.forEach(o => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-secondary';
        btn.style.fontSize = '1.3rem';
        btn.textContent = o;
        btn.addEventListener('click', () => {
          if (o === ans) {
            score += 25;
            updateScoreUI(score);
            beep('click');
          } else {
            beep('boop');
          }
          nextQuestion();
        });
        optContainer.appendChild(btn);
      });
    }

    nextQuestion();

    timerId = setInterval(() => {
      timeLeft--;
      wrapper.querySelector('#math-timer').textContent = `Timer: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timerId);
        showGameOver(container, score, 'math-challenge', () => {
          wrapper.remove();
          canvas.style.display = 'block';
          runMathChallenge(container, canvas);
        });
      }
    }, 1000);

    return {
      stop: () => { clearInterval(timerId); wrapper.remove(); canvas.style.display = 'block'; }
    };
  }

  /* ==========================================================================
     19. PIANO TILES
     ========================================================================== */
  function runPianoTiles(container, canvas) {
    const ctx = canvas.getContext('2d');
    const cols = 4;
    const colW = canvas.width / cols;
    let tiles = [];
    let score = 0, isRunning = true, speed = 4;

    function spawnTile() {
      tiles.push({ col: Math.floor(Math.random() * cols), y: -90, h: 90, hit: false });
    }

    for (let i = 0; i < 3; i++) {
      tiles.push({ col: Math.floor(Math.random() * cols), y: i * 110 - 150, h: 90, hit: false });
    }

    function hitLane(col) {
      const target = tiles.find(t => t.col === col && !t.hit && t.y + t.h > canvas.height - 180 && t.y < canvas.height);
      if (target) {
        target.hit = true;
        score += 10;
        updateScoreUI(score);
        beep('launch');
        speed += 0.05;
      }
    }

    canvas.addEventListener('pointerdown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const col = Math.floor(x / colW);
      hitLane(col);
    });

    function loop() {
      if (!isRunning) return;

      if (tiles.length === 0 || tiles[tiles.length - 1].y > 20) {
        spawnTile();
      }

      ctx.fillStyle = '#04060c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      for (let i = 1; i < cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * colW, 0); ctx.lineTo(i * colW, canvas.height);
        ctx.stroke();
      }

      for (let i = tiles.length - 1; i >= 0; i--) {
        const t = tiles[i];
        t.y += speed;

        ctx.fillStyle = t.hit ? '#334155' : '#00f0ff';
        ctx.fillRect(t.col * colW + 2, t.y, colW - 4, t.h);

        if (!t.hit && t.y > canvas.height) {
          gameOver();
          return;
        }

        if (t.y > canvas.height + 10) tiles.splice(i, 1);
      }

      animationFrameId = requestAnimationFrame(loop);
    }

    function gameOver() {
      isRunning = false;
      beep('boop');
      showGameOver(container, score, 'piano-tiles', () => runPianoTiles(container, canvas));
    }

    loop();

    return {
      stop: () => { isRunning = false; cancelAnimationFrame(animationFrameId); }
    };
  }

  /* ==========================================================================
     20. PIXEL ADVENTURE
     ========================================================================== */
  function runPixelAdventure(container, canvas) {
    const ctx = canvas.getContext('2d');
    let hero = { x: 40, y: canvas.height - 70, vx: 0, vy: 0, size: 26, isGrounded: true };
    let coins = [
      { x: 140, y: canvas.height - 120, taken: false },
      { x: 260, y: canvas.height - 180, taken: false },
      { x: 380, y: canvas.height - 130, taken: false }
    ];
    let platforms = [
      { x: 0, y: canvas.height - 30, w: canvas.width, h: 30 },
      { x: 110, y: canvas.height - 90, w: 90, h: 14 },
      { x: 230, y: canvas.height - 150, w: 100, h: 14 },
      { x: 360, y: canvas.height - 100, w: 90, h: 14 }
    ];
    let portal = { x: canvas.width - 50, y: canvas.height - 70, size: 30 };
    let score = 0, isRunning = true, keys = {};

    function handleKey(e) {
      keys[e.key] = e.type === 'keydown';
      if ([' ', 'z', 'Z', 'w', 'ArrowUp'].includes(e.key) && hero.isGrounded && e.type === 'keydown') {
        hero.vy = -10.5;
        hero.isGrounded = false;
        beep('click');
      }
    }

    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);

    function loop() {
      if (!isRunning) return;

      if (keys['ArrowLeft'] || keys['a']) hero.x -= 4.5;
      if (keys['ArrowRight'] || keys['d']) hero.x += 4.5;

      hero.vy += 0.55;
      hero.y += hero.vy;

      hero.isGrounded = false;
      platforms.forEach(p => {
        if (
          hero.x + hero.size > p.x && hero.x < p.x + p.w &&
          hero.y + hero.size >= p.y && hero.y + hero.size <= p.y + p.h + hero.vy
        ) {
          hero.y = p.y - hero.size;
          hero.vy = 0;
          hero.isGrounded = true;
        }
      });

      coins.forEach(c => {
        if (!c.taken && Math.hypot(hero.x - c.x, hero.y - c.y) < 24) {
          c.taken = true;
          score += 50;
          updateScoreUI(score);
          beep('launch');
        }
      });

      if (Math.hypot(hero.x - portal.x, hero.y - portal.y) < 30) {
        showGameOver(container, score + 150, 'pixel-adventure', () => runPixelAdventure(container, canvas), true);
        return;
      }

      ctx.fillStyle = '#04060c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0e1528';
      platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

      ctx.fillStyle = '#fbbf24';
      coins.forEach(c => {
        if (!c.taken) {
          ctx.beginPath();
          ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.fillStyle = '#00f0ff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00f0ff';
      ctx.fillRect(portal.x, portal.y, portal.size, portal.size);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#0070d8';
      ctx.fillRect(hero.x, hero.y, hero.size, hero.size);

      animationFrameId = requestAnimationFrame(loop);
    }

    loop();

    return {
      stop: () => { isRunning = false; cancelAnimationFrame(animationFrameId); window.removeEventListener('keydown', handleKey); window.removeEventListener('keyup', handleKey); }
    };
  }

  /* ==========================================================================
     LAUNCH DISPATCHER
     ========================================================================== */
  function launch(gameId, container, canvas) {
    if (currentGame && currentGame.stop) {
      currentGame.stop();
      currentGame = null;
    }

    cleanContainer(container);
    updateScoreUI(0);
    updateBestUI(gameId);

    canvas.style.display = 'block';

    switch (gameId) {
      case 'snake-game': currentGame = runSnake(container, canvas); break;
      case 'tetris': currentGame = runTetris(container, canvas); break;
      case 'flappy-bird': currentGame = runFlappyBird(container, canvas); break;
      case '2048': currentGame = run2048(container, canvas); break;
      case 'memory-card': currentGame = runMemoryCard(container, canvas); break;
      case 'tic-tac-toe': currentGame = runTicTacToe(container, canvas); break;
      case 'rock-paper-scissors': currentGame = runRockPaperScissors(container, canvas); break;
      case 'whack-a-mole': currentGame = runWhackAMole(container, canvas); break;
      case 'space-shooter': currentGame = runSpaceShooter(container, canvas); break;
      case 'brick-breaker': currentGame = runBrickBreaker(container, canvas); break;
      case 'jumping-game': currentGame = runJumpingGame(container, canvas); break;
      case 'endless-runner': currentGame = runEndlessRunner(container, canvas); break;
      case 'car-racing': currentGame = runCarRacing(container, canvas); break;
      case 'minesweeper': currentGame = runMinesweeper(container, canvas); break;
      case 'sudoku': currentGame = runSudoku(container, canvas); break;
      case 'hangman': currentGame = runHangman(container, canvas); break;
      case 'word-guess': currentGame = runWordGuess(container, canvas); break;
      case 'math-challenge': currentGame = runMathChallenge(container, canvas); break;
      case 'piano-tiles': currentGame = runPianoTiles(container, canvas); break;
      case 'pixel-adventure': currentGame = runPixelAdventure(container, canvas); break;
      default: currentGame = runSnake(container, canvas); break;
    }

    return currentGame;
  }

  return {
    launch,
    getCurrent: () => currentGame,
    getHighScore,
    saveHighScore
  };
})();
