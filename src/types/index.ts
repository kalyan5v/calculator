export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: string | null;
  waitingForOperand: boolean;
}

export interface MortgageCalculation {
  principal: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  amortizationSchedule: AmortizationRow[];
}

export interface AmortizationRow {
  paymentNumber: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface LoanCalculation {
  principal: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
}

export interface InvestmentCalculation {
  principal: number;
  monthlyContribution: number;
  interestRate: number;
  years: number;
  futureValue: number;
  totalContributed: number;
  totalInterest: number;
}

export interface SavingsCalculation {
  targetAmount: number;
  currentSavings: number;
  monthlyContribution: number;
  interestRate: number;
  timeToTarget: number;
  totalInterest: number;
}

export type CalculatorType = 'basic' | 'mortgage' | 'loan' | 'investment' | 'savings';

export interface Theme {
  name: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
}
