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
import { DebtService } from '../../services/debt.service';
import { Debt } from '../../models/expense.model';

@Component({
  selector: 'app-debt',
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
  templateUrl: './debt.component.html',
  styleUrl: './debt.component.css'
})
export class DebtComponent implements OnInit {
  debts: Debt[] = [];
  displayDialog: boolean = false;
  displayPaymentDialog: boolean = false;
  debt: Debt = this.getEmptyDebt();
  selectedDebt: Debt | null = null;
  paymentAmount: number = 0;
  isEdit: boolean = false;
  
  priorities = [
    { label: 'High', value: 'HIGH' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Low', value: 'LOW' }
  ];

  constructor(
    private debtService: DebtService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadDebts();
  }

  loadDebts(): void {
    this.debtService.getAllDebts().subscribe({
      next: (data) => {
        this.debts = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load debts'
        });
      }
    });
  }

  showDialogToAdd(): void {
    this.debt = this.getEmptyDebt();
    this.isEdit = false;
    this.displayDialog = true;
  }

  editDebt(debt: Debt): void {
    this.debt = { ...debt };
    if (this.debt.dueDate) {
      this.debt.dueDate = new Date(this.debt.dueDate).toISOString().split('T')[0];
    }
    this.isEdit = true;
    this.displayDialog = true;
  }

  saveDebt(): void {
    if (this.isEdit) {
      this.debtService.updateDebt(this.debt.id!, this.debt).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Debt updated successfully'
          });
          this.loadDebts();
          this.displayDialog = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update debt'
          });
        }
      });
    } else {
      this.debtService.createDebt(this.debt).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Debt created successfully'
          });
          this.loadDebts();
          this.displayDialog = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create debt'
          });
        }
      });
    }
  }

  deleteDebt(debt: Debt): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this debt?',
      accept: () => {
        this.debtService.deleteDebt(debt.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Debt deleted successfully'
            });
            this.loadDebts();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete debt'
            });
          }
        });
      }
    });
  }

  showPaymentDialog(debt: Debt): void {
    this.selectedDebt = debt;
    this.paymentAmount = 0;
    this.displayPaymentDialog = true;
  }

  makePayment(): void {
    if (!this.selectedDebt || this.paymentAmount <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter a valid payment amount'
      });
      return;
    }

    this.debtService.makePayment(this.selectedDebt.id!, this.paymentAmount).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Payment recorded successfully'
        });
        this.loadDebts();
        this.displayPaymentDialog = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to record payment'
        });
      }
    });
  }

  getProgressValue(debt: Debt): number {
    if (!debt.paidAmount) return 0;
    return (debt.paidAmount / debt.totalAmount) * 100;
  }

getPrioritySeverity(priority: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
  switch (priority) {
    case 'HIGH': return 'danger';    // Red
    case 'MEDIUM': return 'warning'; // Yellow
    case 'LOW': return 'success';    // Green
    default: return 'info';          // Blue
  }
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

  getEmptyDebt(): Debt {
    return {
      debtName: '',
      creditor: '',
      totalAmount: 0,
      interestRate: 0,
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'MEDIUM'
    };
  }
}