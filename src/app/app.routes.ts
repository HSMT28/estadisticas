import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { statisticsRoutes } from './stadistics/stadistics.routes';
import { PagesComponent } from './pages/pages.component';
import { CreateMatchComponent } from './match/create-match.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full'},
    { path: 'login', component: AuthComponent},
    { path: 'stadistics', component: PagesComponent, children: statisticsRoutes },
    { path: 'registerMatch', component:CreateMatchComponent}
];
