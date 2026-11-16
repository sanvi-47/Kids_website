// 10 Full Starter Templates for Game Creation
export const GAME_CREATION_TEMPLATES = [
  {
    id: 'space_shooter_creator',
    title: 'Space Shooter Creator',
    category: 'Shooting',
    description: 'Control a spaceship with arrow keys, blast alien invaders, and dodge incoming meteors!',
    difficulty: 'Action',
    badge: 'Popular 🔥',
    icon: '🚀',
    background: 'galaxy_stars',
    sprites: [
      {
        id: 'sp_player',
        name: 'Player Ship',
        emoji: '🚀',
        costumes: ['🚀', '⚡'],
        currentCostume: 0,
        x: 250,
        y: 380,
        size: 55,
        direction: 0,
        speed: 8,
        visible: true,
        blocks: [
          { id: 'b1', type: 'when_flag_clicked', label: 'When 🟢 Green Flag clicked', category: 'events' },
          { id: 'b2', type: 'when_key_pressed', label: 'When key [ArrowLeft] pressed', category: 'events', keyChoice: 'ArrowLeft' },
          { id: 'b3', type: 'change_x', label: 'Change X by [-15]', category: 'motion', val: -15 },
          { id: 'b4', type: 'when_key_pressed', label: 'When key [ArrowRight] pressed', category: 'events', keyChoice: 'ArrowRight' },
          { id: 'b5', type: 'change_x', label: 'Change X by [15]', category: 'motion', val: 15 },
          { id: 'b6', type: 'when_key_pressed', label: 'When key [Space] pressed', category: 'events', keyChoice: 'Space' },
          { id: 'b7', type: 'play_laser', label: 'Play Laser Sound 🔫', category: 'sound' },
          { id: 'b8', type: 'change_score', label: 'Change Score by [+10] 🪙', category: 'variables', val: 10 }
        ]
      },
      {
        id: 'sp_enemy',
        name: 'Alien Invader',
        emoji: '👾',
        costumes: ['👾', '💥'],
        currentCostume: 0,
        x: 250,
        y: 60,
        size: 48,
        direction: 0,
        speed: 4,
        visible: true,
        blocks: [
          { id: 'e1', type: 'when_flag_clicked', label: 'When 🟢 Green Flag clicked', category: 'events' },
          { id: 'e2', type: 'forever', label: 'Forever ♾️', category: 'control' },
          { id: 'e3', type: 'move_steps', label: 'Move [10] steps', category: 'motion', val: 8 },
          { id: 'e4', type: 'bounce_edge', label: 'If on edge, bounce', category: 'motion' }
        ]
      }
    ]
  },
  {
    id: 'platformer_creator',
    title: 'Platformer Game Creator',
    category: 'Adventure',
    description: 'Jump between platforms, collect golden coins, stomp monsters and reach the castle goal!',
    difficulty: 'Medium',
    badge: 'Classic 🏰',
    icon: '🦊',
    background: 'emerald_hills',
    sprites: [
      {
        id: 'sp_hero',
        name: 'Sparky Fox',
        emoji: '🦊',
        costumes: ['🦊', '🐾'],
        currentCostume: 0,
        x: 60,
        y: 350,
        size: 52,
        direction: 0,
        speed: 6,
        visible: true,
        blocks: [
          { id: 'p1', type: 'when_flag_clicked', label: 'When 🟢 Green Flag clicked', category: 'events' },
          { id: 'p2', type: 'when_key_pressed', label: 'When key [ArrowRight] pressed', category: 'events', keyChoice: 'ArrowRight' },
          { id: 'p3', type: 'change_x', label: 'Change X by [15]', category: 'motion', val: 15 },
          { id: 'p4', type: 'when_key_pressed', label: 'When key [ArrowLeft] pressed', category: 'events', keyChoice: 'ArrowLeft' },
          { id: 'p5', type: 'change_x', label: 'Change X by [-15]', category: 'motion', val: -15 },
          { id: 'p6', type: 'when_key_pressed', label: 'When key [Space] pressed', category: 'events', keyChoice: 'Space' },
          { id: 'p7', type: 'jump', label: 'Jump Up (Velocity -12)', category: 'motion', val: -14 }
        ]
      },
      {
        id: 'sp_coin',
        name: 'Treasure Coin',
        emoji: '🪙',
        costumes: ['🪙', '✨'],
        currentCostume: 0,
        x: 280,
        y: 260,
        size: 38,
        direction: 0,
        speed: 0,
        visible: true,
        blocks: [
          { id: 'c1', type: 'when_flag_clicked', label: 'When 🟢 Green Flag clicked', category: 'events' },
          { id: 'c2', type: 'if_touching', label: 'If touching [Sparky Fox] then', category: 'control' },
          { id: 'c3', type: 'play_powerup', label: 'Play Power-up Chime ✨', category: 'sound' },
          { id: 'c4', type: 'change_score', label: 'Change Score by [+50] 🪙', category: 'variables', val: 50 },
          { id: 'c5', type: 'goto_random', label: 'Go to random position', category: 'motion' }
        ]
      }
    ]
  },
  {
    id: 'snake_creator',
    title: 'Snake Game Creator',
    category: 'Arcade',
    description: 'Guide the hungry snake, collect glowing energy orbs, and grow longer with each bite!',
    difficulty: 'Beginner',
    badge: 'Popular 🐍',
    icon: '🐍',
    background: 'cyber_grid',
    sprites: [
      {
        id: 'sp_snake_head',
        name: 'Snake Head',
        emoji: '🐍',
        costumes: ['🐍', '⭐'],
        currentCostume: 0,
        x: 250,
        y: 200,
        size: 45,
        direction: 0,
        speed: 6,
        visible: true,
        blocks: [
          { id: 's1', type: 'when_flag_clicked', label: 'When 🟢 Green Flag clicked', category: 'events' },
          { id: 's2', type: 'forever', label: 'Forever ♾️', category: 'control' },
          { id: 's3', type: 'move_steps', label: 'Move [10] steps', category: 'motion', val: 10 }
        ]
      },
      {
        id: 'sp_food',
        name: 'Energy Orb',
        emoji: '🍏',
        costumes: ['🍏', '💎'],
        currentCostume: 0,
        x: 350,
        y: 120,
        size: 38,
        direction: 0,
        speed: 0,
        visible: true,
        blocks: [
          { id: 'f1', type: 'when_flag_clicked', label: 'When 🟢 Green Flag clicked', category: 'events' },
          { id: 'f2', type: 'if_touching', label: 'If touching [Snake Head] then', category: 'control' },
          { id: 'f3', type: 'change_score', label: 'Change Score by [+10] 🪙', category: 'variables', val: 10 },
          { id: 'f4', type: 'goto_random', label: 'Go to random position', category: 'motion' }
        ]
      }
    ]
  },
  {
    id: 'car_racing_creator',
    title: 'Car Racing Creator',
    category: 'Racing',
    description: 'Build a high-speed highway racer, dodge traffic and grab turbo nitro boosts!',
    difficulty: 'Fast',
    badge: 'Turbo 🏎️',
    icon: '🏎️',
    background: 'racing_circuit',
    sprites: [
      {
        id: 'sp_car',
        name: 'Turbo Racer',
        emoji: '🏎️',
        costumes: ['🏎️', '💨'],
        currentCostume: 0,
        x: 250,
        y: 350,
        size: 52,
        direction: 0,
        speed: 8,
        visible: true,
        blocks: [
          { id: 'rc1', type: 'when_flag_clicked', label: 'When 🟢 Green Flag clicked', category: 'events' },
          { id: 'rc2', type: 'when_key_pressed', label: 'When key [ArrowLeft] pressed', category: 'events', keyChoice: 'ArrowLeft' },
          { id: 'rc3', type: 'change_x', label: 'Change X by [-20]', category: 'motion', val: -20 },
          { id: 'rc4', type: 'when_key_pressed', label: 'When key [ArrowRight] pressed', category: 'events', keyChoice: 'ArrowRight' },
          { id: 'rc5', type: 'change_x', label: 'Change X by [20]', category: 'motion', val: 20 }
        ]
      },
      {
        id: 'sp_traffic',
        name: 'Rival Truck',
        emoji: '🚚',
        costumes: ['🚚', '🛢️'],
        currentCostume: 0,
        x: 250,
        y: 40,
        size: 50,
        direction: 0,
        speed: 4,
        visible: true,
        blocks: [
          { id: 'tr1', type: 'when_flag_clicked', label: 'When 🟢 Green Flag clicked', category: 'events' },
          { id: 'tr2', type: 'forever', label: 'Forever ♾️', category: 'control' },
          { id: 'tr3', type: 'change_y', label: 'Change Y by [8]', category: 'motion', val: 8 },
          { id: 'tr4', type: 'bounce_edge', label: 'If on edge, bounce', category: 'motion' }
        ]
      }
    ]
  },
  {
    id: 'flappy_bird_creator',
    title: 'Flappy Wings Creator',
    category: 'Arcade',
    description: 'Tap space to flap wings, navigate through pipes, and survive as long as possible!',
    difficulty: 'Tricky',
    badge: 'Tap Fun 🐥',
    icon: '🐥',
    background: 'sunset_rooftops',
    sprites: [
      {
        id: 'sp_bird',
        name: 'Flappy Bird',
        emoji: '🐥',
        costumes: ['🐥', '🪶'],
        currentCostume: 0,
        x: 100,
        y: 200,
        size: 45,
        direction: 0,
        speed: 5,
        visible: true,
        blocks: [
          { id: 'fb1', type: 'when_flag_clicked', label: 'When 🟢 Green Flag clicked', category: 'events' },
          { id: 'fb2', type: 'when_key_pressed', label: 'When key [Space] pressed', category: 'events', keyChoice: 'Space' },
          { id: 'fb3', type: 'jump', label: 'Jump Up (Velocity -12)', category: 'motion', val: -12 },
          { id: 'fb4', type: 'play_laser', label: 'Play Laser Sound 🔫', category: 'sound' }
        ]
      }
    ]
  },
  {
    id: 'zombie_survival_creator',
    title: 'Zombie Survival Creator',
    category: 'Shooting',
    description: 'Survive incoming waves of spooky pixel zombies with laser blasters and shields!',
    difficulty: 'Action',
    badge: 'Survival 🧟',
    icon: '🧟',
    background: 'haunted_dungeon',
    sprites: [
      {
        id: 'sp_survivor',
        name: 'Hero Guard',
        emoji: '🥷',
        costumes: ['🥷', '🗡️'],
        currentCostume: 0,
        x: 250,
        y: 350,
        size: 50,
        direction: 0,
        speed: 6,
        visible: true,
        blocks: [
          { id: 'z1', type: 'when_flag_clicked', label: 'When 🟢 Green Flag clicked', category: 'events' },
          { id: 'z2', type: 'when_key_pressed', label: 'When key [Space] pressed', category: 'events', keyChoice: 'Space' },
          { id: 'z3', type: 'play_laser', label: 'Play Laser Sound 🔫', category: 'sound' }
        ]
      },
      {
        id: 'sp_zombie',
        name: 'Pixel Zombie',
        emoji: '🧟',
        costumes: ['🧟', '💀'],
        currentCostume: 0,
        x: 250,
        y: 50,
        size: 48,
        direction: 0,
        speed: 3,
        visible: true,
        blocks: [
          { id: 'zm1', type: 'when_flag_clicked', label: 'When 🟢 Green Flag clicked', category: 'events' },
          { id: 'zm2', type: 'forever', label: 'Forever ♾️', category: 'control' },
          { id: 'zm3', type: 'change_y', label: 'Change Y by [4]', category: 'motion', val: 4 }
        ]
      }
    ]
  },
  {
    id: 'battle_arena_creator',
    title: 'Battle Arena Creator',
    category: 'Action',
    description: 'Summon robots and monsters inside a battle cage, trigger sword combos and earn XP!',
    difficulty: 'Hard',
    badge: 'Duel ⚔️',
    icon: '🤖',
    background: 'cyber_city',
    sprites: [
      {
        id: 'sp_mecha',
        name: 'Robbie Mecha',
        emoji: '🤖',
        costumes: ['🤖', '⚡'],
        currentCostume: 0,
        x: 180,
        y: 280,
        size: 52,
        direction: 0,
        speed: 6,
        visible: true,
        blocks: [
          { id: 'ba1', type: 'when_flag_clicked', label: 'When 🟢 Green Flag clicked', category: 'events' },
          { id: 'ba2', type: 'when_key_pressed', label: 'When key [Space] pressed', category: 'events', keyChoice: 'Space' },
          { id: 'ba3', type: 'play_hit', label: 'Play Impact Hit 💥', category: 'sound' }
        ]
      }
    ]
  },
  {
    id: 'endless_runner_creator',
    title: 'Endless Runner Creator',
    category: 'Adventure',
    description: 'Sprint across rooftops, slide under drones, collect gems, and make speeds faster over time!',
    difficulty: 'Medium',
    badge: 'Speed 🏃‍♂️',
    icon: '🏃‍♂️',
    background: 'sunset_rooftops',
    sprites: [
      {
        id: 'sp_runner',
        name: 'Rooftop Runner',
        emoji: '🏃‍♂️',
        costumes: ['🏃‍♂️', '🛹'],
        currentCostume: 0,
        x: 80,
        y: 330,
        size: 50,
        direction: 0,
        speed: 7,
        visible: true,
        blocks: [
          { id: 'er1', type: 'when_flag_clicked', label: 'When 🟢 Green Flag clicked', category: 'events' },
          { id: 'er2', type: 'when_key_pressed', label: 'When key [Space] pressed', category: 'events', keyChoice: 'Space' },
          { id: 'er3', type: 'jump', label: 'Jump Up (Velocity -12)', category: 'motion', val: -13 }
        ]
      }
    ]
  },
  {
    id: 'puzzle_game_creator',
    title: 'Puzzle Game Creator',
    category: 'Puzzle',
    description: 'Create match-3 and brain-teasing tile puzzles with countdown timers and reward streaks!',
    difficulty: 'Brain',
    badge: 'Logic 🔮',
    icon: '🔮',
    background: 'haunted_dungeon',
    sprites: [
      {
        id: 'sp_magic_orb',
        name: 'Magic Orb',
        emoji: '🔮',
        costumes: ['🔮', '✨'],
        currentCostume: 0,
        x: 250,
        y: 200,
        size: 48,
        direction: 0,
        speed: 0,
        visible: true,
        blocks: [
          { id: 'pz1', type: 'when_flag_clicked', label: 'When 🟢 Green Flag clicked', category: 'events' },
          { id: 'pz2', type: 'when_sprite_clicked', label: 'When this sprite clicked', category: 'events' },
          { id: 'pz3', type: 'play_powerup', label: 'Play Power-up Chime ✨', category: 'sound' },
          { id: 'pz4', type: 'change_score', label: 'Change Score by [+25] 🪙', category: 'variables', val: 25 }
        ]
      }
    ]
  },
  {
    id: 'blank_project_creator',
    title: 'Blank Canvas Creator',
    category: 'All',
    description: 'Start completely from scratch! Add your own characters, code blocks and design your dream game rules.',
    difficulty: 'Unlimited',
    badge: 'Freeform 🎨',
    icon: '✨',
    background: 'galaxy_stars',
    sprites: [
      {
        id: 'sp_default',
        name: 'My First Sprite',
        emoji: '🦊',
        costumes: ['🦊'],
        currentCostume: 0,
        x: 250,
        y: 200,
        size: 50,
        direction: 0,
        speed: 6,
        visible: true,
        blocks: [
          { id: 'bk1', type: 'when_flag_clicked', label: 'When 🟢 Green Flag clicked', category: 'events' },
          { id: 'bk2', type: 'say_text', label: 'Say [TEXT] for 2 secs', category: 'looks', text: 'Ready to code!' }
        ]
      }
    ]
  }
];

