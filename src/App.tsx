import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BasicCalculator from './components/Calculator/BasicCalculator';
import MortgageCalculator from './components/FinancialTools/MortgageCalculator';
import LoanCalculator from './components/FinancialTools/LoanCalculator';
import InvestmentCalculator from './components/FinancialTools/InvestmentCalculator';
import SavingsCalculator from './components/FinancialTools/SavingsCalculator';
import { CALCULATOR_TYPES } from './constants';
import './App.css';

const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>🧮 Calculator Pro</h1>
        </div>
        <div className="nav-links">
          {CALCULATOR_TYPES.map((calc) => (
            <Link key={calc.id} to={`/${calc.id}`} className="nav-link">
              <span className="nav-icon">{calc.icon}</span>
              <span className="nav-text">{calc.name}</span>
            </Link>
          ))}
        </div>
        <button className="theme-toggle">
          ☀️
        </button>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<BasicCalculator />} />
            <Route path="/basic" element={<BasicCalculator />} />
            <Route path="/mortgage" element={<MortgageCalculator />} />
            <Route path="/loan" element={<LoanCalculator />} />
            <Route path="/investment" element={<InvestmentCalculator />} />
            <Route path="/savings" element={<SavingsCalculator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
