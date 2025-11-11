import { Component, AfterViewInit, HostListener, ElementRef } from '@angular/core';

type FilterKey = 'trending' | 'new' | 'discussed' | 'upvoted' | 'viewed' | 'unanswered';

@Component({
  selector: 'app-community',
  templateUrl: './community.html',
  styleUrls: ['./community.css']
})
export class Community implements AfterViewInit {
  // ---- canvas particles (mouse-only links) ----
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private particles: { x: number; y: number; vx: number; vy: number; a: number }[] = [];
  private mouse = { x: -9999, y: -9999, active: false };

  // Tunables
  private readonly DENSITY = 0.00008;   // dots per pixel
  private readonly SPEED = 0.9;          // random drift
  private readonly DAMPING = 0.996;      // velocity damping
  private readonly DOT_RADIUS = 2.0;
  private readonly BASE_ALPHA = 0.22;
  private readonly DOT_RGB = '255,255,255'; // white dots/lines


  // Mouse interaction (only mouse links)
  private readonly MOUSE_RADIUS = 180;
  private readonly MAX_MOUSE_LINKS = 35; // how many lines from cursor
  private readonly MOUSE_PUSH = 0;       // no push/pull force
  // Gold color helpers
// White color helpers
private WHITE = (a: number) => `rgba(255, 255, 255, ${a})`;
private WHITE_SOFT = (a: number) => `rgba(255, 255, 255, ${a})`;



  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.canvas = this.el.nativeElement.querySelector('#bg-canvas');
    if (!this.canvas) return;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;
    this.resizeCanvas();
    requestAnimationFrame(() => this.animate());
  }

  @HostListener('window:resize')
  resizeCanvas(): void {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.initParticles();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(ev: MouseEvent): void {
    this.mouse.x = ev.clientX;
    this.mouse.y = ev.clientY;
    this.mouse.active = true;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.mouse.active = false;
    this.mouse.x = -9999;
    this.mouse.y = -9999;
  }

  private initParticles(): void {
    const count = Math.floor(window.innerWidth * window.innerHeight * this.DENSITY);
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * this.SPEED,
        vy: (Math.random() - 0.5) * this.SPEED,
        a: this.BASE_ALPHA * (0.65 + Math.random() * 0.7),
      });
    }
  }

  private animate(): void {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    // background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    ctx.shadowBlur = 0;
ctx.shadowColor = '#fff';


    // soft mouse halo
    if (this.mouse.active) {
      const halo = ctx.createRadialGradient(
        this.mouse.x, this.mouse.y, 0,
        this.mouse.x, this.mouse.y, this.MOUSE_RADIUS
      );
halo.addColorStop(0.0, 'rgba(255,255,255,0.10)');
halo.addColorStop(0.35, 'rgba(255,255,255,0.05)');
halo.addColorStop(1.0, 'rgba(255,255,255,0)');



      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(this.mouse.x, this.mouse.y, this.MOUSE_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    // update & draw dots
    for (const p of this.particles) {
      p.vx *= this.DAMPING;
      p.vy *= this.DAMPING;
      p.x += p.vx;
      p.y += p.vy;

      // wrap edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // fade brightness near mouse (subtle)
      let alpha = p.a;
      if (this.mouse.active) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < this.MOUSE_RADIUS)
          alpha = p.a + (1 - d / this.MOUSE_RADIUS) * 0.12;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, this.DOT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = this.WHITE(alpha);


      ctx.fill();
    }

    // connect nearby dots to mouse only
    if (this.mouse.active) {
      const near: { d: number; x: number; y: number }[] = [];
      for (const p of this.particles) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < this.MOUSE_RADIUS) near.push({ d, x: p.x, y: p.y });
      }
      near.sort((a, b) => a.d - b.d);
      const cap = Math.min(this.MAX_MOUSE_LINKS, near.length);

      for (let i = 0; i < cap; i++) {
        const n = near[i];
        const t = 1 - n.d / this.MOUSE_RADIUS;
        const alpha = 0.16 * t;
        if (alpha <= 0.01) continue;
       ctx.strokeStyle = this.WHITE(alpha);

ctx.lineWidth = 0.9;

        ctx.beginPath();
        ctx.moveTo(this.mouse.x, this.mouse.y);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();
      }
    }

    requestAnimationFrame(() => this.animate());
  }

  // ---- data (unchanged) ----
  stats = [
    { value: '50K+', label: 'Active Members' },
    { value: '12K+', label: 'Questions' },
    { value: '98%', label: 'Response Rate' }
  ];

  posts = [
    {
      user: 'GamerX',
      time: '2 hours ago',
      title: 'What are the best sensitivity settings for Valorant competitive play?',
      content: "I've been struggling with my aim in Valorant ranked matches. I'm currently using 800 DPI with 0.35 in-game sensitivity...",
      tags: ['FPS', 'Esports', 'PC Gaming'],
      likes: 245,
      comments: 34,
      views: 12453,
      replies: 18
    },
    {
      user: 'ProPlayer',
      time: '5 hours ago',
      title: 'How to build the perfect gaming PC under ₹1 Lakh in 2025?',
      content: "I’m planning to build a gaming PC with a budget of ₹1 Lakh. I want to play AAA titles at 1080p with high settings...",
      tags: ['PC Gaming', 'Hardware', 'Budget Build'],
      likes: 512,
      comments: 67,
      views: 34829,
      replies: 42
    },
    {
      user: 'PixelWarrior',
      time: '1 hour ago',
      title: 'Which upcoming games are worth pre-ordering this winter?',
      content: "I’ve seen so many AAA releases get delayed. Are there any titles that actually seem worth pre-ordering this year?",
      tags: ['Gaming', 'Discussion', 'Pre-Order'],
      likes: 378,
      comments: 52,
      views: 18200,
      replies: 25
    },
    {
      user: 'TechTitan',
      time: '3 hours ago',
      title: 'Best 240 Hz monitors for esports under ₹25,000?',
      content: "I’m upgrading from a 144 Hz monitor and looking for solid response times and minimal input lag. Any recommendations?",
      tags: ['Hardware', 'Monitors', 'Esports'],
      likes: 294,
      comments: 41,
      views: 15467,
      replies: 20
    },
    {
      user: 'GameDevJay',
      time: 'Just now',
      title: 'Unity vs Unreal Engine — which is better for indie FPS projects?',
      content: "I’m a solo dev planning to release a fast-paced shooter. Which engine has better performance and easier multiplayer setup?",
      tags: ['GameDev', 'Engines', 'Indie'],
      likes: 121,
      comments: 26,
      views: 8562,
      replies: 14
    }
  ];

  // ---- avatar helpers ----
  // For <img [src]="getAvatarUrl(post.user)">
getAvatarUrl(name: string): string {
  const initials = name.split(' ').map(n => n[0]).join('');
  return `https://api.dicebear.com/7.x/initials/svg?seed=${initials}&backgroundColor=1c1f1c&textColor=ffd700`;
}

  getAvatarAlt(name: string): string {
    return `${name}'s avatar`;
  }

  // For <div class="post-avatar" [ngStyle]="avatarStyle(post.user)">
  avatarStyle(name: string) {
    const initials = name.split(' ').map(n => n[0]).join('');
  const bg = `https://api.dicebear.com/7.x/initials/svg?seed=${initials}&backgroundColor=1c1f1c&textColor=ffd700`;
return {
  backgroundImage: `url('${bg}')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '50%',
  border: '1.5px solid rgba(255,215,0,0.4)',
  boxShadow: '0 0 8px rgba(255,215,0,0.3)'
} as const;

  }

  topQuesters = [
    { name: 'Rahul Sharma', title: 'Best of 2024',    score: '+245', initials: 'RS', online: true  },
    { name: 'Priya Mehta',  title: 'Elite Quester',   score: '+189', initials: 'PM', online: true  },
    { name: 'Arjun Reddy',  title: 'Top Contributor', score: '+162', initials: 'AR', online: false },
    { name: 'Nikita Jain',  title: 'Rising Star',     score: '+156', initials: 'NJ', online: false },
    { name: 'Aditya Roy',   title: 'Pro Player',      score: '-42',  initials: 'AR', online: false }
  ];

  // ---- filters ----
  activeFilter: FilterKey = 'trending';

  setFilter(key: FilterKey): void {
    this.activeFilter = key;
  }

initial(name: string): string {
  const ch = (name || '').trim().charAt(0);
  return ch ? ch.toUpperCase() : '?';
}

  get filteredPosts() {
    const copy = [...this.posts];
    switch (this.activeFilter) {
      case 'new':        return copy;
      case 'discussed':  return copy.sort((a, b) => b.comments - a.comments);
      case 'upvoted':    return copy.sort((a, b) => b.likes - a.likes);
      case 'viewed':     return copy.sort((a, b) => b.views - a.views);
      case 'unanswered': return copy.filter(p => (p.replies ?? 0) === 0);
      case 'trending':
      default:
        return copy.sort((a, b) =>
          (b.likes * 2 + b.comments * 3 + b.views * 0.1) -
          (a.likes * 2 + a.comments * 3 + a.views * 0.1)
        );
    }
  }

  isPos(score?: string): boolean {
    return (score ?? '').trim().startsWith('+');
  }
}
