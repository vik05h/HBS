import { Component, signal, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink,RouterLinkActive } from '@angular/router';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink,RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {
  protected readonly title = signal('HBS');

  @ViewChild('cursorGlow') cursorGlow!: ElementRef<HTMLDivElement>;
  @ViewChild('particlesCanvas') particlesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('navbar') navbar!: ElementRef<HTMLElement>;

  private particles: Particle[] = [];
  private animationFrameId: number | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private lastScrollY = 0;

  ngAfterViewInit() {
    this.initCursorEffect();
    this.initParticles();
    this.initScrollEffect();
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
  }

  private initCursorEffect() {
    this.handleMouseMove = this.handleMouseMove.bind(this);
    window.addEventListener('mousemove', this.handleMouseMove);
  }

  private initScrollEffect() {
    this.handleScroll = this.handleScroll.bind(this);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  private handleScroll = () => {
    const currentScrollY = window.scrollY;
    const navbarEl = this.navbar.nativeElement;

    if (currentScrollY > 50) {
      navbarEl.classList.add('scrolled');
    } else {
      navbarEl.classList.remove('scrolled');
    }

    // Add hide/show on scroll direction
    if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
      // Scrolling down
      navbarEl.classList.add('hidden');
    } else {
      // Scrolling up
      navbarEl.classList.remove('hidden');
    }

    this.lastScrollY = currentScrollY;
  };

  private handleMouseMove = (e: MouseEvent) => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    if (this.cursorGlow) {
      const glowElement = this.cursorGlow.nativeElement;
      glowElement.style.left = `${e.clientX}px`;
      glowElement.style.top = `${e.clientY}px`;
    }
  };

  private initParticles() {
    const canvas = this.particlesCanvas.nativeElement;
    this.ctx = canvas.getContext('2d');

    if (!this.ctx) return;

    this.handleResize = this.handleResize.bind(this);
    this.handleResize();
    window.addEventListener('resize', this.handleResize);

    // Create particles
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    this.animate();
  }

  private handleResize = () => {
    const canvas = this.particlesCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  private animate = () => {
    if (!this.ctx) return;

    const canvas = this.particlesCanvas.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    this.particles.forEach(particle => {
      // Move particle
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around screen
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Draw particle
      if (this.ctx) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(0, 255, 65, ${particle.opacity})`;
        this.ctx.fill();

        // Draw connection to mouse if close
        const dx = this.mouseX - particle.x;
        const dy = this.mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150 && distance > 0) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(this.mouseX, this.mouseY);
          this.ctx.strokeStyle = `rgba(0, 255, 65, ${(1 - distance / 150) * 0.2})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    });

    // Draw connections between nearby particles
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Only draw lines if particles are close AND not wrapping around edges
        const notWrapping = Math.abs(dx) < canvas.width / 2 && Math.abs(dy) < canvas.height / 2;

        if (distance < 100 && notWrapping) {
          if (this.ctx) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
            this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
            this.ctx.strokeStyle = `rgba(0, 255, 65, ${(1 - distance / 100) * 0.15})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
          }
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };
}
