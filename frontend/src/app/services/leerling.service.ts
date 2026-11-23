import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Leerling } from '../models/leerling.model';
import { Coach } from '../models/coach.model';

@Injectable({
  providedIn: 'root'
})
export class LeerlingService {
  private http = inject(HttpClient);
  private apiUrl = '/api/leerlingen';

  getLeerlingen(): Observable<Leerling[]> {
    return this.http.get<Leerling[]>(this.apiUrl);
  }

  getCoaches(): Observable<Coach[]> {
    return this.http.get<Coach[]>('/api/coaches');
  }

  updateLeerling(leerling: Leerling): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${leerling.id}`, leerling);
  }

  addLeerling(leerling: Partial<Leerling>): Observable<void> {
    return this.http.post<void>(this.apiUrl, leerling);
  }

  addCoach(naam: String): Observable<void> {
    return this.http.post<void>('/api/coaches', { naam });
  }
}
