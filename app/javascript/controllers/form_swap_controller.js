import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = [
    "ticketList",
    "detailsSection",
    "formSection",
    "showSection",
    "timeInput",
    "minuteInput",
    "secondInput",
    "dropdown",
    "minuteDropdown",
    "secondDropdown",
    "startButton",
    "resetButton",
    "stopButton",
    "countdown",
    "countup",
    "resumeButton",
    "input",
    "counterDown",
    "countUp",
    "summary",
    "details",
    "input",
    "hideButton",
  ];

  connect() {
    this.loadState();
    this.disableEdit();
    document.addEventListener("click", this.handleOutsideClick.bind(this));
    this.inputTarget.disabled = true;
  }

  saveState(state) {
    localStorage.setItem("currentState", state);
  }

  saveTicketId(ticketId) {
    localStorage.setItem("ticketId", ticketId);
  }

  showForm(event) {
    event.preventDefault();

    this.detailsSectionTarget.style.display = "none";
    this.formSectionTarget.style.display = "block";
    this.showSectionTarget.style.display = "none";
    this.saveState("details");
  }

  toggleDropdown(event) {
    const targetId = event.currentTarget.id;

    if (targetId === "time_input") {
      this.toggleDropdownVisibility(this.dropdownTarget);
    } else if (targetId === "minute_input") {
      this.toggleDropdownVisibility(this.minuteDropdownTarget);
    } else if (targetId === "second_input") {
      this.toggleDropdownVisibility(this.secondDropdownTarget);
    }
  }

  selectTime(event) {
    const value = event.target.getAttribute("data-value");
    if (this.timeInputTarget) {
      this.timeInputTarget.value = value;
    }

    this.closeDropdown();
  }

  selectMinute(event) {
    const value = event.target.getAttribute("data-value");
    if (this.minuteInputTarget) {
      this.minuteInputTarget.value = value;
    }
    this.closeDropdown();
  }

  selectSecond(event) {
    const value = event.target.getAttribute("data-value");
    if (this.secondInputTarget) {
      this.secondInputTarget.value = value;
    }
    this.closeDropdown();
  }

  closeDropdown() {
    this.dropdownTarget.classList.add("hidden");
    this.minuteDropdownTarget.classList.add("hidden");
    this.secondDropdownTarget.classList.add("hidden");
  }

  toggleDropdownVisibility(dropdown) {
    dropdown.classList.toggle("hidden");
  }

  hideFormSubmit() {
    const form = this.formSectionTarget.querySelector("form");
    if (!form) return;

    setTimeout(() => {
      const messageElement = document.getElementById("message");
      if (messageElement && !messageElement.classList.contains("bg-red-500")) {
        form.reset();
        this.formSectionTarget.style.display = "none";
        this.detailsSectionTarget.style.display = "block";
        this.showSectionTarget.style.display = "none";
      }
    }, 300);
  }

  hideForm() {
    const form = this.formSectionTarget.querySelector("form");
    this.formSectionTarget.style.display = "none";
    this.detailsSectionTarget.style.display = "block";
    this.showSectionTarget.style.display = "none";
    if (localStorage.getItem("currentState") === "details") {
      form.reset();
      location.reload();
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.saveState("home");
  }

  clearInterval() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  showTicket(event) {
    event.preventDefault();
    const url = event.currentTarget.getAttribute("href");
    fetch(url, {
      headers: {
        Accept: "text/vnd.turbo-stream.html",
      },
    })
      .then((response) => response.text())
      .then((data) => {
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.showSectionTarget.innerHTML = data;
        this.formSectionTarget.style.display = "none";
        this.detailsSectionTarget.style.display = "none";
        this.showSectionTarget.style.display = "block";
        this.saveState("show");
        this.saveTicketId(url);
        let status = "";
        setTimeout(() => {
          let flag =
            window.getComputedStyle(this.countupTarget).display === "none"
              ? false
              : true;
          status = document.getElementById("timer_status").innerHTML;
          if (status === "start" && flag == true) {
            this.startButtonTarget.disabled = true;
            this.startButtonTarget.classList.add("hidden");
            this.hideButtonTarget.classList.remove("hidden");
            this.minuteInputTarget.disabled = true;
            this.secondInputTarget.disabled = true;
            this.timeInputTarget.disabled = true;
            this.makeUnclickable();
            this.countDown();
          } else if (status === "start" && flag == false) {
            this.startButtonTarget.classList.add("hidden");
            this.minuteInputTarget.disabled = true;
            this.secondInputTarget.disabled = true;
            this.timeInputTarget.disabled = true;
            this.makeUnclickable();
            this.countUp();
          } else if (status === "stop") {
            this.minuteInputTarget.disabled = true;
            this.secondInputTarget.disabled = true;
            this.timeInputTarget.disabled = true;
            this.makeUnclickable();
            this.resumeButtonTarget.classList.remove("hidden");
          } else if (status === "reset_status") {
            this.startButtonTarget.classList.remove("hidden");
          }
        }, 10);
      })
      .catch((error) => {
        1;
        console.error("Error fetching ticket:", error);
      });
  }

  loadState() {
    const state = localStorage.getItem("currentState");

    if (state === "home") {
      this.formSectionTarget.style.display = "none";
      this.detailsSectionTarget.style.display = "block";
      this.showSectionTarget.style.display = "none";
    } else if (state === "show") {
      this.formSectionTarget.style.display = "none";
      this.detailsSectionTarget.style.display = "none";
      this.showSectionTarget.style.display = "block";
      const url = localStorage.getItem("ticketId");
      if (url) {
        this.showTicketFromUrl(url);
      }
    } else {
      this.detailsSectionTarget.style.display = "none";
      this.formSectionTarget.style.display = "block";
      this.showSectionTarget.style.display = "none";
    }
  }

  showTicketFromUrl(url) {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    fetch(url, {
      headers: {
        Accept: "text/vnd.turbo-stream.html",
      },
    })
      .then((response) => response.text())
      .then((data) => {
        this.showSectionTarget.innerHTML = data;
        this.formSectionTarget.style.display = "none";
        this.detailsSectionTarget.style.display = "none";
        this.showSectionTarget.style.display = "block";
        setTimeout(() => {
          let status = document.getElementById("timer_status").innerHTML;
          if (status === "stop") {
            this.minuteInputTarget.disabled = true;
            this.secondInputTarget.disabled = true;
            this.timeInputTarget.disabled = true;
            this.makeUnclickable();
            this.resumeButtonTarget.classList.remove("hidden");
            this.startButtonTarget.classList.add("hidden");
            this.stopButtonTarget.disabled = false;
          } else if (status === "reset_status") {
            this.resumeButtonTarget.classList.add("hidden");
            this.startButtonTarget.classList.remove("hidden");
            this.stopButtonTarget.disabled = true;
          } else if (status === "start") {
            this.minuteInputTarget.disabled = true;
            this.secondInputTarget.disabled = true;
            this.timeInputTarget.disabled = true;
            this.makeUnclickable();
            setTimeout(() => this.startTime(), 10);
          }
        }, 10);
      })
      .catch((error) => {
        console.error("Error fetching ticket:", error);
      });
  }

  startTime(event) {
    if (this.startButtonTarget) this.startButtonTarget.disabled = true;
    if (this.resetButtonTarget) this.resetButtonTarget.disabled = false;
    this.minuteInputTarget.disabled = true;
    this.secondInputTarget.disabled = true;
    this.timeInputTarget.disabled = true;
    this.makeUnclickable();
    let seconds = parseInt(document.getElementById("second_input").value) || 0;
    let minutes = parseInt(document.getElementById("minute_input").value) || 0;
    let hours = parseInt(document.getElementById("time_input").value) || 0;
    let flag =
      window.getComputedStyle(this.countupTarget).display === "none"
        ? false
        : true;

    const timerData = {
      seconds: seconds,
      minutes: minutes,
      hours: hours,
      flag: flag,
    };
    this.startButtonTarget.classList.add("hidden");
    this.stopButtonTarget.disabled = false;
    if (this.timer) {
      clearInterval(this.timer);
    }
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");

    let status = document.getElementById("timer_status").innerHTML;

    this.startButtonTarget.disabled = true;
    this.resumeButtonTarget.classList.add("hidden");
    this.startButtonTarget.classList.add("hidden");

    const url = this.startButtonTarget.getAttribute("data-url");
    fetch(url, {
      method: "PUT",

      headers: {
        Accept: "text/vnd.turbo-stream.html",
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(timerData),
    });
    this.minuteInputTarget.disabled = true;
    this.secondInputTarget.disabled = true;
    this.timeInputTarget.disabled = true;

    if (flag) {
      this.countDown();
    } else {
      this.countUp();
    }
  }

  countDown() {
    let seconds = parseInt(document.getElementById("second_input").value) || 0;
    let minutes = parseInt(document.getElementById("minute_input").value) || 0;
    let hours = parseInt(document.getElementById("time_input").value) || 0;
    this.timer = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          if (hours === 0) {
            clearInterval(this.timer);
            this.timer = null; // Reset the timer variable
            this.resetTime();
            alert("Timer finished!");
            this.startButtonTarget.classList.remove("hidden");
            this.startButtonTarget.disabled = false;
            this.makeClickable();
            this.minuteInputTarget.disabled = false;
            this.secondInputTarget.disabled = false;
            this.timeInputTarget.disabled = false;

            return;
          }
          hours--;
          minutes = 59;
        } else {
          minutes--;
        }
        seconds = 59;
      } else {
        seconds--;
      }

      document.getElementById("second_input").value = seconds
        .toString()
        .padStart(2, "0");
      document.getElementById("minute_input").value = minutes
        .toString()
        .padStart(2, "0");
      document.getElementById("time_input").value = hours
        .toString()
        .padStart(2, "0");
    }, 900);
  }

  countUp() {
    let seconds = parseInt(document.getElementById("second_input").value) || 0;
    let minutes = parseInt(document.getElementById("minute_input").value) || 0;
    let hours = parseInt(document.getElementById("time_input").value) || 0;

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      seconds++;
      if (seconds === 60) {
        seconds = 0;
        minutes++;
        if (minutes === 60) {
          minutes = 0;
          hours++;
        }
      }

      document.getElementById("second_input").value = seconds
        .toString()
        .padStart(2, "0");
      document.getElementById("minute_input").value = minutes
        .toString()
        .padStart(2, "0");
      document.getElementById("time_input").value = hours
        .toString()
        .padStart(2, "0");
    }, 900);
  }

  resumeTime() {
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    let flag =
      window.getComputedStyle(this.countupTarget).display === "none"
        ? false
        : true;
    const timerData = {
      flag: flag,
    };

    const url = this.resumeButtonTarget.getAttribute("data-url");
    fetch(url, {
      method: "PUT",

      headers: {
        Accept: "text/vnd.turbo-stream.html",
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(timerData),
    });
    this.resumeButtonTarget.classList.add("hidden");
    this.minuteInputTarget.disabled = true;
    this.secondInputTarget.disabled = true;
    this.timeInputTarget.disabled = true;
    this.makeUnclickable();
    if (flag) {
      this.countDown();
    } else {
      this.countUp();
    }
  }

  stopTime(event) {
    event.preventDefault();
    let flag =
      window.getComputedStyle(this.countupTarget).display === "none"
        ? false
        : true;
    this.startButtonTarget.classList.add("hidden");
    this.resumeButtonTarget.classList.remove("hidden");
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    const timerData = {
      flag: flag,
    };
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    const url = event.currentTarget.getAttribute("data-url");
    fetch(url, {
      method: "PUT",

      headers: {
        Accept: "text/vnd.turbo-stream.html",
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(timerData),
    });

    this.startButtonTarget.disabled = false;
  }

  resetTime() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.startButtonTarget.classList.remove("hidden");
    // event.preventDefault();
    document.getElementById("time_input").value = "00";
    document.getElementById("minute_input").value = "00";
    document.getElementById("second_input").value = "00";
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    const url = this.resetButtonTarget.getAttribute("data-url");
    fetch(url, {
      method: "PUT",

      headers: {
        Accept: "text/vnd.turbo-stream.html",
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
    });
    this.makeClickable();
    this.minuteInputTarget.disabled = false;
    this.secondInputTarget.disabled = false;
    this.timeInputTarget.disabled = false;

    this.resumeButtonTarget.classList.add("hidden");
    this.stopButtonTarget.disabled = true;
    this.startButtonTarget.classList.remove("hidden");
    this.startButtonTarget.disabled = false;
  }

  toggle(event) {
    event.preventDefault();
    const selectedTimer = event.target.dataset.timer;
    if (selectedTimer === "countdown") {
      this.countdownTarget.classList.add("hidden");
      this.countupTarget.classList.remove("hidden");
    } else if (selectedTimer === "countup") {
      this.countupTarget.classList.add("hidden");
      this.countdownTarget.classList.remove("hidden");
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

    return totalHours.toFixed(2);
  }

  formatTimeLogged(value) {
    const days = Math.floor(value / 24); // Calculate days
    let remainingHours = Math.floor(value % 24); // Calculate hours
    let remainingMinutes = Math.round((value % 1) * 100); // Convert fractional hours to minutes
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

  makeUnclickable() {
    this.countdownTarget.style.pointerEvents = "none";
    this.countupTarget.style.pointerEvents = "none";
  }

  makeClickable() {
    this.countdownTarget.style.pointerEvents = "auto";
    this.countupTarget.style.pointerEvents = "auto";
  }

  enableEdit(event) {
    this.inputTarget.disabled = false;
    const input = this.inputTarget;
    input.value = this.parseTimeLogged(input.value);
    this.countUpTarget.disabled = false;
    this.counterDownTarget.disabled = false;
    input.type = "number";
    input.removeAttribute("readonly");
    if (!input.dataset.boundBlur) {
      input.dataset.boundBlur = true;
    }
  }

  disableEdit(event) {
    if (this.countUpTarget.disabled == false) {
      this.countUpTarget.disabled = true;
      this.counterDownTarget.disabled = true;
      this.inputTarget.type = "text";
      this.inputTarget.setAttribute("readonly", true);
      const formattedValue = this.formatTimeLogged(this.inputTarget.value);
      this.inputTarget.value = formattedValue;
      setTimeout(() => {
        
      }, 1000);
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
}
