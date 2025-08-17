import { 
  MortgageCalculation, 
  LoanCalculation, 
  InvestmentCalculation, 
  SavingsCalculation,
  AmortizationRow 
} from '../types';
import { MONTHS_IN_YEAR } from '../constants';

// Basic calculator operations
export const performCalculation = (a: number, b: number, operation: string): number => {
  switch (operation) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '×':
    case '*':
      return a * b;
    case '÷':
    case '/':
      if (b === 0) throw new Error('Division by zero');
      return a / b;
    case '%':
      return (a * b) / 100;
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
};

// Mortgage calculations
export const calculateMortgage = (
  principal: number,
  annualInterestRate: number,
  loanTermYears: number,
  propertyTax: number = 0,
  insurance: number = 0
): MortgageCalculation => {
  const monthlyInterestRate = annualInterestRate / 100 / MONTHS_IN_YEAR;
  const totalPayments = loanTermYears * MONTHS_IN_YEAR;
  
  // Monthly payment formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
  const monthlyPayment = principal * 
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) /
    (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
  
  const totalPayment = monthlyPayment * totalPayments;
  const totalInterest = totalPayment - principal;
  
  // Generate amortization schedule
  const amortizationSchedule: AmortizationRow[] = [];
  let remainingBalance = principal;
  
  for (let paymentNumber = 1; paymentNumber <= totalPayments; paymentNumber++) {
    const interest = remainingBalance * monthlyInterestRate;
    const principalPayment = monthlyPayment - interest;
    remainingBalance -= principalPayment;
    
    amortizationSchedule.push({
      paymentNumber,
      payment: monthlyPayment,
      principal: principalPayment,
      interest,
      remainingBalance: Math.max(0, remainingBalance),
    });
  }
  
  return {
    principal,
    interestRate: annualInterestRate,
    loanTerm: loanTermYears,
    monthlyPayment: monthlyPayment + (propertyTax + insurance) / MONTHS_IN_YEAR,
    totalInterest,
    totalPayment: totalPayment + propertyTax + insurance,
    amortizationSchedule,
  };
};

// Loan calculations (similar to mortgage but for other types of loans)
export const calculateLoan = (
  principal: number,
  annualInterestRate: number,
  loanTermYears: number
): LoanCalculation => {
  const monthlyInterestRate = annualInterestRate / 100 / MONTHS_IN_YEAR;
  const totalPayments = loanTermYears * MONTHS_IN_YEAR;
  
  const monthlyPayment = principal * 
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) /
    (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
  
  const totalPayment = monthlyPayment * totalPayments;
  const totalInterest = totalPayment - principal;
  
  return {
    principal,
    interestRate: annualInterestRate,
    loanTerm: loanTermYears,
    monthlyPayment,
    totalInterest,
    totalPayment,
  };
};

// Investment calculations (compound interest with regular contributions)
export const calculateInvestment = (
  principal: number,
  monthlyContribution: number,
  annualInterestRate: number,
  years: number
): InvestmentCalculation => {
  const monthlyInterestRate = annualInterestRate / 100 / MONTHS_IN_YEAR;
  const totalMonths = years * MONTHS_IN_YEAR;
  
  // Future value of initial principal
  const futureValueOfPrincipal = principal * Math.pow(1 + monthlyInterestRate, totalMonths);
  
  // Future value of monthly contributions
  const futureValueOfContributions = monthlyContribution * 
    ((Math.pow(1 + monthlyInterestRate, totalMonths) - 1) / monthlyInterestRate);
  
  const futureValue = futureValueOfPrincipal + futureValueOfContributions;
  const totalContributed = principal + (monthlyContribution * totalMonths);
  const totalInterest = futureValue - totalContributed;
  
  return {
    principal,
    monthlyContribution,
    interestRate: annualInterestRate,
    years,
    futureValue,
    totalContributed,
    totalInterest,
  };
};

// Savings goal calculator
export const calculateSavingsGoal = (
  targetAmount: number,
  currentSavings: number,
  monthlyContribution: number,
  annualInterestRate: number
): SavingsCalculation => {
  const monthlyInterestRate = annualInterestRate / 100 / MONTHS_IN_YEAR;
  const remainingAmount = targetAmount - currentSavings;
  
  if (monthlyContribution === 0) {
    // Calculate time needed with only current savings
    const timeToTarget = Math.log(targetAmount / currentSavings) / Math.log(1 + monthlyInterestRate);
    return {
      targetAmount,
      currentSavings,
      monthlyContribution,
      interestRate: annualInterestRate,
      timeToTarget: timeToTarget / MONTHS_IN_YEAR,
      totalInterest: targetAmount - currentSavings,
    };
  }
  
  // Calculate time needed with monthly contributions
  const timeToTarget = Math.log(
    (monthlyContribution + remainingAmount * monthlyInterestRate) /
    (monthlyContribution + currentSavings * monthlyInterestRate)
  ) / Math.log(1 + monthlyInterestRate);
  
  const totalMonths = timeToTarget;
  const totalContributed = currentSavings + (monthlyContribution * totalMonths);
  const totalInterest = targetAmount - totalContributed;
  
  return {
    targetAmount,
    currentSavings,
    monthlyContribution,
    interestRate: annualInterestRate,
    timeToTarget: totalMonths / MONTHS_IN_YEAR,
    totalInterest,
  };
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

// Format number with commas
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};
