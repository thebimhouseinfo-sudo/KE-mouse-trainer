import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Sparkles, 
  MousePointer, 
  Flame, 
  RotateCcw, 
  Gamepad2, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Target, 
  Sparkle,
  BookOpen
} from 'lucide-react';
import { 
  Difficulty, 
  GameState, 
  EggState, 
  Egg, 
  BabyBat, 
  BigBat, 
  Wolf, 
  Bullet, 
  BabyBird 
} from './types';

// Let's create a solid Web-Audio synthesizer helper for immersive kid gameplay
class AudioSynth {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  init() {
    if (!this.enabled) return;
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playShoot() {
    this.init();
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(550, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playPowerShoot() {
    this.init();
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playHatch() {
    this.init();
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const chord = [261.63, 329.63, 392.00, 523.25, 659.25, 1046.50];
    chord.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.1, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.25);
    });
  }

  playHit() {
    this.init();
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playWolfHit() {
    this.init();
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  playPickup() {
    this.init();
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(640, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playNestShake() {
    this.init();
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(70, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(25, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playFail() {
    this.init();
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const chord = [392.00, 311.13, 261.63];
    chord.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);
      gain.gain.setValueAtTime(0.15, now + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.5);
    });
  }

  playVictory() {
    this.init();
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.12, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  }
}

function getBatSpawnPosition(angleDegrees: number) {
  const rad = angleDegrees * Math.PI / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);

  const t1 = dx < 0 ? (-150 - 1865) / dx : Infinity;
  const t2 = dy < 0 ? (-150 - 2220) / dy : Infinity;
  const t = Math.min(t1, t2);

  return {
    x: 1865 + t * dx,
    y: 2220 + t * dy
  };
}

const synthInstance = new AudioSynth();

export default function App() {
  // Game Configuration & Flow State
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [showVictoryScreen, setShowVictoryScreen] = useState<boolean>(false);
  
  // Kids Training Checklist / Interaction Feedback State
  const [mouseMoved, setMouseMoved] = useState<boolean>(false);
  const [leftClickDone, setLeftClickDone] = useState<boolean>(false);
  const [rightClickDone, setRightClickDone] = useState<boolean>(false);
  const [doubleClickDone, setDoubleClickDone] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Canvas element pointers
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRectRef = useRef<DOMRect | null>(null);

  // Entities and dynamics tracked in refs to prevent React state sync choke of high frequency frame loops
  const stateRef = useRef({
    score: 0,
    difficulty: Difficulty.EASY,
    tick: 0,
    eggs: [] as Egg[],
    babyBats: [] as BabyBat[],
    bigBats: [] as BigBat[],
    wolves: [] as Wolf[],
    bullets: [] as Bullet[],
    babyBirds: [] as BabyBird[],
    mouseX: 1984,
    mouseY: 1072,
    isLeftPressed: false,
    isRightPressed: false,
    isDragging: false,
    lastPowerShootTick: 0,
    lastLightShootTime: 0,
    nestShakeIntensity: 0,
    lastActivityTick: 0,
    activeBirdSpawnRequest: null as { x: number; y: number } | null,
    clouds: [] as { x: number; y: number; speed: number; scale: number }[],
    // Track dynamic statistics
    stats: {
      batHits: 0,
      missedShots: 0,
      birdsRescued: 0,
    },
    spawnTimers: {
      babyBat: 0,
      bigBat: 0,
      wolf: 180, // initial 3 seconds delay for first wolf appearance
    },
    // Interaction status mirror
    skillsTracker: {
      move: false,
      leftClick: false,
      rightClick: false,
      doubleClick: false,
      drag: false
    }
  });

  // State mirror to show in modern overlay
  const [uiSkills, setUiSkills] = useState({
    move: false,
    leftClick: false,
    rightClick: false,
    doubleClick: false,
    drag: false
  });

  const [stats, setStats] = useState({
    batHits: 0,
    missedShots: 0,
    birdsRescued: 0
  });

  // Assets load tracking
  const [assetsLoaded, setAssetsLoaded] = useState<boolean>(false);
  const imagesRef = useRef<Record<string, HTMLImageElement>>({});

  // 1. Initial State Setup
  useEffect(() => {
    // Load high score
    const stored = localStorage.getItem('nest_game_highscore');
    if (stored) {
      const num = parseInt(stored, 10);
      if (!isNaN(num)) {
        setHighScore(num);
      }
    }

    // Populate initial cloud list
    const clouds = [];
    for (let i = 0; i < 6; i++) {
      clouds.push({
        x: Math.random() * 3968,
        y: 100 + Math.random() * 400,
        speed: 1 + Math.random() * 2,
        scale: 0.5 + Math.random() * 1.2
      });
    }
    stateRef.current.clouds = clouds;

    // Load Spritesheet images cleanly from our root public folder
    // Use import.meta.env.BASE_URL to ensure correct path on GitHub Pages subdirectory
    const baseUrl = import.meta.env.BASE_URL;
    const assetSources: Record<string, string[]> = {
      'background': [`${baseUrl}Game background.png`],
      'baby_bat': [`${baseUrl}Baby bat.png`],
      'big_bat': [`${baseUrl}Big Bat.png`],
      'bird': [`${baseUrl}Bird.png`],
      'nest': [`${baseUrl}Nest.png`],
      'wolf': [`${baseUrl}Wolf.png`],
      'bullet': [`${baseUrl}Egg Bullet.png`],
      'canon': [`${baseUrl}Canon.png`],
      'egg': [`${baseUrl}Egg.png`],
      'mouse_click': [`${baseUrl}Mouse Click.png`]
    };

    let loadedCount = 0;
    const totalAssets = Object.keys(assetSources).length;

    Object.entries(assetSources).forEach(([key, srcList]) => {
      let pathIdx = 0;

      const attemptLoad = () => {
        if (pathIdx >= srcList.length) {
          // All paths failed, count as processed and display with vector fallbacks
          loadedCount++;
          if (loadedCount === totalAssets) {
            setAssetsLoaded(true);
          }
          return;
        }

        const img = new Image();
        img.onload = () => {
          loadedCount++;
          imagesRef.current[key] = img;
          if (loadedCount === totalAssets) {
            setAssetsLoaded(true);
          }
        };
        img.onerror = () => {
          pathIdx++;
          attemptLoad();
        };
        img.src = srcList[pathIdx];
      };

      attemptLoad();
    });
  }, []);

  // Update sound enabled setting in sync
  useEffect(() => {
    synthInstance.enabled = audioEnabled;
  }, [audioEnabled]);

  // Sync state parameters to ref
  useEffect(() => {
    stateRef.current.difficulty = difficulty;
  }, [difficulty]);

  // Update canvas rect cache on window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvasRectRef.current = canvas.getBoundingClientRect();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gameState === GameState.PLAYING) {
          handlePause();
        } else if (gameState === GameState.PAUSED) {
          handleResume();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  useEffect(() => {
    stateRef.current.score = score;
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('nest_game_highscore', score.toString());
    }
  }, [score, highScore]);

  // Start the Game
  const handleStartGame = (dif: Difficulty) => {
    // Sound init on user gesture
    synthInstance.init();
    synthInstance.playHatch();

    // Enter fullscreen mode
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log('Fullscreen request failed:', err);
      });
    }

    setDifficulty(dif);
    setScore(0);
    stateRef.current.score = 0;
    stateRef.current.stats = {
      batHits: 0,
      missedShots: 0,
      birdsRescued: 0
    };
    setStats({
      batHits: 0,
      missedShots: 0,
      birdsRescued: 0
    });

    // 5 Initial Eggs in the Nest
    const initialEggs: Egg[] = [
      { id: 1, originX: 3070, originY: 829, currentX: 3070, currentY: 829, rotation: 0, state: EggState.IN_NEST, vx: 0, vy: 0, glowTimer: 1800 }, // 30s
      { id: 2, originX: 3110, originY: 869, currentX: 3110, currentY: 869, rotation: 0, state: EggState.IN_NEST, vx: 0, vy: 0, glowTimer: 2100 },
      { id: 3, originX: 3000, originY: 850, currentX: 3000, currentY: 850, rotation: 0, state: EggState.IN_NEST, vx: 0, vy: 0, glowTimer: 2400 },
      { id: 4, originX: 3158, originY: 880, currentX: 3158, currentY: 880, rotation: 0, state: EggState.IN_NEST, vx: 0, vy: 0, glowTimer: 2700 },
      { id: 5, originX: 3040, originY: 890, currentX: 3040, currentY: 890, rotation: 0, state: EggState.IN_NEST, vx: 0, vy: 0, glowTimer: 3000 }
    ];

    const bb0 = getBatSpawnPosition(195);
    const bb1 = getBatSpawnPosition(210);
    const bb2 = getBatSpawnPosition(225);
    const bb3 = getBatSpawnPosition(240);
    const bg0 = getBatSpawnPosition(200);
    const bg1 = getBatSpawnPosition(235);

    stateRef.current.eggs = initialEggs;
    stateRef.current.babyBats = [
      { id: Date.now(), x: bb0.x, y: bb0.y, vx: 4, vy: 2, state: 'FLYING', hitsToNestLeft: 2, targetX: 3088, targetY: 929, frameIndex: 0, scale: 0.35, cooldownTimer: 0 },
      { id: Date.now() + 10, x: bb1.x, y: bb1.y, vx: 3, vy: 1, state: 'RESPAWNING', hitsToNestLeft: 2, targetX: 3088, targetY: 929, frameIndex: 0, scale: 0.35, cooldownTimer: 240 }, // enters at 4 seconds
      { id: Date.now() + 20, x: bb2.x, y: bb2.y, vx: 4, vy: 2, state: 'RESPAWNING', hitsToNestLeft: 2, targetX: 3088, targetY: 929, frameIndex: 0, scale: 0.35, cooldownTimer: 600 }, // enters at 10 seconds
      { id: Date.now() + 30, x: bb3.x, y: bb3.y, vx: 3, vy: 2.5, state: 'RESPAWNING', hitsToNestLeft: 2, targetX: 3088, targetY: 929, frameIndex: 0, scale: 0.35, cooldownTimer: 960 } // enters at 16 seconds
    ];
    stateRef.current.bigBats = [
      { id: Date.now() + 1, x: bg0.x, y: bg0.y, vx: 5, vy: 0, waveAngle: 2.1, state: 'FLYING', stolenEggId: null, frameIndex: 0, scale: 0.5, cooldownTimer: 0 },
      { id: Date.now() + 2, x: bg1.x, y: bg1.y, vx: 5, vy: 0, waveAngle: 0.5, state: 'RESPAWNING', stolenEggId: null, frameIndex: 0, scale: 0.5, cooldownTimer: 480 } // enters at 8-second mark
    ];
    stateRef.current.wolves = [];
    stateRef.current.bullets = [];
    stateRef.current.babyBirds = [];
    stateRef.current.spawnTimers = {
      babyBat: 0,
      bigBat: 100,
      wolf: 360 // Wolf enters 6 seconds into play to let children learn basic inputs first
    };
    stateRef.current.tick = 0;

    // Reset indicator checkpoints
    setMouseMoved(false);
    setLeftClickDone(false);
    setRightClickDone(false);
    setDoubleClickDone(false);
    setDragActive(false);
    setShowVictoryScreen(false);

    setGameState(GameState.PLAYING);
  };

  // Pause Game
  const handlePause = () => {
    setGameState(GameState.PAUSED);
  };

  // Resume Game
  const handleResume = () => {
    setGameState(GameState.PLAYING);
  };

  // Exit Game
  const handleExit = () => {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => {
        console.log('Fullscreen exit failed:', err);
      });
    }
    setGameState(GameState.START);
  };


  // 2. Physics & State updates inside a requestAnimationFrame loop
  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = () => {
      if (gameState !== GameState.PLAYING && gameState !== GameState.VICTORY) return;

      const state = stateRef.current;
      state.tick++;

      // During VICTORY, only animate birds flying away — skip all enemy/physics logic
      if (gameState === GameState.VICTORY) {
        state.babyBirds.forEach(bird => {
          if (bird.orbitState === 'CIRCLING') {
            const dAngle = 0.055;
            bird.orbitAngle = (bird.orbitAngle ?? 0) + dAngle;
            bird.orbitAccumulatedAngle = (bird.orbitAccumulatedAngle ?? 0) + dAngle;
            bird.x = (bird.centerX ?? 3088) + Math.cos(bird.orbitAngle) * (bird.orbitRadius ?? 180);
            bird.y = (bird.centerY ?? 929) + Math.sin(bird.orbitAngle) * (bird.orbitRadius ?? 180);
            if (bird.orbitAccumulatedAngle >= 2 * Math.PI) {
              bird.orbitState = 'FLYING_AWAY';
            }
          } else {
            bird.x += 10;
            bird.y -= 3;
          }
          bird.frameIndex = Math.floor(state.tick / 6) % 4;
        });
        state.babyBirds = state.babyBirds.filter(b => b.x < 4100);
        drawGame();
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      const isHard = state.difficulty === Difficulty.HARD;
      const speedMultiplier = isHard ? 1.85 : 1.0;

      // --- 1. Cloud Drifts ---
      state.clouds.forEach(c => {
        c.x += c.speed * (isHard ? 1.3 : 1.0);
        if (c.x > 4100) {
          c.x = -200;
          c.y = 100 + Math.random() * 400;
        }
      });

      // --- 2. Nest Shaking Decay ---
      if (state.nestShakeIntensity > 0) {
         state.nestShakeIntensity *= 0.92;
         if (state.nestShakeIntensity < 0.1) state.nestShakeIntensity = 0;
      }

      // --- 3. Eggs Updates (Manage Incubation/Glow cycles & Dropping Gravity) ---
      // Requirement: "mỗi lần bị dơi lớn hoặc sói trộm chỉ mất ngẫu nhiên 1 trứng, sau 30s trứng chuyển sang lấp lánh để ấp... sau khi trứng 1 ấp thành công mới bắt đầu đếm 30s cho trứng tiếp theo lấp lánh"
      const currentlyGlowingCount = state.eggs.filter(e => e.state === EggState.GLOWING).length;

      state.eggs.forEach(egg => {
        // Drop physics for fallen eggs (skip if returning to nest)
        if (egg.state === EggState.FALLEN && !(egg as any).returning) {
          egg.vy += 0.5; // gravity
          egg.currentX += egg.vx;
          egg.currentY += egg.vy;
          egg.rotation += egg.vx * 0.05;

          // Align on ground level
          if (egg.currentY > 1940) {
            egg.currentY = 1940;
            egg.vy = -egg.vy * 0.35; // bounce slightly
            egg.vx *= 0.9; // friction friction
            if (Math.abs(egg.vy) < 0.5) egg.vy = 0;
            if (Math.abs(egg.vx) < 0.2) egg.vx = 0;
          }

          // Bounce off left/right borders
          if (egg.currentX < 100) { egg.currentX = 100; egg.vx = -egg.vx; }
          if (egg.currentX > 3800) { egg.currentX = 3800; egg.vx = -egg.vx; }
        }

        // Linear interpolation for eggs returning back to safety upon Double-Click
        if ((egg as any).returning) {
          const dx = egg.originX - egg.currentX;
          const dy = egg.originY - egg.currentY;
          egg.currentX += dx * 0.15;
          egg.currentY += dy * 0.15;
          egg.rotation *= 0.85;

          if (Math.sqrt(dx * dx + dy * dy) < 4) {
            egg.currentX = egg.originX;
            egg.currentY = egg.originY;
            egg.rotation = 0;
            egg.state = EggState.IN_NEST;
            egg.vx = 0;
            egg.vy = 0;
            (egg as any).returning = false;
          }
        }

        // Egg glowing check ("sau 30s - 1800 ticks sẽ đổi sang lấp lánh... sau khi 1 quả được ấp thành công mới bắt đầu đếm cho quả khác")
        if (egg.state === EggState.IN_NEST && currentlyGlowingCount === 0) {
          if (egg.glowTimer > 0) {
            egg.glowTimer--;
            if (egg.glowTimer <= 0) {
              egg.state = EggState.GLOWING;
            }
          }
        }
      });

      // --- 4. Baby Bat dynamics ---
      state.babyBats.forEach(bat => {
        if (bat.state === 'FLYING') {
          // Slide towards bird nest
          const dx = bat.targetX - bat.x;
          const dy = bat.targetY - bat.y;
          const dist = Math.sqrt(dx*dx + dy*dy);

          const baseSpeed = 2.4 * speedMultiplier;
          bat.vx = (dx / dist) * baseSpeed;
          bat.vy = (dy / dist) * baseSpeed;

          bat.x += bat.vx;
          bat.y += bat.vy;

          // Check hit on Bird Nest! "Dơi đâm vào tổ 2 lần sẽ làm rơi trứng, rung lắc tổ"
          if (dist < 120) {
            state.nestShakeIntensity = 25;
            synthInstance.playNestShake();

            bat.state = 'REBOUNDING';
            // Bounce forcefully back
            bat.vx = -bat.vx * 1.5;
            bat.vy = -bat.vy * 1.5;
            bat.hitsToNestLeft--;

            if (bat.hitsToNestLeft <= 0) {
              // Trigger single random egg to fall
              const nestedEggs = state.eggs.filter(e => e.state === EggState.IN_NEST || e.state === EggState.GLOWING);
              if (nestedEggs.length > 0) {
                const targetEggIdx = Math.floor(Math.random() * nestedEggs.length);
                const egg = nestedEggs[targetEggIdx];
                egg.state = EggState.FALLEN;
                egg.vx = -(5 + Math.random() * 5); // Fall leftwards
                egg.vy = -8 - Math.random() * 5;  // bounce up
                egg.glowTimer = 500; // Reset timer
                
                synthInstance.playFail();
              }
              bat.hitsToNestLeft = 2; // reset hit counter
            }
          }
        } else if (bat.state === 'REBOUNDING') {
          // Decelerate and recover
          bat.x += bat.vx;
          bat.y += bat.vy;
          bat.vx *= 0.93;
          bat.vy *= 0.93;

          if (Math.abs(bat.vx) < 0.5) {
            bat.state = 'FLYING';
          }
        } else if (bat.state === 'DEATH') {
          bat.y += 12; // sink rapidly down
          bat.x += bat.vx;
          bat.vx *= 0.95;
          if (bat.y > 2200) {
            bat.state = 'RESPAWNING';
            bat.cooldownTimer = 600; // 10 seconds
          }
        } else if (bat.state === 'RESPAWNING') {
          if (bat.cooldownTimer > 0) {
            bat.cooldownTimer--;
          } else {
            bat.state = 'FLYING';
            const angle = 195 + Math.random() * 45;
            const pos = getBatSpawnPosition(angle);
            bat.x = pos.x;
            bat.y = pos.y;
            bat.vx = 3;
            bat.vy = 2;
            bat.hitsToNestLeft = 2;
          }
        }
      });

      // --- 5. Big Bat swarm pattern (Sinusoidal Stealer) ---
      state.bigBats.forEach(bat => {
        if (bat.state === 'FLYING') {
          bat.x += 3.5 * speedMultiplier;
          bat.waveAngle += isHard ? 0.08 : 0.045;
          bat.y = 450 + Math.sin(bat.waveAngle) * 250;

          // Upon arriving at the nest, lock an egg!
          if (bat.x >= 2980) {
            const stealableEggs = state.eggs.filter(e => e.state === EggState.IN_NEST || e.state === EggState.GLOWING);
            if (stealableEggs.length > 0) {
              const egg = stealableEggs[Math.floor(Math.random() * stealableEggs.length)];
              egg.state = EggState.STOLEN;
              bat.stolenEggId = egg.id;
              bat.state = 'STOLEN_RETREAT';
              
              state.nestShakeIntensity = 12;
              synthInstance.playNestShake();
            } else {
              // No eggs to grab, just retreat empty handed
              bat.state = 'STOLEN_RETREAT';
            }
          }
        } else if (bat.state === 'STOLEN_RETREAT') {
          // Fly backward left to flee with the egg
          bat.x -= 3.0 * speedMultiplier;
          bat.waveAngle += 0.04;
          bat.y = 450 + Math.sin(bat.waveAngle) * 200;

          // If carries egg, sync its position directly underneath the flying thief
          if (bat.stolenEggId !== null) {
            const egg = state.eggs.find(e => e.id === bat.stolenEggId);
            if (egg) {
              egg.currentX = bat.x;
              egg.currentY = bat.y + 80;
            }
          }

          // If successfully escaped, mark egg stolen permanently
          if (bat.x < -100) {
            if (bat.stolenEggId !== null) {
              const egg = state.eggs.find(e => e.id === bat.stolenEggId);
              if (egg) {
                egg.state = EggState.STOLEN;
              }
            }
            bat.stolenEggId = null;
            bat.state = 'RESPAWNING';
            bat.cooldownTimer = 600; // 10 seconds respawn (600 ticks)
          }
        } else if (bat.state === 'DEATH') {
          bat.y += 15;
          if (bat.y > 2200) {
            bat.state = 'RESPAWNING';
            bat.cooldownTimer = 600; // 10 seconds respawn (600 ticks)
          }
        } else if (bat.state === 'RESPAWNING') {
          if (bat.cooldownTimer > 0) {
            bat.cooldownTimer--;
          } else {
            bat.state = 'FLYING';
            const angle = 195 + Math.random() * 45;
            const pos = getBatSpawnPosition(angle);
            bat.x = pos.x;
            bat.y = pos.y;
            bat.vx = 5;
            bat.vy = 0;
            bat.waveAngle = Math.random() * Math.PI;
            bat.stolenEggId = null;
          }
        }
      });

      // --- 6. Wolf (Sói) cycle management ---
      // "sói xuất hiện mỗi 30s. Nếu bị đuổi rẽ 20s xuất hiện lại, sói tới cây nhảy lên lấy trứng rồi ôm đi ngược lại..."
      if (state.wolves.length === 0) {
        if (state.spawnTimers.wolf > 0) {
          state.spawnTimers.wolf--;
        } else {
          state.wolves.push({
            id: Date.now(),
            x: -150,
            y: 1750, // ground level for render
            vx: 3 * speedMultiplier,
            state: 'WALKING',
            stolenEggId: null,
            hitPoints: isHard ? 26 : 14,
            frameIndex: 0,
            scale: 1.35,
            cooldownTimer: 0
          });
        }
      }

      state.wolves.forEach(wolf => {
        // Guarantee wolf is always strictly walking/resting on ground level 1750 unless actively leaping in STEALING state
        if (wolf.state !== 'STEALING') {
          wolf.y = 1750;
        }

        // Continuous left click drag over the wolf to push/chase it back!
        // "Thao tác bắn sói là nhấn giữ chuột trái và drag theo sói cho tới khi nó ra khỏi màn hình"
        if (state.isLeftPressed) {
          const mdx = state.mouseX - wolf.x;
          const mdy = state.mouseY - (wolf.y + 40);
          const mdist = Math.sqrt(mdx*mdx + mdy*mdy);
          if (mdist < 260) {
            // Drop stolen egg if carrying one
            if (wolf.stolenEggId !== null) {
              const egg = state.eggs.find(e => e.id === wolf.stolenEggId);
              if (egg) {
                egg.state = EggState.FALLEN;
                egg.currentX = wolf.x;
                egg.currentY = wolf.y;
                egg.vx = -4; // roll left
                egg.vy = -3;
              }
              wolf.stolenEggId = null;
            }

            // Immediately switch to crying & push backwards leftwards
            wolf.state = 'CRYING_RUN_AWAY';
            wolf.y = 1750; // Force to ground level to prevent floating!
            wolf.cryingTimer = Math.max(wolf.cryingTimer || 0, 75); // stay in crying mode as long as we drag
            wolf.x -= 4.2 * speedMultiplier; // reduced push back speed so wolf runs away more smoothly

            // Spawn visual bullet and trigger hit sound continuously every 8 ticks
            if (state.tick % 8 === 0) {
              const angle = Math.atan2(wolf.y + 40 - 2220, wolf.x - 1865);
              const startX = 1865 + Math.cos(angle) * 440;
              const startY = 2220 + Math.sin(angle) * 440;

              state.bullets.push({
                id: Date.now() + Math.random(),
                x: startX,
                y: startY,
                vx: Math.cos(angle) * 55,
                vy: Math.sin(angle) * 55,
                targetX: wolf.x,
                targetY: wolf.y + 40,
                type: 'LIGHT',
                frameIndex: 0,
                lockedTargetId: wolf.id,
                lockedTargetType: 'WOLF'
              });

              synthInstance.playWolfHit();
            }
          }
        }

        if (wolf.state === 'WALKING') {
          // check if there is any fallen egg on the ground nearby
          const fallenEggs = state.eggs.filter(e => e.state === EggState.FALLEN);
          let grabbedEgg = null;
          for (const egg of fallenEggs) {
            if (Math.abs(wolf.x - egg.currentX) < 140) {
              grabbedEgg = egg;
              break;
            }
          }

          if (grabbedEgg) {
            grabbedEgg.state = EggState.STOLEN;
            wolf.stolenEggId = grabbedEgg.id;
            wolf.state = 'RETREATING';
            synthInstance.playNestShake();
          } else {
            if (wolf.x < 2820) {
              wolf.x += wolf.vx;
            } else {
              // At base tree. Check if there are any eggs in the nest before leaping to steal!
              const stealableEggs = state.eggs.filter(e => e.state === EggState.IN_NEST || e.state === EggState.GLOWING);
              if (stealableEggs.length > 0) {
                wolf.state = 'STEALING';
              }
            }
          }
        } else if (wolf.state === 'STEALING') {
          // Leap upwards curve to grab egg
          if (wolf.y > 880 && wolf.stolenEggId === null) {
            wolf.y -= 15;
          } else {
            // Reached egg altitude, snag one
            if (wolf.stolenEggId === null) {
              const stealableEggs = state.eggs.filter(e => e.state === EggState.IN_NEST || e.state === EggState.GLOWING);
              if (stealableEggs.length > 0) {
                const egg = stealableEggs[Math.floor(Math.random() * stealableEggs.length)];
                egg.state = EggState.STOLEN;
                wolf.stolenEggId = egg.id;
                
                state.nestShakeIntensity = 15;
                synthInstance.playNestShake();
              }
            }
            
            // Descent back to ground Y = 1750
            if (wolf.y < 1750) {
              wolf.y += 15;
            } else {
              wolf.y = 1750;
              wolf.state = 'RETREATING';
            }
          }

          // Sync stolen egg in leaps
          if (wolf.stolenEggId !== null) {
            const egg = state.eggs.find(e => e.id === wolf.stolenEggId);
            if (egg) {
              egg.currentX = wolf.x + 30;
              egg.currentY = wolf.y + 40;
            }
          }
        } else if (wolf.state === 'RETREATING') {
          // Walk backward carrying egg
          wolf.x -= 2.2 * speedMultiplier;

          if (wolf.stolenEggId !== null) {
            const egg = state.eggs.find(e => e.id === wolf.stolenEggId);
            if (egg) {
              egg.currentX = wolf.x - 30;
              egg.currentY = wolf.y + 80;
            }
          }

          if (wolf.x < -150) {
            // Escaped safely
            if (wolf.stolenEggId !== null) {
              const egg = state.eggs.find(e => e.id === wolf.stolenEggId);
              if (egg) {
                egg.state = EggState.STOLEN;
              }
            }
            wolf.stolenEggId = null;
            state.wolves = [];
            state.spawnTimers.wolf = 720; // reappear 12s later
            setScore(prev => Math.max(0, prev - 40));
          }
        } else if (wolf.state === 'CRYING_RUN_AWAY') {
          // Force to ground Y to prevent floating
          wolf.y = 1750;
          // Decrement crying timer. If no longer hit, transition back to WALKING (towards tree)
          if (wolf.cryingTimer !== undefined && wolf.cryingTimer > 0) {
            wolf.cryingTimer--;
            // Crying run away to left, crying sprites (slower and smoother)
            wolf.x -= 1.8 * speedMultiplier;
          } else {
            // No longer crying, turns around and goes forward again!
            wolf.state = 'WALKING';
          }
          
          if (wolf.x < -150) {
            // Remove wolf when it runs off screen
            state.wolves = state.wolves.filter(w => w.id !== wolf.id);
          }
        }
      });

      // --- 7. Bullet coordinates updates ---
      state.bullets.forEach(bullet => {
        if (bullet.isExploding) {
          if (bullet.explodeTimer !== undefined) {
            bullet.explodeTimer--;
          }
          return;
        }

        bullet.x += bullet.vx;
        bullet.y += bullet.vy;

        // Mouse-training requirement: must click precisely on the enemies to hit them!
        // We only trigger hits if this bullet was locked to a specific enemy at click time.
        if (bullet.lockedTargetId && bullet.lockedTargetType) {
          if (bullet.lockedTargetType === 'BABY_BAT') {
            const bat = state.babyBats.find(b => b.id === bullet.lockedTargetId);
            if (bat && (bat.state === 'FLYING' || bat.state === 'REBOUNDING')) {
              const dx = bullet.x - bat.x;
              const dy = bullet.y - (bat.y - 20);
              const dist = Math.sqrt(dx*dx + dy*dy);
              // Trigger hit when the fast bullet flies into the bat's standard rendering zone
              if (dist < 140) {
                bat.state = 'DEATH';
                bat.vy = 8;
                bat.vx = bullet.vx * 0.15;
                state.stats.batHits++; // Increment bat hits!
                
                // Bullet explodes!
                bullet.isExploding = true;
                bullet.frameIndex = 4; // explode state
                bullet.explodeTimer = 8;
                bullet.vx = 0;
                bullet.vy = 0;
                
                setScore(prev => prev + 15);
                synthInstance.playHit();
                state.skillsTracker.leftClick = true;
                setLeftClickDone(true);
              }
            }
          } else if (bullet.lockedTargetType === 'BIG_BAT') {
            const bat = state.bigBats.find(b => b.id === bullet.lockedTargetId);
            if (bat && (bat.state === 'FLYING' || bat.state === 'STOLEN_RETREAT')) {
              const dx = bullet.x - bat.x;
              const dy = bullet.y - (bat.y - 10);
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < 150) {
                bat.state = 'DEATH';
                state.stats.batHits++; // Increment bat hits!
                // Drop the egg if it has one
                if (bat.stolenEggId !== null) {
                  const egg = state.eggs.find(e => e.id === bat.stolenEggId);
                  if (egg) {
                    egg.state = EggState.FALLEN;
                    egg.vy = 2; // small initial drop velocity
                    egg.vx = -1;
                  }
                }
                bat.stolenEggId = null;
                
                // Bullet explodes!
                bullet.isExploding = true;
                bullet.frameIndex = 4; // explode state
                bullet.explodeTimer = 8;
                bullet.vx = 0;
                bullet.vy = 0;

                setScore(prev => prev + 25);
                synthInstance.playHit();
                state.skillsTracker.leftClick = true;
                setLeftClickDone(true);
              }
            }
          } else if (bullet.lockedTargetType === 'WOLF') {
            const wolf = state.wolves.find(w => w.id === bullet.lockedTargetId);
            // Wolf can be hit in WALKING, STEALING, RETREATING, OR even while CRYING (to reset cry timer!)
            if (wolf && (wolf.state === 'WALKING' || wolf.state === 'STEALING' || wolf.state === 'RETREATING' || wolf.state === 'CRYING_RUN_AWAY')) {
              const dx = bullet.x - wolf.x;
              const dy = bullet.y - (wolf.y + 40);
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < 180) {
                // Bullet explodes!
                bullet.isExploding = true;
                bullet.frameIndex = 4; // explode state
                bullet.explodeTimer = 8;
                bullet.vx = 0;
                bullet.vy = 0;

                // Hit sound
                synthInstance.playWolfHit();
                
                // Skill indicators
                if (bullet.type === 'POWER') {
                  state.skillsTracker.drag = true;
                  setDragActive(true);
                } else {
                  state.skillsTracker.leftClick = true;
                  setLeftClickDone(true);
                }

                // Dropping egg logic at exact location
                if (wolf.stolenEggId !== null) {
                  const egg = state.eggs.find(e => e.id === wolf.stolenEggId);
                  if (egg) {
                    egg.state = EggState.FALLEN;
                    egg.currentX = wolf.x; // EXACT location hit!
                    egg.currentY = wolf.y; // EXACT location hit!
                    egg.vx = -4; // rolls leftwards
                    egg.vy = -3;
                  }
                  wolf.stolenEggId = null;
                }

                // If not already crying, or even if crying, set/reset the crying running away state
                wolf.state = 'CRYING_RUN_AWAY';
                wolf.cryingTimer = 150; // reset/set crying running away timer for 2.5 seconds (150 frames)
                setScore(prev => prev + 50);
              }
            }
          }
        }
      });

      // Filter out off-screen or exploded bullets
      state.bullets = state.bullets.filter(b => {
        if (b.isExploding && b.explodeTimer !== undefined && b.explodeTimer <= 0) {
          return false; // remove after the explosion completes
        }
        const onScreen = b.x >= 0 && b.x <= 4000 && b.y >= 0 && b.y <= 2200;
        if (!onScreen && !b.isExploding) {
          state.stats.missedShots++; // Count missed bullets when they fly off screen!
        }
        return onScreen;
      });

      // --- 8. Baby Birds flight path updates ---
      state.babyBirds.forEach(bird => {
        if (bird.orbitState === 'CIRCLING') {
          const dAngle = 0.055; // circular increment per frame (~115 frames)
          bird.orbitAngle = (bird.orbitAngle ?? 0) + dAngle;
          bird.orbitAccumulatedAngle = (bird.orbitAccumulatedAngle ?? 0) + dAngle;
          bird.x = (bird.centerX ?? 3088) + Math.cos(bird.orbitAngle) * (bird.orbitRadius ?? 180);
          bird.y = (bird.centerY ?? 929) + Math.sin(bird.orbitAngle) * (bird.orbitRadius ?? 180);

          if (bird.orbitAccumulatedAngle >= 2 * Math.PI) {
            bird.orbitState = 'FLYING_AWAY';
          }
        } else {
          bird.x += 10;
          bird.y -= 3; // gentle rise
        }
        bird.frameIndex = Math.floor(state.tick / 6) % 4;
      });
      state.babyBirds = state.babyBirds.filter(b => b.x < 4100);

      // Win/Lose check logic
      const inPlayCount = state.eggs.filter(e => e.state === EggState.IN_NEST || e.state === EggState.GLOWING || e.state === EggState.FALLEN).length;
      const hatchedCount = state.eggs.filter(e => e.state === EggState.HATCHED).length;
      const stolenCount = state.eggs.filter(e => e.state === EggState.STOLEN).length;

      if (stolenCount === 5) {
        synthInstance.playFail();
        setStats({
          batHits: state.stats.batHits,
          missedShots: state.stats.missedShots,
          birdsRescued: state.stats.birdsRescued
        });
        setGameState(GameState.DEFEAT);
      } else if (inPlayCount === 0 && hatchedCount > 0 && gameState === GameState.PLAYING) {
        synthInstance.playVictory();
        setStats({
          batHits: state.stats.batHits,
          missedShots: state.stats.missedShots,
          birdsRescued: state.stats.birdsRescued
        });
        setGameState(GameState.VICTORY);
        // Wait for ALL baby birds to finish orbit + fly off screen before showing victory screen
        const waitForBirds = () => {
          if (stateRef.current.babyBirds.length === 0) {
            setShowVictoryScreen(true);
          } else {
            setTimeout(waitForBirds, 200);
          }
        };
        setTimeout(waitForBirds, 200);
      }

      // Smooth Sync values to state trackers
      setUiSkills({
        move: state.skillsTracker.move,
        leftClick: state.skillsTracker.leftClick,
        rightClick: state.skillsTracker.rightClick,
        doubleClick: state.skillsTracker.doubleClick,
        drag: state.skillsTracker.drag
      });

      // Render the active frame
      drawGame();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, difficulty, assetsLoaded]);

  // 3. Main Graphics Renderer on canvas
  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = stateRef.current;
    const images = imagesRef.current;

    // Clear Canvas fully
    ctx.clearRect(0,0, 3968, 2144);

    // BACKGROUND LAYER
    if (images.background) {
      ctx.drawImage(images.background, 0, 0, 3968, 2144);
    } else {
      // Magnificent responsive vector gradient of morning forest meadow for toddler
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 1400);
      skyGrad.addColorStop(0, '#bae6fd'); // sky blue
      skyGrad.addColorStop(0.6, '#fef08a'); // soft yellow horizon warmth
      skyGrad.addColorStop(1, '#86efac'); // grass transition
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 3968, 2144);

      // Sun
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(3600, 300, 150, 0, Math.PI * 2);
      ctx.fill();
      
      // Sun Rays
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 15;
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(3600 + Math.cos(angle)*190, 300 + Math.sin(angle)*190);
        ctx.lineTo(3600 + Math.cos(angle)*260, 300 + Math.sin(angle)*260);
        ctx.stroke();
      }

      // Meadow green base ground
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(0, 1447, 3968, 700);

      // Hill vectors
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(800, 1600, 1200, 400, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.ellipse(3200, 1650, 1500, 450, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // SCENERY: Cloud drawings
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    state.clouds.forEach(cloud => {
      ctx.save();
      ctx.translate(cloud.x, cloud.y);
      ctx.scale(cloud.scale, cloud.scale);
      
      ctx.beginPath();
      ctx.arc(0, 0, 60, 0, Math.PI*2);
      ctx.arc(70, -20, 75, 0, Math.PI*2);
      ctx.arc(150, 0, 60, 0, Math.PI*2);
      ctx.rect(0, -10, 150, 70); // fill bottom
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });

    // SCENERY: The Majestic Oak Tree (nest branches extending rightward)
    ctx.save();
    // Shaking effect when bats attack nest!
    if (state.nestShakeIntensity > 0) {
      const shakeX = (Math.random() - 0.5) * state.nestShakeIntensity;
      const shakeY = (Math.random() - 0.5) * state.nestShakeIntensity;
      ctx.translate(shakeX, shakeY);
    }

    // 4. NEST BACKING LAYER
    // Sized by scale: 0.3, pivot: (3088, 929)
    if (images.nest) {
      ctx.save();
      ctx.translate(3088, 929);
      ctx.scale(0.3, 0.3);
      // Sprite Frame info: Full nest is at x=0, y=0, w=1200, h=1200
      ctx.drawImage(images.nest, 0, 0, 1200, 1200, -600, -600, 1200, 1200);
      ctx.restore();
    } else {
      // Nest vector fallback
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 14;
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(3088, 929, 230, 140, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Twigs design
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 6;
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.arc(3088 + (Math.random()-0.5)*80, 929 + (Math.random()-0.5)*30, 190 + Math.random()*20, 0 + i*0.2, Math.PI+ i*0.3);
        ctx.stroke();
      }
    }

    // 5. EGGS IN NEST (Rendered after backing, but before over-nest overlay for occlusion!)
    state.eggs.forEach(egg => {
      if (egg.state === EggState.IN_NEST || egg.state === EggState.GLOWING) {
        ctx.save();
        ctx.translate(egg.currentX, egg.currentY);
        ctx.scale(egg.state === EggState.GLOWING ? 0.3 + Math.sin(state.tick * 0.15)*0.015 : 0.3, 0.3);

        if (images.egg) {
          // Sprite dimensions: Frame x offset. Normal Egg is at x=0. Glowing Egg 1, 2, 3 at 600, 1200, 1800.
          let srcX = 0;
          if (egg.state === EggState.GLOWING) {
            const glowFrame = 1 + (Math.floor(state.tick / 6) % 3); // cycles Glowing 1,2,3
            srcX = glowFrame * 600;
          }
          ctx.drawImage(images.egg, srcX, 0, 600, 600, -300, -300, 600, 600);
        } else {
          // Shaded white/golden egg ellipse fallback
          const gr = ctx.createRadialGradient(-35, -55, 10, 0, 0, 150);
          if (egg.state === EggState.GLOWING) {
            gr.addColorStop(0, '#fef08a');
            gr.addColorStop(0.5, '#fde047');
            gr.addColorStop(1, '#ca8a04');
            
            // Aura glow circle
            ctx.fillStyle = 'rgba(253, 224, 71, 0.28)';
            ctx.beginPath();
            ctx.arc(0, 0, 200, 0, Math.PI*2);
            ctx.fill();

            // Star sparkles
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(-160, -10); ctx.lineTo(-110, -10);
            ctx.moveTo(-135, -35); ctx.lineTo(-135, 15);
            ctx.moveTo(110, -10); ctx.lineTo(160, -10);
            ctx.moveTo(135, -35); ctx.lineTo(135, 15);
            ctx.stroke();
          } else {
            gr.addColorStop(0, '#ffffff');
            gr.addColorStop(0.5, '#fbbf24'); // soft gold elements
            gr.addColorStop(1, '#d97706');
          }
          
          ctx.fillStyle = gr;
          ctx.beginPath();
          ctx.ellipse(0, 0, 110, 150, 0, 0, Math.PI*2);
          ctx.fill();
        }
        ctx.restore();
      }
    });

    // 6. FRONT OVER-NEST OVERLAY
    // Pivoted: (3093, 909), scale: 0.32
    if (images.nest) {
      ctx.save();
      ctx.translate(3093, 909);
      ctx.scale(0.32, 0.32);
      // Sprite Frame: Front nest is at x=1200, y=0, w=1200, h=1200
      ctx.drawImage(images.nest, 1200, 0, 1200, 1200, -600, -600, 1200, 1200);
      ctx.restore();
    } else {
      // Straw twigs facade fallback
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.ellipse(3093, 919, 235, 115, 0, 0, Math.PI, false); // bottom half only
      ctx.stroke();
    }

    ctx.restore(); // end trees nest shake wrapper

    // 7. FALLEN EGGS ON MEADOW
    state.eggs.forEach(egg => {
      if (egg.state === EggState.FALLEN) {
        ctx.save();
        ctx.translate(egg.currentX, egg.currentY);
        ctx.rotate(egg.rotation);
        ctx.scale(0.3, 0.3);

        if (images.egg) {
          ctx.drawImage(images.egg, 0, 0, 600, 600, -300, -300, 600, 600);
        } else {
          const gr = ctx.createRadialGradient(-35, -55, 10, 0, 0, 150);
          gr.addColorStop(0, '#f3f4f6');
          gr.addColorStop(0.6, '#9ca3af');
          gr.addColorStop(1, '#4b5563');
          ctx.fillStyle = gr;
          ctx.beginPath();
          ctx.ellipse(0, 0, 110, 150, 0, 0, Math.PI*2);
          ctx.fill();
        }
        ctx.restore();

        // Arrow pointer pointing to the fallen egg to help little kids locate it
        ctx.save();
        ctx.translate(egg.currentX, egg.currentY - 140 + Math.sin(state.tick * 0.1)*14);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(0, 40);
        ctx.lineTo(-30, 0);
        ctx.lineTo(-12, 0);
        ctx.lineTo(-12, -45);
        ctx.lineTo(12, -45);
        ctx.lineTo(12, 0);
        ctx.lineTo(30, 0);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = 'center';
        ctx.fillText("Double-Click", 0, -65);
        ctx.restore();
      }
    });

    // 8. CHICKS (Successfully incubated baby birds flying away)
    state.babyBirds.forEach(bird => {
      ctx.save();
      ctx.translate(bird.x, bird.y);
      let lookDir = 1;
      if (bird.orbitState === 'CIRCLING') {
        const velX = -Math.sin(bird.orbitAngle ?? 0);
        if (velX < 0) lookDir = -1;
      }
      ctx.scale(0.5 * lookDir, 0.5);

      if (images.bird) {
        // Sprite: w=350, h=350. Frame offset = frameIndex * 350
        ctx.drawImage(images.bird, bird.frameIndex * 350, 0, 350, 350, -175, -175, 350, 350);
      } else {
        // Cute vector chick fallback
        ctx.fillStyle = '#fde047'; // bright yellow round body
        ctx.beginPath();
        ctx.arc(0, 0, 100, 0, Math.PI*2);
        ctx.fill();

        // Cute face
        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.arc(35, -20, 25, 0, Math.PI*2);
        ctx.arc(-25, -20, 25, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(37, -20, 10, 0, Math.PI*2);
        ctx.arc(-23, -20, 10, 0, Math.PI*2);
        ctx.fill();

        // Beak
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(35, 15);
        ctx.lineTo(0, 30);
        ctx.closePath();
        ctx.fill();

        // Wings flapping
        ctx.save();
        ctx.translate(-70, 0);
        ctx.rotate(Math.sin(state.tick * 0.45) * 0.6);
        ctx.fillStyle = '#ca8a04';
        ctx.beginPath();
        ctx.ellipse(0, 0, 30, 60, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    });

    // 9. BULLET INSTANCES
    state.bullets.forEach(bullet => {
      ctx.save();
      ctx.translate(bullet.x, bullet.y);
      ctx.rotate(Math.atan2(bullet.vy, bullet.vx));
      ctx.scale(0.67, 0.67);

      if (images.bullet) {
        // Egg Bullet frames is 300x300. Normal bullet is frameIndex = 0. Explosion frameIndex = 4.
        ctx.drawImage(images.bullet, bullet.frameIndex * 300, 0, 300, 300, -150, -150, 300, 300);
      } else {
        // Vector golden yolk capsule bullet fallback
        if (bullet.frameIndex === 4 || bullet.frameIndex === 3) {
          // Yellow splash sparks
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(0, 0, 65, 0, Math.PI*2);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(0, 0, 40, 0, Math.PI*2);
          ctx.fill();
        } else {
          ctx.fillStyle = bullet.type === 'POWER' ? '#ef4444' : '#f59e0b';
          ctx.beginPath();
          ctx.ellipse(0, 0, 50, 30, 0, 0, Math.PI*2);
          ctx.fill();
        }
      }
      ctx.restore();
    });

    // 10. ENEMIES: Baby Bats
    state.babyBats.forEach(bat => {
      if (bat.state === 'RESPAWNING') return; // skip rendering while dead/respawning
      ctx.save();
      ctx.translate(bat.x, bat.y);
      // Look direction vx
      const lookDir = bat.vx < 0 ? -1 : 1;
      
      // Flip upside down when dead - nose-dive head pointing straight down
      if (bat.state === 'DEATH') {
        ctx.scale(bat.scale * lookDir, bat.scale);
        ctx.rotate(Math.PI); // 180° — fully inverted, head straight down
      } else {
        ctx.scale(bat.scale * lookDir, bat.scale);
        ctx.rotate(6 * Math.PI / 180); // Rotate slightly by 6 degrees for a natural look
      }

      if (images.baby_bat) {
        // Sprite Frame: frame_0, 1, 2, 3 at size 680x680
        // When dead, use frame 3 and stop animation
        const index = bat.state === 'DEATH' ? 3 : (Math.floor(state.tick / 6) % 4);
        ctx.drawImage(images.baby_bat, index * 680, 0, 680, 680, -340, -340, 680, 680);
      } else {
        // Cute purple cartoon bat vector fallback
        ctx.fillStyle = '#581c87';
        // Left wings
        ctx.save();
        ctx.translate(-140, 0);
        ctx.rotate(Math.sin(state.tick * 0.25) * 0.7);
        ctx.beginPath();
        ctx.ellipse(0, 0, 130, 60, Math.PI/4, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();

        // Right wings
        ctx.save();
        ctx.translate(140, 0);
        ctx.rotate(-Math.sin(state.tick * 0.25) * 0.7);
        ctx.beginPath();
        ctx.ellipse(0, 0, 130, 60, -Math.PI/4, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();

        // Head/Body
        ctx.beginPath();
        ctx.arc(0, 0, 110, 0, Math.PI*2);
        ctx.fill();

        // Ears
        ctx.beginPath();
        ctx.moveTo(-100, -80); ctx.lineTo(-40, -110); ctx.lineTo(-30, -50);
        ctx.moveTo(100, -80); ctx.lineTo(40, -110); ctx.lineTo(30, -50);
        ctx.fill();

        // Eyes (yellow dots)
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(-30, -25, 12, 0, Math.PI*2);
        ctx.arc(30, -25, 12, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-30, -25, 5, 0, Math.PI*2);
        ctx.arc(30, -25, 5, 0, Math.PI*2);
        ctx.fill();
      }

      ctx.restore();
    });

    // 11. ENEMIES: Big Bat
    state.bigBats.forEach(bat => {
      if (bat.state === 'RESPAWNING') return; // skip rendering while dead/respawning
      ctx.save();
      ctx.translate(bat.x, bat.y);
      const lookDir = bat.state === 'STOLEN_RETREAT' ? -1 : 1;
      let scaleFactor = bat.scale;
      if (bat.stolenEggId !== null) {
        scaleFactor *= 1.2;
      }

      // When dead, rotate to point head down and stop wing animation
      if (bat.state === 'DEATH') {
        ctx.scale(scaleFactor * lookDir, scaleFactor);
        ctx.rotate(Math.PI / 2); // 90 degree rotation to point head down
      } else {
        ctx.scale(scaleFactor * lookDir, scaleFactor);
      }

      if (images.big_bat) {
        let srcX = 0;
        let srcY = 0;
        // When dead, use fixed frame to stop wing animation
        const frameIndex = bat.state === 'DEATH' ? 0 : (Math.floor(state.tick / 6) % 4);

        if (bat.state === 'STOLEN_RETREAT' && bat.stolenEggId !== null) {
          srcX = frameIndex * 800; // 0, 800, 1600, 2400
          srcY = 800; // y-coordinate 800 is the fly_with_egg row
        } else {
          srcX = frameIndex * 800; // 0, 800, 1600, 2400
          srcY = 0; // y-coordinate 0 is the fly row
        }
        ctx.drawImage(images.big_bat, srcX, srcY, 800, 800, -400, -400, 800, 800);
      } else {
        // Slate colored large vampire bat fallback
        ctx.fillStyle = '#312e81';

        // Wings spans
        ctx.save();
        ctx.translate(-220, 0);
        ctx.rotate(Math.sin(state.waveAngle) * 0.6);
        ctx.beginPath();
        ctx.ellipse(0, 0, 200, 75, Math.PI/5, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(220, 0);
        ctx.rotate(-Math.sin(state.waveAngle) * 0.6);
        ctx.beginPath();
        ctx.ellipse(0, 0, 200, 75, -Math.PI/5, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();

        // Core round bat torso
        ctx.beginPath();
        ctx.arc(0, 0, 140, 0, Math.PI*2);
        ctx.fill();

        // Eyes yellow
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(-38, -35, 18, 0, Math.PI*2);
        ctx.arc(38, -35, 18, 0, Math.PI*2);
        ctx.fill();

        // Captured egg placeholder drawing if image missing
        if (bat.stolenEggId !== null) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.ellipse(0, 100, 45, 60, 0, 0, Math.PI*2);
          ctx.fill();
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      }

      ctx.restore();
    });

    // 12. ENEMIES: Wolf
    state.wolves.forEach(wolf => {
      ctx.save();
      ctx.translate(wolf.x, wolf.y);
      const lookLeft = (wolf.state === 'RETREATING' || wolf.state === 'CRYING_RUN_AWAY') ? -1 : 1;
      ctx.scale(wolf.scale * lookLeft, wolf.scale);

      if (images.wolf) {
        // Sprite sheet: 16 frames of size 400x421.
        let frameIndex = 0;
        const index = Math.floor(state.tick / 6) % 4;

        if (wolf.state === 'WALKING') {
          // Normal_walk_frame_1 to 4
          frameIndex = index;
        } else if (wolf.state === 'STEALING') {
          // jump_steel_egg_frame_1 to 4
          frameIndex = 4 + index;
        } else if (wolf.state === 'RETREATING') {
          // Walk_with_egg_frame_1 to 4
          frameIndex = 8 + index;
        } else if (wolf.state === 'CRYING_RUN_AWAY') {
          // Walk_Cry_frame_1 to 4
          frameIndex = 12 + index;
        }

        // Texture offset calculation: w=400, h=421. Rows are packed: 4 per row.
        const col = frameIndex % 4;
        const row = Math.floor(frameIndex / 4);
        ctx.drawImage(images.wolf, col * 400, row * 421, 400, 421, -200, -210, 400, 421);
      } else {
        // Stylized gray wolf cartoon vector fallback
        ctx.fillStyle = '#4b5563'; // charcoal gray wolf
        
        ctx.save();
        ctx.translate(0, -50);

        // Body
        ctx.beginPath();
        ctx.ellipse(0, 50, 150, 100, 0, 0, Math.PI*2);
        ctx.fill();

        // Legs
        ctx.fillRect(-110, 130, 45, 90);
        ctx.fillRect(70, 130, 45, 90);

        // Snout & jaws
        ctx.beginPath();
        ctx.moveTo(-100, 20); ctx.lineTo(-180, 5); ctx.lineTo(-120, -50);
        ctx.closePath();
        ctx.fill();

        // Tail
        ctx.save();
        ctx.translate(130, 80);
        ctx.rotate(Math.sin(state.tick * 0.1) * 0.3);
        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.ellipse(0, 0, 40, 110, Math.PI/4, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();

        // Head/Ears
        ctx.beginPath();
        ctx.arc(-80, -30, 75, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-60, -80); ctx.lineTo(-100, -150); ctx.lineTo(-120, -70);
        ctx.fill();

        // Angry / crying elements
        if (wolf.state === 'CRYING_RUN_AWAY') {
          // Crying eye
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-110, -30, 20, 0, Math.PI*2);
          ctx.fill();
          // Tear drops flying
          ctx.fillStyle = '#38bdf8';
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(-130 - i*20, -10 + i*15 + Math.sin(state.tick * 0.3)*10, 12, 0, Math.PI*2);
            ctx.fill();
          }
        } else {
          // Angry red eyes
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(-100, -35, 14, 0, Math.PI*2);
          ctx.fill();
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(-100, -35, 6, 0, Math.PI*2);
          ctx.fill();
        }

        // Draw egg inside wolf mouth if carrying
        if (wolf.stolenEggId !== null) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.ellipse(-140, 60, 35, 45, 0, 0, Math.PI*2);
          ctx.fill();
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        ctx.restore();
      }

      ctx.restore();
    });

    // 13. CANON (Defends bird tree, pivots around 1865, 2220)
    // Cannon sits at coordinates: x=1865, y=1562, scale=0.67
    ctx.save();
    ctx.translate(1865, 2220);

    // Aim calculations to point facing client mouse target coordinates
    const targetAngleRad = Math.atan2(state.mouseY - 2220, state.mouseX - 1865);
    // Align so canonical 0 points upwards along barrel: adding PI/2 offset
    const angleRotation = targetAngleRad + Math.PI/2;
    ctx.rotate(angleRotation);

    ctx.scale(0.67, 0.67);

    if (images.canon) {
      // Canon sprite w=700, h=1050. Frame is "Normal" (x=0) or "Fire" (x=700)
      const fireFrame = (state.tick - state.lastActivityTick < 8) ? 700 : 0;
      ctx.drawImage(images.canon, fireFrame, 0, 700, 1050, -350, -850, 700, 1050);
    } else {
      // Wood-carved heavy turret barrel fallback. Looks rustic and wonderful!
      ctx.save();
      
      // Pivot mount circle
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, 0, 140, 0, Math.PI*2);
      ctx.fill();

      // Golden decoration rings
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-130, -580, 260, 45);
      ctx.fillRect(-140, -320, 280, 40);

      // Heavy brown cannon barrel cylinder
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-120, -650, 240, 650);

      ctx.restore();
    }
    ctx.restore();

    // 14. TARGET MOUSE RETICLE (Drawn in vector shape with active mouse spritesheet helper)
    ctx.save();
    ctx.translate(state.mouseX, state.mouseY);
    ctx.scale(1.2, 1.2);

    // Glowing target circles
    ctx.strokeStyle = state.isRightPressed ? '#ef4444' : '#3b82f6';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 45, 0, Math.PI*2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI*2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();

    // Crosshairs lines
    ctx.beginPath();
    ctx.moveTo(-60, 0); ctx.lineTo(-15, 0);
    ctx.moveTo(15, 0); ctx.lineTo(60, 0);
    ctx.moveTo(0, -60); ctx.lineTo(0, -15);
    ctx.moveTo(0, 15); ctx.lineTo(0, 60);
    ctx.stroke();

    // Optional active Mouse Click spritesheet drawing helper
    if (images.mouse_click) {
      ctx.save();
      ctx.translate(45, 45); // offset to bottom-right of reticle
      ctx.scale(0.24, 0.24); // scale 500x500 to a child-friendly size of 120x120
      let frameIdx = 0;
      if (state.isLeftPressed) {
        frameIdx = 1;
      } else if (state.isRightPressed) {
        frameIdx = 2;
      }
      ctx.drawImage(images.mouse_click, frameIdx * 500, 0, 500, 500, -250, -250, 500, 500);
      ctx.restore();
    }

    ctx.restore();
  };

  // 4. Coordinates Translation to preserve canvas 3968x2144 coordinate systems
  const getCanvasCoords = (clientX: number, clientY: number): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 1984, y: 1072 };
    
    // Use cached rect or get fresh one if not available
    let rect = canvasRectRef.current;
    if (!rect) {
      rect = canvas.getBoundingClientRect();
      canvasRectRef.current = rect;
    }
    
    const scaleX = 3968 / rect.width;
    const scaleY = 2144 / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  // Aiming pointer
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCanvasCoords(e.clientX, e.clientY);
    const state = stateRef.current;
    state.mouseX = coords.x;
    state.mouseY = coords.y;

    // Directly align mouse state isPressed with real buttons bitmask
    state.isLeftPressed = (e.buttons === 1);
    state.isRightPressed = (e.buttons === 2);

    if (!mouseMoved) {
      setMouseMoved(true);
    }

    // Capture dragging continuous bullet stream
    // Check right button metadata mask: buttons bitwise 2 represents right click held
    if (e.buttons === 2) {
      const state = stateRef.current;
      if (state.tick - state.lastPowerShootTick > 9) { // 8-9 ticks fire interval (approx 135ms)
        state.lastPowerShootTick = state.tick;
        state.lastActivityTick = state.tick;

        // Origin at upper tip barrel: computed dynamically from trigonometry
        const angle = Math.atan2(coords.y - 2220, coords.x - 1865);
        const startX = 1865 + Math.cos(angle) * 440;
        const startY = 2220 + Math.sin(angle) * 440;

        const velocitySpeed = 50; // high bullet velocity

        // Detect if user dragged directly over an enemy for lock-on power shots
        let lockedTargetId: number | undefined = undefined;
        let lockedTargetType: 'BABY_BAT' | 'BIG_BAT' | 'WOLF' | undefined = undefined;

        // 1. Check Baby Bats (precise body bounds 110px)
        for (const bat of state.babyBats) {
          if (bat.state === 'FLYING' || bat.state === 'REBOUNDING') {
            const dx = coords.x - bat.x;
            const dy = coords.y - (bat.y - 20);
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 110) {
              lockedTargetId = bat.id;
              lockedTargetType = 'BABY_BAT';
              break;
            }
          }
        }

        // 2. Check Big Bats (precise hitbox 140px)
        if (!lockedTargetId) {
          for (const bat of state.bigBats) {
            if (bat.state === 'FLYING' || bat.state === 'STOLEN_RETREAT') {
              const dx = coords.x - bat.x;
              const dy = coords.y - (bat.y - 10);
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < 140) {
                lockedTargetId = bat.id;
                lockedTargetType = 'BIG_BAT';
                break;
              }
            }
          }
        }

        // 3. Check Wolves (precise hitbox 180px)
        if (!lockedTargetId) {
          for (const wolf of state.wolves) {
            if (wolf.state === 'WALKING' || wolf.state === 'STEALING' || wolf.state === 'RETREATING') {
              const dx = coords.x - wolf.x;
              const dy = coords.y - (wolf.y + 40);
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < 180) {
                lockedTargetId = wolf.id;
                lockedTargetType = 'WOLF';
                break;
              }
            }
          }
        }

        state.bullets.push({
          id: Date.now() + Math.random(),
          x: startX,
          y: startY,
          vx: Math.cos(angle) * velocitySpeed,
          vy: Math.sin(angle) * velocitySpeed,
          targetX: coords.x,
          targetY: coords.y,
          type: 'POWER',
          frameIndex: 0,
          lockedTargetId,
          lockedTargetType
        });

        synthInstance.playPowerShoot();
      }
    }
  };

  // Left click is for firing regular bullets to shoot bats
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    synthInstance.init(); // secure Context
    const coords = getCanvasCoords(e.clientX, e.clientY);

    if (e.button === 0) { // Left-click
      const state = stateRef.current;
      state.isLeftPressed = true;
      state.lastActivityTick = state.tick;

      // 1-second gap check for regular shoot (does not apply if clicked near wolf)
      const nowTime = Date.now();
      const clickNearWolf = state.wolves.some(wolf => {
        const dx = coords.x - wolf.x;
        const dy = coords.y - (wolf.y + 40);
        return Math.sqrt(dx*dx + dy*dy) < 260;
      });

      if (!clickNearWolf) {
        if (nowTime - state.lastLightShootTime < 1000) {
          // Block bullet spawning so children can't rapid-spam regular shots
          return;
        }
        state.lastLightShootTime = nowTime;
      }

      // Spawn bullet
      const angle = Math.atan2(coords.y - 2220, coords.x - 1865);
      const startX = 1865 + Math.cos(angle) * 440;
      const startY = 2220 + Math.sin(angle) * 440;

      const velocitySpeed = 55; // high velocity for fast and accurate click response

      // Detect if user clicked directly on an enemy for precise targeting
      let lockedTargetId: number | undefined = undefined;
      let lockedTargetType: 'BABY_BAT' | 'BIG_BAT' | 'WOLF' | undefined = undefined;

      // 1. Check Baby Bats (precise body bounds 110px)
      for (const bat of state.babyBats) {
        if (bat.state === 'FLYING' || bat.state === 'REBOUNDING') {
          const dx = coords.x - bat.x;
          const dy = coords.y - (bat.y - 20);
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 110) {
            lockedTargetId = bat.id;
            lockedTargetType = 'BABY_BAT';
            break;
          }
        }
      }

      // 2. Check Big Bats (precise hitbox 140px)
      if (!lockedTargetId) {
        for (const bat of state.bigBats) {
          if (bat.state === 'FLYING' || bat.state === 'STOLEN_RETREAT') {
            const dx = coords.x - bat.x;
            const dy = coords.y - (bat.y - 10);
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 140) {
              lockedTargetId = bat.id;
              lockedTargetType = 'BIG_BAT';
              break;
            }
          }
        }
      }

      // 3. Check Wolves (precise hitbox 180px)
      if (!lockedTargetId) {
        for (const wolf of state.wolves) {
          if (wolf.state === 'WALKING' || wolf.state === 'STEALING' || wolf.state === 'RETREATING') {
            const dx = coords.x - wolf.x;
            const dy = coords.y - (wolf.y + 40);
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 180) {
              lockedTargetId = wolf.id;
              lockedTargetType = 'WOLF';
              break;
            }
          }
        }
      }

      state.bullets.push({
        id: Date.now(),
        x: startX,
        y: startY,
        vx: Math.cos(angle) * velocitySpeed,
        vy: Math.sin(angle) * velocitySpeed,
        targetX: coords.x,
        targetY: coords.y,
        type: 'LIGHT',
        frameIndex: 0,
        lockedTargetId,
        lockedTargetType
      });

      synthInstance.playShoot();
    } else if (e.button === 2) { // Right Click
      // Right click is used for: incubating Glowing eggs in the nest!
      const state = stateRef.current;
      state.isRightPressed = true;

      // Check if clicking on any Glowing Egg in the bird nest! Glowing egg radius approx 130px
      const glowingEggs = state.eggs.filter(egg => egg.state === EggState.GLOWING);
      let eggIncubated = false;

      for (let egg of glowingEggs) {
        const dx = coords.x - egg.currentX;
        const dy = coords.y - egg.currentY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 140) {
          // Success incubation!
          egg.state = EggState.HATCHED;
          eggIncubated = true;
          state.stats.birdsRescued++;

          // Hatch a cute baby bird!
          const startAngle = Math.atan2(egg.currentY - 929, egg.currentX - 3088);
          state.babyBirds.push({
            id: Date.now() + Math.random(),
            x: egg.currentX,
            y: egg.currentY,
            vx: 12,
            vy: -4,
            frameIndex: 0,
            orbitState: 'CIRCLING',
            orbitAngle: startAngle,
            orbitRadius: 180,
            centerX: 3088,
            centerY: 929,
            orbitAccumulatedAngle: 0
          });

          // Sound trigger & score bonus
          synthInstance.playHatch();
          setScore(prev => prev + 50);

          state.skillsTracker.rightClick = true;
          setRightClickDone(true);

          break; // incubate only one egg per right click
        }
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.button === 0) {
      stateRef.current.isLeftPressed = false;
    } else if (e.button === 2) {
      stateRef.current.isRightPressed = false;
    }
  };

  // Double Click logic: rescues any egg fallen on the ground
  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCanvasCoords(e.clientX, e.clientY);
    const state = stateRef.current;

    // Search for fallen eggs near the clicked location
    const fallenEggs = state.eggs.filter(egg => egg.state === EggState.FALLEN);
    
    for (let egg of fallenEggs) {
      const dx = coords.x - egg.currentX;
      const dy = coords.y - egg.currentY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      // Generous threshold for kids: 160 pixels
      if (dist < 180) {
        // Return egg back to safety home nest!
        (egg as any).returning = true;
        egg.vx = 0;
        egg.vy = 0;
        synthInstance.playPickup();
        
        state.skillsTracker.doubleClick = true;
        setDoubleClickDone(true);

        break;
      }
    }
  };

  return (
    <div 
      id="game-viewport" 
      className="min-h-screen bg-slate-950 font-sans text-white select-none flex flex-col h-screen overflow-hidden"
    >
      {/* STAGE CONTAINER */}
      <div 
        id="canvas-stage-wrapper"
        ref={containerRef}
        className="flex-1 bg-slate-950 relative flex items-center justify-center overflow-hidden h-full"
      >
        {/* Canvas wrapper - relative so pause btn anchors to game frame corner */}
        <div className="relative w-full h-full" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {gameState === GameState.PLAYING && (
            <button
              id="pause-btn"
              onClick={() => handlePause()}
              title="Tạm dừng game (ESC)"
              className="absolute z-20 cursor-pointer select-none"
              style={{
                top: '12px',
                right: '12px',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                border: '3px solid rgba(255,255,255,0.6)',
                boxShadow: '0 4px 0 #b45309, 0 6px 16px rgba(245,158,11,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.1s',
                fontSize: '20px',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.12)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.92) translateY(2px)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              ⏸️
            </button>
          )}
        {/* START SCREEN PANEL */}
        {gameState === GameState.START && (
          <div id="start-overlay" className="absolute inset-0 z-25 flex flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto"
            style={{
              background: 'linear-gradient(160deg, rgba(255, 247, 230, 0.95), rgba(238, 248, 255, 0.95))',
              fontFamily: "'Quicksand', sans-serif",
              color: 'var(--text)',
            }}
          >
            {/* Floating decorative shapes */}
            <div className="deco deco1"></div>
            <div className="deco deco2"></div>
            <div className="deco deco3"></div>

            <div className="w-full max-w-2xl mx-auto relative z-10 flex flex-col items-center">

              {/* Hero section with logo - using game background */}
              <div className="rounded-[2.5rem] p-0 mb-8 relative overflow-hidden flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700" 
                style={{
                  width: '100%',
                  aspectRatio: '21/9',
                  backgroundImage: `url('${import.meta.env.BASE_URL}Game background.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 40%',
                  boxShadow: '0 25px 50px -12px rgba(91,140,255,0.4)',
                }}
              >
                <div className="absolute inset-0 bg-black/10"></div>
                {/* Logo image centered on game background */}
                <img 
                  src={`${import.meta.env.BASE_URL}logo.png`} 
                  alt="Bảo Vệ Tổ Trứng"
                  className="max-w-[80%] h-auto drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] z-10"
                />
              </div>

              {/* Difficulty select - Game-style buttons */}
              <div className="rounded-[2rem] bg-white/70 backdrop-blur-md p-6 sm:p-8 shadow-2xl w-full border border-white/50 animate-in slide-in-from-bottom-8 duration-700 delay-200"
                style={{
                  boxShadow: '0 20px 40px rgba(60,60,100,.1)',
                }}
              >
                <h3 className="text-center font-bold text-gray-500 uppercase tracking-widest text-sm mb-6">Chọn độ khó để bắt đầu</h3>
                <div id="diff-select" className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center">
                  <button
                    id="btn-level-easy"
                    onClick={() => handleStartGame(Difficulty.EASY)}
                    className="cursor-pointer transition-all text-center rounded-2xl p-6 flex flex-col items-center gap-3 relative overflow-hidden group h-full"
                    style={{
                      background: 'linear-gradient(180deg, #34D399 0%, #059669 100%)',
                      border: 'none',
                      boxShadow: '0 8px 0 #047857, 0 15px 30px rgba(5,150,105,0.3)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 0 #047857, 0 20px 35px rgba(5,150,105,0.4)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 0 #047857, 0 15px 30px rgba(5,150,105,0.3)';
                    }}
                    onMouseDown={e => {
                      e.currentTarget.style.transform = 'translateY(4px)';
                      e.currentTarget.style.boxShadow = '0 4px 0 #047857, 0 10px 20px rgba(0,0,0,0.15)';
                    }}
                  >
                    <div className="bg-white/20 rounded-full p-4 mb-1 group-hover:scale-110 transition-transform">
                      <span className="text-5xl drop-shadow-lg">🌟</span>
                    </div>
                    <div>
                      <span className="block font-black text-2xl text-white tracking-wide drop-shadow-md">CHƠI DỄ</span>
                      <span className="text-sm text-white/90 font-semibold opacity-80">Dành cho bé mới tập</span>
                    </div>
                  </button>

                  <button
                    id="btn-level-hard"
                    onClick={() => handleStartGame(Difficulty.HARD)}
                    className="cursor-pointer transition-all text-center rounded-2xl p-6 flex flex-col items-center gap-3 relative overflow-hidden group h-full"
                    style={{
                      background: 'linear-gradient(180deg, #FB923C 0%, #EA580C 100%)',
                      border: 'none',
                      boxShadow: '0 8px 0 #C2410C, 0 15px 30px rgba(234,88,12,0.3)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 0 #C2410C, 0 20px 35px rgba(234,88,12,0.4)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 0 #C2410C, 0 15px 30px rgba(234,88,12,0.3)';
                    }}
                    onMouseDown={e => {
                      e.currentTarget.style.transform = 'translateY(4px)';
                      e.currentTarget.style.boxShadow = '0 4px 0 #C2410C, 0 10px 20px rgba(0,0,0,0.15)';
                    }}
                  >
                    <div className="bg-white/20 rounded-full p-4 mb-1 group-hover:scale-110 transition-transform">
                      <span className="text-5xl drop-shadow-lg">🔥</span>
                    </div>
                    <div>
                      <span className="block font-black text-2xl text-white tracking-wide drop-shadow-md">CHƠI KHÓ</span>
                      <span className="text-sm text-white/90 font-semibold opacity-80">Thử thách thực sự</span>
                    </div>
                  </button>
                </div>
              </div>

              {highScore > 0 && (
                <div className="mt-8 text-center bg-white/50 backdrop-blur-sm px-6 py-2 rounded-full border border-white/50 shadow-sm animate-in fade-in duration-1000 delay-500">
                  <span className="text-gray-500 font-bold text-sm uppercase tracking-wider">🏅 Điểm cao nhất: </span>
                  <span className="text-xl font-black" style={{color: '#F59E0B'}}>{highScore}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PAUSED SCREEN PANEL */}
        {gameState === GameState.PAUSED && (
          <div id="pause-overlay" onContextMenu={(e) => e.preventDefault()} className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 text-center"
            style={{background: 'rgba(30,27,75,0.45)', backdropFilter: 'blur(6px)', fontFamily: 'system-ui, -apple-system, sans-serif'}}
          >
            <div className="rounded-3xl p-8 max-w-sm w-full shadow-2xl bg-white" style={{color: '#1E1B4B'}}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl" style={{background: '#F5F3FF'}}>
                ⏸️
              </div>

              <h2 id="pause-h2" className="text-2xl font-extrabold mb-1" style={{color: '#6366F1'}}>
                Tạm dừng
              </h2>
              <p id="pause-p" className="text-sm mb-6" style={{color: '#9CA3AF'}}>
                Bé hãy nghỉ ngơi một chút nhé! 🌙
              </p>

              <div className="flex flex-col gap-3">
                <button
                  id="resume-btn"
                  onClick={() => handleResume()}
                  className="w-full cursor-pointer active:scale-95 transition-all rounded-2xl py-3.5 font-extrabold text-base text-white"
                  style={{
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    boxShadow: '0 4px 14px -4px rgba(34,197,94,0.5)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  ▶️ Tiếp tục chơi
                </button>

                <button
                  id="exit-btn"
                  onClick={() => handleExit()}
                  className="w-full cursor-pointer active:scale-95 transition-all rounded-2xl py-3.5 font-extrabold text-base"
                  style={{
                    background: '#F3F4F6',
                    color: '#6B7280',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  🏠 Thoát game
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DEFEAT SCREEN PANEL */}
        {gameState === GameState.DEFEAT && (
          <div id="defeat-overlay" onContextMenu={(e) => e.preventDefault()}
            className="absolute inset-0 z-25 flex flex-col items-center justify-center p-4 text-center overflow-y-auto"
            style={{
              background: 'linear-gradient(155deg, #FFF1F2 0%, #F5F3FF 50%, #EEF2FF 100%)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: '#1E1B4B',
            }}
          >
            <div className="max-w-sm w-full">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl" style={{background: '#FFE4E6'}}>
                😿
              </div>

              <h2 id="defeat-h2" className="text-2xl sm:text-3xl font-extrabold mb-2" style={{color: '#E11D48'}}>
                Trứng đã bị mang đi hết!
              </h2>
              <p id="defeat-p" className="text-sm mb-5 leading-relaxed" style={{color: '#6B7280'}}>
                Dơi và sói đã lấy hết trứng trong tổ rồi. Bé hãy thử lại để bảo vệ tốt hơn nhé! 💪
              </p>

              <div className="rounded-3xl bg-white p-4 mb-5 shadow-sm text-left space-y-2.5 text-sm">
                <div className="text-xs font-bold uppercase tracking-widest mb-1 text-center" style={{color: '#9CA3AF'}}>
                  📊 Thống kê trận đấu
                </div>
                <div className="flex justify-between items-center">
                  <span style={{color: '#6B7280'}}>🎯 Bắn trúng dơi</span>
                  <span className="font-extrabold" style={{color: '#14B8A6'}}>{stats.batHits} lần</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{color: '#6B7280'}}>💨 Bắn hụt</span>
                  <span className="font-extrabold" style={{color: '#F472B6'}}>{stats.missedShots} lần</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{color: '#6B7280'}}>🐣 Chim nở thành công</span>
                  <span className="font-extrabold" style={{color: '#3B82F6'}}>{stats.birdsRescued} chú</span>
                </div>
              </div>

              <button
                id="restart-defeat-btn"
                onClick={() => setGameState(GameState.START)}
                className="w-full cursor-pointer active:scale-95 transition-all rounded-2xl py-3.5 font-extrabold text-base text-white flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                  boxShadow: '0 4px 14px -4px rgba(99,102,241,0.5)',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <RotateCcw className="w-5 h-5" />
                Cho bé chơi lại
              </button>
            </div>
          </div>
        )}

        {/* VICTORY SCREEN PANEL */}
        {gameState === GameState.VICTORY && showVictoryScreen && (
          <div id="victory-overlay" onContextMenu={(e) => e.preventDefault()}
            className="absolute inset-0 z-25 flex flex-col items-center justify-center p-4 text-center overflow-y-auto"
            style={{
              background: 'linear-gradient(155deg, #FFFBEB 0%, #ECFDF5 45%, #EEF2FF 100%)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: '#1E1B4B',
            }}
          >
            {/* Floating confetti */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {['🎊','🎉','⭐','✨','🌟','🎊','🎉','💫','🎊','⭐','✨','🌟'].map((s, i) => (
                <span key={i} className="absolute animate-bounce select-none" style={{
                  left: `${(i * 8.7 + 2) % 100}%`,
                  top: `${(i * 11 + 3) % 85}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${1.2 + (i % 4) * 0.4}s`,
                  fontSize: `${1.2 + (i % 3) * 0.6}rem`,
                  opacity: 0.6,
                }}>{s}</span>
              ))}
            </div>

            <div className="relative z-10 max-w-sm w-full">
              {/* Trophy + birds celebration */}
              <div className="relative flex items-end justify-center gap-2 mb-3">
                <div className="animate-bounce" style={{
                  width: '60px', height: '60px',
                  backgroundImage: `url('${import.meta.env.BASE_URL}Bird.png')`,
                  backgroundSize: '240px 60px', backgroundPosition: '0px 0px', backgroundRepeat: 'no-repeat',
                  animationDelay: '0.1s',
                }} />
                <div className="relative">
                  <div className="text-7xl animate-bounce" style={{animationDuration: '0.8s', filter: 'drop-shadow(0 6px 14px rgba(245,158,11,0.4))'}}>🏆</div>
                  <span className="absolute -top-1 -right-2 text-xl animate-spin" style={{animationDuration: '2s'}}>✨</span>
                </div>
                <div className="animate-bounce" style={{
                  width: '60px', height: '60px', transform: 'scaleX(-1)',
                  backgroundImage: `url('${import.meta.env.BASE_URL}Bird.png')`,
                  backgroundSize: '240px 60px', backgroundPosition: '-180px 0px', backgroundRepeat: 'no-repeat',
                  animationDelay: '0.2s',
                }} />
              </div>

              {/* Title */}
              <h2 id="victory-h2" className="font-extrabold leading-tight mb-1" style={{fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', color: '#16A34A'}}>
                Bé thắng rồi! 🎉
              </h2>
              <p id="victory-p" className="text-sm font-medium mb-4" style={{color: '#6B7280'}}>
                Tất cả chim non đã nở an toàn! Bé giỏi lắm! 🐣
              </p>

              {/* Score big display */}
              <div className="rounded-3xl bg-white p-4 mb-3 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{color: '#9CA3AF'}}>⭐ Điểm của bé</div>
                <div className="font-extrabold mb-3" style={{
                  fontSize: 'clamp(2.5rem, 8vw, 3.5rem)',
                  color: '#F59E0B',
                  lineHeight: 1,
                }}>{score}</div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: '🎯', label: 'Bắn trúng', value: stats.batHits, color: '#14B8A6', bg: '#ECFDF5' },
                    { icon: '🐣', label: 'Chim nở', value: stats.birdsRescued, color: '#3B82F6', bg: '#EFF6FF' },
                    { icon: '💨', label: 'Bắn hụt', value: stats.missedShots, color: '#F472B6', bg: '#FDF2F8' },
                  ].map((s, i) => (
                    <div key={i} className="rounded-2xl p-2 text-center" style={{background: s.bg}}>
                      <div className="text-xl mb-0.5">{s.icon}</div>
                      <div className="font-extrabold text-lg" style={{color: s.color}}>{s.value}</div>
                      <div className="text-xs" style={{color: '#9CA3AF'}}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* High score badge if applicable */}
              {score >= highScore && score > 0 && (
                <div className="rounded-2xl py-2 px-4 mb-3 text-sm font-bold" style={{
                  background: '#FFFBEB',
                  border: '1.5px solid #FDE68A',
                  color: '#D97706',
                }}>
                  🏅 Kỷ lục mới của bé!
                </div>
              )}

              {/* Play again button */}
              <button
                id="restart-victory-btn"
                onClick={() => setGameState(GameState.START)}
                className="w-full cursor-pointer active:scale-95 transition-all rounded-2xl py-3.5 font-extrabold text-base text-white"
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  boxShadow: '0 4px 14px -4px rgba(34,197,94,0.5)',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                🔄 Chơi lại ván mới!
              </button>
            </div>
          </div>
        )}
          <canvas
          id="game-canvas"
          ref={canvasRef}
          width="3968"
          height="2144"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            const state = stateRef.current;
            state.isLeftPressed = false;
            state.isRightPressed = false;
          }}
          onDoubleClick={handleDoubleClick}
          onContextMenu={(e) => e.preventDefault()} // Intercept default browser right click menu!
          className="block bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl relative w-full h-full cursor-none object-contain z-0"
        />
        </div>

        {/* HUD removed - difficulty badge and menu button deleted */}
      </div>
    </div>
  );
}