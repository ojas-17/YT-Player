import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { VideoPageComponent } from './components/video-page/video-page.component';

export const routes: Routes = [
    {
        path: '',
        component: HomePageComponent
    },
    {
        path: ':id',
        component: VideoPageComponent
    }
];
