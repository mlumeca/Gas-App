import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostalCode } from '../models/postal-code.interface';
import { Provincia } from '../models/provincia.interface';
import { ComunidadAutonoma } from '../models/comunidad-autonoma.interface';

@Injectable({
  providedIn: 'root'
})
export class GasAppService {

  constructor(private http: HttpClient) { }

  getGasList() {
    return this.http.get('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres');
  }
  getComunidadList(): Observable<ComunidadAutonoma[]> {
    return this.http.get<ComunidadAutonoma[]>('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/ComunidadesAutonomas/');
  }

  getGasListPorComunidad(iDCCAA: string) {
    return this.http.get(`https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroCCAA/${iDCCAA}`);
  }

  getProvinciasList(iDCCAA: string): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(`https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/ProvinciasPorComunidad/${iDCCAA}`);
  }

  getGasListPorProvincia(idPovincia: string) {
    return this.http.get(`https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/${idPovincia}`)
  }

  getPostalCodes(): Observable<PostalCode[]> {
    return this.http.get<PostalCode[]>('http://localhost:3000/postal-code');
  }
}
