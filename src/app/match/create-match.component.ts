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
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Player {
  id: number
  name: string
}

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
  teamData!: FormGroup;
  imageCountryLocal: string | null = null;
  imageCountryVisitor: string | null = null;
  selectedImage: File | null = null;
  idCountryLocal: number = 0;
  idCountryVisitor: number = 0;
  countries: {id: number, name: string, image: string, code: string}[] = [];
  teams: {id: number, name: string, image: string, idLeague: number}[] = [];
  teamsRegister: {id: number, name: string}[] = [];
  teamsLocal: {id: number, name: string, image: string, idLeague: number}[] = [];
  teamsVisitor: {id: number, name: string, image: string, idLeague: number}[] = [];
  columnsToDisplay = ['Local', 'Visitor', 'Goals Local', 'Goals Visitor', 'Scorers'];
  columnsPlayersToDisplay = ['Name', 'Goals', 'Assists', 'Shots', 'Shots Goal', 'Cards'];
  dataMatch: MatTableDataSource<any> | null = null;
  addStatsPlayer = false;
  isOpenModal = false;
  viewAddStats = false;
  viewRegisterTeam = false;
  viewDetailsMatch = false;
  errorDatosPlayer = false;
  dataPlayer: MatTableDataSource<any> | null = null;
  statsData: any;

  playerNames: Player[] = [];
  filteredNames: Player[] = [];

  opciones: string[] = ['Opción 1', 'Opción 2', 'Opción 3'];
  opcionSeleccionada: string = '';

  constructor(private fb: FormBuilder, private createMatchService: CreateMatchService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.imageCountryLocal = null;
    this.imageCountryVisitor = null;
    this.errorDatosPlayer = false;

    this.matchData = this.fb.group({
      countryLocal: [null, Validators.required],
      countryVisitor: [null, Validators.required],
      localTeam: [null, Validators.required],
      visitorTeam: [null, Validators.required],
      goalsLocal: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      goalsVisitor: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      cardsLocal: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      cardsRedLocal: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      cardsVisitor: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      cardsRedVisitor: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      cornersLocal: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      cornersVisitor: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      shotsLocal: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      shotsVisitor: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      shotsGoalLocal: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      shotsGoalVisitor: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      dateMatch: ['', Validators.required],
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

    this.teamData = this.fb.group({
      idCountry: [null, Validators.required],
      idLeague: [null, Validators.required],
      nameTeam: ['', Validators.required],
      urlImage: ['']
    });

    this.onCountryLocalChange();
    this.onCountryVisitorChange();
    this.onNamePlayerChange();
    this.onCountryRegisterTeamChange();

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
    this.obtenerPlayers();
  }

  onNamePlayerChange() {
    this.playerData.get('name')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      )
      .subscribe(filtered => {
        this.filteredNames = filtered;
      });
  }

  onCountryRegisterTeamChange() {
    this.teamData.get('idCountry')?.valueChanges.subscribe((value) => {
      this.createMatchService.getLeagues(value).subscribe(
        (data: any[]) => {
          this.teamsRegister = data.map(team => ({
            id: team.id,
            name: team.name || ''
          }));
        },
        (error) => {
          console.error('Error loading teams:', error);
        }
      );
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

  obtenerPlayers() {
    this.createMatchService.getAllPlayers().subscribe(
      (data: any[]) => {
        this.playerNames = data.map(player => ({
          id: player.id,
          name: player.name || ''
        }));
      },
      (error) => {
        console.error('Error loading players:', error);
      }
    );
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

  saveTeam(){
    var textImage = "";

    if (this.selectedImage) {
      const formData = new FormData();
      formData.append('file', this.selectedImage);

      this.createMatchService.postImageTeam(formData).subscribe(
        (data: string) => {
          textImage = data;
          this.selectedImage = null;
        },
        (error) => {
          console.error('Error saving image team:', error);
        }
      );
    }
    
    this.createMatchService.postTeam(this.teamData?.value ?? null).subscribe(
      (data: string) => {
        this.snackBar.open(data + textImage, 'Cerrar', {
          duration: 10000,
          verticalPosition: 'top',
        });
      },
      (error) => {
        console.error('Error saving team:', error);
      }
    );

    this.ngOnInit();
  }

  openModal() {
    this.isOpenModal = true;
  }

  closedModal() {
    this.isOpenModal = false;
    this.viewAddStats = false;
    this.viewRegisterTeam = false;
    this.viewDetailsMatch = false;
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
          idplayer: this.playerNames.find(x => x.name == this.playerData.get('name')?.value)?.id ?? 0,
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
    this.statsData = statsPlayer;
    this.openModal();
    this.viewDetailsMatch = true;
    console.log(this.statsData);
  }

  private _filter(value: string): Player[] {
    const filterValue = value.toLowerCase();
    return this.playerNames.filter(x => x.name.toLowerCase().includes(filterValue));
  }

  saveStats(){
    this.createMatchService.postMatches(this.dataMatch?.data ?? null).subscribe(
      (data: string) => {
        this.snackBar.open(data, 'Cerrar', {
          duration: 10000,
          verticalPosition: 'top',
        });
        this.dataMatch = null;
      },
      (error) => {
        console.error('Error saving games:', error);
      }
    );
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      if (file.type === 'image/png') {
        const fileName = file.name;
        const imagePath = `/images/${fileName}`;
        console.log(file);
        this.selectedImage = file;

        this.teamData.get('urlImage')?.setValue(imagePath);
      } else {
        alert('Solo se permiten imágenes PNG.');
      }
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.teamData.get('urlImage')?.reset();
  }
}
