import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

export interface EventData {
  id: number;
  title: string;
  game: string;
  date: string;
  time: string;
  location: string;
  type: 'online' | 'offline' | 'hybrid';
  status: 'upcoming' | 'live' | 'past';
  prizePool: string;
  teams: number;
  registrationDeadline: string;
  description: string;
  banner: string;
  participants: number;
  maxParticipants: number;
  organizer: string;
}

@Component({
  selector: 'app-event',
  imports: [CommonModule, RouterLink],
  templateUrl: './event.html',
  styleUrl: './event.css',
})
export class Event implements OnInit {
  upcomingEvents: EventData[] = [
    {
      id: 1,
      title: 'HeatBeasts Championship Finals',
      game: 'CS:GO',
      date: '2025-11-20',
      time: '18:00 IST',
      location: 'Mumbai, India',
      type: 'offline',
      status: 'upcoming',
      prizePool: '₹10,00,000',
      teams: 16,
      registrationDeadline: '2025-11-15',
      description: 'The ultimate CS:GO championship featuring top teams from across India',
      banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
      participants: 14,
      maxParticipants: 16,
      organizer: 'HeatBeasts Esports'
    },
    {
      id: 2,
      title: 'Valorant Champions League',
      game: 'Valorant',
      date: '2025-11-25',
      time: '20:00 IST',
      location: 'Online',
      type: 'online',
      status: 'upcoming',
      prizePool: '₹5,00,000',
      teams: 32,
      registrationDeadline: '2025-11-18',
      description: 'Regional qualifiers for the international Valorant championship',
      banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop',
      participants: 28,
      maxParticipants: 32,
      organizer: 'HeatBeasts Esports'
    },
    {
      id: 3,
      title: 'BGMI Pro Series',
      game: 'BGMI',
      date: '2025-11-28',
      time: '16:00 IST',
      location: 'Hybrid Event',
      type: 'hybrid',
      status: 'upcoming',
      prizePool: '₹7,50,000',
      teams: 24,
      registrationDeadline: '2025-11-20',
      description: 'Mobile gaming tournament with both online and offline stages',
      banner: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&h=400&fit=crop',
      participants: 20,
      maxParticipants: 24,
      organizer: 'HeatBeasts Mobile'
    },
    {
      id: 4,
      title: 'Apex Legends Arena',
      game: 'Apex Legends',
      date: '2025-12-05',
      time: '19:00 IST',
      location: 'Online',
      type: 'online',
      status: 'upcoming',
      prizePool: '₹3,00,000',
      teams: 20,
      registrationDeadline: '2025-11-28',
      description: 'Fast-paced battle royale tournament for the best squads',
      banner: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=400&fit=crop',
      participants: 15,
      maxParticipants: 20,
      organizer: 'HeatBeasts Esports'
    }
  ];

  pastEvents: EventData[] = [
    {
      id: 5,
      title: 'Summer Showdown 2025',
      game: 'CS:GO',
      date: '2025-06-15',
      time: '18:00 IST',
      location: 'Delhi, India',
      type: 'offline',
      status: 'past',
      prizePool: '₹8,00,000',
      teams: 16,
      registrationDeadline: '2025-06-10',
      description: 'Mid-year championship with record breaking viewership',
      banner: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&h=400&fit=crop',
      participants: 16,
      maxParticipants: 16,
      organizer: 'HeatBeasts Esports'
    },
    {
      id: 6,
      title: 'Valorant Spring Cup',
      game: 'Valorant',
      date: '2025-03-20',
      time: '20:00 IST',
      location: 'Online',
      type: 'online',
      status: 'past',
      prizePool: '₹4,00,000',
      teams: 32,
      registrationDeadline: '2025-03-15',
      description: 'Season opener with amazing competitive matches',
      banner: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=400&fit=crop',
      participants: 32,
      maxParticipants: 32,
      organizer: 'HeatBeasts Esports'
    }
  ];

  eventTypes = ['All', 'Online', 'Offline', 'Hybrid'];
  selectedType = 'All';

  ngOnInit() {}

  filterByType(type: string) {
    this.selectedType = type;
  }

  getFilteredEvents() {
    if (this.selectedType === 'All') {
      return this.upcomingEvents;
    }
    return this.upcomingEvents.filter(event => 
      event.type.toLowerCase() === this.selectedType.toLowerCase()
    );
  }

  getProgressPercentage(event: EventData): number {
    return (event.participants / event.maxParticipants) * 100;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  }

  getDaysUntil(dateString: string): number {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getTypeIcon(type: string): string {
    switch(type) {
      case 'online': return '🌐';
      case 'offline': return '📍';
      case 'hybrid': return '🔄';
      default: return '🎮';
    }
  }
}
