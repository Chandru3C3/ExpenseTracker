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
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EMIService } from '../../services/emi.service';
import { EMI } from '../../models/expense.model';

@Component({
  selector: 'app-emi',
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
    TagModule,
    ProgressBarModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './emi.component.html',
  styleUrls: ['./emi.component.css']
})
export class EMIComponent implements OnInit {
  emis: EMI[] = [];
  displayDialog: boolean = false;
  emi: EMI = this.getEmptyEMI();
  isEdit: boolean = false;

  constructor(
    private emiService: EMIService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadEMIs();
  }

  loadEMIs(): void {
    this.emiService.getAllEMIs().subscribe({
      next: (data) => {
        this.emis = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load EMIs'
        });
      }
    });
  }

  showDialogToAdd(): void {
    this.emi = this.getEmptyEMI();
    this.isEdit = false;
    this.displayDialog = true;
  }

  editEMI(emi: EMI): void {
    this.emi = { ...emi };
    if (this.emi.startDate) {
      this.emi.startDate = new Date(this.emi.startDate).toISOString().split('T')[0];
    }
    this.isEdit = true;
    this.displayDialog = true;
  }

  saveEMI(): void {
    if (this.isEdit) {
      this.emiService.updateEMI(this.emi.id!, this.emi).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'EMI updated successfully'
          });
          this.loadEMIs();
          this.displayDialog = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update EMI'
          });
        }
      });
    } else {
      this.emiService.createEMI(this.emi).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'EMI created successfully'
          });
          this.loadEMIs();
          this.displayDialog = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create EMI'
          });
        }
      });
    }
  }

  deleteEMI(emi: EMI): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this EMI?',
      accept: () => {
        this.emiService.deleteEMI(emi.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'EMI deleted successfully'
            });
            this.loadEMIs();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete EMI'
            });
          }
        });
      }
    });
  }

  payEMI(emi: EMI): void {
    this.confirmationService.confirm({
      message: 'Confirm EMI payment?',
      accept: () => {
        this.emiService.payEMI(emi.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'EMI paid successfully'
            });
            this.loadEMIs();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to pay EMI'
            });
          }
        });
      }
    });
  }

  getProgressValue(emi: EMI): number {
    if (!emi.paidEmis || !emi.tenure) return 0;
    return (emi.paidEmis / emi.tenure) * 100;
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

  getEmptyEMI(): EMI {
    return {
      loanName: '',
      totalAmount: 0,
      emiAmount: 0,
      tenure: 12,
      interestRate: 0,
      startDate: new Date().toISOString().split('T')[0]
    };
  }
}