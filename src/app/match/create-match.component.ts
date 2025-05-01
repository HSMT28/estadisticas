import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateMatchService } from './create-match.service';
import { ModalComponent } from "../modal/modal.component";
import { map, Observable, startWith } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-create-match',
  imports: [CommonModule, ReactiveFormsModule, MatSidenavModule, MatButtonModule, MatInputModule, MatFormFieldModule,
    MatCheckboxModule, MatIconModule, MatSelectModule, MatTableModule, MatDialogModule, ModalComponent, MatDividerModule,
    MatAutocompleteModule, MatOptionModule],
  templateUrl: './create-match.component.html',
  styleUrl: './create-match.component.scss'
})
export class CreateMatchComponent implements OnInit {
  matchData!: FormGroup;
  playerData!: FormGroup;
  imageCountryLocal: string | null = null;
  imageCountryVisitor: string | null = null;
  idCountryLocal: number = 0;
  idCountryVisitor: number = 0;
  countries: {id: number, name: string, image: string, code: string}[] = [];
  teams: {id: number, name: string, image: string, idLeague: number}[] = [];
  teamsLocal: {id: number, name: string, image: string, idLeague: number}[] = [];
  teamsVisitor: {id: number, name: string, image: string, idLeague: number}[] = [];
  columnsToDisplay = ['Local', 'Visitor', 'Goals Local', 'Goals Visitor', 'Scorers'];
  columnsPlayersToDisplay = ['Name', 'Goals', 'Assists', 'Shots', 'Shots Goal', 'Cards'];
  dataMatch: MatTableDataSource<any> | null = null;
  addStatsPlayer = false;
  isOpenModal = false;
  viewAddStats = false;
  viewRegisterTeam = false;
  errorDatosPlayer = false;
  dataPlayer: MatTableDataSource<any> | null = null;

  playerNames: string[] = ['Messi', 'Ronaldo', 'Mbappé', 'Haaland', 'Neymar'];
  filteredNames: string[] = [];

  opciones: string[] = ['Opción 1', 'Opción 2', 'Opción 3'];
  opcionSeleccionada: string = '';

  constructor(private fb: FormBuilder, private createMatchService: CreateMatchService) {}

  ngOnInit(): void {
    this.imageCountryLocal = null;
    this.imageCountryVisitor = null;
    this.errorDatosPlayer = false;

    this.matchData = this.fb.group({
      countryLocal: [null, Validators.required],
      countryVisitor: [null, Validators.required],
      localTeam: [null, Validators.required],
      visitorTeam: [null, Validators.required],
      goalsLocal: ['', Validators.required],
      goalsVisitor: ['', Validators.required],
      cardsLocal: ['', Validators.required],
      cardsVisitor: ['', Validators.required],
      cornersLocal: ['', Validators.required],
      cornersVisitor: ['', Validators.required],
      shotsLocal: ['', Validators.required],
      shotsVisitor: ['', Validators.required],
      shotsGoalLocal: ['', Validators.required],
      shotsGoalVisitor: ['', Validators.required],
      statsPlayer: this.fb.array([])
    });

    this.playerData = this.fb.group({
      name: ['', [Validators.required]],
      goals: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      assists: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      shots: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      shotsGoal: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      cards: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });

    this.onCountryLocalChange();
    this.onCountryVisitorChange();
    this.onNamePlayerChange();

    this.createMatchService.getCountries().subscribe(
      (data: any[]) => {
        this.countries = data.map(country => ({
          id: country.id,
          name: country.name || '',
          image: country.image || '',
          code: country.code
        }));
      },
      (error) => {
        console.error('Error loading countries:', error);
      }
    );

    this.obtenerTeams();
  }

  onNamePlayerChange() {
    this.playerData.get('name')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      )
      .subscribe(filtered => {
        this.filteredNames = filtered;
        console.log(this.filteredNames);
      });
  }

  onCountryLocalChange() {
    this.matchData.get('countryLocal')?.valueChanges.subscribe((value) => {
      this.imageCountryLocal = this.countries.find(x => x.id === value)?.image ?? null;

      this.createMatchService.getTeams(value).subscribe(
        (data: any[]) => {
          this.teamsLocal = data.map(team => ({
            id: team.id,
            name: team.name || '',
            image: team.image || '',
            idLeague: team.idLeague
          }));
        },
        (error) => {
          console.error('Error loading teams:', error);
        }
      );
    });
  }

  onCountryVisitorChange() {
    this.matchData.get('countryVisitor')?.valueChanges.subscribe((value) => {
      this.idCountryVisitor = value;
      this.imageCountryVisitor = this.countries.find(x => x.id === value)?.image ?? null;
      
      this.createMatchService.getTeams(this.idCountryVisitor).subscribe(
        (data: any[]) => {
          this.teamsVisitor = data.map(team => ({
            id: team.id,
            name: team.name || '',
            image: team.image || '',
            idLeague: team.idLeague
          }));
        },
        (error) => {
          console.error('Error loading teams:', error);
        }
      );
    });
  }

  obtenerTeams() {
    this.createMatchService.getAllTeams().subscribe(
      (data: any[]) => {
        this.teams = data.map(team => ({
          id: team.id,
          name: team.name || '',
          image: team.image || '',
          idLeague: team.idLeague
        }));
      },
      (error) => {
        console.error('Error loading teams:', error);
      }
    );

    this.teamsLocal = this.teams;
    this.teamsVisitor = this.teams;
  }

  register() {
    const formValue = this.matchData.value;

    const localTeamName = this.teamsLocal.find(team => team.id === formValue.localTeam)?.name;
    const visitorTeamName = this.teamsVisitor.find(team => team.id === formValue.visitorTeam)?.name;

    const matchToDisplay = {
      ...formValue,
      localTeam: localTeamName,
      visitorTeam: visitorTeamName,
      idLocalTeam:this.matchData.get('localTeam')?.value,
      idVisitorTeam:this.matchData.get('visitorTeam')?.value,
      statsPlayer: this.dataPlayer?.data
    };

    const dataExist = this.dataMatch?.data || [];

    this.dataMatch = new MatTableDataSource([...dataExist, matchToDisplay]);
    this.dataPlayer = null;
    this.ngOnInit();
  }

  addStats(event: any): void{
    this.addStatsPlayer = event.checked;
  }

  addStatsPlayers(){
    this.openModal();
    this.viewAddStats = true;
  }

  registerTeam(){
    this.openModal();
    this.viewRegisterTeam = true;
  }

  openModal() {
    this.isOpenModal = true;
  }

  closedModal() {
    this.isOpenModal = false;
    this.viewAddStats = false;
    this.viewRegisterTeam = false;
  }

  saveStatsPlayer() {
    if (!this.matchData.valid) {
      this.errorDatosPlayer = true;
    }
    else {
      if (this.playerData.valid) {
        this.errorDatosPlayer = false;

        this.statsPlayerArray.push(this.fb.group(this.playerData.value));
        
        const formValue = this.playerData.value;
  
        const matchToDisplay = {
          ...formValue,
        };
  
        const dataExist = this.dataPlayer?.data || [];
  
        this.dataPlayer = new MatTableDataSource([...dataExist, matchToDisplay]);
  
        this.playerData.reset({
          name: '',
          goals: '',
          shots: '',
          shotsOnTarget: '',
          cards: '',
          assists: ''
        });
      }
    }
  }

  get statsPlayerArray(): FormArray {
    return this.matchData.get('statsPlayer') as FormArray;
  }

  viewStats(statsPlayer: any) {
    console.log(statsPlayer);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.playerNames.filter(name => name.toLowerCase().includes(filterValue));
  }
}
