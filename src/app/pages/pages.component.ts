import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { PagesService } from './pages.service';

@Component({
  selector: 'app-pages',
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, RouterModule],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent implements OnInit {
  competitions: {id: number, name: string, image: string, code: string}[] = [];

  constructor(private pagesService: PagesService) {}

  ngOnInit(): void {
      this.loadCountries();
  }

  loadCountries(): void {
    this.pagesService.getCountries().subscribe(
      (data: any[]) => {
        this.competitions = data.map(country => ({
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
  }

  selectCompetition(index: string) {
    sessionStorage.setItem('nameCountry', index);
  }

  generateRandomCode(id: number): string{
    return btoa(id.toString()).replace(/=/g, '');
  }
}
