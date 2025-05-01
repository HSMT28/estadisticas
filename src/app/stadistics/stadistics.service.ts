import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { remoteServer } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class StadisticsService {

  constructor(private http: HttpClient) { }

  getLeagues(idCountry: number): Observable<any> {
    return this.http.get(`${remoteServer.baseUrl}/league/${idCountry}`);
  }

  getTeams(idLeague: number): Observable<any> {
    return this.http.get(`${remoteServer.baseUrl}/teams/${idLeague}`);
  }
}
