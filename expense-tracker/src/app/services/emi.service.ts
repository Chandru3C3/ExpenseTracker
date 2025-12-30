import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EMI } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class EMIService {
  private apiUrl = 'http://localhost:8080/api/emis';

  constructor(private http: HttpClient) { }

  getAllEMIs(): Observable<EMI[]> {
    return this.http.get<EMI[]>(this.apiUrl);
  }

  getEMIById(id: number): Observable<EMI> {
    return this.http.get<EMI>(`${this.apiUrl}/${id}`);
  }

  createEMI(emi: EMI): Observable<EMI> {
    return this.http.post<EMI>(this.apiUrl, emi);
  }

  updateEMI(id: number, emi: EMI): Observable<EMI> {
    return this.http.put<EMI>(`${this.apiUrl}/${id}`, emi);
  }

  deleteEMI(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  payEMI(id: number): Observable<EMI> {
    return this.http.post<EMI>(`${this.apiUrl}/${id}/pay`, {});
  }

  getActiveEMIs(): Observable<EMI[]> {
    return this.http.get<EMI[]>(`${this.apiUrl}/active`);
  }
}