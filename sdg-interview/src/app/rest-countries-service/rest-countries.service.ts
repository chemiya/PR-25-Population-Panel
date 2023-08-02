import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestCountriesService {

  private apiUrl = 'https://restcountries.com/v3.1/'; 

  constructor(private http: HttpClient) { }
  
  
  getDataContinents(): Observable<any> {// to obtain the data from all the countries
    const url = `${this.apiUrl}all`;
    return this.http.get<any>(url);
  }
  dataOfContinent(continent:string): Observable<any> {// to obtain the data from the countries of a continent
    const url = `${this.apiUrl}region/${continent}`;
    return this.http.get<any>(url);
  }
}
