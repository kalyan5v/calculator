import React, { useState, useCallback } from 'react';
import { calculateSavingsGoal, formatCurrency, formatPercentage } from '../../utils/calculations';
import { SavingsCalculation } from '../../types';
import './FinancialTools.css';

const SavingsCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    targetAmount: 50000,
    currentSavings: 10000,
    monthlyContribution: 500,
    interestRate: 4.0,
  });

  const [result, setResult] = useState<SavingsCalculation | null>(null);

  const handleInputChange = useCallback((field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      [field]: numValue,
    }));
  }, []);

  const calculate = useCallback(() => {
    try {
      const calculation = calculateSavingsGoal(
        formData.targetAmount,
        formData.currentSavings,
        formData.monthlyContribution,
        formData.interestRate
      );
      setResult(calculation);
    } catch (error) {
      console.error('Calculation error:', error);
    }
  }, [formData]);

  React.useEffect(() => {
    calculate();
  }, [calculate]);

  const formatTime = (years: number) => {
    const fullYears = Math.floor(years);
    const months = Math.round((years - fullYears) * 12);
    
    if (fullYears === 0) {
      return `${months} months`;
    } else if (months === 0) {
      return `${fullYears} years`;
    } else {
      return `${fullYears} years, ${months} months`;
    }
  };

  return (
    <div className="financial-calculator">
      <div className="calculator-header">
        <h2>💎 Savings Goal Calculator</h2>
        <p>Plan your savings journey and reach your financial goals</p>
      </div>

      <div className="calculator-content">
        <div className="input-section">
          <h3>Savings Goal</h3>
          
          <div className="input-group">
            <label htmlFor="targetAmount">Target Amount ($)</label>
            <input
              type="number"
              id="targetAmount"
              value={formData.targetAmount}
              onChange={(e) => handleInputChange('targetAmount', e.target.value)}
              placeholder="50,000"
            />
          </div>

          <div className="input-group">
            <label htmlFor="currentSavings">Current Savings ($)</label>
            <input
              type="number"
              id="currentSavings"
              value={formData.currentSavings}
              onChange={(e) => handleInputChange('currentSavings', e.target.value)}
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
              placeholder="4.0"
            />
          </div>

          <div className="savings-info">
            <h4>Goal Summary</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Target Amount:</span>
                <span className="info-value">{formatCurrency(formData.targetAmount)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Current Savings:</span>
                <span className="info-value">{formatCurrency(formData.currentSavings)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Remaining Amount:</span>
                <span className="info-value">{formatCurrency(formData.targetAmount - formData.currentSavings)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Monthly Contribution:</span>
                <span className="info-value">{formatCurrency(formData.monthlyContribution)}</span>
              </div>
            </div>
          </div>
        </div>

        {result && (
          <div className="results-section">
            <h3>Savings Plan</h3>
            
            <div className="result-cards">
              <div className="result-card primary">
                <div className="result-label">Time to Goal</div>
                <div className="result-value">{formatTime(result.timeToTarget)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Total Interest Earned</div>
                <div className="result-value">{formatCurrency(result.totalInterest)}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Total Contributions</div>
                <div className="result-value">{formatCurrency(result.currentSavings + (result.monthlyContribution * result.timeToTarget * 12))}</div>
              </div>

              <div className="result-card">
                <div className="result-label">Interest Rate</div>
                <div className="result-value">{formatPercentage(result.interestRate)}</div>
              </div>
            </div>

            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Target Amount:</span>
                <span className="stat-value">{formatCurrency(result.targetAmount)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Current Savings:</span>
                <span className="stat-value">{formatCurrency(result.currentSavings)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Monthly Contribution:</span>
                <span className="stat-value">{formatCurrency(result.monthlyContribution)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Time to Goal:</span>
                <span className="stat-value">{formatTime(result.timeToTarget)}</span>
              </div>
            </div>

            <div className="savings-progress">
              <h4>Progress to Goal</h4>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${(result.currentSavings / result.targetAmount) * 100}%` 
                  }}
                >
                  <span className="progress-text">
                    {((result.currentSavings / result.targetAmount) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="progress-labels">
                <span>Current: {formatCurrency(result.currentSavings)}</span>
                <span>Target: {formatCurrency(result.targetAmount)}</span>
              </div>
            </div>

            <div className="monthly-breakdown">
              <h4>Monthly Breakdown</h4>
              <div className="breakdown-chart">
                <div className="chart-item">
                  <div 
                    className="chart-bar current" 
                    style={{ 
                      width: `${(result.currentSavings / result.targetAmount) * 100}%` 
                    }}
                  >
                    <span>Current Savings</span>
                  </div>
                  <span className="chart-value">{formatCurrency(result.currentSavings)}</span>
                </div>
                <div className="chart-item">
                  <div 
                    className="chart-bar contributions" 
                    style={{ 
                      width: `${((result.monthlyContribution * result.timeToTarget * 12) / result.targetAmount) * 100}%` 
                    }}
                  >
                    <span>Future Contributions</span>
                  </div>
                  <span className="chart-value">{formatCurrency(result.monthlyContribution * result.timeToTarget * 12)}</span>
                </div>
                <div className="chart-item">
                  <div 
                    className="chart-bar interest" 
                    style={{ 
                      width: `${(result.totalInterest / result.targetAmount) * 100}%` 
                    }}
                  >
                    <span>Interest Earned</span>
                  </div>
                  <span className="chart-value">{formatCurrency(result.totalInterest)}</span>
                </div>
              </div>
            </div>

            {result.timeToTarget > 0 && (
              <div className="savings-tips">
                <h4>💡 Savings Tips</h4>
                <ul className="tips-list">
                  <li>Set up automatic transfers to make saving effortless</li>
                  <li>Consider increasing your monthly contribution to reach your goal faster</li>
                  <li>Look for high-yield savings accounts to maximize interest earned</li>
                  <li>Review your budget regularly to find additional savings opportunities</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsCalculator;
