import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  instagram?: string;
  linkedin?: string;
}

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;
  
  // Modal state for viewing member profile and social links
  selectedMember: TeamMember | null = null;
  showModal = false;

  teamMembers: TeamMember[] = [
    {
      name: 'Hussian Asghar Kazmi',
      role: 'Founder',
      bio: "I'm the founder and driving force behind HeatBeast E-Sports. With a strong vision for building a dynamic and competitive gaming community, I leads the company’s strategy, growth, and overall direction. Passionate about e-sports, content creation, and innovation",
      image: 'Hussian.jpg',
      instagram: 'https://www.instagram.com/ig_vtxraw/#',
      linkedin: 'https://www.linkedin.com/in/husain-asghar-33177a260/'
    },
    {
      name: 'Harsh Kumar',
      role: 'CEO',
      bio: 'As CEO of HeatBeast E-Sports, I drive growth, innovation, and excellence in competitive gaming, content creation, and community building. With a focus on nurturing talent, fostering teamwork, and pushing boundaries',
      image: 'Harsh.jpg',
      instagram: 'https://www.instagram.com/epicharsh07?igsh=MWZiaHdnZ3Jtc3k5Yg==',
      linkedin: 'https://www.linkedin.com/in/harsh-kumar-0859722a8?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
    },
    {
      name: 'Harsh Mehta',
      role: 'Head of Operations',
      bio: 'I’m responsible for ensuring seamless day-to-day operations, fostering team collaboration, and driving organizational efficiency. I also lead all esports initiatives within the app, including tournaments, community engagement, and strategic growth in the esports domain.',
      image: 'HK.png',
      instagram: 'https://instagram.com/harsh',
      linkedin: ''
    },
    {
      name: 'Ananth Gokul Das',
      role: 'Public Relation head & Social Media Manager',
      bio: 'I am the PR and Social Media Manager at HeatBeast E-Sports, where I handle brand communication, public relations, and digital engagement. My role includes managing our social media presence, crafting compelling content, and building meaningful connections with our audience and partners.',
      image: 'ananth.jpg',
      instagram: 'https://www.instagram.com/ananth_gd/',
      linkedin: 'https://www.linkedin.com/in/ananthgokudas/'
    },
    {
      name: 'Vikash Kumar',
      role: 'Lead Developer',
      bio: "As the Head of Product, I'm responsible for the app's overall vision and strategic direction. I own the feature roadmap, translating our goals into tangible updates and new experiences for the HBS esports community. My job is to ensure we are constantly evolving and delivering the best possible platform for our users.",
      image: 'Vikash.jpg',
      instagram: 'https://instagram.com/vikashkumar',
      linkedin: 'https://linkedin.com/in/vikashkumar'
    },
    {
      name: 'Arsh Saharan',
      role: 'Community Manager',
      bio: "I’m passionate about building strong communities, ensuring smooth app performance, and driving collaboration across teams. I believe in continuous learning, thoughtful innovation, and creating meaningful impact through every project I work on.",
      image: 'arsh.png',
      instagram: 'https://www.instagram.com/arsh_saharan?igsh=cjd6dzR3d3R2a2g1',
      linkedin: 'https://www.linkedin.com/in/arsh-saharan-3b2552312/'
    },
    {
      name: 'Anuskha Agarwal',
      role: 'Data Analyst',
      bio: "Hello guys! I'm Anushka — team's Data Analyst, which is a bit like being a treasure hunter. I sift through mountains of data—think K/D ratios, popular drop zones, and item crafting trends—to find the hidden patterns. My goal? To help the dev team use that treasure to forge even more epic experiences, balance the meta, and crush bugs.",
      image: 'anu.jpg',
      instagram: 'https://www.instagram.com/anushka.ag16?igsh=emozeDZ4dWl3bjYz',
      linkedin: 'https://www.linkedin.com/in/anushkaagarwal161'
    },
    {
      name: 'Raghav Agarwal',
      role: 'Gaming Arenas & StudioLead',
      bio: 'As the Gaming Arenas Lead, I’m responsible for discovering local gaming arenas and collaborating with them to host exciting tournaments. My role focuses on building strong connections within the gaming community and creating engaging, on-ground experiences for players. I strive to make every event memorable while strengthening the bridge between gamers and local venues.',
      image: 'Raghav.jpg',
      instagram: 'https://www.instagram.com/raghav.404notfound/',
      linkedin: 'https://www.linkedin.com/in/raghav-agarwal-7019a5290/'
    },
    {
      name: 'Aditya Nair',
      role: 'Product Manager',
      bio: 'Driving product innovation. Building features that gamers love and competitors envy.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya',
      instagram: 'https://instagram.com/adityanair',
      linkedin: 'https://linkedin.com/in/adityanair'
    },
    {
      name: 'Meera Joshi',
      role: 'UX/UI Designer',
      bio: 'Crafting beautiful gaming experiences. Award-winning designer with focus on player engagement.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera',
      instagram: 'https://instagram.com/meerajoshi',
      linkedin: 'https://linkedin.com/in/meerajoshi'
    },
    {
      name: 'Rahul Desai',
      role: 'Partnership Manager',
      bio: 'Building strategic partnerships with game publishers, sponsors, and esports organizations globally.',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
      instagram: 'https://instagram.com/rahuldesai',
      linkedin: 'https://linkedin.com/in/rahuldesai'
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

  // Open profile modal
  openModal(member: TeamMember) {
    this.selectedMember = member;
    this.showModal = true;
    // Prevent background scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  // Close profile modal
  closeModal() {
    this.showModal = false;
    this.selectedMember = null;
    document.body.style.overflow = '';
  }

  // Open external social profile safely
  openSocialLink(url: string) {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
