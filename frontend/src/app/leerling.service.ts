import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Leerling } from './leerling.model';

@Injectable({
  providedIn: 'root'
})
export class LeerlingService {
  private http = inject(HttpClient);
  private apiUrl = '/api/leerlingen';

  getLeerlingen(): Observable<Leerling[]> {
    return this.http.get<Leerling[]>(this.apiUrl);
  }

  updateLeerling(leerling: Leerling): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${leerling.id}`, leerling);
  }
}
