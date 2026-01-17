class Calculator {
  constructor(previousOperandElement, currentOperandElement) {
    this.previousOperandElement = previousOperandElement;
    this.currentOperandElement = currentOperandElement;
    this.clear();
  }

  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = undefined;
    this.shouldResetScreen = false;
  }

  delete() {
    if (this.currentOperand === "0" || this.currentOperand.length === 1) {
      this.currentOperand = "0";
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
  }

  appendNumber(number) {
    // If we just calculated, reset the screen for new input
    if (this.shouldResetScreen) {
      this.currentOperand = "";
      this.shouldResetScreen = false;
    }

    // Prevent multiple decimal points
    if (number === "." && this.currentOperand.includes(".")) return;

    // Replace initial 0 with new number (unless it's 0.)
    if (this.currentOperand === "0" && number !== ".") {
      this.currentOperand = number;
    } else {
      this.currentOperand += number;
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return;

    // If we have a previous operation, compute it first
    if (this.previousOperand !== "") {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = `${this.currentOperand} ${operation}`;
    this.currentOperand = "";
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    // Check if inputs are valid numbers
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "×":
        computation = prev * current;
        break;
      case "÷":
        if (current === 0) {
          alert("Cannot divide by zero!");
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    // Format the result to avoid floating point issues
    this.currentOperand = this.formatResult(computation);
    this.operation = undefined;
    this.previousOperand = "";
    this.shouldResetScreen = true;
  }

  formatResult(result) {
    // If result is an integer, don't show decimal places
    if (result % 1 === 0) {
      return result.toString();
    }

    // Otherwise, limit to 10 decimal places
    return parseFloat(result.toFixed(10)).toString();
  }

  updateDisplay() {
    this.currentOperandElement.innerText = this.currentOperand;
    this.previousOperandElement.innerText = this.previousOperand;
  }
}

// DOM Elements
const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.getElementById("equals");
const clearAllButton = document.getElementById("clear-all");
const deleteButton = document.getElementById("delete");
const previousOperandElement = document.getElementById("previous-operand");
const currentOperandElement = document.getElementById("current-operand");

// Create calculator instance
const calculator = new Calculator(
  previousOperandElement,
  currentOperandElement,
);

// Event Listeners
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", () => {
  calculator.compute();
  calculator.updateDisplay();
});

clearAllButton.addEventListener("click", () => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", () => {
  calculator.delete();
  calculator.updateDisplay();
});

// Keyboard support
document.addEventListener("keydown", (event) => {
  // Prevent default behavior for calculator keys
  if (
    event.key.match(/[0-9\.]/) ||
    event.key === "+" ||
    event.key === "-" ||
    event.key === "*" ||
    event.key === "/" ||
    event.key === "Enter" ||
    event.key === "Escape" ||
    event.key === "Backspace"
  ) {
    event.preventDefault();
  }

  // Map keyboard keys to calculator functions
  if (event.key >= "0" && event.key <= "9") {
    calculator.appendNumber(event.key);
    calculator.updateDisplay();
  }

  if (event.key === ".") {
    calculator.appendNumber(".");
    calculator.updateDisplay();
  }

  if (event.key === "+") {
    calculator.chooseOperation("+");
    calculator.updateDisplay();
  }

  if (event.key === "-") {
    calculator.chooseOperation("-");
    calculator.updateDisplay();
  }

  if (event.key === "*") {
    calculator.chooseOperation("×");
    calculator.updateDisplay();
  }

  if (event.key === "/") {
    calculator.chooseOperation("÷");
    calculator.updateDisplay();
  }

  if (event.key === "Enter" || event.key === "=") {
    calculator.compute();
    calculator.updateDisplay();
  }

  if (event.key === "Escape") {
    calculator.clear();
    calculator.updateDisplay();
  }

  if (event.key === "Backspace") {
    calculator.delete();
    calculator.updateDisplay();
  }
});

// Add click animation feedback
document.querySelectorAll(".calculator-btn").forEach((button) => {
  button.addEventListener("mousedown", function () {
    this.style.transform = "translateY(1px)";
  });

  button.addEventListener("mouseup", function () {
    this.style.transform = "";
  });

  button.addEventListener("mouseleave", function () {
    this.style.transform = "";
  });
});
