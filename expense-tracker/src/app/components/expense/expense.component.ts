import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent implements OnInit {
  expenses: Expense[] = [];
  displayDialog: boolean = false;
  expense: Expense = this.getEmptyExpense();
  isEdit: boolean = false;
  
  categories = [
    { label: 'Food', value: 'Food' },
    { label: 'Transport', value: 'Transport' },
    { label: 'Shopping', value: 'Shopping' },
    { label: 'Bills', value: 'Bills' },
    { label: 'Entertainment', value: 'Entertainment' },
    { label: 'Healthcare', value: 'Healthcare' },
    { label: 'Other', value: 'Other' }
  ];
  
  paymentMethods = [
    { label: 'Cash', value: 'Cash' },
    { label: 'Credit Card', value: 'Credit Card' },
    { label: 'Debit Card', value: 'Debit Card' },
    { label: 'UPI', value: 'UPI' },
    { label: 'Net Banking', value: 'Net Banking' }
  ];

  constructor(
    private expenseService: ExpenseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.expenseService.getAllExpenses().subscribe({
      next: (data) => {
        this.expenses = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load expenses'
        });
      }
    });
  }

  showDialogToAdd(): void {
    this.expense = this.getEmptyExpense();
    this.isEdit = false;
    this.displayDialog = true;
  }

  editExpense(expense: Expense): void {
    this.expense = { ...expense };
    if (this.expense.expenseDate) {
      this.expense.expenseDate = new Date(this.expense.expenseDate).toISOString().split('T')[0];
    }
    this.isEdit = true;
    this.displayDialog = true;
  }

  saveExpense(): void {
    if (this.isEdit) {
      this.expenseService.updateExpense(this.expense.id!, this.expense).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Expense updated successfully'
          });
          this.loadExpenses();
          this.displayDialog = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update expense'
          });
        }
      });
    } else {
      this.expenseService.createExpense(this.expense).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Expense created successfully'
          });
          this.loadExpenses();
          this.displayDialog = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create expense'
          });
        }
      });
    }
  }

  deleteExpense(expense: Expense): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this expense?',
      accept: () => {
        this.expenseService.deleteExpense(expense.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Expense deleted successfully'
            });
            this.loadExpenses();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete expense'
            });
          }
        });
      }
    });
  }

  getEmptyExpense(): Expense {
    return {
      category: '',
      description: '',
      amount: 0,
      expenseDate: new Date().toISOString().split('T')[0],
      paymentMethod: ''
    };
  }
}
