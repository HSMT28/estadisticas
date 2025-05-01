import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StadisticsService } from '../stadistics.service';

@Component({
  selector: 'app-stadistics-team',
  imports: [CommonModule, RouterModule],
  templateUrl: './stadistics-team.component.html',
  styleUrl: './stadistics-team.component.scss'
})
export class StadisticsTeamComponent implements OnInit {
  
  allTeam: {id: number, name: string, image: string, idLeague: number}[] = [];
  league: {id: number, name: string, image: string, idCountry: number}[] = [];

  teams = this.allTeam;
  nameCountry: string | null = "";
  idCountry: string | null = "";
  detalle = false;

  constructor (private route: ActivatedRoute, private stadisticsService: StadisticsService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.detalle = false;
      this.nameCountry = sessionStorage.getItem('nameCountry');
      this.idCountry = this.decodeRandomCode(params.get('idCountry') ?? "");
      this.loadLeagues(parseInt(this.idCountry ?? ""));
    })
  }

  loadLeagues(idCountry: number): void {
    this.stadisticsService.getLeagues(idCountry).subscribe(
      (data: any[]) => {
        this.league = data.map(leagues => ({
          id: leagues.id,
          name: leagues.name || '',
          image: leagues.image || '',
          idCountry: leagues.idCountry
        }));
        this.cd.detectChanges();
      },
      (error) => {
        console.error('Error loading leagues: ', error);
      }
    );
  }

  decodeRandomCode(id: string): string {
    return atob(id);
  }

  seeDetails(idLeague: number) {
    this.stadisticsService.getTeams(idLeague).subscribe(
      (data: any[]) =>{
        this.allTeam = data.map(teams => ({
          id: teams.id,
          name: teams.name || '',
          image: teams.image || '',
          idLeague: teams.idLeague
        }));
        this.teams = this.allTeam;
        this.detalle = true;
        this.cd.detectChanges();
      },
      (error) => {
        console.log('Error loading teams: ', error);
      }
    )
    
  }

  chooseLeague() {
    this.teams = [];
    this.detalle = false;
  }

  generateRandomCode(id: number): string{
    return btoa(id.toString()).replace(/=/g, '');
  }
}