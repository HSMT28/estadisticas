import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StadisticsService } from '../stadistics.service';

@Component({
  selector: 'app-stadistics-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './stadistics-details.component.html',
  styleUrl: './stadistics-details.component.scss'
})
export class StadisticsDetailsComponent {
  idTeam: string | null = null;
  sectionsState: { [key: number]: boolean } = {
    1: true,
    2: true,
    3: true,
    4: true,
    5: true
  };
  matches: { result: string, idLocal: number, nameLocal: string, idVisit: number, nameVisit: string, imageLocal: string, imageVisit: string,
    goalsLocal: number, goalsVisit: number, cardsRedLocal: number, cardsRedVisit: number, cardsYellowLocal: number, cardsYellowVisit: number,
    cornersLocal: number, cornersVisit: number, shotsGoalLocal: number, shotsGoalVisit: number, shotsLocal: number, shotsVisit: number }[] = [];

  constructor (private route: ActivatedRoute, private stadisticsService: StadisticsService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idTeam = this.decodeRandomCode(id);
      }
    })

    this.stadisticsService.getMatches(Number(this.idTeam)).subscribe(
      (data: any[]) => {
        this.matches = data;
      },
      (error) => {
        console.error('Error loading matches: ', error);
      }
    );
  }

  decodeRandomCode(id: string): string {
    return atob(id);
  }

  generateRandomCode(id: number): string{
    return btoa(id.toString()).replace(/=/g, '');
  }

  toggleCard(section: number) {
    this.sectionsState[section] = !this.sectionsState[section];
  }
}
