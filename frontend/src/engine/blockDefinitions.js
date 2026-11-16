// Color-coded block categories & definitions inspired by Scratch
export const BLOCK_CATEGORIES = [
  { id: 'motion', name: 'Motion', color: 'bg-blue-600 border-blue-700 text-white' },
  { id: 'looks', name: 'Looks', color: 'bg-purple-600 border-purple-700 text-white' },
  { id: 'sound', name: 'Sound', color: 'bg-pink-600 border-pink-700 text-white' },
  { id: 'events', name: 'Events', color: 'bg-amber-500 border-amber-600 text-white' },
  { id: 'control', name: 'Control', color: 'bg-orange-500 border-orange-600 text-white' },
  { id: 'sensing', name: 'Sensing', color: 'bg-cyan-600 border-cyan-700 text-white' },
  { id: 'operators', name: 'Operators', color: 'bg-emerald-600 border-emerald-700 text-white' },
  { id: 'variables', name: 'Variables', color: 'bg-rose-600 border-rose-700 text-white' }
];

export const BLOCK_TEMPLATES = {
  motion: [
    { type: 'move_steps', label: 'Move [X] steps', category: 'motion', val: 10, inputType: 'number' },
    { type: 'turn_right', label: 'Turn ↻ [X] degrees', category: 'motion', val: 15, inputType: 'number' },
    { type: 'turn_left', label: 'Turn ↺ [X] degrees', category: 'motion', val: 15, inputType: 'number' },
    { type: 'change_x', label: 'Change X by [X]', category: 'motion', val: 10, inputType: 'number' },
    { type: 'change_y', label: 'Change Y by [X]', category: 'motion', val: -10, inputType: 'number' },
    { type: 'jump', label: 'Jump Up (Velocity -12)', category: 'motion', val: -12 },
    { type: 'goto_random', label: 'Go to random position', category: 'motion' },
    { type: 'bounce_edge', label: 'If on edge, bounce', category: 'motion' }
  ],
  looks: [
    { type: 'say_text', label: 'Say [TEXT] for 2 secs', category: 'looks', text: 'Hello, World!', inputType: 'text' },
    { type: 'next_costume', label: 'Next Costume 🎭', category: 'looks' },
    { type: 'change_size', label: 'Change size by [X]%', category: 'looks', val: 10, inputType: 'number' },
    { type: 'show', label: 'Show Sprite 👁️', category: 'looks' },
    { type: 'hide', label: 'Hide Sprite 🙈', category: 'looks' }
  ],
  sound: [
    { type: 'play_laser', label: 'Play Laser Sound 🔫', category: 'sound' },
    { type: 'play_powerup', label: 'Play Power-up Chime ✨', category: 'sound' },
    { type: 'play_hit', label: 'Play Impact Hit 💥', category: 'sound' },
    { type: 'play_explosion', label: 'Play Explosion 💣', category: 'sound' }
  ],
  events: [
    { type: 'when_flag_clicked', label: 'When 🟢 Green Flag clicked', category: 'events', isStarter: true },
    { type: 'when_key_pressed', label: 'When key [KEY] pressed', category: 'events', keyChoice: 'ArrowRight', isStarter: true, inputType: 'key' },
    { type: 'when_sprite_clicked', label: 'When this sprite clicked', category: 'events', isStarter: true }
  ],
  control: [
    { type: 'forever', label: 'Forever ♾️', category: 'control', isContainer: true },
    { type: 'repeat', label: 'Repeat [X] times', category: 'control', val: 5, inputType: 'number', isContainer: true },
    { type: 'wait', label: 'Wait [X] seconds ⏱️', category: 'control', val: 0.5, inputType: 'number' },
    { type: 'if_touching', label: 'If touching [SPRITE] then', category: 'control', targetSprite: 'Villain', inputType: 'sprite', isContainer: true }
  ],
  sensing: [
    { type: 'touching_edge', label: 'Touching Edge?', category: 'sensing' },
    { type: 'distance_to_mouse', label: 'Distance to Mouse 🖱️', category: 'sensing' },
    { type: 'key_pressed_check', label: 'Key [KEY] is down?', category: 'sensing', keyChoice: 'Space', inputType: 'key' }
  ],
  operators: [
    { type: 'pick_random', label: 'Pick random [1] to [10] 🎲', category: 'operators', min: 1, max: 10 },
    { type: 'check_greater', label: '[Score] > [50] ❓', category: 'operators', val: 50 }
  ],
  variables: [
    { type: 'change_score', label: 'Change Score by [+1] 🪙', category: 'variables', val: 1, inputType: 'number' },
    { type: 'change_lives', label: 'Change Lives by [-1] ❤️', category: 'variables', val: -1, inputType: 'number' },
    { type: 'set_score', label: 'Set Score to [0]', category: 'variables', val: 0, inputType: 'number' }
  ]
};

