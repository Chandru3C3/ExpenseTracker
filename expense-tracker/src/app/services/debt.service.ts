import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Debt } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class DebtService {
  private apiUrl = 'http://localhost:8080/api/debts';

  constructor(private http: HttpClient) { }

  getAllDebts(): Observable<Debt[]> {
    return this.http.get<Debt[]>(this.apiUrl);
  }

  getDebtById(id: number): Observable<Debt> {
    return this.http.get<Debt>(`${this.apiUrl}/${id}`);
  }

  createDebt(debt: Debt): Observable<Debt> {
    return this.http.post<Debt>(this.apiUrl, debt);
  }

  updateDebt(id: number, debt: Debt): Observable<Debt> {
    return this.http.put<Debt>(`${this.apiUrl}/${id}`, debt);
  }

  deleteDebt(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  makePayment(id: number, amount: number): Observable<Debt> {
    return this.http.post<Debt>(`${this.apiUrl}/${id}/payment`, { amount });
  }

  getPendingDebts(): Observable<Debt[]> {
    return this.http.get<Debt[]>(`${this.apiUrl}/pending`);
  }
}