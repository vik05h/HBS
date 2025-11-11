import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { About } from './pages/about/about';
import { Community } from './pages/community/community';
import { Event } from './pages/event/event';
import { LiveStream } from './pages/live-stream/live-stream';
import { Tournaments } from './pages/tournaments/tournaments';
import { User } from './pages/user/user';

export const routes: Routes = [
    {
        path: '', component: Landing
    },
    {
        path: 'about', component: About
    },
    {
        path: 'community', component: Community
    },
    {
        path: 'event', component: Event
    },
    {
        path: 'live-stream', component: LiveStream
    },
    {
        path: 'tournaments', component: Tournaments
    },
    {
        path: 'user', component: User
    }
];
