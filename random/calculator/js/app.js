class Calculator {
  constructor(previousOutput, currentOutput) {
    this.previousOutput = previousOutput;
    this.currentOutput = currentOutput;
    this.clear();
  }

  clear() {
    this.currentValue = "";
    this.previousValue = "";
    this.operation = undefined;
    this.updateOutput();
  }

  delete() {
    if (this.currentValue === "") {
      this.currentValue = this.previousValue;
      this.previousValue = "";
      this.operation = undefined;
      this.updateOutput();
    } else {
      this.currentValue = this.currentValue.toString().slice(0, -1);
    }
  }

  append(value) {
    if (value === "." && this.currentValue.includes(".")) return;
    this.currentValue = this.currentValue.toString() + value.toString();
  }

  selectOperation(operation) {
    if (this.currentValue === "") return;
    if (this.previousValue !== "") {
      this.calculate();
    }
    this.operation = operation;

    this.previousValue = this.currentValue;
    this.currentValue = "";
  }

  calculate() {
    let result;
    const prev = parseFloat(this.previousValue);
    const cur = parseFloat(this.currentValue);
    if (isNaN(prev) || isNaN(cur)) return;

    console.log(this.operation);

    if (this.operation === "addition") result = prev + cur;
    else if (this.operation === "subtraction") result = prev - cur;
    else if (this.operation === "multiplication") result = prev * cur;
    else if (this.operation === "division") result = prev / cur;
    else return;

    this.currentValue = result;
    this.operation = undefined;
    this.previousValue = "";
  }

  //TODO: Implement formatting?

  formatDisplayedValue(value) {
    const stringValue = value.toString();
    const intPart = parseFloat(stringValue.split(".")[0]);
    const floatPart = stringValue.split(".")[1];
    let intToDisplay;
    if (isNaN(intPart)) {
      intToDisplay = "";
    } else {
      intToDisplay = intPart.toLocaleString("en", { maximumFractionDigits: 0 });
    }
    if (floatPart != null) {
      return `${intToDisplay}.${floatPart}`;
    } else {
      return intToDisplay;
    }
  }

  updateOutput() {
    this.sign = "";
    if (this.operation === "addition") this.sign = " +";
    else if (this.operation === "subtraction") this.sign = " -";
    else if (this.operation === "multiplication") this.sign = " ×";
    else if (this.operation === "division") this.sign = " ÷";
    this.currentOutput.innerText = this.formatDisplayedValue(this.currentValue);
    this.previousOutput.innerText =
      this.formatDisplayedValue(this.previousValue) + this.sign;
  }
}

const numberButtons = document.querySelectorAll("button[data-number]");
const clearButton = document.querySelector("[data-cl]");
const deleteButton = document.querySelector("[data-del");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");

const currentOutput = document.querySelector(".current");
const previousOutput = document.querySelector(".previous");

const calculator = new Calculator(previousOutput, currentOutput);

console.log(currentOutput.innerText);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.append(button.innerText);
    calculator.updateOutput();
  });
});

clearButton.addEventListener("click", () => {
  calculator.clear();
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const currentOperation = button.getAttribute("data-operation");
    calculator.selectOperation(currentOperation);
    calculator.updateOutput();
  });
});

equalsButton.addEventListener("click", () => {
  calculator.calculate();
  calculator.updateOutput();
});

deleteButton.addEventListener("click", () => {
  calculator.delete();
  calculator.updateOutput();
});
