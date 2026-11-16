// Built-in Categorized Sprite Library with Costumes and Attributes
export const SPRITE_CATEGORIES = [
  'All',
  'Heroes',
  'Villains',
  'Animals',
  'Robots',
  'Monsters',
  'Cars',
  'Space',
  'Fantasy'
];

export const BUILTIN_SPRITES = [
  // Heroes
  { id: 'hero_fox', name: 'Sparky Fox', category: 'Heroes', emoji: '🦊', costumes: ['🦊', '🐾', '🌟'], defaultSpeed: 6 },
  { id: 'hero_kid', name: 'Cyber Hero', category: 'Heroes', emoji: '🦸‍♂️', costumes: ['🦸‍♂️', '⚡', '🛡️'], defaultSpeed: 6 },
  { id: 'hero_ninja', name: 'Shadow Ninja', category: 'Heroes', emoji: '🥷', costumes: ['🥷', '🗡️', '💨'], defaultSpeed: 7 },
  { id: 'hero_runner', name: 'Dash Kid', category: 'Heroes', emoji: '🏃‍♂️', costumes: ['🏃‍♂️', '🛹', '👟'], defaultSpeed: 7 },
  
  // Villains
  { id: 'villain_boss', name: 'Dark Demon', category: 'Villains', emoji: '👹', costumes: ['👹', '🔥', '💀'], defaultSpeed: 3 },
  { id: 'villain_skull', name: 'Ghost Skull', category: 'Villains', emoji: '💀', costumes: ['💀', '👻', '☠️'], defaultSpeed: 4 },
  { id: 'villain_alien', name: 'Zorg Raider', category: 'Villains', emoji: '👾', costumes: ['👾', '🛸', '💣'], defaultSpeed: 5 },
  
  // Animals
  { id: 'anim_cat', name: 'Pixel Cat', category: 'Animals', emoji: '🐱', costumes: ['🐱', '🐾', '😸'], defaultSpeed: 6 },
  { id: 'anim_dino', name: 'Rex Dino', category: 'Animals', emoji: '🦖', costumes: ['🦖', '🦕', '🐾'], defaultSpeed: 5 },
  { id: 'anim_mouse', name: 'Cheese Mouse', category: 'Animals', emoji: '🐭', costumes: ['🐭', '🧀', '🏃'], defaultSpeed: 6 },
  { id: 'anim_kangaroo', name: 'Hoppy Roo', category: 'Animals', emoji: '🦘', costumes: ['🦘', '⭐', '💨'], defaultSpeed: 6 },

  // Robots
  { id: 'bot_spark', name: 'Robbie Bot', category: 'Robots', emoji: '🤖', costumes: ['🤖', '⚡', '🔋'], defaultSpeed: 5 },
  { id: 'bot_drone', name: 'Hover Sentry', category: 'Robots', emoji: '🛸', costumes: ['🛸', '📡', '💥'], defaultSpeed: 6 },

  // Monsters
  { id: 'mon_slime', name: 'Goo Monster', category: 'Monsters', emoji: '🦠', costumes: ['🦠', '🧪', '✨'], defaultSpeed: 3 },
  { id: 'mon_zombie', name: 'Pixel Zombie', category: 'Monsters', emoji: '🧟', costumes: ['🧟', '🦴', '💀'], defaultSpeed: 2 },
  { id: 'mon_cyclops', name: 'One-Eyed Pete', category: 'Monsters', emoji: '👁️', costumes: ['👁️', '🌀', '💢'], defaultSpeed: 4 },

  // Cars & Vehicles
  { id: 'veh_racer', name: 'Turbo Red', category: 'Cars', emoji: '🏎️', costumes: ['🏎️', '💨', '🏁'], defaultSpeed: 8 },
  { id: 'veh_police', name: 'Patrol Cruiser', category: 'Cars', emoji: '🚓', costumes: ['🚓', '🚨', '🚔'], defaultSpeed: 7 },
  { id: 'veh_truck', name: 'Monster Hauler', category: 'Cars', emoji: '🚚', costumes: ['🚚', '📦', '🛢️'], defaultSpeed: 4 },

  // Space
  { id: 'spc_rocket', name: 'Hyper Rocket', category: 'Space', emoji: '🚀', costumes: ['🚀', '🔥', '✨'], defaultSpeed: 7 },
  { id: 'spc_star', name: 'Nova Star', category: 'Space', emoji: '⭐', costumes: ['⭐', '🌟', '💫'], defaultSpeed: 3 },
  { id: 'spc_meteor', name: 'Burning Meteor', category: 'Space', emoji: '☄️', costumes: ['☄️', '🔥', '💥'], defaultSpeed: 5 },

  // Fantasy & Collectibles
  { id: 'fnt_wizard', name: 'Merlin Mage', category: 'Fantasy', emoji: '🧙‍♂️', costumes: ['🧙‍♂️', '🪄', '🔮'], defaultSpeed: 5 },
  { id: 'fnt_dragon', name: 'Flame Dragon', category: 'Fantasy', emoji: '🐲', costumes: ['🐲', '🔥', '🐉'], defaultSpeed: 6 },
  { id: 'fnt_coin', name: 'Gold Coin', category: 'Fantasy', emoji: '🪙', costumes: ['🪙', '✨', '💰'], defaultSpeed: 0 },
  { id: 'fnt_gem', name: 'Ruby Crystal', category: 'Fantasy', emoji: '💎', costumes: ['💎', '✨', '👑'], defaultSpeed: 0 }
];

export const BUILTIN_BACKGROUNDS = [
  { id: 'cyber_grid', name: 'Cyber Grid', bgClass: 'bg-slate-950 border-4 border-dashed border-teal-500/30' },
  { id: 'galaxy_stars', name: 'Deep Galaxy', bgClass: 'bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900' },
  { id: 'emerald_hills', name: 'Emerald Hills', bgClass: 'bg-gradient-to-b from-sky-300 via-emerald-200 to-green-600' },
  { id: 'cyber_city', name: 'Neon City Night', bgClass: 'bg-gradient-to-b from-slate-900 via-purple-950 to-indigo-950' },
  { id: 'ocean_depths', name: 'Ocean Depths', bgClass: 'bg-gradient-to-b from-cyan-400 via-blue-600 to-indigo-950' },
  { id: 'haunted_dungeon', name: 'Haunted Dungeon', bgClass: 'bg-gradient-to-b from-stone-900 via-purple-950 to-neutral-900' },
  { id: 'racing_circuit', name: 'Speedway Track', bgClass: 'bg-gradient-to-b from-slate-900 via-neutral-800 to-rose-950' },
  { id: 'sunset_rooftops', name: 'Sunset Rooftops', bgClass: 'bg-gradient-to-b from-amber-400 via-rose-500 to-purple-900' }
];

