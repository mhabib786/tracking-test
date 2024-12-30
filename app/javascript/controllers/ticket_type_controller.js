import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["menu", "button", "selected", "hiddenField"];

  connect() {
    this.menuTarget.classList.add("hidden");
  }

  toggleMenu() {
    this.menuTarget.classList.toggle("hidden");
  }

  selectOption(event) {
    event.preventDefault();
    const option = event.currentTarget;
    const ticketType = option.dataset.ticketType;
    const iconColor = option.dataset.icon;

    this.selectedTarget.innerHTML = `<i class="fas fa-circle text-${iconColor} mr-2"></i>${
      ticketType.charAt(0).toUpperCase() + ticketType.slice(1)
    }`;

    this.hiddenFieldTarget.value = ticketType;

    this.menuTarget.classList.add("hidden");
  }
}
