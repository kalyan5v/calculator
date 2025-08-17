import React, { useState, useCallback } from 'react';
import type { CalculatorState } from '../../types';
import { CALCULATOR_BUTTONS } from '../../constants';
import { performCalculation } from '../../utils/calculations';
import './BasicCalculator.css';

const BasicCalculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    waitingForOperand: false,
  });

  const inputDigit = useCallback((digit: string) => {
    if (state.waitingForOperand) {
      setState(prev => ({
        ...prev,
        display: digit,
        waitingForOperand: false,
      }));
    } else {
      setState(prev => ({
        ...prev,
        display: prev.display === '0' ? digit : prev.display + digit,
      }));
    }
  }, [state.waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (state.waitingForOperand) {
      setState(prev => ({
        ...prev,
        display: '0.',
        waitingForOperand: false,
      }));
    } else if (state.display.indexOf('.') === -1) {
      setState(prev => ({
        ...prev,
        display: prev.display + '.',
      }));
    }
  }, [state.waitingForOperand, state.display]);

  const clear = useCallback(() => {
    setState({
      display: '0',
      previousValue: null,
      operation: null,
      waitingForOperand: false,
    });
  }, []);

  const toggleSign = useCallback(() => {
    setState(prev => ({
      ...prev,
      display: prev.display.charAt(0) === '-' ? prev.display.substr(1) : '-' + prev.display,
    }));
  }, []);

  const inputPercent = useCallback(() => {
    const value = parseFloat(state.display);
    setState(() => ({
      display: String(value / 100),
      previousValue: null,
      operation: null,
      waitingForOperand: false,
    }));
  }, [state.display]);

  const performOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(state.display);

    if (state.previousValue === null) {
      setState(prev => ({
        ...prev,
        previousValue: inputValue,
        operation: nextOperation,
        waitingForOperand: true,
      }));
    } else if (state.operation) {
      const currentValue = state.previousValue || 0;
      const newValue = performCalculation(currentValue, inputValue, state.operation);

      setState(prev => ({
        display: String(newValue),
        previousValue: newValue,
        operation: nextOperation,
        waitingForOperand: true,
      }));
    }
  }, [state.previousValue, state.operation, state.display]);

  const handleClick = useCallback((button: string) => {
    if (button === 'C') {
      clear();
    } else if (button === '±') {
      toggleSign();
    } else if (button === '%') {
      inputPercent();
    } else if (button === '.') {
      inputDecimal();
    } else if (button === '=') {
      if (state.previousValue !== null && state.operation) {
        const inputValue = parseFloat(state.display);
        const newValue = performCalculation(state.previousValue, inputValue, state.operation);
        setState(prev => ({
          display: String(newValue),
          previousValue: null,
          operation: null,
          waitingForOperand: true,
        }));
      }
    } else if (['+', '-', '×', '÷'].includes(button)) {
      performOperation(button);
    } else {
      inputDigit(button);
    }
  }, [clear, toggleSign, inputPercent, inputDecimal, state, performOperation, inputDigit]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const key = event.key;
    if (key >= '0' && key <= '9') {
      inputDigit(key);
    } else if (key === '.') {
      inputDecimal();
    } else if (key === 'Enter' || key === '=') {
      handleClick('=');
    } else if (key === 'Escape') {
      clear();
    } else if (['+', '-', '*', '/'].includes(key)) {
      const operation = key === '*' ? '×' : key === '/' ? '÷' : key;
      performOperation(operation);
    }
  }, [inputDigit, inputDecimal, handleClick, clear, performOperation]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="basic-calculator">
      <div className="calculator-display">
        <div className="display-value">{state.display}</div>
      </div>
      <div className="calculator-buttons">
        {CALCULATOR_BUTTONS.map((row, rowIndex) => (
          <div key={rowIndex} className="button-row">
            {row.map((button, buttonIndex) => (
              <button
                key={buttonIndex}
                className={`calculator-button ${button === '' ? 'empty' : ''} ${
                  ['÷', '×', '-', '+', '='].includes(button) ? 'operator' : ''
                } ${button === 'C' ? 'clear' : ''}`}
                onClick={() => button && handleClick(button)}
                disabled={button === ''}
              >
                {button}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicCalculator;
