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

  private readonly BASE_URL = 'https://countriesnow.space/api/v0.1';

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getPaises(): Observable<LocalidadePaisesResponse> {
    return this.http.get<LocalidadePaisesResponse>(
      `${this.BASE_URL}/countries/positions`
    );
  }

  getEstados(pais: string): Observable<LocalidadeEstadosResponse> {
    return this.http.post<LocalidadeEstadosResponse>(
      `${this.BASE_URL}/countries/states`,
      { country: pais }
    );
  }
}
