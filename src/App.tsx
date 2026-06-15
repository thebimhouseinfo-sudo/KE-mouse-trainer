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

// Audio synthesizer helper
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

  // Entities and dynamics tracked in refs
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
    stats: {
      batHits: 0,
      missedShots: 0,
      birdsRescued: 0,
    },
    spawnTimers: {
      babyBat: 0,
      bigBat: 0,
      wolf: 180,
    },
    skillsTracker: {
      move: false,
      leftClick: false,
      rightClick: false,
      doubleClick: false,
      drag: false
    }
  });

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

  const [assetsLoaded, setAssetsLoaded] = useState<boolean>(false);
  const imagesRef = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    const stored = localStorage.getItem('nest_game_highscore');
    if (stored) {
      const num = parseInt(stored, 10);
      if (!isNaN(num)) {
        setHighScore(num);
      }
    }

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

  useEffect(() => {
    synthInstance.enabled = audioEnabled;
  }, [audioEnabled]);

  useEffect(() => {
    stateRef.current.difficulty = difficulty;
  }, [difficulty]);

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

  const handleStartGame = (dif: Difficulty) => {
    synthInstance.init();
    synthInstance.playHatch();

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

    const initialEggs: Egg[] = [
      { id: 1, originX: 3070, originY: 829, currentX: 3070, currentY: 829, rotation: 0, state: EggState.IN_NEST, vx: 0, vy: 0, glowTimer: 1800 },
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
      { id: Date.now() + 10, x: bb1.x, y: bb1.y, vx: 3, vy: 1, state: 'RESPAWNING', hitsToNestLeft: 2, targetX: 3088, targetY: 929, frameIndex: 0, scale: 0.35, cooldownTimer: 240 },
      { id: Date.now() + 20, x: bb2.x, y: bb2.y, vx: 4, vy: 2, state: 'RESPAWNING', hitsToNestLeft: 2, targetX: 3088, targetY: 929, frameIndex: 0, scale: 0.35, cooldownTimer: 600 },
      { id: Date.now() + 30, x: bb3.x, y: bb3.y, vx: 3, vy: 2.5, state: 'RESPAWNING', hitsToNestLeft: 2, targetX: 3088, targetY: 929, frameIndex: 0, scale: 0.35, cooldownTimer: 960 }
    ];
    stateRef.current.bigBats = [
      { id: Date.now() + 1, x: bg0.x, y: bg0.y, vx: 5, vy: 0, waveAngle: 2.1, state: 'FLYING', stolenEggId: null, frameIndex: 0, scale: 0.5, cooldownTimer: 0 },
      { id: Date.now() + 2, x: bg1.x, y: bg1.y, vx: 5, vy: 0, waveAngle: 0.5, state: 'RESPAWNING', stolenEggId: null, frameIndex: 0, scale: 0.5, cooldownTimer: 480 }
    ];
    stateRef.current.wolves = [];
    stateRef.current.bullets = [];
    stateRef.current.babyBirds = [];
    stateRef.current.spawnTimers = {
      babyBat: 0,
      bigBat: 100,
      wolf: 360
    };
    stateRef.current.tick = 0;

    setMouseMoved(false);
    setLeftClickDone(false);
    setRightClickDone(false);
    setDoubleClickDone(false);
    setDragActive(false);
    setShowVictoryScreen(false);

    setGameState(GameState.PLAYING);
  };

  const handlePause = () => {
    setGameState(GameState.PAUSED);
  };

  const handleResume = () => {
    setGameState(GameState.PLAYING);
  };

  const handleExit = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => {
        console.log('Fullscreen exit failed:', err);
      });
    }
    setGameState(GameState.START);
  };

  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = () => {
      if (gameState !== GameState.PLAYING && gameState !== GameState.VICTORY) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      const state = stateRef.current;
      state.tick++;

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

      state.clouds.forEach(c => {
        c.x += c.speed * (isHard ? 1.3 : 1.0);
        if (c.x > 4100) {
          c.x = -200;
          c.y = 100 + Math.random() * 400;
        }
      });

      if (state.nestShakeIntensity > 0) {
         state.nestShakeIntensity *= 0.92;
         if (state.nestShakeIntensity < 0.1) state.nestShakeIntensity = 0;
      }

      const currentlyGlowingCount = state.eggs.filter(e => e.state === EggState.GLOWING).length;

      state.eggs.forEach(egg => {
        if (egg.state === EggState.FALLEN && !(egg as any).returning) {
          egg.vy += 0.5;
          egg.currentX += egg.vx;
          egg.currentY += egg.vy;
          egg.rotation += egg.vx * 0.05;

          if (egg.currentY > 1940) {
            egg.currentY = 1940;
            egg.vy = -egg.vy * 0.35;
            egg.vx *= 0.9;
            if (Math.abs(egg.vy) < 0.5) egg.vy = 0;
            if (Math.abs(egg.vx) < 0.2) egg.vx = 0;
          }

          if (egg.currentX < 100) { egg.currentX = 100; egg.vx = -egg.vx; }
          if (egg.currentX > 3800) { egg.currentX = 3800; egg.vx = -egg.vx; }
        }

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

        if (egg.state === EggState.IN_NEST && currentlyGlowingCount === 0) {
          if (egg.glowTimer > 0) {
            egg.glowTimer--;
            if (egg.glowTimer <= 0) {
              egg.state = EggState.GLOWING;
            }
          }
        }
      });

      state.babyBats.forEach(bat => {
        if (bat.state === 'FLYING') {
          const dx = bat.targetX - bat.x;
          const dy = bat.targetY - bat.y;
          const dist = Math.sqrt(dx*dx + dy*dy);

          const baseSpeed = 2.4 * speedMultiplier;
          bat.vx = (dx / dist) * baseSpeed;
          bat.vy = (dy / dist) * baseSpeed;

          bat.x += bat.vx;
          bat.y += bat.vy;

          if (dist < 120) {
            state.nestShakeIntensity = 25;
            synthInstance.playNestShake();

            bat.state = 'REBOUNDING';
            bat.vx = -bat.vx * 1.5;
            bat.vy = -bat.vy * 1.5;
            bat.hitsToNestLeft--;

            if (bat.hitsToNestLeft <= 0) {
              const nestedEggs = state.eggs.filter(e => e.state === EggState.IN_NEST || e.state === EggState.GLOWING);
              if (nestedEggs.length > 0) {
                const targetEggIdx = Math.floor(Math.random() * nestedEggs.length);
                const egg = nestedEggs[targetEggIdx];
                egg.state = EggState.FALLEN;
                egg.vx = -(5 + Math.random() * 5);
                egg.vy = -8 - Math.random() * 5;
                egg.glowTimer = 500;
                
                synthInstance.playFail();
              }
              bat.hitsToNestLeft = 2;
            }
          }
        } else if (bat.state === 'REBOUNDING') {
          bat.x += bat.vx;
          bat.y += bat.vy;
          bat.vx *= 0.93;
          bat.vy *= 0.93;

          if (Math.abs(bat.vx) < 0.5) {
            bat.state = 'FLYING';
          }
        } else if (bat.state === 'DEATH') {
          bat.y += 12;
          bat.x += bat.vx;
          bat.vx *= 0.95;
          if (bat.y > 2200) {
            bat.state = 'RESPAWNING';
            bat.cooldownTimer = 600;
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

      state.bigBats.forEach(bat => {
        if (bat.state === 'FLYING') {
          bat.x += 3.5 * speedMultiplier;
          bat.waveAngle += isHard ? 0.08 : 0.045;
          bat.y = 450 + Math.sin(bat.waveAngle) * 250;

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
              bat.state = 'STOLEN_RETREAT';
            }
          }
        } else if (bat.state === 'STOLEN_RETREAT') {
          bat.x -= 3.0 * speedMultiplier;
          bat.waveAngle += 0.04;
          bat.y = 450 + Math.sin(bat.waveAngle) * 200;

          if (bat.stolenEggId !== null) {
            const egg = state.eggs.find(e => e.id === bat.stolenEggId);
            if (egg) {
              egg.currentX = bat.x;
              egg.currentY = bat.y + 80;
            }
          }

          if (bat.x < -100) {
            if (bat.stolenEggId !== null) {
              const egg = state.eggs.find(e => e.id === bat.stolenEggId);
              if (egg) {
                egg.state = EggState.STOLEN;
              }
            }
            bat.stolenEggId = null;
            bat.state = 'RESPAWNING';
            bat.cooldownTimer = 600;
          }
        } else if (bat.state === 'DEATH') {
          bat.y += 15;
          if (bat.y > 2200) {
            bat.state = 'RESPAWNING';
            bat.cooldownTimer = 600;
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

      if (state.wolves.length === 0) {
        if (state.spawnTimers.wolf > 0) {
          state.spawnTimers.wolf--;
        } else {
          state.wolves.push({
            id: Date.now(),
            x: -150,
            y: 1750,
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
        if (wolf.state !== 'STEALING') {
          wolf.y = 1750;
        }

        if (state.isLeftPressed) {
          const mdx = state.mouseX - wolf.x;
          const mdy = state.mouseY - (wolf.y + 40);
          const mdist = Math.sqrt(mdx*mdx + mdy*mdy);
          if (mdist < 260) {
            if (wolf.stolenEggId !== null) {
              const egg = state.eggs.find(e => e.id === wolf.stolenEggId);
              if (egg) {
                egg.state = EggState.FALLEN;
                egg.currentX = wolf.x;
                egg.currentY = wolf.y;
                egg.vx = -4;
                egg.vy = -3;
              }
              wolf.stolenEggId = null;
            }

            wolf.state = 'CRYING_RUN_AWAY';
            wolf.y = 1750;
            wolf.cryingTimer = Math.max(wolf.cryingTimer || 0, 75);
            wolf.x -= 4.2 * speedMultiplier;

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
              const stealableEggs = state.eggs.filter(e => e.state === EggState.IN_NEST || e.state === EggState.GLOWING);
              if (stealableEggs.length > 0) {
                wolf.state = 'STEALING';
              }
            }
          }
        } else if (wolf.state === 'STEALING') {
          if (wolf.y > 880 && wolf.stolenEggId === null) {
            wolf.y -= 15;
          } else {
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
            
            if (wolf.y < 1750) {
              wolf.y += 15;
            } else {
              wolf.y = 1750;
              wolf.state = 'RETREATING';
            }
          }

          if (wolf.stolenEggId !== null) {
            const egg = state.eggs.find(e => e.id === wolf.stolenEggId);
            if (egg) {
              egg.currentX = wolf.x + 30;
              egg.currentY = wolf.y + 40;
            }
          }
        } else if (wolf.state === 'RETREATING') {
          wolf.x -= 2.2 * speedMultiplier;

          if (wolf.stolenEggId !== null) {
            const egg = state.eggs.find(e => e.id === wolf.stolenEggId);
            if (egg) {
              egg.currentX = wolf.x - 30;
              egg.currentY = wolf.y + 80;
            }
          }

          if (wolf.x < -150) {
            if (wolf.stolenEggId !== null) {
              const egg = state.eggs.find(e => e.id === wolf.stolenEggId);
              if (egg) {
                egg.state = EggState.STOLEN;
              }
            }
            wolf.stolenEggId = null;
            state.wolves = [];
            state.spawnTimers.wolf = 720;
            setScore(prev => Math.max(0, prev - 40));
          }
        } else if (wolf.state === 'CRYING_RUN_AWAY') {
          wolf.y = 1750;
          if (wolf.cryingTimer !== undefined && wolf.cryingTimer > 0) {
            wolf.cryingTimer--;
            wolf.x -= 1.8 * speedMultiplier;
          } else {
            wolf.state = 'WALKING';
          }
          
          if (wolf.x < -150) {
            state.wolves = state.wolves.filter(w => w.id !== wolf.id);
          }
        }
      });

      state.bullets.forEach(bullet => {
        if (bullet.isExploding) {
          if (bullet.explodeTimer !== undefined) {
            bullet.explodeTimer--;
          }
          return;
        }

        bullet.x += bullet.vx;
        bullet.y += bullet.vy;

        if (bullet.lockedTargetId && bullet.lockedTargetType) {
          if (bullet.lockedTargetType === 'BABY_BAT') {
            const bat = state.babyBats.find(b => b.id === bullet.lockedTargetId);
            if (bat && (bat.state === 'FLYING' || bat.state === 'REBOUNDING')) {
              const dx = bullet.x - bat.x;
              const dy = bullet.y - (bat.y - 20);
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < 140) {
                bat.state = 'DEATH';
                bat.vy = 8;
                bat.vx = bullet.vx * 0.15;
                state.stats.batHits++;
                
                bullet.isExploding = true;
                bullet.frameIndex = 4;
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
                state.stats.batHits++;
                if (bat.stolenEggId !== null) {
                  const egg = state.eggs.find(e => e.id === bat.stolenEggId);
                  if (egg) {
                    egg.state = EggState.FALLEN;
                    egg.vy = 2;
                    egg.vx = -1;
                  }
                }
                bat.stolenEggId = null;
                
                bullet.isExploding = true;
                bullet.frameIndex = 4;
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
            if (wolf && (wolf.state === 'WALKING' || wolf.state === 'STEALING' || wolf.state === 'RETREATING' || wolf.state === 'CRYING_RUN_AWAY')) {
              const dx = bullet.x - wolf.x;
              const dy = bullet.y - (wolf.y + 40);
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < 180) {
                bullet.isExploding = true;
                bullet.frameIndex = 4;
                bullet.explodeTimer = 8;
                bullet.vx = 0;
                bullet.vy = 0;

                synthInstance.playWolfHit();
                
                if (bullet.type === 'POWER') {
                  state.skillsTracker.drag = true;
                  setDragActive(true);
                } else {
                  state.skillsTracker.leftClick = true;
                  setLeftClickDone(true);
                }

                if (wolf.stolenEggId !== null) {
                  const egg = state.eggs.find(e => e.id === wolf.stolenEggId);
                  if (egg) {
                    egg.state = EggState.FALLEN;
                    egg.currentX = wolf.x;
                    egg.currentY = wolf.y;
                    egg.vx = -4;
                    egg.vy = -3;
                  }
                  wolf.stolenEggId = null;
                }

                wolf.state = 'CRYING_RUN_AWAY';
                wolf.cryingTimer = 150;
                setScore(prev => prev + 50);
              }
            }
          }
        }
      });

      state.bullets = state.bullets.filter(b => {
        if (b.isExploding && b.explodeTimer !== undefined && b.explodeTimer <= 0) {
          return false;
        }
        const onScreen = b.x >= 0 && b.x <= 4000 && b.y >= 0 && b.y <= 2200;
        if (!onScreen && !b.isExploding) {
          state.stats.missedShots++;
        }
        return onScreen;
      });

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
        const waitForBirds = () => {
          if (stateRef.current.babyBirds.length === 0) {
            setShowVictoryScreen(true);
          } else {
            setTimeout(waitForBirds, 200);
          }
        };
        setTimeout(waitForBirds, 200);
      }

      setUiSkills({
        move: state.skillsTracker.move,
        leftClick: state.skillsTracker.leftClick,
        rightClick: state.skillsTracker.rightClick,
        doubleClick: state.skillsTracker.doubleClick,
        drag: state.skillsTracker.drag
      });

      drawGame();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, difficulty, assetsLoaded]);

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = stateRef.current;
    const images = imagesRef.current;

    ctx.clearRect(0,0, 3968, 2144);

    if (images.background) {
      ctx.drawImage(images.background, 0, 0, 3968, 2144);
    } else {
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 1400);
      skyGrad.addColorStop(0, '#bae6fd');
      skyGrad.addColorStop(0.6, '#fef08a');
      skyGrad.addColorStop(1, '#86efac');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 3968, 2144);

      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(3600, 300, 150, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 15;
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(3600 + Math.cos(angle)*190, 300 + Math.sin(angle)*190);
        ctx.lineTo(3600 + Math.cos(angle)*260, 300 + Math.sin(angle)*260);
        ctx.stroke();
      }

      ctx.fillStyle = '#4ade80';
      ctx.fillRect(0, 1447, 3968, 700);

      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(800, 1600, 1200, 400, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.ellipse(3200, 1650, 1500, 450, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    state.clouds.forEach(cloud => {
      ctx.save();
      ctx.translate(cloud.x, cloud.y);
      ctx.scale(cloud.scale, cloud.scale);
      
      ctx.beginPath();
      ctx.arc(0, 0, 60, 0, Math.PI*2);
      ctx.arc(70, -20, 75, 0, Math.PI*2);
      ctx.arc(150, 0, 60, 0, Math.PI*2);
      ctx.rect(0, -10, 150, 70);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });

    ctx.save();
    if (state.nestShakeIntensity > 0) {
      const shakeX = (Math.random() - 0.5) * state.nestShakeIntensity;
      const shakeY = (Math.random() - 0.5) * state.nestShakeIntensity;
      ctx.translate(shakeX, shakeY);
    }

    if (images.nest) {
      ctx.save();
      ctx.translate(3088, 929);
      ctx.scale(0.3, 0.3);
      ctx.drawImage(images.nest, 0, 0, 1200, 1200, -600, -600, 1200, 1200);
      ctx.restore();
    } else {
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 14;
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(3088, 929, 230, 140, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 6;
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.arc(3088 + (Math.random()-0.5)*80, 929 + (Math.random()-0.5)*30, 190 + Math.random()*20, 0 + i*0.2, Math.PI+ i*0.3);
        ctx.stroke();
      }
    }

    state.eggs.forEach(egg => {
      if (egg.state === EggState.IN_NEST || egg.state === EggState.GLOWING) {
        ctx.save();
        ctx.translate(egg.currentX, egg.currentY);
        ctx.scale(egg.state === EggState.GLOWING ? 0.3 + Math.sin(state.tick * 0.15)*0.015 : 0.3, 0.3);

        if (images.egg) {
          let srcX = 0;
          if (egg.state === EggState.GLOWING) {
            const glowFrame = 1 + (Math.floor(state.tick / 6) % 3);
            srcX = glowFrame * 600;
          }
          ctx.drawImage(images.egg, srcX, 0, 600, 600, -300, -300, 600, 600);
        } else {
          const gr = ctx.createRadialGradient(-35, -55, 10, 0, 0, 150);
          if (egg.state === EggState.GLOWING) {
            gr.addColorStop(0, '#fef08a');
            gr.addColorStop(0.5, '#fde047');
            gr.addColorStop(1, '#ca8a04');
            
            ctx.fillStyle = 'rgba(253, 224, 71, 0.28)';
            ctx.beginPath();
            ctx.arc(0, 0, 200, 0, Math.PI*2);
            ctx.fill();

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
            gr.addColorStop(0.5, '#fbbf24');
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

    if (images.nest) {
      ctx.save();
      ctx.translate(3093, 909);
      ctx.scale(0.32, 0.32);
      ctx.drawImage(images.nest, 1200, 0, 1200, 1200, -600, -600, 1200, 1200);
      ctx.restore();
    } else {
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.ellipse(3093, 919, 235, 115, 0, 0, Math.PI, false);
      ctx.stroke();
    }

    ctx.restore();

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
        ctx.drawImage(images.bird, bird.frameIndex * 350, 0, 350, 350, -175, -175, 350, 350);
      } else {
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(0, 0, 100, 0, Math.PI*2);
        ctx.fill();

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

        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(35, 15);
        ctx.lineTo(0, 30);
        ctx.closePath();
        ctx.fill();

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

    state.bullets.forEach(bullet => {
      ctx.save();
      ctx.translate(bullet.x, bullet.y);
      ctx.rotate(Math.atan2(bullet.vy, bullet.vx));
      ctx.scale(0.67, 0.67);

      if (images.bullet) {
        ctx.drawImage(images.bullet, bullet.frameIndex * 300, 0, 300, 300, -150, -150, 300, 300);
      } else {
        if (bullet.frameIndex === 4 || bullet.frameIndex === 3) {
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

    state.babyBats.forEach(bat => {
      if (bat.state === 'RESPAWNING') return;
      ctx.save();
      ctx.translate(bat.x, bat.y);
      const lookDir = bat.vx < 0 ? -1 : 1;
      
      if (bat.state === 'DEATH') {
        ctx.scale(bat.scale * lookDir, bat.scale);
        ctx.rotate(Math.PI);
      } else {
        ctx.scale(bat.scale * lookDir, bat.scale);
        ctx.rotate(6 * Math.PI / 180);
      }

      if (images.baby_bat) {
        const index = bat.state === 'DEATH' ? 3 : (Math.floor(state.tick / 6) % 4);
        ctx.drawImage(images.baby_bat, index * 680, 0, 680, 680, -340, -340, 680, 680);
      } else {
        ctx.fillStyle = '#581c87';
        ctx.save();
        ctx.translate(-140, 0);
        ctx.rotate(Math.sin(state.tick * 0.25) * 0.7);
        ctx.beginPath();
        ctx.ellipse(0, 0, 130, 60, Math.PI/4, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(140, 0);
        ctx.rotate(-Math.sin(state.tick * 0.25) * 0.7);
        ctx.beginPath();
        ctx.ellipse(0, 0, 130, 60, -Math.PI/4, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(0, 0, 110, 0, Math.PI*2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-100, -80); ctx.lineTo(-40, -110); ctx.lineTo(-30, -50);
        ctx.moveTo(100, -80); ctx.lineTo(40, -110); ctx.lineTo(30, -50);
        ctx.fill();

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

    state.bigBats.forEach(bat => {
      if (bat.state === 'RESPAWNING') return;
      ctx.save();
      ctx.translate(bat.x, bat.y);
      const lookDir = bat.state === 'STOLEN_RETREAT' ? -1 : 1;
      let scaleFactor = bat.scale;
      if (bat.stolenEggId !== null) {
        scaleFactor *= 1.2;
      }

      if (bat.state === 'DEATH') {
        ctx.scale(scaleFactor * lookDir, scaleFactor);
        ctx.rotate(Math.PI / 2);
      } else {
        ctx.scale(scaleFactor * lookDir, scaleFactor);
      }

      if (images.big_bat) {
        let srcX = 0;
        let srcY = 0;
        const frameIndex = bat.state === 'DEATH' ? 0 : (Math.floor(state.tick / 6) % 4);

        if (bat.state === 'STOLEN_RETREAT' && bat.stolenEggId !== null) {
          srcX = frameIndex * 800;
          srcY = 800;
        } else {
          srcX = frameIndex * 800;
          srcY = 0;
        }
        ctx.drawImage(images.big_bat, srcX, srcY, 800, 800, -400, -400, 800, 800);
      } else {
        ctx.fillStyle = '#312e81';

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

        ctx.beginPath();
        ctx.arc(0, 0, 140, 0, Math.PI*2);
        ctx.fill();

        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(-38, -35, 18, 0, Math.PI*2);
        ctx.arc(38, -35, 18, 0, Math.PI*2);
        ctx.fill();

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

    state.wolves.forEach(wolf => {
      ctx.save();
      ctx.translate(wolf.x, wolf.y);
      const lookLeft = (wolf.state === 'RETREATING' || wolf.state === 'CRYING_RUN_AWAY') ? -1 : 1;
      ctx.scale(wolf.scale * lookLeft, wolf.scale);

      if (images.wolf) {
        let frameIndex = 0;
        const index = Math.floor(state.tick / 6) % 4;

        if (wolf.state === 'WALKING') {
          frameIndex = index;
        } else if (wolf.state === 'STEALING') {
          frameIndex = 4 + index;
        } else if (wolf.state === 'RETREATING') {
          frameIndex = 8 + index;
        } else if (wolf.state === 'CRYING_RUN_AWAY') {
          frameIndex = 12 + index;
        }

        const col = frameIndex % 4;
        const row = Math.floor(frameIndex / 4);
        ctx.drawImage(images.wolf, col * 400, row * 421, 400, 421, -200, -210, 400, 421);
      } else {
        ctx.fillStyle = '#4b5563';
        
        ctx.save();
        ctx.translate(0, -50);

        ctx.beginPath();
        ctx.ellipse(0, 50, 150, 100, 0, 0, Math.PI*2);
        ctx.fill();

        ctx.fillRect(-110, 130, 45, 90);
        ctx.fillRect(70, 130, 45, 90);

        ctx.beginPath();
        ctx.moveTo(-100, 20); ctx.lineTo(-180, 5); ctx.lineTo(-120, -50);
        ctx.closePath();
        ctx.fill();

        ctx.save();
        ctx.translate(130, 80);
        ctx.rotate(Math.sin(state.tick * 0.1) * 0.3);
        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.ellipse(0, 0, 40, 110, Math.PI/4, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(-80, -30, 75, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-60, -80); ctx.lineTo(-100, -150); ctx.lineTo(-120, -70);
        ctx.fill();

        if (wolf.state === 'CRYING_RUN_AWAY') {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(-110, -30, 20, 0, Math.PI*2);
          ctx.fill();
          ctx.fillStyle = '#38bdf8';
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(-130 - i*20, -10 + i*15 + Math.sin(state.tick * 0.3)*10, 12, 0, Math.PI*2);
            ctx.fill();
          }
        } else {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(-100, -35, 14, 0, Math.PI*2);
          ctx.fill();
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(-100, -35, 6, 0, Math.PI*2);
          ctx.fill();
        }

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

    ctx.save();
    ctx.translate(1865, 2220);

    const targetAngleRad = Math.atan2(state.mouseY - 2220, state.mouseX - 1865);
    const angleRotation = targetAngleRad + Math.PI/2;
    ctx.rotate(angleRotation);

    ctx.scale(0.67, 0.67);

    if (images.canon) {
      const fireFrame = (state.tick - state.lastActivityTick < 8) ? 700 : 0;
      ctx.drawImage(images.canon, fireFrame, 0, 700, 1050, -350, -850, 700, 1050);
    } else {
      ctx.save();
      
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, 0, 140, 0, Math.PI*2);
      ctx.fill();

      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-130, -580, 260, 45);
      ctx.fillRect(-140, -320, 280, 40);

      ctx.fillStyle = '#b45309';
      ctx.fillRect(-120, -650, 240, 650);

      ctx.restore();
    }
    ctx.restore();

    ctx.save();
    ctx.translate(state.mouseX, state.mouseY);
    ctx.scale(1.2, 1.2);

    ctx.strokeStyle = state.isRightPressed ? '#ef4444' : '#3b82f6';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 45, 0, Math.PI*2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI*2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-60, 0); ctx.lineTo(-15, 0);
    ctx.moveTo(15, 0); ctx.lineTo(60, 0);
    ctx.moveTo(0, -60); ctx.lineTo(0, -15);
    ctx.moveTo(0, 15); ctx.lineTo(0, 60);
    ctx.stroke();

    if (images.mouse_click) {
      ctx.save();
      ctx.translate(45, 45);
      ctx.scale(0.24, 0.24);
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

  const getCanvasCoords = (clientX: number, clientY: number): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 1984, y: 1072 };
    
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

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCanvasCoords(e.clientX, e.clientY);
    const state = stateRef.current;
    state.mouseX = coords.x;
    state.mouseY = coords.y;

    state.isLeftPressed = (e.buttons === 1);
    state.isRightPressed = (e.buttons === 2);

    if (!mouseMoved) {
      setMouseMoved(true);
    }

    if (e.buttons === 2) {
      const state = stateRef.current;
      if (state.tick - state.lastPowerShootTick > 9) {
        state.lastPowerShootTick = state.tick;
        state.lastActivityTick = state.tick;

        const angle = Math.atan2(coords.y - 2220, coords.x - 1865);
        const startX = 1865 + Math.cos(angle) * 440;
        const startY = 2220 + Math.sin(angle) * 440;

        const velocitySpeed = 50;

        let lockedTargetId: number | undefined = undefined;
        let lockedTargetType: 'BABY_BAT' | 'BIG_BAT' | 'WOLF' | undefined = undefined;

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

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    synthInstance.init();
    const coords = getCanvasCoords(e.clientX, e.clientY);

    if (e.button === 0) {
      const state = stateRef.current;
      state.isLeftPressed = true;
      state.lastActivityTick = state.tick;

      const nowTime = Date.now();
      const clickNearWolf = state.wolves.some(wolf => {
        const dx = coords.x - wolf.x;
        const dy = coords.y - (wolf.y + 40);
        return Math.sqrt(dx*dx + dy*dy) < 260;
      });

      if (!clickNearWolf) {
        if (nowTime - state.lastLightShootTime < 1000) {
          return;
        }
        state.lastLightShootTime = nowTime;
      }

      const angle = Math.atan2(coords.y - 2220, coords.x - 1865);
      const startX = 1865 + Math.cos(angle) * 440;
      const startY = 2220 + Math.sin(angle) * 440;

      const velocitySpeed = 55;

      let lockedTargetId: number | undefined = undefined;
      let lockedTargetType: 'BABY_BAT' | 'BIG_BAT' | 'WOLF' | undefined = undefined;

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
    } else if (e.button === 2) {
      const state = stateRef.current;
      state.isRightPressed = true;

      const glowingEggs = state.eggs.filter(egg => egg.state === EggState.GLOWING);
      let eggIncubated = false;

      for (let egg of glowingEggs) {
        const dx = coords.x - egg.currentX;
        const dy = coords.y - egg.currentY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 140) {
          egg.state = EggState.HATCHED;
          eggIncubated = true;
          state.stats.birdsRescued++;

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

          synthInstance.playHatch();
          setScore(prev => prev + 50);

          state.skillsTracker.rightClick = true;
          setRightClickDone(true);

          break;
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

  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCanvasCoords(e.clientX, e.clientY);
    const state = stateRef.current;

    const fallenEggs = state.eggs.filter(egg => egg.state === EggState.FALLEN);
    
    for (let egg of fallenEggs) {
      const dx = coords.x - egg.currentX;
      const dy = coords.y - egg.currentY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 180) {
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

  const baseUrl = import.meta.env.BASE_URL;

  const playGuide = [
    { bgPos: '0px 0px', label: 'Di chuột', sub: 'Ngắm bắn', bg: '#EFF6FF' },
    { bgPos: '-56px 0px', label: 'Click trái', sub: 'Bắn dơi', bg: '#FFFBEB' },
    { bgPos: '-112px 0px', label: 'Click phải', sub: 'Ấp trứng', bg: '#ECFDF5' },
    { bgPos: '-56px 0px', label: '2× Click', sub: 'Nhặt trứng', bg: '#FDF2F8', badge: '✌️' },
    { bgPos: '-56px 0px', label: 'Giữ & kéo', sub: 'Đuổi sói', bg: '#F5F3FF', badge: '👉' },
  ];

  return (
    <div 
      id="game-viewport" 
      className="min-h-screen bg-slate-950 font-sans text-white select-none flex flex-col h-screen overflow-hidden"
    >
      <style>{`
        .start-content {
          width: min(920px, 95vw);
          margin-top: clamp(8px, 2vh, 16px);
          margin-bottom: clamp(8px, 2vh, 16px);
        }

        .start-breadcrumb {
          margin-bottom: clamp(16px, 4vh, 28px);
          padding: 0 clamp(8px, 2vw, 16px);
        }

        .start-logo {
          width: min(700px, 90vw);
          height: auto;
          display: block;
          filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.12));
          user-select: none;
          pointer-events: none;
          margin-bottom: clamp(20px, 5vh, 36px);
          margin-top: clamp(8px, 2vh, 16px);
        }

        .guide-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
        }

        .start-card:first-of-type {
          margin-bottom: clamp(16px, 4vh, 24px);
        }

        .start-card-label {
          margin-bottom: clamp(12px, 3vh, 20px);
          font-size: clamp(16px, 4vw, 20px);
        }

        .diff-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .difficulty-banner {
          position: relative;
          min-height: 140px;
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: 0.25s;
          border: none;
        }

        .difficulty-banner:hover {
          transform: translateY(-3px);
        }

        .easy-banner {
          background: linear-gradient(90deg, #eefcf0 0%, #f8fff9 100%);
          border: 3px solid #59d38c;
        }

        .hard-banner {
          background: linear-gradient(90deg, #fff6ea 0%, #fffaf5 100%);
          border: 3px solid #ff9f43;
        }

        .difficulty-content {
          position: relative;
          z-index: 2;
          padding: 22px;
          flex: 1;
        }

        .difficulty-title {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .difficulty-subtitle {
          font-size: 15px;
          opacity: 0.75;
        }

        .difficulty-image {
          position: absolute;
          top: -10px;
          bottom: -10px;
          width: 42%;
          background-repeat: no-repeat;
          background-size: contain;
        }

        .difficulty-bat {
          background-image: url("/Baby bat.png");
          left: -20px;
          background-position: left center;
        }

        .difficulty-wolf {
          background-image: url("/Wolf.png");
          right: -20px;
          background-position: right center;
        }

        /* Responsive cho màn hình nhỏ */
        @media (max-width: 640px) {
          .start-content {
            margin-top: 8px;
            margin-bottom: 8px;
          }
          
          .start-breadcrumb {
            margin-bottom: 12px;
          }
          
          .start-logo {
            margin-bottom: 16px;
            margin-top: 4px;
          }
          
          .start-card:first-of-type {
            margin-bottom: 12px;
          }

          .difficulty-title {
            font-size: 24px;
          }

          .difficulty-subtitle {
            font-size: 12px;
          }

          .difficulty-content {
            padding: 16px;
          }
        }

        @media (max-width: 480px) {
          .start-content {
            margin-top: 4px;
            margin-bottom: 4px;
          }
          
          .start-breadcrumb {
            margin-bottom: 8px;
          }
          
          .start-logo {
            margin-bottom: 12px;
          }

          .difficulty-title {
            font-size: 20px;
          }

          .difficulty-subtitle {
            font-size: 11px;
          }

          .difficulty-content {
            padding: 12px;
          }
        }

        /* Giãn cách các nút ở End Page (Victory & Defeat) */
        .game-panel .flex.flex-col.gap-3 {
          gap: 16px;
        }

        .game-panel .gap-2 {
          gap: 16px;
        }

        .game-panel .grid-cols-3 {
          gap: 16px;
        }

        /* Responsive cho end page buttons */
        @media (max-width: 640px) {
          .game-panel .flex.flex-col.gap-3 {
            gap: 12px;
          }
          
          .game-panel .gap-2 {
            gap: 12px;
          }
          
          .game-panel .grid-cols-3 {
            gap: 12px;
          }
        }
      `}</style>

      <div 
        id="canvas-stage-wrapper"
        ref={containerRef}
        className="flex-1 bg-slate-950 relative flex items-center justify-center overflow-hidden h-full"
      >
        {gameState === GameState.START && (
          <div id="start-overlay" className="start-overlay absolute inset-0 z-30 flex flex-col items-center justify-start p-3 sm:p-5 overflow-y-auto text-left">
            <div className="start-content relative z-10 overlay-enter">

              <div className="start-breadcrumb">
                <a href="https://kideschool.blogspot.com/p/tin-hoc.html">
                  🏠 Trang chủ
                </a>
                <span style={{ opacity: 0.5 }}>›</span>
                <span className="start-breadcrumb-pill">🪺 Bảo vệ tổ chim</span>
              </div>

              <div className="flex justify-center" style={{ marginBottom: 'clamp(20px, 5vh, 36px)', marginTop: 'clamp(8px, 2vh, 16px)' }}>
                <img
                  src={`${baseUrl}logo.png`}
                  alt="Bảo vệ tổ trứng"
                  className="start-logo"
                  draggable={false}
                  style={{ marginBottom: 0, marginTop: 0 }}
                />
              </div>

              <div className="start-card">
                <div className="start-card-label">Cách chơi</div>
                <div className="guide-grid">
                  {playGuide.map((item, i) => (
                    <div key={i} className="guide-card" style={{ background: item.bg }}>
                      <div className="guide-card-icon">
                        <div
                          className="guide-card-icon-sprite"
                          style={{
                            backgroundImage: `url('${baseUrl}Mouse Click.png')`,
                            backgroundSize: '168px 56px',
                            backgroundPosition: item.bgPos,
                          }}
                        />
                        {item.badge && <span className="guide-card-badge">{item.badge}</span>}
                      </div>
                      <div className="guide-card-label">{item.label}</div>
                      <div className="guide-card-sub">{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="start-card">
                <div className="start-card-label">Chọn độ khó</div>
                <div id="diff-select" className="diff-row">

                  <button
                    id="btn-level-easy"
                    onClick={() => handleStartGame(Difficulty.EASY)}
                    className="difficulty-banner easy-banner"
                  >
                    <div className="difficulty-image difficulty-bat" />

                    <div className="difficulty-content">
                      <div className="difficulty-title">
                        Chơi dễ
                      </div>

                      <div className="difficulty-subtitle">
                        Dành cho bé mới tập
                      </div>
                    </div>
                  </button>

                  <button
                    id="btn-level-hard"
                    onClick={() => handleStartGame(Difficulty.HARD)}
                    className="difficulty-banner hard-banner"
                  >
                    <div className="difficulty-content">
                      <div className="difficulty-title">
                        Chơi khó
                      </div>

                      <div className="difficulty-subtitle">
                        Thử thách thực sự
                      </div>
                    </div>

                    <div className="difficulty-image difficulty-wolf" />
                  </button>

                </div>
              </div>

              {highScore > 0 && (
                <div className="text-center font-semibold mb-2" style={{ color: '#9CA3AF', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
                  🏅 Điểm cao nhất:{' '}
                  <span className="game-heading" style={{ color: '#F59E0B', fontSize: 'clamp(1.1rem, 3.5vw, 1.35rem)' }}>{highScore}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="relative w-full h-full flex items-center justify-center">
          <div className="game-frame">
          {gameState === GameState.PLAYING && (
            <button
              id="pause-btn"
              onClick={() => handlePause()}
              title="Tạm dừng game (ESC)"
              className="absolute z-20 cursor-pointer select-none"
              style={{
                top: 'clamp(8px, 1.5vw, 14px)',
                right: 'clamp(8px, 1.5vw, 14px)',
                width: 'clamp(38px, 6vw, 46px)',
                height: 'clamp(38px, 6vw, 46px)',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                border: '3px solid rgba(255,255,255,0.6)',
                boxShadow: '0 4px 0 #b45309, 0 6px 16px rgba(245,158,11,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.1s',
                fontSize: 'clamp(16px, 3vw, 20px)',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.92) translateY(2px)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              ⏸️
            </button>
          )}

        {gameState === GameState.PAUSED && (
          <div id="pause-overlay" onContextMenu={(e) => e.preventDefault()}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4 text-center game-overlay-blur"
          >
            <div className="game-panel game-panel-xl overlay-enter">
              <div className="rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  width: 'clamp(60px, 14vw, 72px)',
                  height: 'clamp(60px, 14vw, 72px)',
                  background: '#F5F3FF',
                  fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
                }}
              >
                ⏸️
              </div>

              <h2 id="pause-h2" className="game-heading mb-1" style={{ color: '#6366F1', fontSize: 'clamp(1.5rem, 4.5vw, 1.85rem)' }}>
                Tạm dừng
              </h2>
              <p id="pause-p" className="mb-6" style={{ color: '#9CA3AF', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
                Bé hãy nghỉ ngơi một chút nhé! 🌙
              </p>

              <div className="flex flex-col" style={{ gap: 'clamp(12px, 3vh, 20px)' }}>
                <button
                  id="resume-btn"
                  onClick={() => handleResume()}
                  className="game-btn-primary game-btn-green"
                >
                  ▶️ Tiếp tục chơi
                </button>

                <button
                  id="exit-btn"
                  onClick={() => handleExit()}
                  className="game-btn-secondary"
                >
                  🏠 Thoát game
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState === GameState.DEFEAT && (
          <div id="defeat-overlay" onContextMenu={(e) => e.preventDefault()}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center p-4 text-center overflow-y-auto game-overlay-defeat"
          >
            <div className="game-panel game-panel-xl overlay-enter">
              <div className="rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  width: 'clamp(60px, 14vw, 72px)',
                  height: 'clamp(60px, 14vw, 72px)',
                  background: '#FFE4E6',
                  fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
                }}
              >
                😿
              </div>

              <h2 id="defeat-h2" className="game-heading mb-2" style={{ color: '#E11D48', fontSize: 'clamp(1.4rem, 4.5vw, 1.75rem)' }}>
                Trứng đã bị mang đi hết!
              </h2>
              <p id="defeat-p" className="mb-5 leading-relaxed" style={{ color: '#6B7280', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
                Dơi và sói đã lấy hết trứng trong tổ rồi. Bé hãy thử lại để bảo vệ tốt hơn nhé! 💪
              </p>

              <div className="rounded-2xl bg-white/90 p-4 mb-5 text-left" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
                <div className="text-xs font-bold uppercase tracking-widest mb-1 text-center" style={{ color: '#9CA3AF' }}>
                  📊 Thống kê trận đấu
                </div>
                <div className="flex flex-col" style={{ gap: 'clamp(10px, 2.5vh, 16px)' }}>
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#6B7280' }}>🎯 Bắn trúng dơi</span>
                    <span className="game-heading" style={{ color: '#14B8A6', fontSize: '1rem' }}>{stats.batHits} lần</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#6B7280' }}>💨 Bắn hụt</span>
                    <span className="game-heading" style={{ color: '#F472B6', fontSize: '1rem' }}>{stats.missedShots} lần</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#6B7280' }}>🐣 Chim nở thành công</span>
                    <span className="game-heading" style={{ color: '#3B82F6', fontSize: '1rem' }}>{stats.birdsRescued} chú</span>
                  </div>
                </div>
              </div>

              <button
                id="restart-defeat-btn"
                onClick={() => setGameState(GameState.START)}
                className="game-btn-primary game-btn-purple flex items-center justify-center gap-2"
              >
                <RotateCcw style={{ width: '1.15rem', height: '1.15rem' }} />
                Cho bé chơi lại
              </button>
            </div>
          </div>
        )}

        {gameState === GameState.VICTORY && showVictoryScreen && (
          <div id="victory-overlay" onContextMenu={(e) => e.preventDefault()}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center p-4 text-center overflow-y-auto game-overlay-end"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {['🎊','🎉','⭐','✨','🌟','🎊','🎉','💫','🎊','⭐','✨','🌟'].map((s, i) => (
                <span key={i} className="absolute animate-bounce select-none" style={{
                  left: `${(i * 8.7 + 2) % 100}%`,
                  top: `${(i * 11 + 3) % 85}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${1.2 + (i % 4) * 0.4}s`,
                  fontSize: `${0.9 + (i % 3) * 0.4}rem`,
                  opacity: 0.55,
                }}>{s}</span>
              ))}
            </div>

            <div className="relative z-10 game-panel game-panel-xl overlay-enter">
              <div className="relative flex items-end justify-center gap-2 mb-3">
                <div className="animate-bounce" style={{
                  width: 'clamp(52px, 12vw, 64px)',
                  height: 'clamp(52px, 12vw, 64px)',
                  backgroundImage: `url('${baseUrl}Bird.png')`,
                  backgroundSize: '256px 64px',
                  backgroundPosition: '0px 0px',
                  backgroundRepeat: 'no-repeat',
                  animationDelay: '0.1s',
                }} />
                <div className="relative">
                  <div className="animate-bounce" style={{
                    fontSize: 'clamp(2.75rem, 9vw, 4rem)',
                    animationDuration: '0.8s',
                    filter: 'drop-shadow(0 6px 14px rgba(245,158,11,0.4))',
                    lineHeight: 1,
                  }}>🏆</div>
                  <span className="absolute -top-1 -right-2 animate-spin" style={{ animationDuration: '2s', fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>✨</span>
                </div>
                <div className="animate-bounce" style={{
                  width: 'clamp(52px, 12vw, 64px)',
                  height: 'clamp(52px, 12vw, 64px)',
                  transform: 'scaleX(-1)',
                  backgroundImage: `url('${baseUrl}Bird.png')`,
                  backgroundSize: '256px 64px',
                  backgroundPosition: '-192px 0px',
                  backgroundRepeat: 'no-repeat',
                  animationDelay: '0.2s',
                }} />
              </div>

              <h2 id="victory-h2" className="game-heading mb-1" style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: '#16A34A' }}>
                Bé thắng rồi! 🎉
              </h2>
              <p id="victory-p" className="font-medium mb-4" style={{ color: '#6B7280', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
                Tất cả chim non đã nở an toàn! Bé giỏi lắm! 🐣
              </p>

              <div className="rounded-2xl bg-white/90 p-4 mb-4">
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>⭐ Điểm của bé</div>
                <div className="game-heading mb-4" style={{
                  fontSize: 'clamp(2.25rem, 8vw, 3.25rem)',
                  color: '#F59E0B',
                  lineHeight: 1,
                }}>{score}</div>

                <div className="grid grid-cols-3" style={{ gap: 'clamp(12px, 3vw, 20px)' }}>
                  {[
                    { icon: '🎯', label: 'Bắn trúng', value: stats.batHits, color: '#14B8A6', bg: '#ECFDF5' },
                    { icon: '🐣', label: 'Chim nở', value: stats.birdsRescued, color: '#3B82F6', bg: '#EFF6FF' },
                    { icon: '💨', label: 'Bắn hụt', value: stats.missedShots, color: '#F472B6', bg: '#FDF2F8' },
                  ].map((s, i) => (
                    <div key={i} className="rounded-xl p-2 text-center" style={{ background: s.bg }}>
                      <div style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.35rem)' }} className="mb-0.5">{s.icon}</div>
                      <div className="game-heading" style={{ color: s.color, fontSize: 'clamp(1rem, 3.2vw, 1.2rem)' }}>{s.value}</div>
                      <div style={{ color: '#9CA3AF', fontSize: 'clamp(0.65rem, 2vw, 0.75rem)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {score >= highScore && score > 0 && (
                <div className="rounded-xl py-2.5 px-4 mb-4 font-bold" style={{
                  background: '#FFFBEB',
                  border: '1.5px solid #FDE68A',
                  color: '#D97706',
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                }}>
                  🏅 Kỷ lục mới của bé!
                </div>
              )}

              <button
                id="restart-victory-btn"
                onClick={() => setGameState(GameState.START)}
                className="game-btn-primary game-btn-green"
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
          onContextMenu={(e) => e.preventDefault()}
          className="absolute inset-0 block w-full h-full bg-slate-900 cursor-none z-0"
        />
          </div>
        </div>
      </div>
    </div>
  );
}