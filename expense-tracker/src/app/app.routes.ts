// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
// import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DebtComponent } from './components/debt/debt.component';
import { EMIComponent } from './components/emi/emi.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ExpenseComponent } from './components/expense/expense.component';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: MainLayoutComponent },
  { path: 'debt', component: DebtComponent },
  { path: 'emi', component: EMIComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'expense', component: ExpenseComponent },
  { 
    path: '', 
    component: MainLayoutComponent,
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: '' }
];