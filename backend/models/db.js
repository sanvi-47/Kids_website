import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class JsonStore {
  constructor(filename, initialData = []) {
    this.filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify(initialData, null, 2), 'utf-8');
    }
  }

  read() {
    try {
      const content = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(content || '[]');
    } catch (e) {
      console.error(`Error reading ${this.filePath}`, e);
      return [];
    }
  }

  write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (e) {
      console.error(`Error writing to ${this.filePath}`, e);
      return false;
    }
  }

  findAll(query = {}) {
    const all = this.read();
    return all.filter(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  findById(id) {
    const all = this.read();
    return all.find(item => item.id === id || item._id === id);
  }

  create(item) {
    const all = this.read();
    const newItem = {
      id: item.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    all.push(newItem);
    this.write(all);
    return newItem;
  }

  update(id, updates) {
    const all = this.read();
    const index = all.findIndex(item => item.id === id || item._id === id);
    if (index === -1) return null;
    all[index] = {
      ...all[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.write(all);
    return all[index];
  }

  delete(id) {
    const all = this.read();
    const filtered = all.filter(item => item.id !== id && item._id !== id);
    this.write(filtered);
    return true;
  }
}

export const usersDb = new JsonStore('users.json', [
  {
    id: 'user_demo_kid',
    username: 'SparkyCoder',
    email: 'kid@sparkcode.ai',
    // hashed version of 'password123'
    passwordHash: '$2a$10$w09u7RrvqZ23W1bQfWk3fOGx5zNkVW3q1H784q8wW73QzK2kE1i2y',
    role: 'kid',
    age: 10,
    avatar: '🦊',
    parentEmail: 'parent@sparkcode.ai',
    screenTimeLimitMinutes: 60,
    allowedAIModes: ['guided', 'creative', 'strict'],
    xp: 350,
    level: 3,
    badges: ['First Code', 'Maze Runner', 'Storyteller']
  },
  {
    id: 'user_demo_parent',
    username: 'ParentSarah',
    email: 'parent@sparkcode.ai',
    passwordHash: '$2a$10$w09u7RrvqZ23W1bQfWk3fOGx5zNkVW3q1H784q8wW73QzK2kE1i2y',
    role: 'parent',
    avatar: '🦉',
    childrenIds: ['user_demo_kid']
  }
]);

export const projectsDb = new JsonStore('projects.json', [
  {
    id: 'sample_game_1',
    title: 'Space Star Catcher',
    type: 'game',
    authorId: 'user_demo_kid',
    authorName: 'SparkyCoder',
    description: 'Catch the twinkling stars falling from galaxy space before time runs out!',
    isPublic: true,
    thumbnail: '🚀',
    data: {
      blocks: [
        { type: 'event_start', id: 'b1' },
        { type: 'motion_move_steps', id: 'b2', value: 10 },
        { type: 'control_forever', id: 'b3', children: [
          { type: 'motion_bounce_edge', id: 'b4' },
          { type: 'sensing_touching', id: 'b5', target: 'star' }
        ]}
      ],
      sprites: [
        { id: 's1', name: 'Rocket', emoji: '🚀', x: 200, y: 300, size: 50, speed: 6 },
        { id: 's2', name: 'Star', emoji: '⭐', x: 200, y: 50, size: 40, speed: 4 }
      ],
      background: 'galaxy',
      score: 0
    }
  },
  {
    id: 'sample_game_2',
    title: 'Super Maze Runner',
    type: 'game',
    authorId: 'user_demo_kid',
    authorName: 'SparkyCoder',
    description: 'Use arrow keys to escape the colourful maze and reach the treasure chest!',
    isPublic: true,
    thumbnail: '🧀',
    data: {
      sprites: [
        { id: 's1', name: 'Mouse', emoji: '🐭', x: 50, y: 50, size: 45, speed: 5 },
        { id: 's2', name: 'Cheese', emoji: '🧀', x: 420, y: 320, size: 45, speed: 0 }
      ],
      background: 'grid',
      score: 0
    }
  },
  {
    id: 'sample_anim_1',
    title: 'Dancing Dino Birthday Party',
    type: 'animation',
    authorId: 'user_demo_kid',
    authorName: 'SparkyCoder',
    description: 'A happy dinosaur dances under confetti and sings birthday beats!',
    isPublic: true,
    thumbnail: '🦖',
    data: {
      sprites: [
        { id: 's1', name: 'Dino', emoji: '🦖', x: 220, y: 220, size: 60, dialogue: "Let's party and code!" },
        { id: 's2', name: 'Cake', emoji: '🎂', x: 330, y: 240, size: 50 }
      ],
      background: 'party',
      frames: []
    }
  },
  {
    id: 'sample_story_1',
    title: 'The Brave Robot and Magic Tree',
    type: 'story',
    authorId: 'user_demo_kid',
    authorName: 'SparkyCoder',
    description: 'An interactive tale of Robbie the Robot learning to make friendly code.',
    isPublic: true,
    thumbnail: '🤖',
    data: {
      scenes: [
        {
          id: 'scene_1',
          name: 'The Forest Entry',
          background: 'forest',
          character: '🤖',
          dialogue: 'Hello world! I am looking for the Tree of Wisdom.',
          action: 'walk_right'
        },
        {
          id: 'scene_2',
          name: 'At The Magic Tree',
          background: 'fantasy_forest',
          character: '🌳',
          dialogue: 'Welcome Robbie! To pass, teach me a simple code loop!',
          action: 'glow'
        }
      ]
    }
  }
]);

