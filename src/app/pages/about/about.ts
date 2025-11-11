import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  teamMembers: TeamMember[] = [
    {
      name: 'Hussian',
      role: 'Founder & CEO',
      bio: "I'm the founder and driving force behind HeatBeast E-Sports. With a strong vision for building a dynamic and competitive gaming community, I leads the company’s strategy, growth, and overall direction. Passionate about e-sports, content creation, and innovation",
      image: 'Hussian.jpg'
    },
    {
      name: 'Harsh',
      role: 'Head of Operations',
      bio: 'I’m responsible for ensuring seamless day-to-day operations, fostering team collaboration, and driving organizational efficiency. I also lead all esports initiatives within the app, including tournaments, community engagement, and strategic growth in the esports domain.',
      image: 'HK.png'
    },
    {
      name: 'Vikash Kumar',
      role: 'Lead Developer',
      bio: "As the Head of Product, I'm responsible for the app's overall vision and strategic direction. I own the feature roadmap, translating our goals into tangible updates and new experiences for the HBS esports community. My job is to ensure we are constantly evolving and delivering the best possible platform for our users.",
      image: 'Vikash.jpg'
    },
    {
      name: 'Arsh Saharan',
      role: 'Community Manager',
      bio: "I’m passionate about building strong communities, ensuring smooth app performance, and driving collaboration across teams. I believe in continuous learning, thoughtful innovation, and creating meaningful impact through every project I work on.",
      image: 'arsh.png'
    },
    {
      name: 'Ananth',
      role: 'Social Media Manager',
      bio: 'I am the PR and Social Media Manager at HeatBeast E-Sports, where I handle brand communication, public relations, and digital engagement. My role includes managing our social media presence, crafting compelling content, and building meaningful connections with our audience and partners.',
      image: 'Ananth.jpg'
    },
    {
      name: 'Ananya Gupta',
      role: 'Marketing Head',
      bio: 'Digital marketing expert growing esports brands. 5 years experience in gaming industry.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya'
    },
    {
      name: 'Vikram Malhotra',
      role: 'Technical Director',
      bio: 'Infrastructure architect ensuring 99.9% uptime. Scaling systems for millions of concurrent users.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram'
    },
    {
      name: 'Ishita Kapoor',
      role: 'Content Creator Lead',
      bio: 'Creating viral esports content. Managing streaming partnerships and influencer collaborations.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ishita'
    },
    {
      name: 'Aditya Nair',
      role: 'Product Manager',
      bio: 'Driving product innovation. Building features that gamers love and competitors envy.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya'
    },
    {
      name: 'Meera Joshi',
      role: 'UX/UI Designer',
      bio: 'Crafting beautiful gaming experiences. Award-winning designer with focus on player engagement.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera'
    },
    {
      name: 'Rahul Desai',
      role: 'Partnership Manager',
      bio: 'Building strategic partnerships with game publishers, sponsors, and esports organizations globally.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul'
    }
  ];

  private scrollListener: (() => void) | null = null;
  private ticking = false;
  private lastScrollTime = 0;
  private scrollThrottle = 16; // ~60fps

  ngOnInit() {}

  ngAfterViewInit() {
    this.initScrollEffects();
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  private initScrollEffects() {
    this.scrollListener = () => {
      const now = Date.now();
      
      // Throttle scroll events
      if (now - this.lastScrollTime < this.scrollThrottle) {
        return;
      }
      
      this.lastScrollTime = now;

      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.updateScrollEffects();
          this.ticking = false;
        });
        this.ticking = true;
      }
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
    this.updateScrollEffects(); // Initial call
  }

  private updateScrollEffects() {
    const cards = document.querySelectorAll('.team-card');
    const aboutSection = document.querySelector('.about-intro');
    const windowHeight = window.innerHeight;

    // Animate team cards with 3D transforms
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      
      // Calculate center position
      const cardCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      
      // Distance from viewport center (-1 to 1)
      const distanceFromCenter = (viewportCenter - cardCenter) / windowHeight;
      
      // Clamp values to prevent extreme transforms
      const clampedDistance = Math.max(-1.5, Math.min(1.5, distanceFromCenter));

      // Calculate 3D transforms based on scroll position
      const rotateX = clampedDistance * 25;
      const rotateY = clampedDistance * 12;
      const translateZ = Math.abs(clampedDistance) * -120;
      const scale = 1 - Math.abs(clampedDistance) * 0.2;
      const opacity = 1 - Math.abs(clampedDistance) * 0.6;

      // Apply transforms
      const finalScale = Math.max(scale, 0.8);
      const finalOpacity = Math.max(opacity, 0.3);

      (card as HTMLElement).style.transform = `
        perspective(1200px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateZ(${translateZ}px)
        scale(${finalScale})
      `;
      (card as HTMLElement).style.opacity = `${finalOpacity}`;
    });

    // Animate about section
    if (aboutSection) {
      const rect = aboutSection.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const distanceFromCenter = (viewportCenter - sectionCenter) / windowHeight;
      const clampedDistance = Math.max(-1.5, Math.min(1.5, distanceFromCenter));

      const rotateX = clampedDistance * 18;
      const translateZ = Math.abs(clampedDistance) * -100;
      const opacity = 1 - Math.abs(clampedDistance) * 0.4;

      (aboutSection as HTMLElement).style.transform = `
        perspective(1200px)
        rotateX(${rotateX}deg)
        translateZ(${translateZ}px)
      `;
      (aboutSection as HTMLElement).style.opacity = `${Math.max(opacity, 0.4)}`;
    }
  }
}
