import { useState } from 'react';

type ButtonDef = { label: string; value: string; variant?: 'op' | 'action' | 'equal' | 'number' };

const BUTTONS: ButtonDef[][] = [
  [
    { label: 'AC', value: 'AC', variant: 'action' },
    { label: '+/-', value: 'NEG', variant: 'action' },
    { label: '%', value: '%', variant: 'action' },
    { label: '÷', value: '/', variant: 'op' },
  ],
  [
    { label: '7', value: '7', variant: 'number' },
    { label: '8', value: '8', variant: 'number' },
    { label: '9', value: '9', variant: 'number' },
    { label: '×', value: '*', variant: 'op' },
  ],
  [
    { label: '4', value: '4', variant: 'number' },
    { label: '5', value: '5', variant: 'number' },
    { label: '6', value: '6', variant: 'number' },
    { label: '−', value: '-', variant: 'op' },
  ],
  [
    { label: '1', value: '1', variant: 'number' },
    { label: '2', value: '2', variant: 'number' },
    { label: '3', value: '3', variant: 'number' },
    { label: '+', value: '+', variant: 'op' },
  ],
  [
    { label: '0', value: '0', variant: 'number' },
    { label: '.', value: '.', variant: 'number' },
    { label: '=', value: '=', variant: 'equal' },
  ],
];

const OPS = new Set(['+', '-', '*', '/']);

export function CalculatorPage() {
  const [display, setDisplay] = useState('0');
  const [operand, setOperand] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  function calculate(a: number, op: string, b: number): number {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : NaN;
      default: return b;
    }
  }

  function format(n: number): string {
    if (isNaN(n)) return 'Error';
    if (!isFinite(n)) return 'Error';
    const s = parseFloat(n.toPrecision(12)).toString();
    return s.length > 12 ? parseFloat(n.toPrecision(9)).toString() : s;
  }

  function handleButton(value: string) {
    if (value === 'AC') {
      setDisplay('0');
      setOperand(null);
      setOperator(null);
      setWaitingForOperand(false);
      return;
    }

    if (value === 'NEG') {
      const n = parseFloat(display);
      setDisplay(format(-n));
      return;
    }

    if (value === '%') {
      const n = parseFloat(display);
      setDisplay(format(n / 100));
      return;
    }

    if (OPS.has(value)) {
      if (operator && !waitingForOperand) {
        const result = calculate(parseFloat(operand!), operator, parseFloat(display));
        setDisplay(format(result));
        setOperand(format(result));
      } else {
        setOperand(display);
      }
      setOperator(value);
      setWaitingForOperand(true);
      return;
    }

    if (value === '=') {
      if (operator && operand !== null) {
        const result = calculate(parseFloat(operand), operator, parseFloat(display));
        setDisplay(format(result));
        setOperand(null);
        setOperator(null);
        setWaitingForOperand(false);
      }
      return;
    }

    // Digit or decimal
    if (waitingForOperand) {
      setDisplay(value === '.' ? '0.' : value);
      setWaitingForOperand(false);
      return;
    }

    if (value === '.') {
      if (!display.includes('.')) setDisplay(display + '.');
      return;
    }

    setDisplay(display === '0' ? value : display + value);
  }

  function variantClasses(variant: ButtonDef['variant']): string {
    switch (variant) {
      case 'action': return 'bg-gray-400 hover:bg-gray-300 text-black';
      case 'op': return 'bg-amber-400 hover:bg-amber-300 text-white';
      case 'equal': return 'bg-amber-400 hover:bg-amber-300 text-white col-span-2';
      default: return 'bg-gray-700 hover:bg-gray-600 text-white';
    }
  }

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-black rounded-3xl overflow-hidden shadow-2xl w-72">
        {/* Display */}
        <div className="px-6 pt-8 pb-4 text-right">
          <p className="text-gray-400 text-sm h-5">
            {operator ? `${operand} ${operator === '*' ? '×' : operator === '/' ? '÷' : operator}` : ''}
          </p>
          <p
            className="text-white font-light mt-1 leading-none break-all"
            style={{ fontSize: display.length > 9 ? '2rem' : '3.5rem' }}
          >
            {display}
          </p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-px bg-gray-800 border-t border-gray-800">
          {BUTTONS.map((row, ri) =>
            row.map((btn) => (
              <button
                key={`${ri}-${btn.value}`}
                onClick={() => handleButton(btn.value)}
                className={`${variantClasses(btn.variant)} h-16 text-xl font-medium transition-colors active:opacity-70`}
              >
                {btn.label}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}