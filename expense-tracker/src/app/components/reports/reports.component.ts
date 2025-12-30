import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    CalendarModule,
    ButtonModule,
    TableModule,
    ChartModule
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  startDate: string = '';
  endDate: string = '';
  summary: any = null;
  categoryData: any[] = [];
  categoryChartData: any;
  chartOptions: any;

  constructor(private http: HttpClient) {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.startDate = firstDay.toISOString().split('T')[0];
    this.endDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.generateReport();
  }

  generateReport(): void {
    const url = `http://localhost:8080/api/analytics/financial-summary?startDate=${this.startDate}&endDate=${this.endDate}`;
    
    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.summary = data;
        this.processCategories(data.categoryBreakdown);
      },
      error: (error) => {
        console.error('Failed to generate report', error);
      }
    });
  }

  processCategories(breakdown: any): void {
    const total = Object.values(breakdown).reduce((sum: number, val: any) => sum + val, 0) as number;
    
    this.categoryData = Object.entries(breakdown).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? ((amount as number) / total) * 100 : 0
    }));
    
    this.categoryChartData = {
      labels: Object.keys(breakdown),
      datasets: [{
        data: Object.values(breakdown),
        backgroundColor: [
          '#ef4444', '#3b82f6', '#10b981', '#f59e0b',
          '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
        ]
      }]
    };

    this.chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#495057' // Makes text readable
        }
      }
    }
  };
  }

  exportToCSV(): void {
    const headers = ['Category', 'Amount', 'Percentage'];
    const rows = this.categoryData.map(item => 
      [item.category, item.amount, item.percentage.toFixed(2)]
    );
    
    let csv = headers.join(',') + '\n';
    csv += rows.map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${this.startDate}-to-${this.endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
