import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { remoteServer } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class CreateMatchService {

  constructor(private http: HttpClient) { }

  getCountries(): Observable<any> {
    return this.http.get(`${remoteServer.baseUrl}/countries`);
  }

  getTeams(idCountry: number): Observable<any> {
    return this.http.get(`${remoteServer.baseUrl}/teams/teamsByCountry/${idCountry}`);
  }

  getAllTeams(): Observable<any> {
    return this.http.get(`${remoteServer.baseUrl}/teams`);
  }

  getAllPlayers(): Observable<any> {
    return this.http.get(`${remoteServer.baseUrl}/players`);
  }

  postMatches(dataMatch: any): Observable<string> {
    return this.http.post(`${remoteServer.baseUrl}/matches/saveMatches`, dataMatch, { responseType: 'text' });
  }

  getLeagues(idCountry: number): Observable<any> {
    return this.http.get(`${remoteServer.baseUrl}/league/${idCountry}`);
  }

  postTeam(dataTeam: any): Observable<string> {
    return this.http.post(`${remoteServer.baseUrl}/teams/saveTeam`, dataTeam, { responseType: 'text' });
  }
}
