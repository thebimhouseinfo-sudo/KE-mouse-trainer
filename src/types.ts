export enum Difficulty {
  EASY = 'EASY',
  HARD = 'HARD'
}

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  DEFEAT = 'DEFEAT',
  VICTORY = 'VICTORY'
}

export enum EggState {
  IN_NEST = 'IN_NEST',
  GLOWING = 'GLOWING',
  FALLEN = 'FALLEN',
  STOLEN = 'STOLEN',
  HATCHED = 'HATCHED'
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface SpriteFrame {
  filename: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SpriteAsset {
  png: string;
  frames: SpriteFrame[];
}

export interface Egg {
  id: number;
  originX: number;
  originY: number;
  currentX: number;
  currentY: number;
  rotation: number;
  state: EggState;
  vx: number;
  vy: number;
  glowTimer: number; // to manage state
}

export interface BabyBat {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  state: 'FLYING' | 'REBOUNDING' | 'DEATH' | 'RESPAWNING';
  hitsToNestLeft: number;
  targetX: number;
  targetY: number;
  frameIndex: number;
  scale: number;
  cooldownTimer: number; // for respawn
}

export interface BigBat {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  waveAngle: number;
  state: 'FLYING' | 'STOLEN_RETREAT' | 'DEATH' | 'RESPAWNING';
  stolenEggId: number | null;
  frameIndex: number;
  scale: number;
  cooldownTimer: number; // for respawn
}

export interface Wolf {
  id: number;
  x: number;
  y: number;
  vx: number;
  state: 'WALKING' | 'STEALING' | 'RETREATING' | 'CRYING_RUN_AWAY';
  stolenEggId: number | null;
  hitPoints: number;
  frameIndex: number;
  scale: number;
  cooldownTimer: number; // for spawn cycle
  cryingTimer?: number; // for crying recovery
}

export interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  type: 'LIGHT' | 'POWER'; // light from left click, power from holding right click
  frameIndex: number;
  lockedTargetId?: number;
  lockedTargetType?: 'BABY_BAT' | 'BIG_BAT' | 'WOLF';
  isExploding?: boolean;
  explodeTimer?: number;
}

export interface BabyBird {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  frameIndex: number;
  orbitState?: 'CIRCLING' | 'FLYING_AWAY';
  orbitAngle?: number;
  orbitRadius?: number;
  centerX?: number;
  centerY?: number;
  orbitAccumulatedAngle?: number;
}

export interface Cloud {
  x: number;
  y: number;
  speed: number;
  scale: number;
}
