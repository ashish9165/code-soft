// Calculator State
let display = '0';
let previousValue = null;
let operation = null;
let waitingForNewValue = false;

// DOM Elements
const displayElement = document.getElementById('display');
const clearButton = document.getElementById('clear');
const equalsButton = document.getElementById('equals');

// Update display function
function updateDisplay() {
    displayElement.textContent = display;
}

// Handle number button clicks
function handleNumber(value) {
    if (waitingForNewValue) {
        display = value;
        waitingForNewValue = false;
    } else {
        display = display === '0' ? value : display + value;
    }
    updateDisplay();
}

// Handle operator button clicks
function handleOperator(op) {
    const currentValue = parseFloat(display);
    
    if (previousValue === null) {
        previousValue = currentValue;
    } else if (operation) {
        // Calculate previous operation
        const result = calculate(previousValue, currentValue, operation);
        display = String(result);
        previousValue = result;
        waitingForNewValue = true;
        
        // Add pulse animation to result
        displayElement.classList.add('result');
        setTimeout(() => {
            displayElement.classList.remove('result');
        }, 300);
    }
    
    operation = op;
    waitingForNewValue = true;
    updateDisplay();
}

// Calculate function using switch-case
function calculate(firstValue, secondValue, operator) {
    switch (operator) {
        case '+':
            return firstValue + secondValue;
        case '-':
            return firstValue - secondValue;
        case '×':
            return firstValue * secondValue;
        case '/':
            if (secondValue === 0) {
                alert('Error: Division by zero');
                return 0;
            }
            return firstValue / secondValue;
        default:
            return secondValue;
    }
}

// Handle equals button
function handleEquals() {
    if (operation && previousValue !== null && !waitingForNewValue) {
        const currentValue = parseFloat(display);
        const result = calculate(previousValue, currentValue, operation);
        display = formatResult(result);
        previousValue = null;
        operation = null;
        waitingForNewValue = true;
        updateDisplay();
        
        // Add pulse animation to result
        displayElement.classList.add('result');
        setTimeout(() => {
            displayElement.classList.remove('result');
        }, 300);
    }
}

// Handle clear button
function handleClear() {
    display = '0';
    previousValue = null;
    operation = null;
    waitingForNewValue = false;
    updateDisplay();
}

// Format result to avoid unnecessary decimals
function formatResult(value) {
    // Check if the result is a whole number
    if (value % 1 === 0) {
        return String(value);
    }
    // Otherwise, round to 8 decimal places and remove trailing zeros
    return String(parseFloat(value.toFixed(8)));
}

// Handle decimal point
function handleDecimal() {
    if (waitingForNewValue) {
        display = '0.';
        waitingForNewValue = false;
    } else if (display.indexOf('.') === -1) {
        display += '.';
    }
    updateDisplay();
}

// Event listeners for all buttons using loops
function initializeCalculator() {
    // Get all buttons
    const buttons = document.querySelectorAll('.btn');
    
    // Use loop to add event listeners to all buttons
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            
            if (value === null) {
                // Handle special buttons without data-value
                if (button.id === 'clear') {
                    handleClear();
                } else if (button.id === 'equals') {
                    handleEquals();
                }
            } else {
                // Handle different types of buttons using if-else
                if (button.classList.contains('number')) {
                    if (value === '.') {
                        handleDecimal();
                    } else {
                        handleNumber(value);
                    }
                } else if (button.classList.contains('operator')) {
                    handleOperator(value);
                }
            }
        });
    });
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', initializeCalculator);

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        handleNumber(key);
    } else if (key === '.') {
        handleDecimal();
    } else if (key === '+' || key === '-') {
        handleOperator(key);
    } else if (key === '*') {
        handleOperator('×');
    } else if (key === '/') {
        event.preventDefault(); // Prevent browser search
        handleOperator('/');
    } else if (key === 'Enter' || key === '=') {
        handleEquals();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleClear();
    }
});

// Initial display update
updateDisplay();


