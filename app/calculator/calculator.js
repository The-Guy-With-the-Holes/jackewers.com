const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    history: ''
};

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    calculator.history = '';
}

function updateDisplay() {
    const display = document.querySelector('.calculator-display');
    if (display) {
        display.textContent = calculator.displayValue;
    }
}

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;
    
    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
    } else if (calculator.displayValue.indexOf(dot) === -1) {
        calculator.displayValue += dot;
    }
}

function clear() {
    calculator.displayValue = '0';
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);
    
    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const currentValue = firstOperand || 0;
        const result = calculate(currentValue, inputValue, operator);
        
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
    }
    
    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

function calculate(firstOperand, secondOperand, operator) {
    switch (operator) {
        case '+':
            return firstOperand + secondOperand;
        case '-':
            return firstOperand - secondOperand;
        case '*':
            return firstOperand * secondOperand;
        case '/':
            return firstOperand / secondOperand;
        case '=':
            return secondOperand;
        default:
            return secondOperand;
    }
}

function toggleEmbeddedMode() {
    const body = document.body;
    body.classList.toggle('embedded');
}

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
    } else if (calculator.displayValue.indexOf(dot) === -1) {
        calculator.displayValue += dot;
    }
}

function clear() {
    calculator.displayValue = '0';
}

function performCalculation(rightOperand, leftOperand, operator) {
    switch (operator) {
        case '+':
            return leftOperand + rightOperand;
        case '-':
            return leftOperand - rightOperand;
        case '*':
            return leftOperand * rightOperand;
        case '/':
            return leftOperand / rightOperand;
        case '=':
            return rightOperand;
        default:
            return rightOperand;
    }
}

function calculate(firstOperand, secondOperand, operator) {
    return performCalculation(parseFloat(secondOperand), parseFloat(firstOperand), operator);
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const currentValue = firstOperand || 0;
        const result = calculate(currentValue, displayValue, operator);

        calculator.displayValue = String(result);
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

// Toggle functionality for embedded mode
function toggleEmbeddedMode() {
    const body = document.body;
    body.classList.toggle('embedded');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();

    const keys = document.querySelector('.calculator-keypad');
    if (keys) {
        keys.addEventListener('click', (event) => {
            const { target } = event;
            if (!target.matches('button') && !target.matches('.key')) {
                return;
            }

            const value = target.textContent;
            const dataKey = target.dataset.key;

            // Handle operators
            if (target.classList.contains('operator-key')) {
                let operator = dataKey;
                if (value === '÷') operator = '/';
                if (value === '×') operator = '*';
                if (value === '−') operator = '-';
                
                handleOperator(operator);
                updateDisplay();
                return;
            }

            // Handle decimal point
            if (value === '.') {
                inputDecimal('.');
                updateDisplay();
                return;
            }

            // Handle all clear
            if (target.classList.contains('all-clear') || dataKey === 'clear') {
                resetCalculator();
                updateDisplay();
                return;
            }

            // Handle backspace/delete
            if (dataKey === 'delete') {
                clear();
                updateDisplay();
                return;
            }

            // Handle equals
            if (target.classList.contains('equals-key') || value === '=') {
                handleOperator('=');
                updateDisplay();
                return;
            }

            // Handle numbers
            if (target.classList.contains('number-key') && !isNaN(parseInt(value))) {
                inputDigit(value);
                updateDisplay();
            }
        });
    }

    // Toggle button functionality (if it exists)
    const toggleBtn = document.querySelector('.toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleEmbeddedMode);
    }

    // Keyboard support
    document.addEventListener('keydown', (event) => {
        const { key } = event;

        if (key >= '0' && key <= '9') {
            inputDigit(key);
            updateDisplay();
        } else if (key === '.') {
            inputDecimal(key);
            updateDisplay();
        } else if (key === '=' || key === 'Enter') {
            handleOperator('=');
            updateDisplay();
        } else if (key === 'Escape') {
            resetCalculator();
            updateDisplay();
        } else if (key === 'Backspace') {
            clear();
            updateDisplay();
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            handleOperator(key);
            updateDisplay();
        }
    });
});