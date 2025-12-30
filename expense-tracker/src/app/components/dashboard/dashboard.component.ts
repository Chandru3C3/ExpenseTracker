import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { forkJoin } from 'rxjs';
import { ExpenseService } from '../../services/expense.service';
import { EMIService } from '../../services/emi.service';
import { BudgetService } from '../../services/budget.service';
import { DebtService } from '../../services/debt.service';
import { Expense, EMI, Budget, Debt } from '../../models/expense.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalExpenses: number = 0;
  activeEMIs: number = 0;
  totalEMIAmount: number = 0;
  activeBudgets: number = 0;
  budgetUtilization: number = 0;
  totalDebts: number = 0;
  pendingDebts: number = 0;

  categoryChartData: any;
  monthlyTrendData: any;
  budgetComparisonData: any;
  debtDistributionData: any;
  
  chartOptions: any;
  lineChartOptions: any;
  barChartOptions: any;

  constructor(
    private expenseService: ExpenseService,
    private emiService: EMIService,
    private budgetService: BudgetService,
    private debtService: DebtService
  ) {
    this.initializeChartOptions();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    forkJoin({
      expenses: this.expenseService.getAllExpenses(),
      emis: this.emiService.getAllEMIs(),
      budgets: this.budgetService.getAllBudgets(),
      debts: this.debtService.getAllDebts()
    }).subscribe({
      next: (data) => {
        this.processExpenses(data.expenses);
        this.processEMIs(data.emis);
        this.processBudgets(data.budgets);
        this.processDebts(data.debts);
        
        this.createCategoryChart(data.expenses);
        this.createMonthlyTrendChart(data.expenses);
        this.createBudgetComparisonChart(data.budgets, data.expenses);
        this.createDebtDistributionChart(data.debts);
      }
    });
  }

  processExpenses(expenses: Expense[]): void {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    this.totalExpenses = expenses
      .filter(e => {
        const date = new Date(e.expenseDate);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }

  processEMIs(emis: EMI[]): void {
    const activeEMIList = emis.filter(e => e.status === 'ACTIVE');
    this.activeEMIs = activeEMIList.length;
    this.totalEMIAmount = activeEMIList.reduce((sum, e) => sum + e.emiAmount, 0);
  }

  processBudgets(budgets: Budget[]): void {
    const today = new Date();
    const activeBudgetList = budgets.filter(b => new Date(b.endDate) >= today);
    this.activeBudgets = activeBudgetList.length;
    
    if (activeBudgetList.length > 0) {
      const totalBudget = activeBudgetList.reduce((sum, b) => sum + b.budgetAmount, 0);
      const totalSpent = activeBudgetList.reduce((sum, b) => sum + (b.spentAmount || 0), 0);
      this.budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    }
  }

  processDebts(debts: Debt[]): void {
    this.totalDebts = debts.reduce((sum, d) => sum + (d.remainingAmount || d.totalAmount), 0);
    this.pendingDebts = debts.filter(d => d.status === 'PENDING').length;
  }

  createCategoryChart(expenses: Expense[]): void {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    this.categoryChartData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#ef4444', '#3b82f6', '#10b981', '#f59e0b',
          '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
        ]
      }]
    };
  }

  createMonthlyTrendChart(expenses: Expense[]): void {
    const monthlyData = this.getLast6MonthsData(expenses);
    
    this.monthlyTrendData = {
      labels: monthlyData.map(m => m.month),
      datasets: [{
        label: 'Expenses',
        data: monthlyData.map(m => m.amount),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  }

  createBudgetComparisonChart(budgets: Budget[], expenses: Expense[]): void {
    const categories = [...new Set(budgets.map(b => b.category))];
    
    const budgetAmounts = categories.map(cat => {
      const budget = budgets.find(b => b.category === cat);
      return budget ? budget.budgetAmount : 0;
    });
    
    const actualAmounts = categories.map(cat => {
      return expenses
        .filter(e => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0);
    });

    this.budgetComparisonData = {
      labels: categories,
      datasets: [
        {
          label: 'Budget',
          data: budgetAmounts,
          backgroundColor: '#10b981'
        },
        {
          label: 'Actual',
          data: actualAmounts,
          backgroundColor: '#ef4444'
        }
      ]
    };
  }

  createDebtDistributionChart(debts: Debt[]): void {
    const labels = debts.map(d => d.debtName);
    const data = debts.map(d => d.remainingAmount || d.totalAmount);

    this.debtDistributionData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
          '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
        ]
      }]
    };
  }

  getLast6MonthsData(expenses: Expense[]): { month: string; amount: number }[] {
    const months = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      const amount = expenses
        .filter(e => {
          const expenseDate = new Date(e.expenseDate);
          return expenseDate.getMonth() === date.getMonth() &&
                 expenseDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, e) => sum + e.amount, 0);
      
      months.push({ month: monthName, amount });
    }
    
    return months;
  }

  initializeChartOptions(): void {
    this.chartOptions = {
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };

    this.lineChartOptions = {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value: any) {
              return '₹' + value.toLocaleString();
            }
          }
        }
      }
    };

    this.barChartOptions = {
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value: any) {
              return '₹' + value.toLocaleString();
            }
          }
        }
      }
    };
  }
}
