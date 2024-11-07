import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostalCode } from '../models/postal-code.interface';

@Injectable({
  providedIn: 'root'
})
export class PostalCodeService {
  constructor(private http: HttpClient) {}

  getPostalCodes(): Observable<PostalCode[]> {
    return this.http.get<PostalCode[]>('http://localhost:3000/postal-code');
  }
}