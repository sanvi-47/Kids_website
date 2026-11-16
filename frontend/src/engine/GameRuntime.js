import { sounds } from '../games/SoundManager';
import confetti from 'canvas-confetti';

export class GameRuntime {
  constructor(canvas, state, onUpdate) {
    this.canvas = canvas;
    this.ctx = canvas?.getContext('2d');
    this.state = state; // sprites, background, score, lives, variables, etc.
    this.onUpdate = onUpdate;
    this.isRunning = false;
    this.animId = null;
    this.keys = {};
    this.particles = [];
    this.projectiles = [];
    this.obstacles = [];
    this.groundY = 380;
    this.lastTick = 0;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.loop = this.loop.bind(this);
  }

  start() {
    this.isRunning = true;
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);

    // Trigger starter blocks (when_flag_clicked) on all sprites
    this.state.sprites.forEach((sp) => {
      this.executeStarterBlocks(sp, 'when_flag_clicked');
    });

    this.animId = requestAnimationFrame(this.loop);
  }

  stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown(e) {
    const key = e.key;
    this.keys[key] = true;
    this.keys[key.toLowerCase()] = true;

    // Check all sprites for "when_key_pressed"
    this.state.sprites.forEach((sp) => {
      if (!sp.blocks) return;
      for (let i = 0; i < sp.blocks.length; i++) {
        const blk = sp.blocks[i];
        if (blk.type === 'when_key_pressed') {
          const targetKey = blk.keyChoice || 'Space';
          if (
            targetKey === key ||
            targetKey.toLowerCase() === key.toLowerCase() ||
            (targetKey === 'Space' && key === ' ')
          ) {
            // Execute attached code pipeline right below this starter
            this.runBlockPipeline(sp, sp.blocks.slice(i + 1));
          }
        }
      }
    });

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(key)) {
      e.preventDefault();
    }
  }

  handleKeyUp(e) {
    this.keys[e.key] = false;
    this.keys[e.key.toLowerCase()] = false;
  }

  handleSpriteClick(sp) {
    if (!this.isRunning) return;
    this.executeStarterBlocks(sp, 'when_sprite_clicked');
  }

  executeStarterBlocks(sp, triggerType) {
    if (!sp.blocks) return;
    for (let i = 0; i < sp.blocks.length; i++) {
      if (sp.blocks[i].type === triggerType) {
        this.runBlockPipeline(sp, sp.blocks.slice(i + 1));
      }
    }
  }

  runBlockPipeline(sp, blocks) {
    for (const blk of blocks) {
      if (blk.type.startsWith('when_')) break; // Next stack started

      switch (blk.type) {
        case 'move_steps': {
          const step = Number(blk.val) || 10;
          const rad = ((sp.direction || 0) * Math.PI) / 180;
          sp.x += Math.cos(rad) * step;
          sp.y += Math.sin(rad) * step;
          break;
        }
        case 'turn_right': {
          sp.direction = ((sp.direction || 0) + (Number(blk.val) || 15)) % 360;
          break;
        }
        case 'turn_left': {
          sp.direction = ((sp.direction || 0) - (Number(blk.val) || 15) + 360) % 360;
          break;
        }
        case 'change_x': {
          sp.x += Number(blk.val) || 10;
          break;
        }
        case 'change_y': {
          sp.y += Number(blk.val) || -10;
          break;
        }
        case 'jump': {
          sp.vy = Number(blk.val) || -12;
          sp.isGrounded = false;
          sounds.laser();
          break;
        }
        case 'goto_random': {
          sp.x = Math.floor(Math.random() * 480) + 40;
          sp.y = Math.floor(Math.random() * 320) + 40;
          break;
        }
        case 'bounce_edge': {
          if (sp.x <= 20 || sp.x >= 540) {
            sp.direction = (180 - (sp.direction || 0) + 360) % 360;
          }
          if (sp.y <= 20 || sp.y >= 400) {
            sp.direction = (360 - (sp.direction || 0)) % 360;
          }
          break;
        }
        case 'say_text': {
          sp.dialogue = blk.text || 'Hello!';
          setTimeout(() => {
            sp.dialogue = null;
          }, 2000);
          break;
        }
        case 'next_costume': {
          if (sp.costumes && sp.costumes.length > 1) {
            sp.currentCostume = ((sp.currentCostume || 0) + 1) % sp.costumes.length;
            sp.emoji = sp.costumes[sp.currentCostume];
          }
          break;
        }
        case 'change_size': {
          sp.size = Math.max(20, Math.min(120, (sp.size || 50) + (Number(blk.val) || 10)));
          break;
        }
        case 'show': {
          sp.visible = true;
          break;
        }
        case 'hide': {
          sp.visible = false;
          break;
        }
        case 'play_laser': {
          sounds.laser();
          // Spawn shooting projectile from sprite
          this.projectiles.push({
            x: sp.x,
            y: sp.y - 15,
            vy: -10,
            color: '#38bdf8'
          });
          break;
        }
        case 'play_powerup': {
          sounds.powerup();
          confetti({ particleCount: 20, spread: 45, origin: { y: 0.6 } });
          break;
        }
        case 'play_hit': {
          sounds.hit();
          break;
        }
        case 'play_explosion': {
          sounds.explosion();
          break;
        }
        case 'change_score': {
          this.state.score = (this.state.score || 0) + (Number(blk.val) || 1);
          if (this.onUpdate) this.onUpdate('score', this.state.score);
          break;
        }
        case 'change_lives': {
          this.state.lives = Math.max(0, (this.state.lives || 3) + (Number(blk.val) || -1));
          if (this.onUpdate) this.onUpdate('lives', this.state.lives);
          break;
        }
        case 'set_score': {
          this.state.score = Number(blk.val) || 0;
          if (this.onUpdate) this.onUpdate('score', this.state.score);
          break;
        }
        default:
          break;
      }
    }
  }

  loop(timestamp) {
    if (!this.isRunning) return;

    // Sprite Gravity & Continuous Tick execution (Forever loops)
    this.state.sprites.forEach((sp) => {
      // Check gravity if jumping
      if (sp.vy !== undefined && sp.vy !== 0) {
        sp.y += sp.vy;
        sp.vy += 0.8; // gravity
        if (sp.y >= 350) {
          sp.y = 350;
          sp.vy = 0;
          sp.isGrounded = true;
        }
      }

      // Check Forever loop blocks
      if (sp.blocks) {
        const hasForever = sp.blocks.some((b) => b.type === 'forever');
        if (hasForever) {
          const moveBlock = sp.blocks.find((b) => b.type === 'move_steps');
          if (moveBlock) {
            const step = (Number(moveBlock.val) || 8) * 0.4;
            const rad = ((sp.direction || 0) * Math.PI) / 180;
            sp.x += Math.cos(rad) * step;
            sp.y += Math.sin(rad) * step;
          }

          const changeYBlock = sp.blocks.find((b) => b.type === 'change_y');
          if (changeYBlock) {
            sp.y += (Number(changeYBlock.val) || 4) * 0.5;
            if (sp.y > 440) sp.y = 20;
          }

          const bounceBlock = sp.blocks.find((b) => b.type === 'bounce_edge');
          if (bounceBlock) {
            if (sp.x <= 20) {
              sp.x = 20;
              sp.direction = 0;
            } else if (sp.x >= 540) {
              sp.x = 540;
              sp.direction = 180;
            }
          }
        }
      }
    });

    // Update Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.y += p.vy;

      // Check collision with other sprites
      this.state.sprites.forEach((sp) => {
        if (sp.id !== 'sp_player' && sp.visible) {
          if (Math.abs(p.x - sp.x) < 25 && Math.abs(p.y - sp.y) < 25) {
            sounds.explosion();
            this.state.score = (this.state.score || 0) + 10;
            if (this.onUpdate) this.onUpdate('score', this.state.score);
            sp.y = 30;
            sp.x = Math.floor(Math.random() * 450) + 40;

            // Particles
            for (let k = 0; k < 6; k++) {
              this.particles.push({
                x: sp.x,
                y: sp.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 16,
                color: '#ec4899'
              });
            }
          }
        }
      });

      if (p.y < -20) this.projectiles.splice(i, 1);
    }

    // Render Stage
    this.render();

    this.animId = requestAnimationFrame(this.loop);
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // Draw Projectiles
    this.projectiles.forEach((pr) => {
      ctx.fillStyle = pr.color;
      ctx.shadowColor = pr.color;
      ctx.shadowBlur = 10;
      ctx.fillRect(pr.x - 3, pr.y - 10, 6, 14);
      ctx.shadowBlur = 0;
    });

    // Draw Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 4, 4);
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    // Draw Sprites
    this.state.sprites.forEach((sp) => {
      if (!sp.visible) return;

      ctx.save();
      ctx.translate(sp.x, sp.y);
      if (sp.direction) ctx.rotate(((sp.direction || 0) * Math.PI) / 180);

      // Emoji or Image Avatar
      ctx.font = `${sp.size || 50}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sp.emoji || '🦊', 0, 0);

      // Speech bubble if any
      if (sp.dialogue) {
        ctx.restore();
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(sp.x - 60, sp.y - 55, 120, 28, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px Nunito, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sp.dialogue, sp.x, sp.y - 41);
      }

      ctx.restore();
    });
  }
}

