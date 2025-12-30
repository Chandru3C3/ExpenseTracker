export interface Expense {
  id?: number;
  category: string;
  description: string;
  amount: number;
  expenseDate: string;
  paymentMethod: string;
  createdAt?: string;
}

export interface EMI {
  id?: number;
  loanName: string;
  totalAmount: number;
  emiAmount: number;
  tenure: number;
  interestRate: number;
  startDate: string;
  nextDueDate?: string;
  paidEmis?: number;
  remainingAmount?: number;
  status?: string;
}

export interface Budget {
  id?: number;
  category: string;
  budgetAmount: number;
  spentAmount?: number;
  startDate: string;
  endDate: string;
  alertThreshold: number;
}

export interface Debt {
  id?: number;
  debtName: string;
  creditor: string;
  totalAmount: number;
  paidAmount?: number;
  remainingAmount?: number;
  interestRate: number;
  dueDate: string;
  status?: string;
  priority: string;
}