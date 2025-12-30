import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG Imports
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';

// Component Imports
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ExpenseComponent } from '../expense/expense.component';
import { EMIComponent } from '../emi/emi.component';
import { BudgetComponent } from '../budget/budget.component';
import { DebtComponent } from '../debt/debt.component';
import { ReportsComponent } from '../reports/reports.component';

// Service Import
import { AuthService } from '../../services/auth.service'; // Check this path!

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    TabViewModule,
    ButtonModule,
    AvatarModule,
    MenuModule,
    DashboardComponent,
    ExpenseComponent,
    EMIComponent,
    BudgetComponent,
    DebtComponent,
    ReportsComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}