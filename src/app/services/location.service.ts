import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private comunidadesUrl = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/ComunidadesAutonomas';

  constructor(private http: HttpClient) { }

  getComunidadesAutonomas(): Observable<any> {
    return this.http.get<any>(this.comunidadesUrl);
  }

  getProvincias(comunidadId: string): Observable<any> {
    const provinciasUrl = `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/ProvinciasFiltroComunidad/${comunidadId}`;
    return this.http.get<any>(provinciasUrl);
  }

  getGasolinerasPorComunidad(comunidadId: string): Observable<any> {
    const url = `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/PreciosEESSTerrestresFiltroCCAA/${comunidadId}`;
    return this.http.get<any>(url);
  }
  
  getGasolinerasPorProvincia(provinciaId: string): Observable<any> {
    const url = `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/PreciosEESSTerrestresFiltroProvincia/${provinciaId}`;
    return this.http.get<any>(url);
  }
}

