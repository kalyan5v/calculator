import React, { useState, useCallback } from 'react';
import { calculateInvestment, formatCurrency, formatPercentage } from '../../utils/calculations';
import { InvestmentCalculation } from '../../types';
import './FinancialTools.css';

const InvestmentCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    principal: 10000,
    monthlyContribution: 500,
    interestRate: 8.0,
    years: 20,
  });

  const [result, setResult] = useState<InvestmentCalculation | null>(null);

  const handleInputChange = useCallback((field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      [field]: numValue,
    }));
  }, []);

  const calculate = useCallback(() => {
    try {
      const calculation = calculateInvestment(
        formData.principal,
        formData.monthlyContribution,
        formData.interestRate,
        formData.years
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
        <h2>📈 Investment Calculator</h2>
        <p>Calculate the future value of your investments with compound interest</p>
      </div>

      <div className="calculator-content">
        <div className="input-section">
          <h3>Investment Details</h3>
          
          <div className="input-group">
            <label htmlFor="principal">Initial Investment ($)</label>
            <input
              type="number"
              id="principal"
              value={formData.principal}
              onChange={(e) => handleInputChange('principal', e.target.value)}
              placeholder="10,000"
            />
          </div>

          <div className="input-group">
            <label htmlFor="monthlyContribution">Monthly Contribution ($)</label>
            <input
              type="number"
              id="monthlyContribution"
              value={formData.monthlyContribution}
              onChange={(e) => handleInputChange('monthlyContribution', e.target.value)}
              placeholder="500"
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
              placeholder="8.0"
            />
          </div>

          <div className="input-group">
            <label htmlFor="years">Investment Period (Years)</label>
            <select
              id="years"
              value={formData.years}
              onChange={(e) => handleInputChange('years', e.target.value)}
            >
              <option value={5}>5 Years</option>
              <option value={10}>10 Years</option>
              <option value={15}>15 Years</option>
              <option value={20}>20 Years</option>
              <option value={25}>25 Years</option>
              <option value={30}>30 Years</option>
              <option value={35}>35 Years</option>
              <option value={40}>40 Years</option>
            </select>
          </div>

          <div className="investment-info">
            <h4>Investment Summary</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Initial Investment:</span>
                <span className="info-value">{formatCurrency(formData.principal)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Monthly Contribution:</span>
                <span className="info-value">{formatCurrency(formData.monthlyContribution)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Annual Interest Rate:</span>
                <span className="info-value">{formatPercentage(formData.interestRate)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Investment Period:</span>
                <span className="info-value">{formData.years} Years</span>
              </div>
            </div>
          </div>
        </div>

        {result && (
          <div className="results-section">
            <h3>Investment Results</h3>
            
            <div className="result-cards">
              <div className="result-card primary">
                <div className="result-label">Future Value</div>
                <div className="result-value">{formatCurrency(result.futureValue)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Total Contributed</div>
                <div className="result-value">{formatCurrency(result.totalContributed)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Total Interest Earned</div>
                <div className="result-value">{formatCurrency(result.totalInterest)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Interest Rate</div>
                <div className="result-value">{formatPercentage(result.interestRate)}</div>
              </div>
            </div>

            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Initial Investment:</span>
                <span className="stat-value">{formatCurrency(result.principal)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Contributions:</span>
                <span className="stat-value">{formatCurrency(result.totalContributed - result.principal)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Interest Earned:</span>
                <span className="stat-value">{formatCurrency(result.totalInterest)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Return on Investment:</span>
                <span className="stat-value">{((result.totalInterest / result.totalContributed) * 100).toFixed(1)}%</span>
              </div>
            </div>

            <div className="investment-breakdown">
              <h4>Investment Breakdown</h4>
              <div className="breakdown-chart">
                <div className="chart-item">
                  <div 
                    className="chart-bar principal" 
                    style={{ 
                      width: `${(result.principal / result.futureValue) * 100}%` 
                    }}
                  >
                    <span>Initial Investment</span>
                  </div>
                  <span className="chart-value">{formatCurrency(result.principal)}</span>
                </div>
                <div className="chart-item">
                  <div 
                    className="chart-bar contributions" 
                    style={{ 
                      width: `${((result.totalContributed - result.principal) / result.futureValue) * 100}%` 
                    }}
                  >
                    <span>Contributions</span>
                  </div>
                  <span className="chart-value">{formatCurrency(result.totalContributed - result.principal)}</span>
                </div>
                <div className="chart-item">
                  <div 
                    className="chart-bar interest" 
                    style={{ 
                      width: `${(result.totalInterest / result.futureValue) * 100}%` 
                    }}
                  >
                    <span>Interest Earned</span>
                  </div>
                  <span className="chart-value">{formatCurrency(result.totalInterest)}</span>
                </div>
              </div>
            </div>

            <div className="projection-table">
              <h4>Yearly Projections</h4>
              <div className="projection-grid">
                {Array.from({ length: Math.min(10, result.years) }, (_, i) => {
                  const year = i + 1;
                  const yearlyCalculation = calculateInvestment(
                    result.principal,
                    result.monthlyContribution,
                    result.interestRate,
                    year
                  );
                  return (
                    <div key={year} className="projection-item">
                      <div className="projection-year">Year {year}</div>
                      <div className="projection-value">{formatCurrency(yearlyCalculation.futureValue)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentCalculator;
