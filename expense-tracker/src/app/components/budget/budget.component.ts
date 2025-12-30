import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BudgetService } from '../../services/budget.service';
import { Budget } from '../../models/expense.model';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressBarModule,
    TagModule,
    DropdownModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent implements OnInit {
  budgets: Budget[] = [];
  displayDialog: boolean = false;
  budget: Budget = this.getEmptyBudget();
  isEdit: boolean = false;
  
  categories = [
    { label: 'Food', value: 'Food' },
    { label: 'Transport', value: 'Transport' },
    { label: 'Shopping', value: 'Shopping' },
    { label: 'Bills', value: 'Bills' },
    { label: 'Entertainment', value: 'Entertainment' },
    { label: 'Healthcare', value: 'Healthcare' },
    { label: 'Education', value: 'Education' },
    { label: 'Other', value: 'Other' }
  ];

  constructor(
    private budgetService: BudgetService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.budgetService.getAllBudgets().subscribe({
      next: (data) => {
        this.budgets = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load budgets'
        });
      }
    });
  }

  showDialogToAdd(): void {
    this.budget = this.getEmptyBudget();
    this.isEdit = false;
    this.displayDialog = true;
  }

  editBudget(budget: Budget): void {
    this.budget = { ...budget };
    if (this.budget.startDate) {
      this.budget.startDate = new Date(this.budget.startDate).toISOString().split('T')[0];
    }
    if (this.budget.endDate) {
      this.budget.endDate = new Date(this.budget.endDate).toISOString().split('T')[0];
    }
    this.isEdit = true;
    this.displayDialog = true;
  }

  saveBudget(): void {
    if (this.isEdit) {
      this.budgetService.updateBudget(this.budget.id!, this.budget).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Budget updated successfully'
          });
          this.loadBudgets();
          this.displayDialog = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update budget'
          });
        }
      });
    } else {
      this.budgetService.createBudget(this.budget).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Budget created successfully'
          });
          this.loadBudgets();
          this.displayDialog = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create budget'
          });
        }
      });
    }
  }

  deleteBudget(budget: Budget): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this budget?',
      accept: () => {
        this.budgetService.deleteBudget(budget.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Budget deleted successfully'
            });
            this.loadBudgets();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete budget'
            });
          }
        });
      }
    });
  }

  getRemainingAmount(budget: Budget): number {
    return budget.budgetAmount - (budget.spentAmount || 0);
  }

  getProgressValue(budget: Budget): number {
    if (!budget.spentAmount) return 0;
    return (budget.spentAmount / budget.budgetAmount) * 100;
  }

  getProgressClass(budget: Budget): string {
    const progress = this.getProgressValue(budget);
    if (progress >= budget.alertThreshold) return 'danger';
    if (progress >= budget.alertThreshold * 0.8) return 'warning';
    return '';
  }

  getBudgetStatus(budget: Budget): string {
    const progress = this.getProgressValue(budget);
    if (progress >= 100) return 'EXCEEDED';
    if (progress >= budget.alertThreshold) return 'WARNING';
    return 'ON TRACK';
  }

  getStatusSeverity(status: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
  switch (status) {
    case 'ACTIVE': 
      return 'success';       // Green
    case 'COMPLETED': 
      return 'info';          // Blue
    case 'DEFAULTED': 
      return 'danger';        // Red
    case 'PENDING':
      return 'warning';       // Yellow
    default: 
      return 'secondary';     // Gray
  }
}

  getEmptyBudget(): Budget {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return {
      category: '',
      budgetAmount: 0,
      startDate: firstDay.toISOString().split('T')[0],
      endDate: lastDay.toISOString().split('T')[0],
      alertThreshold: 80
    };
  }
}