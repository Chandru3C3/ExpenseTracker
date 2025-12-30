import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

export interface DashboardStats {
  totalExpenses: number;
  totalIncome: number;
  totalDebts: number;
  activeEMIs: number;
  savingsRate: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
}

export interface MonthlyTrend {
  month: string;
  expenses: number;
  budget: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`);
  }

  getCategoryExpenses(): Observable<CategoryExpense[]> {
    return this.http.get<CategoryExpense[]>(`${this.apiUrl}/dashboard/category-expenses`);
  }

  getMonthlyTrends(): Observable<MonthlyTrend[]> {
    return this.http.get<MonthlyTrend[]>(`${this.apiUrl}/dashboard/monthly-trends`);
  }
}