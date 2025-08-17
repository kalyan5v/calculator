import React, { useState, useCallback } from 'react';
import { calculateLoan, formatCurrency, formatPercentage } from '../../utils/calculations';
import { LoanCalculation } from '../../types';
import './FinancialTools.css';

const LoanCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    principal: 25000,
    interestRate: 7.5,
    loanTerm: 5,
    loanType: 'personal',
  });

  const [result, setResult] = useState<LoanCalculation | null>(null);

  const handleInputChange = useCallback((field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      [field]: numValue,
    }));
  }, []);

  const calculate = useCallback(() => {
    try {
      const calculation = calculateLoan(
        formData.principal,
        formData.interestRate,
        formData.loanTerm
      );
      setResult(calculation);
    } catch (error) {
      console.error('Calculation error:', error);
    }
  }, [formData]);

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const getLoanTypeInfo = (type: string) => {
    switch (type) {
      case 'personal':
        return { name: 'Personal Loan', icon: '💰', description: 'Unsecured personal loan for various purposes' };
      case 'auto':
        return { name: 'Auto Loan', icon: '🚗', description: 'Secured loan for vehicle purchase' };
      case 'student':
        return { name: 'Student Loan', icon: '🎓', description: 'Loan for educational expenses' };
      default:
        return { name: 'Loan', icon: '💳', description: 'General loan calculator' };
    }
  };

  const loanInfo = getLoanTypeInfo(formData.loanType);

  return (
    <div className="financial-calculator">
      <div className="calculator-header">
        <h2>{loanInfo.icon} {loanInfo.name} Calculator</h2>
        <p>{loanInfo.description}</p>
      </div>

      <div className="calculator-content">
        <div className="input-section">
          <h3>Loan Details</h3>
          
          <div className="input-group">
            <label htmlFor="loanType">Loan Type</label>
            <select
              id="loanType"
              value={formData.loanType}
              onChange={(e) => setFormData(prev => ({ ...prev, loanType: e.target.value }))}
            >
              <option value="personal">Personal Loan</option>
              <option value="auto">Auto Loan</option>
              <option value="student">Student Loan</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="principal">Loan Amount ($)</label>
            <input
              type="number"
              id="principal"
              value={formData.principal}
              onChange={(e) => handleInputChange('principal', e.target.value)}
              placeholder="25,000"
            />
          </div>

          <div className="input-group">
            <label htmlFor="interestRate">Annual Interest Rate (%)</label>
            <input
              type="number"
              id="interestRate"
              value={formData.interestRate}
              onChange={(e) => handleInputChange('interestRate', e.target.value)}
              step="0.1"
              placeholder="7.5"
            />
          </div>

          <div className="input-group">
            <label htmlFor="loanTerm">Loan Term (Years)</label>
            <select
              id="loanTerm"
              value={formData.loanTerm}
              onChange={(e) => handleInputChange('loanTerm', e.target.value)}
            >
              <option value={1}>1 Year</option>
              <option value={2}>2 Years</option>
              <option value={3}>3 Years</option>
              <option value={4}>4 Years</option>
              <option value={5}>5 Years</option>
              <option value={7}>7 Years</option>
              <option value={10}>10 Years</option>
              <option value={15}>15 Years</option>
            </select>
          </div>

          <div className="loan-info">
            <h4>Loan Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Principal:</span>
                <span className="info-value">{formatCurrency(formData.principal)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Interest Rate:</span>
                <span className="info-value">{formatPercentage(formData.interestRate)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Term:</span>
                <span className="info-value">{formData.loanTerm} Years</span>
              </div>
              <div className="info-item">
                <span className="info-label">Total Payments:</span>
                <span className="info-value">{formData.loanTerm * 12}</span>
              </div>
            </div>
          </div>
        </div>

        {result && (
          <div className="results-section">
            <h3>Payment Summary</h3>
            
            <div className="result-cards">
              <div className="result-card primary">
                <div className="result-label">Monthly Payment</div>
                <div className="result-value">{formatCurrency(result.monthlyPayment)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Total Interest</div>
                <div className="result-value">{formatCurrency(result.totalInterest)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Total Payment</div>
                <div className="result-value">{formatCurrency(result.totalPayment)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Interest Rate</div>
                <div className="result-value">{formatPercentage(result.interestRate)}</div>
              </div>
            </div>

            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Principal Amount:</span>
                <span className="stat-value">{formatCurrency(result.principal)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Interest Paid:</span>
                <span className="stat-value">{formatCurrency(result.totalInterest)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Cost:</span>
                <span className="stat-value">{formatCurrency(result.totalPayment)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Interest to Principal Ratio:</span>
                <span className="stat-value">{((result.totalInterest / result.principal) * 100).toFixed(1)}%</span>
              </div>
            </div>

            <div className="payment-breakdown">
              <h4>Payment Breakdown</h4>
              <div className="breakdown-chart">
                <div className="chart-item">
                  <div className="chart-bar principal" style={{ width: '60%' }}>
                    <span>Principal</span>
                  </div>
                  <span className="chart-value">{formatCurrency(result.principal)}</span>
                </div>
                <div className="chart-item">
                  <div className="chart-bar interest" style={{ width: '40%' }}>
                    <span>Interest</span>
                  </div>
                  <span className="chart-value">{formatCurrency(result.totalInterest)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;
