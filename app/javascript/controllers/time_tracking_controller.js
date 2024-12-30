import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["input", "counterDown", "countUp"];

  connect() {
    document.addEventListener("click", this.handleOutsideClick.bind(this));
    this.inputTarget.setAttribute("readonly", true);
    this.inputTarget.disabled = true;
    this.countUpTarget.disabled = true;
    this.counterDownTarget.disabled = true;
  }

  enableEdit(event) {
    const input = this.inputTarget;
    this.inputTarget.disabled = false;
    input.value = this.parseTimeLogged(input.value);
    this.countUpTarget.disabled = false;
    this.counterDownTarget.disabled = false;
    input.type = "number";
    input.removeAttribute("readonly");
    if (!input.dataset.boundBlur) {
      input.dataset.boundBlur = true;
    }
    document.getElementById("log_time_actual").value = this.inputTarget.value;
  }

  disableEdit() {
    if (this.countUpTarget.disabled == false) {
      this.countUpTarget.disabled = true;
      this.counterDownTarget.disabled = true;
      this.inputTarget.type = "text";
      this.inputTarget.setAttribute("readonly", true);
      const formattedValue = this.formatTimeLogged(this.inputTarget.value);
      this.inputTarget.value = formattedValue;
      document.getElementById("log_time_actual").value = this.inputTarget.value;
    }
  }

  adjustTime() {
    const input = this.inputTarget;
    let value = parseFloat(input.value);

    if (isNaN(value) || value < 0) {
      input.value = "0.00";
      return;
    }

    const integerPart = Math.floor(value);
    const decimalPart = value - integerPart;

    if (decimalPart >= 0.59) {
      value = integerPart + 1;
    } else {
      value = integerPart + decimalPart;
    }

    input.value = value.toFixed(2);
  }

  increment() {
    const input = this.inputTarget || document.getElementById("log_time");
    let value = parseFloat(input.value) || 0;
    value += 0.01;
    input.value = value.toFixed(2);
    this.adjustTime();
  }

  decrement() {
    const input = this.inputTarget;
    let value = parseFloat(input.value) || 0;
    value -= 0.01;
    input.value = value.toFixed(2);
    this.decrementAdjustTime();
  }

  decrementAdjustTime() {
    const input = this.inputTarget;
    let value = parseFloat(input.value);

    if (isNaN(value) || value <= 0) {
      input.value = "0.00";
      return;
    }

    const integerPart = Math.floor(value);
    const decimalPart = value - integerPart;

    if (decimalPart <= 0.0 && integerPart > 0) {
      value = integerPart - 1 + 0.59;
    } else {
      value = integerPart + decimalPart;
    }

    input.value = value.toFixed(2);
  }

  handleOutsideClick(event) {
    const input = this.inputTarget;
    if (
      !this.element.contains(event.target) ||
      (event.target.parentElement !== this.countUpTarget &&
        event.target.parentElement !== this.counterDownTarget &&
        event.target !== this.inputTarget &&
        !event.target.parentElement.classList.contains("editButton"))
    ) {
      this.disableEdit();
    }
  }

  parseTimeLogged(timeString) {
    let totalHours = 0;

    const daysMatch = timeString.match(/(\d+)d/);
    const hoursMatch = timeString.match(/(\d+)h/);
    const minutesMatch = timeString.match(/(\d+)m/);
    if (minutesMatch === null && hoursMatch === null && daysMatch === null) {
      console.log("minutesMatch is null");
      return timeString;
    }
    if (daysMatch) {
      totalHours += parseInt(daysMatch[1]) * 24;
    }

    if (hoursMatch) {
      totalHours += parseInt(hoursMatch[1]);
    }

    if (minutesMatch) {
      totalHours += parseInt(minutesMatch[1]) / 100;
    }
    debugger;
    return totalHours.toFixed(2);
  }

  formatTimeLogged(value) {
    const hours = parseFloat(value);
    const days = Math.floor(hours / 24);
    let remainingHours = Math.floor(hours % 24);
    let remainingMinutes = Math.round((hours % 1) * 100);
    if (remainingMinutes > 60) {
      const newminutes = remainingMinutes % 60;
      remainingHours = remainingHours + (remainingMinutes - newminutes) / 60;
      remainingMinutes = newminutes;
    }
    let formattedString = "";

    if (days > 0) {
      formattedString += `${days}d `;
    }

    if (remainingHours > 0 || days === 0) {
      formattedString += `${remainingHours}h `;
    }

    if (remainingMinutes > 0) {
      formattedString += `${remainingMinutes}m`;
    }
    return formattedString.trim();
  }
}
