import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { remoteServer } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  constructor(private http: HttpClient) { }

  getCountries(): Observable<any> {
    return this.http.get(`${remoteServer.baseUrl}/countries`);
  }
}
