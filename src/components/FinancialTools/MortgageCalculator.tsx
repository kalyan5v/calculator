import React, { useState, useCallback } from 'react';
import { calculateMortgage, formatCurrency, formatPercentage } from '../../utils/calculations';
import { MortgageCalculation } from '../../types';
import './FinancialTools.css';

const MortgageCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    principal: 300000,
    interestRate: 4.5,
    loanTerm: 30,
    propertyTax: 3600,
    insurance: 1200,
  });

  const [result, setResult] = useState<MortgageCalculation | null>(null);

  const handleInputChange = useCallback((field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      [field]: numValue,
    }));
  }, []);

  const calculate = useCallback(() => {
    try {
      const calculation = calculateMortgage(
        formData.principal,
        formData.interestRate,
        formData.loanTerm,
        formData.propertyTax,
        formData.insurance
      );
      setResult(calculation);
    } catch (error) {
      console.error('Calculation error:', error);
    }
  }, [formData]);

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  return (
    <div className="financial-calculator">
      <div className="calculator-header">
        <h2>🏠 Mortgage Calculator</h2>
        <p>Calculate your monthly mortgage payment and see the full breakdown</p>
      </div>

      <div className="calculator-content">
        <div className="input-section">
          <h3>Loan Details</h3>
          <div className="input-group">
            <label htmlFor="principal">Loan Amount ($)</label>
            <input
              type="number"
              id="principal"
              value={formData.principal}
              onChange={(e) => handleInputChange('principal', e.target.value)}
              placeholder="300,000"
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
              placeholder="4.5"
            />
          </div>

          <div className="input-group">
            <label htmlFor="loanTerm">Loan Term (Years)</label>
            <select
              id="loanTerm"
              value={formData.loanTerm}
              onChange={(e) => handleInputChange('loanTerm', e.target.value)}
            >
              <option value={15}>15 Years</option>
              <option value={20}>20 Years</option>
              <option value={30}>30 Years</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="propertyTax">Annual Property Tax ($)</label>
            <input
              type="number"
              id="propertyTax"
              value={formData.propertyTax}
              onChange={(e) => handleInputChange('propertyTax', e.target.value)}
              placeholder="3,600"
            />
          </div>

          <div className="input-group">
            <label htmlFor="insurance">Annual Insurance ($)</label>
            <input
              type="number"
              id="insurance"
              value={formData.insurance}
              onChange={(e) => handleInputChange('insurance', e.target.value)}
              placeholder="1,200"
            />
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
                <div className="result-label">Principal & Interest</div>
                <div className="result-value">
                  {formatCurrency(result.monthlyPayment - (result.totalPayment - result.totalInterest - result.principal) / (result.loanTerm * 12))}
                </div>
              </div>

              <div className="result-card">
                <div className="result-label">Property Tax</div>
                <div className="result-value">{formatCurrency(formData.propertyTax / 12)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Insurance</div>
                <div className="result-value">{formatCurrency(formData.insurance / 12)}</div>
              </div>
            </div>

            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Total Interest:</span>
                <span className="stat-value">{formatCurrency(result.totalInterest)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Payment:</span>
                <span className="stat-value">{formatCurrency(result.totalPayment)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Interest Rate:</span>
                <span className="stat-value">{formatPercentage(result.interestRate)}</span>
              </div>
            </div>

            <div className="amortization-section">
              <h4>Amortization Schedule (First 12 Months)</h4>
              <div className="amortization-table">
                <div className="table-header">
                  <div>Payment #</div>
                  <div>Payment</div>
                  <div>Principal</div>
                  <div>Interest</div>
                  <div>Balance</div>
                </div>
                {result.amortizationSchedule.slice(0, 12).map((row) => (
                  <div key={row.paymentNumber} className="table-row">
                    <div>{row.paymentNumber}</div>
                    <div>{formatCurrency(row.payment)}</div>
                    <div>{formatCurrency(row.principal)}</div>
                    <div>{formatCurrency(row.interest)}</div>
                    <div>{formatCurrency(row.remainingBalance)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MortgageCalculator;
