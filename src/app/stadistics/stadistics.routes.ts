import { Routes } from '@angular/router';
import { StadisticsDetailsComponent } from './stadistics-details/stadistics-details.component';
import { StadisticsTeamComponent } from './stadistics-team/stadistics-team.component';

export const statisticsRoutes: Routes = [
  { path: 'details/:id', component: StadisticsDetailsComponent },
  { path: 'team/:idCountry', component: StadisticsTeamComponent }
];