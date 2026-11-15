const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'assets', 'images', 'games');
const iconDir = path.join(__dirname, '..', 'assets', 'icons');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(iconDir)) fs.mkdirSync(iconDir, { recursive: true });

function wrapSvg(id, primaryColor, secondaryColor, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c0e17" />
      <stop offset="50%" stop-color="#121526" />
      <stop offset="100%" stop-color="#08090d" />
    </linearGradient>
    <radialGradient id="radial-${id}" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.25" />
      <stop offset="100%" stop-color="${secondaryColor}" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="accent-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}" />
      <stop offset="100%" stop-color="${secondaryColor}" />
    </linearGradient>
    <filter id="glow-${id}" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <pattern id="grid-${id}" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="600" height="380" fill="url(#bg-${id})" rx="16" />
  <rect width="600" height="380" fill="url(#radial-${id})" rx="16" />
  <rect width="600" height="380" fill="url(#grid-${id})" rx="16" />

  <!-- Outer Tech Border -->
  <rect x="12" y="12" width="576" height="356" rx="12" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1.5"/>
  <circle cx="28" cy="28" r="3" fill="${primaryColor}" opacity="0.8" />
  <circle cx="572" cy="28" r="3" fill="${secondaryColor}" opacity="0.8" />
  <circle cx="28" cy="352" r="3" fill="${primaryColor}" opacity="0.5" />
  <circle cx="572" cy="352" r="3" fill="${secondaryColor}" opacity="0.5" />

  <!-- Custom Game Visual Artwork -->
  ${content}

  <!-- Tech Status Vignette Overlay -->
  <path d="M 20 40 L 40 20 M 580 40 L 560 20" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
</svg>`;
}

const gamesArtwork = {
  "snake-game": {
    primary: "#10b981",
    secondary: "#06b6d4",
    content: `
      <!-- Cyber Matrix Snake -->
      <g filter="url(#glow-snake-game)">
        <!-- Grid dots -->
        <circle cx="200" cy="190" r="14" fill="#10b981" />
        <circle cx="235" cy="190" r="14" fill="#10b981" />
        <circle cx="270" cy="190" r="14" fill="#10b981" />
        <circle cx="305" cy="190" r="14" fill="#10b981" />
        <circle cx="340" cy="190" r="14" fill="#10b981" />
        <circle cx="340" cy="155" r="14" fill="#34d399" />
        <circle cx="340" cy="120" r="14" fill="#34d399" />
        <circle cx="375" cy="120" r="16" fill="#6ee7b7" />
        <!-- Eyes -->
        <circle cx="380" cy="115" r="3.5" fill="#064e3b" />
        <circle cx="380" cy="125" r="3.5" fill="#064e3b" />
        <!-- Energy Apple Orb -->
        <circle cx="440" cy="120" r="15" fill="#ef4444" />
        <circle cx="440" cy="120" r="6" fill="#fecaca" />
      </g>
      <text x="300" y="320" font-family="'Space Grotesk', monospace" font-size="16" fill="#a7f3d0" text-anchor="middle" letter-spacing="4">SCORE MATRIX • 9,450</text>
    `
  },
  "tetris": {
    primary: "#a855f7",
    secondary: "#06b6d4",
    content: `
      <g filter="url(#glow-tetris)" transform="translate(180, 70)">
        <!-- T Piece -->
        <rect x="80" y="20" width="36" height="36" rx="4" fill="#c084fc" stroke="#f3e8ff" stroke-width="1.5" />
        <rect x="44" y="56" width="36" height="36" rx="4" fill="#a855f7" stroke="#f3e8ff" stroke-width="1.5" />
        <rect x="80" y="56" width="36" height="36" rx="4" fill="#a855f7" stroke="#f3e8ff" stroke-width="1.5" />
        <rect x="116" y="56" width="36" height="36" rx="4" fill="#a855f7" stroke="#f3e8ff" stroke-width="1.5" />

        <!-- I Piece (Cyan) -->
        <rect x="180" y="40" width="36" height="36" rx="4" fill="#22d3ee" stroke="#cffafe" stroke-width="1.5" />
        <rect x="180" y="76" width="36" height="36" rx="4" fill="#06b6d4" stroke="#cffafe" stroke-width="1.5" />
        <rect x="180" y="112" width="36" height="36" rx="4" fill="#0891b2" stroke="#cffafe" stroke-width="1.5" />

        <!-- L Piece (Orange) -->
        <rect x="10" y="120" width="36" height="36" rx="4" fill="#fb923c" stroke="#ffedd5" stroke-width="1.5" />
        <rect x="10" y="156" width="36" height="36" rx="4" fill="#f97316" stroke="#ffedd5" stroke-width="1.5" />
        <rect x="46" y="156" width="36" height="36" rx="4" fill="#ea580c" stroke="#ffedd5" stroke-width="1.5" />

        <!-- Base row clears -->
        <rect x="82" y="156" width="36" height="36" rx="4" fill="#10b981" opacity="0.9" />
        <rect x="118" y="156" width="36" height="36" rx="4" fill="#3b82f6" opacity="0.9" />
        <rect x="154" y="156" width="36" height="36" rx="4" fill="#ec4899" opacity="0.9" />
        <rect x="190" y="156" width="36" height="36" rx="4" fill="#eab308" opacity="0.9" />
      </g>
      <text x="300" y="325" font-family="'Space Grotesk', monospace" font-size="16" fill="#e9d5ff" text-anchor="middle" letter-spacing="4">TETRIS LINE CLEAR x4</text>
    `
  },
  "flappy-bird": {
    primary: "#f59e0b",
    secondary: "#10b981",
    content: `
      <!-- Neon Pipes -->
      <g filter="url(#glow-flappy-bird)">
        <!-- Top Pipe -->
        <rect x="360" y="30" width="55" height="110" rx="6" fill="#10b981" stroke="#34d399" stroke-width="2" />
        <rect x="350" y="130" width="75" height="25" rx="4" fill="#059669" stroke="#6ee7b7" stroke-width="2" />

        <!-- Bottom Pipe -->
        <rect x="350" y="240" width="75" height="25" rx="4" fill="#059669" stroke="#6ee7b7" stroke-width="2" />
        <rect x="360" y="265" width="55" height="90" rx="6" fill="#10b981" stroke="#34d399" stroke-width="2" />

        <!-- Cyber Bird -->
        <g transform="translate(190, 160)">
          <circle cx="30" cy="30" r="24" fill="#f59e0b" stroke="#fde68a" stroke-width="2" />
          <ellipse cx="22" cy="32" rx="12" ry="8" fill="#fbbf24" transform="rotate(-15 22 32)" />
          <circle cx="42" cy="24" r="7" fill="#ffffff" />
          <circle cx="44" cy="24" r="3" fill="#1e293b" />
          <polygon points="48,28 65,34 48,40" fill="#ef4444" />
        </g>
      </g>
      <text x="300" y="330" font-family="'Space Grotesk', monospace" font-size="16" fill="#fef08a" text-anchor="middle" letter-spacing="4">ALTITUDE: FLAP TO SURVIVE</text>
    `
  },
  "2048": {
    primary: "#06b6d4",
    secondary: "#3b82f6",
    content: `
      <g filter="url(#glow-2048)" transform="translate(160, 60)">
        <rect x="0" y="0" width="280" height="220" rx="16" fill="rgba(15,23,42,0.8)" stroke="#38bdf8" stroke-width="2" />
        <!-- 2048 Main Tile -->
        <rect x="20" y="20" width="115" height="85" rx="10" fill="url(#accent-2048)" />
        <text x="77" y="74" font-family="'Outfit', sans-serif" font-weight="900" font-size="34" fill="#ffffff" text-anchor="middle">2048</text>

        <!-- 1024 Tile -->
        <rect x="145" y="20" width="115" height="85" rx="10" fill="#3b82f6" />
        <text x="202" y="74" font-family="'Outfit', sans-serif" font-weight="900" font-size="30" fill="#ffffff" text-anchor="middle">1024</text>

        <!-- 512 Tile -->
        <rect x="20" y="115" width="115" height="85" rx="10" fill="#6366f1" />
        <text x="77" y="169" font-family="'Outfit', sans-serif" font-weight="900" font-size="32" fill="#ffffff" text-anchor="middle">512</text>

        <!-- 256 Tile -->
        <rect x="145" y="115" width="115" height="85" rx="10" fill="#8b5cf6" />
        <text x="202" y="169" font-family="'Outfit', sans-serif" font-weight="900" font-size="32" fill="#ffffff" text-anchor="middle">256</text>
      </g>
      <text x="300" y="325" font-family="'Space Grotesk', monospace" font-size="16" fill="#7dd3fc" text-anchor="middle" letter-spacing="4">QUANTUM TILE MERGE</text>
    `
  },
  "memory-card": {
    primary: "#ec4899",
    secondary: "#a855f7",
    content: `
      <g filter="url(#glow-memory-card)" transform="translate(130, 80)">
        <!-- Card 1 (Flipped face) -->
        <rect x="20" y="10" width="90" height="130" rx="12" fill="#831843" stroke="#f472b6" stroke-width="2" />
        <circle cx="65" cy="75" r="24" fill="#ec4899" />
        <path d="M 65 60 L 72 73 L 86 73 L 75 82 L 79 95 L 65 86 L 51 95 L 55 82 L 44 73 L 58 73 Z" fill="#ffffff" />

        <!-- Card 2 (Matching face) -->
        <rect x="130" y="10" width="90" height="130" rx="12" fill="#831843" stroke="#f472b6" stroke-width="2" />
        <circle cx="175" cy="75" r="24" fill="#ec4899" />
        <path d="M 175 60 L 182 73 L 196 73 L 185 82 L 189 95 L 175 86 L 161 95 L 165 82 L 154 73 L 168 73 Z" fill="#ffffff" />

        <!-- Card 3 (Back side) -->
        <rect x="240" y="10" width="90" height="130" rx="12" fill="#1e1b4b" stroke="#818cf8" stroke-width="2" />
        <text x="285" y="85" font-family="'Space Grotesk', sans-serif" font-size="40" font-weight="900" fill="#a5b4fc" text-anchor="middle">?</text>
      </g>
      <text x="300" y="315" font-family="'Space Grotesk', monospace" font-size="16" fill="#fbcfe8" text-anchor="middle" letter-spacing="4">HOLOGRAPHIC MATCH DETECTED</text>
    `
  },
  "tic-tac-toe": {
    primary: "#3b82f6",
    secondary: "#06b6d4",
    content: `
      <g filter="url(#glow-tic-tac-toe)" transform="translate(190, 75)">
        <!-- Grid lines -->
        <line x1="80" y1="10" x2="80" y2="170" stroke="rgba(255,255,255,0.2)" stroke-width="4" stroke-linecap="round"/>
        <line x1="140" y1="10" x2="140" y2="170" stroke="rgba(255,255,255,0.2)" stroke-width="4" stroke-linecap="round"/>
        <line x1="10" y1="65" x2="210" y2="65" stroke="rgba(255,255,255,0.2)" stroke-width="4" stroke-linecap="round"/>
        <line x1="10" y1="120" x2="210" y2="120" stroke="rgba(255,255,255,0.2)" stroke-width="4" stroke-linecap="round"/>

        <!-- X -->
        <g stroke="#38bdf8" stroke-width="6" stroke-linecap="round">
          <line x1="28" y1="22" x2="62" y2="52" />
          <line x1="62" y1="22" x2="28" y2="52" />
        </g>

        <!-- O -->
        <circle cx="110" cy="92" r="18" fill="none" stroke="#ec4899" stroke-width="6" />

        <!-- X winning combo -->
        <g stroke="#38bdf8" stroke-width="6" stroke-linecap="round">
          <line x1="158" y1="132" x2="192" y2="162" />
          <line x1="192" y1="132" x2="158" y2="162" />
          <line x1="158" y1="22" x2="192" y2="52" />
          <line x1="192" y1="22" x2="158" y2="52" />
        </g>
      </g>
      <text x="300" y="315" font-family="'Space Grotesk', monospace" font-size="16" fill="#93c5fd" text-anchor="middle" letter-spacing="4">NEON TACTICAL DUEL</text>
    `
  },
  "rock-paper-scissors": {
    primary: "#8b5cf6",
    secondary: "#ec4899",
    content: `
      <g filter="url(#glow-rock-paper-scissors)" transform="translate(130, 90)">
        <!-- Rock -->
        <circle cx="60" cy="65" r="45" fill="#4c1d95" stroke="#a78bfa" stroke-width="2" />
        <path d="M 45 65 L 55 45 L 75 50 L 78 72 L 58 82 Z" fill="#c4b5fd" />

        <!-- VS badge -->
        <circle cx="170" cy="65" r="22" fill="#ef4444" />
        <text x="170" y="72" font-family="'Outfit', sans-serif" font-weight="900" font-size="18" fill="#ffffff" text-anchor="middle">VS</text>

        <!-- Scissors -->
        <circle cx="280" cy="65" r="45" fill="#831843" stroke="#f472b6" stroke-width="2" />
        <g stroke="#fbcfe8" stroke-width="4" stroke-linecap="round">
          <line x1="265" y1="48" x2="295" y2="82" />
          <line x1="295" y1="48" x2="265" y2="82" />
        </g>
      </g>
      <text x="300" y="320" font-family="'Space Grotesk', monospace" font-size="16" fill="#ddd6fe" text-anchor="middle" letter-spacing="4">ALGORITHMIC PROBABILITY</text>
    `
  },
  "whack-a-mole": {
    primary: "#f43f5e",
    secondary: "#f59e0b",
    content: `
      <g filter="url(#glow-whack-a-mole)" transform="translate(180, 80)">
        <!-- Warp Hole -->
        <ellipse cx="120" cy="150" rx="90" ry="26" fill="#18181b" stroke="#f43f5e" stroke-width="3" />

        <!-- Cyber Mole -->
        <path d="M 75 140 C 75 60, 165 60, 165 140 Z" fill="#881337" stroke="#fb7185" stroke-width="2" />
        <!-- Visor -->
        <rect x="90" y="90" width="60" height="16" rx="8" fill="#06b6d4" />
        <line x1="95" y1="98" x2="145" y2="98" stroke="#ffffff" stroke-width="2" />

        <!-- Cyber Mallet -->
        <g transform="translate(160, 20) rotate(25)">
          <rect x="0" y="30" width="16" height="80" rx="4" fill="#713f12" />
          <rect x="-25" y="0" width="66" height="36" rx="6" fill="#fbbf24" stroke="#fef08a" stroke-width="2" />
        </g>
      </g>
      <text x="300" y="325" font-family="'Space Grotesk', monospace" font-size="16" fill="#fda4af" text-anchor="middle" letter-spacing="4">LIGHTNING STRIKE REFLEX</text>
    `
  },
  "space-shooter": {
    primary: "#06b6d4",
    secondary: "#3b82f6",
    content: `
      <g filter="url(#glow-space-shooter)" transform="translate(170, 70)">
        <!-- Alien enemy -->
        <g transform="translate(80, 10)">
          <polygon points="50,0 20,40 80,40" fill="#ef4444" />
          <circle cx="50" cy="28" r="8" fill="#fef08a" />
        </g>

        <!-- Lasers -->
        <line x1="110" y1="85" x2="110" y2="135" stroke="#22d3ee" stroke-width="4" stroke-linecap="round"/>
        <line x1="150" y1="85" x2="150" y2="135" stroke="#22d3ee" stroke-width="4" stroke-linecap="round"/>

        <!-- Player Starfighter -->
        <g transform="translate(70, 135)">
          <polygon points="60,0 30,65 60,50 90,65" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
          <polygon points="60,10 48,50 60,42 72,50" fill="#38bdf8"/>
          <circle cx="60" cy="55" r="5" fill="#f97316" />
        </g>
      </g>
      <text x="300" y="325" font-family="'Space Grotesk', monospace" font-size="16" fill="#a5f3fc" text-anchor="middle" letter-spacing="4">VOID INTERCEPTOR READY</text>
    `
  },
  "brick-breaker": {
    primary: "#a855f7",
    secondary: "#ec4899",
    content: `
      <g filter="url(#glow-brick-breaker)" transform="translate(150, 65)">
        <!-- Bricks Rows -->
        <rect x="0" y="10" width="55" height="18" rx="3" fill="#f43f5e" />
        <rect x="62" y="10" width="55" height="18" rx="3" fill="#f43f5e" />
        <rect x="124" y="10" width="55" height="18" rx="3" fill="#f43f5e" />
        <rect x="186" y="10" width="55" height="18" rx="3" fill="#f43f5e" />
        <rect x="248" y="10" width="55" height="18" rx="3" fill="#f43f5e" />

        <rect x="0" y="35" width="55" height="18" rx="3" fill="#a855f7" />
        <rect x="62" y="35" width="55" height="18" rx="3" fill="#a855f7" />
        <rect x="124" y="35" width="55" height="18" rx="3" fill="#a855f7" />
        <rect x="186" y="35" width="55" height="18" rx="3" fill="#a855f7" />
        <rect x="248" y="35" width="55" height="18" rx="3" fill="#a855f7" />

        <rect x="0" y="60" width="55" height="18" rx="3" fill="#06b6d4" />
        <rect x="62" y="60" width="55" height="18" rx="3" fill="#06b6d4" />
        <rect x="186" y="60" width="55" height="18" rx="3" fill="#06b6d4" />
        <rect x="248" y="60" width="55" height="18" rx="3" fill="#06b6d4" />

        <!-- Ball -->
        <circle cx="152" cy="115" r="10" fill="#fde047" stroke="#ffffff" stroke-width="2"/>

        <!-- Paddle -->
        <rect x="105" y="180" width="95" height="14" rx="7" fill="#c084fc" stroke="#f3e8ff" stroke-width="2" />
      </g>
      <text x="300" y="325" font-family="'Space Grotesk', monospace" font-size="16" fill="#e9d5ff" text-anchor="middle" letter-spacing="4">SUPER RESONANCE DEFLECTION</text>
    `
  },
  "jumping-game": {
    primary: "#10b981",
    secondary: "#06b6d4",
    content: `
      <g filter="url(#glow-jumping-game)" transform="translate(170, 60)">
        <!-- Platforms -->
        <rect x="30" y="190" width="80" height="14" rx="7" fill="#10b981" />
        <rect x="150" y="130" width="80" height="14" rx="7" fill="#10b981" />
        <rect x="50" y="70" width="80" height="14" rx="7" fill="#06b6d4" />
        <rect x="160" y="20" width="80" height="14" rx="7" fill="#38bdf8" />

        <!-- Jumper Sprite with Springs -->
        <g transform="translate(175, 75)">
          <circle cx="20" cy="20" r="18" fill="#f59e0b" stroke="#fef08a" stroke-width="2"/>
          <circle cx="15" cy="16" r="3" fill="#18181b" />
          <circle cx="25" cy="16" r="3" fill="#18181b" />
          <path d="M 14 26 Q 20 32 26 26" stroke="#18181b" stroke-width="2" fill="none" />
          <!-- Spring -->
          <path d="M 15 38 L 25 42 L 15 46 L 25 50" stroke="#f43f5e" stroke-width="3" fill="none" />
        </g>
      </g>
      <text x="300" y="325" font-family="'Space Grotesk', monospace" font-size="16" fill="#a7f3d0" text-anchor="middle" letter-spacing="4">VERTICAL GRAVITY ASCENSION</text>
    `
  },
  "endless-runner": {
    primary: "#f59e0b",
    secondary: "#ec4899",
    content: `
      <g filter="url(#glow-endless-runner)">
        <!-- Synthwave Sunset -->
        <circle cx="300" cy="130" r="60" fill="url(#accent-endless-runner)" />
        <line x1="230" y1="120" x2="370" y2="120" stroke="#08090d" stroke-width="4" />
        <line x1="235" y1="135" x2="365" y2="135" stroke="#08090d" stroke-width="5" />
        <line x1="245" y1="150" x2="355" y2="150" stroke="#08090d" stroke-width="6" />

        <!-- Perspective Road -->
        <polygon points="270,180 330,180 500,280 100,280" fill="rgba(30,27,75,0.7)" stroke="#ec4899" stroke-width="2" />
        <line x1="300" y1="180" x2="300" y2="280" stroke="#f59e0b" stroke-width="3" stroke-dasharray="10 8" />

        <!-- Runner silhouette -->
        <g transform="translate(285, 205)">
          <circle cx="15" cy="10" r="8" fill="#22d3ee" />
          <line x1="15" y1="18" x2="15" y2="35" stroke="#22d3ee" stroke-width="4" />
          <line x1="15" y1="35" x2="5" y2="52" stroke="#22d3ee" stroke-width="4" />
          <line x1="15" y1="35" x2="28" y2="52" stroke="#22d3ee" stroke-width="4" />
        </g>
      </g>
      <text x="300" y="330" font-family="'Space Grotesk', monospace" font-size="16" fill="#fed7aa" text-anchor="middle" letter-spacing="4">SUPERSONIC SYNTHWAVE DASH</text>
    `
  },
  "car-racing": {
    primary: "#ef4444",
    secondary: "#f59e0b",
    content: `
      <g filter="url(#glow-car-racing)" transform="translate(190, 60)">
        <!-- Race Track Lines -->
        <rect x="0" y="0" width="220" height="210" rx="14" fill="#0f172a" stroke="#ef4444" stroke-width="2" />
        <line x1="110" y1="0" x2="110" y2="210" stroke="#fbbf24" stroke-width="4" stroke-dasharray="20 15" />

        <!-- Cyber Racecar -->
        <g transform="translate(85, 60)">
          <!-- Wheels -->
          <rect x="-8" y="15" width="10" height="24" rx="4" fill="#18181b" stroke="#ef4444" stroke-width="1.5" />
          <rect x="48" y="15" width="10" height="24" rx="4" fill="#18181b" stroke="#ef4444" stroke-width="1.5" />
          <rect x="-8" y="65" width="10" height="24" rx="4" fill="#18181b" stroke="#ef4444" stroke-width="1.5" />
          <rect x="48" y="65" width="10" height="24" rx="4" fill="#18181b" stroke="#ef4444" stroke-width="1.5" />

          <!-- Body -->
          <rect x="0" y="5" width="50" height="95" rx="14" fill="#dc2626" stroke="#fca5a5" stroke-width="2" />
          <!-- Cockpit -->
          <polygon points="10,35 40,35 34,65 16,65" fill="#0284c7" />
          <!-- Nitro tail flame -->
          <polygon points="18,100 25,125 32,100" fill="#f59e0b" />
        </g>
      </g>
      <text x="300" y="325" font-family="'Space Grotesk', monospace" font-size="16" fill="#fca5a5" text-anchor="middle" letter-spacing="4">NITRO DRIFT OVERDRIVE</text>
    `
  },
  "minesweeper": {
    primary: "#06b6d4",
    secondary: "#ef4444",
    content: `
      <g filter="url(#glow-minesweeper)" transform="translate(180, 60)">
        <rect x="0" y="0" width="240" height="210" rx="12" fill="#0f172a" stroke="#06b6d4" stroke-width="2" />
        <!-- Grid Cells -->
        <rect x="15" y="15" width="60" height="55" rx="6" fill="#1e293b" />
        <text x="45" y="52" font-family="'Outfit', sans-serif" font-weight="900" font-size="28" fill="#38bdf8" text-anchor="middle">1</text>

        <rect x="90" y="15" width="60" height="55" rx="6" fill="#1e293b" />
        <text x="120" y="52" font-family="'Outfit', sans-serif" font-weight="900" font-size="28" fill="#10b981" text-anchor="middle">2</text>

        <rect x="165" y="15" width="60" height="55" rx="6" fill="#1e293b" />
        <text x="195" y="52" font-family="'Outfit', sans-serif" font-weight="900" font-size="28" fill="#ef4444" text-anchor="middle">3</text>

        <!-- Mine Cell -->
        <rect x="90" y="85" width="60" height="55" rx="6" fill="#881337" stroke="#f43f5e" stroke-width="2" />
        <circle cx="120" cy="112" r="14" fill="#18181b" stroke="#f43f5e" stroke-width="2" />
        <line x1="102" y1="112" x2="138" y2="112" stroke="#fb7185" stroke-width="3" />
        <line x1="120" y1="94" x2="120" y2="130" stroke="#fb7185" stroke-width="3" />

        <!-- Flag Cell -->
        <rect x="15" y="85" width="60" height="55" rx="6" fill="#1e293b" />
        <polygon points="38,98 55,108 38,118" fill="#ef4444" />
        <line x1="38" y1="98" x2="38" y2="130" stroke="#ffffff" stroke-width="3" />
      </g>
      <text x="300" y="325" font-family="'Space Grotesk', monospace" font-size="16" fill="#bae6fd" text-anchor="middle" letter-spacing="4">QUANTUM MINE DETECTION</text>
    `
  },
  "sudoku": {
    primary: "#6366f1",
    secondary: "#8b5cf6",
    content: `
      <g filter="url(#glow-sudoku)" transform="translate(190, 55)">
        <rect x="0" y="0" width="220" height="220" rx="14" fill="#0f172a" stroke="#6366f1" stroke-width="2" />
        <!-- 3x3 Block Grid -->
        <line x1="73" y1="0" x2="73" y2="220" stroke="#818cf8" stroke-width="3" />
        <line x1="146" y1="0" x2="146" y2="220" stroke="#818cf8" stroke-width="3" />
        <line x1="0" y1="73" x2="220" y2="73" stroke="#818cf8" stroke-width="3" />
        <line x1="0" y1="146" x2="220" y2="146" stroke="#818cf8" stroke-width="3" />

        <!-- Glowing Numbers -->
        <text x="36" y="50" font-family="'Outfit', sans-serif" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle">5</text>
        <text x="110" y="50" font-family="'Outfit', sans-serif" font-weight="900" font-size="28" fill="#a5b4fc" text-anchor="middle">3</text>
        <text x="183" y="125" font-family="'Outfit', sans-serif" font-weight="900" font-size="28" fill="#c084fc" text-anchor="middle">7</text>
        <text x="36" y="195" font-family="'Outfit', sans-serif" font-weight="900" font-size="28" fill="#38bdf8" text-anchor="middle">6</text>
        <text x="110" y="195" font-family="'Outfit', sans-serif" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle">9</text>
      </g>
      <text x="300" y="325" font-family="'Space Grotesk', monospace" font-size="16" fill="#c7d2fe" text-anchor="middle" letter-spacing="4">DEDUCTION MATRIX SOLVER</text>
    `
  },
  "hangman": {
    primary: "#ec4899",
    secondary: "#f43f5e",
    content: `
      <g filter="url(#glow-hangman)" transform="translate(180, 60)">
        <!-- Cyber Scaffold -->
        <line x1="40" y1="190" x2="140" y2="190" stroke="#f472b6" stroke-width="5" stroke-linecap="round"/>
        <line x1="70" y1="190" x2="70" y2="20" stroke="#f472b6" stroke-width="5" stroke-linecap="round"/>
        <line x1="70" y1="20" x2="160" y2="20" stroke="#f472b6" stroke-width="5" stroke-linecap="round"/>
        <line x1="160" y1="20" x2="160" y2="50" stroke="#fb7185" stroke-width="4" stroke-linecap="round"/>

        <!-- Hologram Figure -->
        <circle cx="160" cy="70" r="18" fill="none" stroke="#38bdf8" stroke-width="4" />
        <line x1="160" y1="88" x2="160" y2="135" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" />
        <line x1="160" y1="102" x2="135" y2="120" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" />
        <line x1="160" y1="102" x2="185" y2="120" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" />
        <line x1="160" y1="135" x2="140" y2="165" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" />
        <line x1="160" y1="135" x2="180" y2="165" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" />
      </g>
      <text x="300" y="325" font-family="'Space Grotesk', monospace" font-size="16" fill="#fbcfe8" text-anchor="middle" letter-spacing="4">A _ C A D E • CIPHER LOCK</text>
    `
  },
  "word-guess": {
    primary: "#10b981",
    secondary: "#f59e0b",
    content: `
      <g filter="url(#glow-word-guess)" transform="translate(130, 75)">
        <!-- Wordle Tiles 5-letter -->
        <!-- Tile 1 G -->
        <rect x="0" y="10" width="58" height="58" rx="8" fill="#10b981" stroke="#6ee7b7" stroke-width="2" />
        <text x="29" y="49" font-family="'Outfit', sans-serif" font-weight="900" font-size="32" fill="#ffffff" text-anchor="middle">G</text>

        <!-- Tile 2 A -->
        <rect x="70" y="10" width="58" height="58" rx="8" fill="#10b981" stroke="#6ee7b7" stroke-width="2" />
        <text x="99" y="49" font-family="'Outfit', sans-serif" font-weight="900" font-size="32" fill="#ffffff" text-anchor="middle">A</text>

        <!-- Tile 3 M -->
        <rect x="140" y="10" width="58" height="58" rx="8" fill="#f59e0b" stroke="#fde68a" stroke-width="2" />
        <text x="169" y="49" font-family="'Outfit', sans-serif" font-weight="900" font-size="32" fill="#ffffff" text-anchor="middle">M</text>

        <!-- Tile 4 E -->
        <rect x="210" y="10" width="58" height="58" rx="8" fill="#334155" stroke="#64748b" stroke-width="2" />
        <text x="239" y="49" font-family="'Outfit', sans-serif" font-weight="900" font-size="32" fill="#ffffff" text-anchor="middle">E</text>

        <!-- Tile 5 R -->
        <rect x="280" y="10" width="58" height="58" rx="8" fill="#10b981" stroke="#6ee7b7" stroke-width="2" />
        <text x="309" y="49" font-family="'Outfit', sans-serif" font-weight="900" font-size="32" fill="#ffffff" text-anchor="middle">R</text>

        <!-- Sub row empty -->
        <rect x="70" y="80" width="58" height="58" rx="8" fill="#1e293b" opacity="0.6" />
        <rect x="140" y="80" width="58" height="58" rx="8" fill="#1e293b" opacity="0.6" />
        <rect x="210" y="80" width="58" height="58" rx="8" fill="#1e293b" opacity="0.6" />
      </g>
      <text x="300" y="325" font-family="'Space Grotesk', monospace" font-size="16" fill="#a7f3d0" text-anchor="middle" letter-spacing="4">DAILY 5-LETTER CYPHER</text>
    `
  },
  "math-challenge": {
    primary: "#8b5cf6",
    secondary: "#06b6d4",
    content: `
      <g filter="url(#glow-math-challenge)" transform="translate(140, 70)">
        <rect x="0" y="0" width="320" height="180" rx="16" fill="rgba(15,23,42,0.8)" stroke="#8b5cf6" stroke-width="2" />
        <!-- Equation -->
        <text x="160" y="70" font-family="'Outfit', sans-serif" font-weight="900" font-size="44" fill="#ffffff" text-anchor="middle">12 × 8 + ? = 144</text>
        <line x1="30" y1="100" x2="290" y2="100" stroke="rgba(255,255,255,0.1)" stroke-width="2" />
        <!-- Timer bar -->
        <rect x="40" y="125" width="240" height="14" rx="7" fill="#1e293b" />
        <rect x="40" y="125" width="180" height="14" rx="7" fill="url(#accent-math-challenge)" />
      </g>
      <text x="300" y="325" font-family="'Space Grotesk', monospace" font-size="16" fill="#ddd6fe" text-anchor="middle" letter-spacing="4">SPEED ARITHMETIC COMBO x5</text>
    `
  },
  "piano-tiles": {
    primary: "#06b6d4",
    secondary: "#ec4899",
    content: `
      <g filter="url(#glow-piano-tiles)" transform="translate(170, 50)">
        <!-- Piano Columns -->
        <rect x="0" y="0" width="60" height="230" fill="#0b0f19" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" />
        <rect x="65" y="0" width="60" height="230" fill="#0b0f19" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" />
        <rect x="130" y="0" width="60" height="230" fill="#0b0f19" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" />
        <rect x="195" y="0" width="60" height="230" fill="#0b0f19" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" />

        <!-- Descending Neon Tiles -->
        <rect x="0" y="20" width="60" height="80" rx="6" fill="#06b6d4" stroke="#67e8f9" stroke-width="2" />
        <rect x="130" y="60" width="60" height="80" rx="6" fill="#a855f7" stroke="#d8b4fe" stroke-width="2" />
        <rect x="65" y="120" width="60" height="80" rx="6" fill="#ec4899" stroke="#f472b6" stroke-width="2" />
        <rect x="195" y="140" width="60" height="80" rx="6" fill="#06b6d4" stroke="#67e8f9" stroke-width="2" />
      </g>
      <text x="300" y="325" font-family="'Space Grotesk', monospace" font-size="16" fill="#a5f3fc" text-anchor="middle" letter-spacing="4">PERFECT RHYTHM STREAK</text>
    `
  },
  "pixel-adventure": {
    primary: "#c084fc",
    secondary: "#f59e0b",
    content: `
      <g filter="url(#glow-pixel-adventure)" transform="translate(170, 60)">
        <!-- Retro Castle Dungeon -->
        <rect x="10" y="180" width="240" height="30" fill="#334155" stroke="#64748b" stroke-width="2" />
        <!-- Floating Gem Relic -->
        <polygon points="130,50 155,80 130,110 105,80" fill="#fbbf24" stroke="#fef08a" stroke-width="3" />
        <circle cx="130" cy="80" r="10" fill="#ffffff" opacity="0.8" />

        <!-- 8-Bit Pixel Knight -->
        <g transform="translate(60, 115)">
          <!-- Helmet -->
          <rect x="15" y="0" width="30" height="25" fill="#c084fc" />
          <rect x="25" y="8" width="18" height="6" fill="#18181b" />
          <!-- Armor body -->
          <rect x="12" y="25" width="36" height="30" fill="#7e22ce" />
          <!-- Sword -->
          <rect x="52" y="10" width="8" height="45" fill="#f8fafc" stroke="#38bdf8" stroke-width="1.5" />
          <rect x="44" y="38" width="24" height="6" fill="#fbbf24" />
          <!-- Legs -->
          <rect x="15" y="55" width="12" height="15" fill="#581c87" />
          <rect x="33" y="55" width="12" height="15" fill="#581c87" />
        </g>
      </g>
      <text x="300" y="325" font-family="'Space Grotesk', monospace" font-size="16" fill="#f3e8ff" text-anchor="middle" letter-spacing="4">LEGEND OF THE RETRO REALM</text>
    `
  }
};

// Write each game SVG
for (const [id, data] of Object.entries(gamesArtwork)) {
  const filePath = path.join(outDir, `${id}.svg`);
  const svg = wrapSvg(id, data.primary, data.secondary, data.content);
  fs.writeFileSync(filePath, svg.trim());
}

// Logo SVG
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <defs>
    <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="50%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <!-- Background Badge -->
  <rect x="6" y="6" width="108" height="108" rx="28" fill="#0e101a" stroke="url(#logo-grad)" stroke-width="3" filter="url(#logo-glow)"/>
  
  <!-- Arcade Controller Emblem / Letter H -->
  <g fill="none" stroke="url(#logo-grad)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <!-- Left Pillar -->
    <line x1="38" y1="32" x2="38" y2="88" />
    <!-- Right Pillar -->
    <line x1="82" y1="32" x2="82" y2="88" />
    <!-- Crossbar -->
    <line x1="38" y1="60" x2="82" y2="60" />
  </g>
  
  <!-- Action D-Pad dots -->
  <circle cx="60" cy="40" r="5" fill="#a855f7" />
  <circle cx="60" cy="80" r="5" fill="#06b6d4" />
</svg>`;

fs.writeFileSync(path.join(iconDir, 'logo.svg'), logoSvg.trim());
console.log('Successfully generated all 20 game SVGs and platform logo.');

