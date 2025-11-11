import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StreamData {
  id: number;
  streamer: string;
  game: string;
  title: string;
  viewers: number;
  thumbnail: string;
  avatar: string;
  isLive: boolean;
  category: string;
}

@Component({
  selector: 'app-live-stream',
  imports: [CommonModule],
  templateUrl: './live-stream.html',
  styleUrl: './live-stream.css',
})
export class LiveStream implements OnInit {
  featuredStream: StreamData = {
    id: 1,
    streamer: 'ProGamer_Arjun',
    game: 'CS:GO',
    title: 'FINALS - HeatBeasts Championship | Road to Global Elite',
    viewers: 15432,
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProArjun',
    isLive: true,
    category: 'Esports'
  };

  liveStreams: StreamData[] = [
    {
      id: 2,
      streamer: 'QueenSniper',
      game: 'Valorant',
      title: 'Radiant Ranked Grind | Pro Tips & Tricks',
      viewers: 8234,
      thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Queen',
      isLive: true,
      category: 'FPS'
    },
    {
      id: 3,
      streamer: 'TechMaster_Rohan',
      game: 'League of Legends',
      title: 'Challenger Series | Master Yi Jungle Masterclass',
      viewers: 6543,
      thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=225&fit=crop',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech',
      isLive: true,
      category: 'MOBA'
    },
    {
      id: 4,
      streamer: 'SpeedRun_Karan',
      game: 'Apex Legends',
      title: 'Predator Ranked | 30+ Kills Challenge',
      viewers: 5421,
      thumbnail: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=225&fit=crop',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Speed',
      isLive: true,
      category: 'Battle Royale'
    },
    {
      id: 5,
      streamer: 'StealthNinja_Priya',
      game: 'CS:GO',
      title: 'Faceit Level 10 Grind | AWP Only',
      viewers: 4123,
      thumbnail: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&h=225&fit=crop',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stealth',
      isLive: true,
      category: 'Esports'
    },
    {
      id: 6,
      streamer: 'BuildMaster_Aditya',
      game: 'Fortnite',
      title: 'Arena Mode | Building & Editing Practice',
      viewers: 3876,
      thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=225&fit=crop',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Build',
      isLive: true,
      category: 'Battle Royale'
    },
    {
      id: 7,
      streamer: 'TacticalGenius',
      game: 'Rainbow Six Siege',
      title: 'Diamond Ranked Push | Strat Caller',
      viewers: 3245,
      thumbnail: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=400&h=225&fit=crop',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tactical',
      isLive: true,
      category: 'FPS'
    },
    {
      id: 8,
      streamer: 'MobileKing_Vikram',
      game: 'BGMI',
      title: 'Conqueror Tier | Squad Gameplay',
      viewers: 2987,
      thumbnail: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=400&h=225&fit=crop',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mobile',
      isLive: true,
      category: 'Mobile'
    },
    {
      id: 9,
      streamer: 'ClutchQueen_Ananya',
      game: 'Valorant',
      title: 'Immortal Ranked | Agent Tutorial',
      viewers: 2654,
      thumbnail: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&h=225&fit=crop',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Clutch',
      isLive: true,
      category: 'FPS'
    }
  ];

  categories = ['All', 'Esports', 'FPS', 'MOBA', 'Battle Royale', 'Mobile'];
  selectedCategory = 'All';

  ngOnInit() {}

  filterByCategory(category: string) {
    this.selectedCategory = category;
  }

  getFilteredStreams() {
    if (this.selectedCategory === 'All') {
      return this.liveStreams;
    }
    return this.liveStreams.filter(stream => stream.category === this.selectedCategory);
  }

  formatViewers(viewers: number): string {
    if (viewers >= 1000) {
      return (viewers / 1000).toFixed(1) + 'K';
    }
    return viewers.toString();
  }
}
