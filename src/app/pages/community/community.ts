import { Component, AfterViewInit, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-community',
  templateUrl: './community.html',
  styleUrls: ['./community.css']
})
export class Community implements AfterViewInit {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private particles: { x: number; y: number; vx: number; vy: number }[] = [];
  private mouse = { x: 0, y: 0 };
  private particleCount = 100; // number of dots

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.canvas = this.el.nativeElement.querySelector('#bg-canvas');
    if (!this.canvas) { console.warn('bg-canvas not found'); return; }
    const ctx = this.canvas.getContext('2d');
    if (!ctx) { console.warn('2D context not available'); return; }
    this.ctx = ctx;
    this.resizeCanvas();
    this.initParticles();
    requestAnimationFrame(() => this.animate());
  }

  @HostListener('window:resize')
  resizeCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }

  private initParticles(): void {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }
  }

  private animate(): void {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    // ---- draw particles (brighter dots w/ glow) ----
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      // bounce at edges
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(0, 255, 136, 0.7)'; // brighter dot
      this.ctx.shadowBlur = 6;
      this.ctx.shadowColor = '#00ff88';
      this.ctx.fill();

      // reset glow BEFORE drawing any lines
      this.ctx.shadowBlur = 0;
      this.ctx.shadowColor = 'transparent';
    }

    // ---- connection settings (tuned for visibility) ----
    const LINE_MAX_DIST = 120;   // between dots
    const MOUSE_MAX_DIST = 180;  // to mouse

    // ---- draw connections ----
    for (const a of this.particles) {
      for (const b of this.particles) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);

        if (dist < LINE_MAX_DIST) {
          const alpha = (1 - dist / LINE_MAX_DIST) * 0.28; // stronger
          this.ctx.strokeStyle = `rgba(0, 255, 136, ${alpha})`;
          this.ctx.lineWidth = 0.6;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.stroke();
        }
      }

      // connect to mouse if close
      const mdx = a.x - this.mouse.x;
      const mdy = a.y - this.mouse.y;
      const distToMouse = Math.hypot(mdx, mdy);

      if (distToMouse < MOUSE_MAX_DIST) {
        const alpha = (1 - distToMouse / MOUSE_MAX_DIST) * 0.65;
        this.ctx.strokeStyle = `rgba(0, 255, 136, ${alpha})`;
        this.ctx.lineWidth = 1.1;
        this.ctx.beginPath();
        this.ctx.moveTo(a.x, a.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.stroke();
      }
    }

    requestAnimationFrame(() => this.animate());
  }

  // ----------------------------
  // Community content data
  // ----------------------------

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
      content:
        "I've been struggling with my aim in Valorant ranked matches. I'm currently using 800 DPI with 0.35 in-game sensitivity...",
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
      content:
        "I’m planning to build a gaming PC with a budget of ₹1 Lakh. I want to play AAA titles at 1080p with high settings...",
      tags: ['PC Gaming', 'Hardware', 'Budget Build'],
      likes: 512,
      comments: 67,
      views: 34829,
      replies: 42
    }
  ];

  topQuesters = [
    { name: 'Rahul Sharma', title: 'Best of 2024', score: '+245' },
    { name: 'Priya Mehta', title: 'Elite Quester', score: '+189' },
    { name: 'Arjun Reddy', title: 'Top Contributor', score: '+162' },
    { name: 'Nikita Jain', title: 'Rising Star', score: '+156' },
    { name: 'Aditya Roy', title: 'Pro Player', score: '-42' }
  ];

  // ----------------------------
  // Filters (icons + logic)
  // ----------------------------
  filters = [
    { key: 'trending',   label: 'Trending',       icon: 'M3 12h4l3 8 4-16 3 8h4' },
    { key: 'new',        label: 'New Releases',   icon: 'M12 3v18M5 10l7-7 7 7' },
    { key: 'discussed',  label: 'Most Discussed', icon: 'M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4' },
    { key: 'upvoted',    label: 'Most Upvoted',   icon: 'M12 4l6 8h-4v8h-4v-8H6z' },
    { key: 'viewed',     label: 'Most Viewed',    icon: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6' },
    { key: 'unanswered', label: 'Unanswered',     icon: 'M6 8h12M6 12h7M4 20l3-3h11a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14z' }
  ] as const;

  activeFilter: 'trending' | 'new' | 'discussed' | 'upvoted' | 'viewed' | 'unanswered' = 'trending';

  setFilter(key: 'trending' | 'new' | 'discussed' | 'upvoted' | 'viewed' | 'unanswered'): void {
    this.activeFilter = key;
  }

  get filteredPosts() {
    const copy = [...this.posts];
    switch (this.activeFilter) {
      case 'new':
        // if you add real timestamps later, sort by date here
        return copy;
      case 'discussed':
        return copy.sort((a, b) => b.comments - a.comments);
      case 'upvoted':
        return copy.sort((a, b) => b.likes - a.likes);
      case 'viewed':
        return copy.sort((a, b) => b.views - a.views);
      case 'unanswered':
        return copy.filter(p => (p.replies ?? 0) === 0);
      case 'trending':
      default:
        return copy.sort((a, b) =>
          (b.likes * 2 + b.comments * 3 + b.views * 0.1) -
          (a.likes * 2 + a.comments * 3 + a.views * 0.1)
        );
    }
  }
}
