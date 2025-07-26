import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  LocalidadePaisesResponse,
  LocalidadeEstadosResponse,
} from '../../../../models/localidade/LocalidadeResponse';

@Injectable({
  providedIn: 'root',
})
export class Localidade {
  // Injects
  private readonly http = inject(HttpClient);

  private readonly API_KEY =
    'b081b3JRVFBZMDJjT3U5TjRBUVhOamM2d1JwaWszWEppalV4QU9mRQ==';
  private readonly BASE_URL = 'https://api.countrystatecity.in/v1';

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSCAPI-KEY': this.API_KEY,
    }),
  };

  getPaises(): Observable<LocalidadePaisesResponse[]> {
    return this.http.get<LocalidadePaisesResponse[]>(
      `${this.BASE_URL}/countries`,
      this.httpOptions
    );
  }

  getEstados(pais: string): Observable<LocalidadeEstadosResponse[]> {
    return this.http.get<LocalidadeEstadosResponse[]>(
      `${this.BASE_URL}/countries/${pais}/states`,
      this.httpOptions
    );
  }
}
