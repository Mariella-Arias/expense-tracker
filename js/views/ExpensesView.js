import ExpensesController from "../controllers/ExpensesController.js";

class ExpensesView {
  constructor() {
    this.modal = document.getElementById("form-modal");
    this.openModalBtn = document.querySelector(".btn-add-expense");
    this.closeModalBtn = document.querySelector(".btn-close-modal");
    this.addExpenseForm = document.getElementById("new-expense");

    this.total = document.getElementById("running-total");

    this.datePicker = document.getElementById("date-picker");
    this.currentDate = document.getElementById("selected-date");
    this.prevDay = document.getElementById("nav-prev");
    this.nextDay = document.getElementById("nav-fwd");

    this.filterButton = document.getElementById("filter-button");

    this.expenseList = document.getElementById("expense-list");

    this.handleClickOutsideModal = this.#handleClickOutsideModal.bind(this);
  }

  renderExpenses(expenses, cb) {
    let total = 0;

    while (this.expenseList.firstChild) {
      this.expenseList.firstChild.remove();
    }

    if (expenses.length) {
      const rows = expenses
        .map(({ amount, category, id }) => {
          total += amount;

          return `<li id="expense-${id}">
                   <div class="expense-item">
                   <p class="body-text">${
                     category.charAt(0).toUpperCase() + category.slice(1)
                   }
                   </p>
                   <div class="expense-amount">
                     <span>$${amount.toFixed(2)}</span>
                     <button id="expense-options-${id}" class="btn btn-open-tooltip" aria-label="Open expense options tooltip">
                     <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke-width="1.5"
                     stroke="currentColor"
                     >
                     <path
                     stroke-linecap="round"
                     stroke-linejoin="round"
                     d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                     />
                     </svg>
                     </button>
                   </div>
                </div>
                <hr />
                </li>
      `;
        })
        .join("");

      this.expenseList.insertAdjacentHTML("afterbegin", rows);

      const optionsButton = document.querySelectorAll(".btn-open-tooltip");

      optionsButton.forEach((button) => {
        const id = parseInt(button.getAttribute("id").split("-")[2]);

        button.addEventListener("click", (e) => this.renderTooltip(e, id, cb));
      });
    } else {
      this.expenseList.insertAdjacentHTML(
        "afterbegin",
        `<div class="empty-list">
          <span>No expenses for the selected criteria</span>
        </div>`
      );
    }

    this.total.textContent = `$${total.toFixed(2)}`;
  }

  renderTooltip(e, index, cb) {
    const prevTooltip = document.querySelector(".tooltip");

    if (prevTooltip) {
      prevTooltip.remove();
    }

    document.querySelector("body").insertAdjacentHTML(
      "afterbegin",
      `<div class="tooltip">
          <button class="btn btn-edit" type="button">Edit</button>
          <button class="btn btn-delete" type="button">Delete</button>
         </div>`
    );

    const tooltip = document.querySelector(".tooltip");
    tooltip.style.left = `${e.pageX}px`;
    tooltip.style.top = `${e.pageY}px`;

    const handleOutsideClick = (e) => {
      if (tooltip && !tooltip.contains(e.target)) {
        cleanTooltip();
      }
    };

    const cleanTooltip = () => {
      if (tooltip) tooltip.remove();
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("touchend", handleOutsideClick);
      listEl.removeEventListener("scroll", cleanTooltip);
      window.removeEventListener("resize", cleanTooltip);
    };

    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
      window.addEventListener("touchend", handleOutsideClick);
    }, 0);

    const listEl = document.getElementById("expense-list");

    listEl.addEventListener("scroll", cleanTooltip);
    window.addEventListener("resize", cleanTooltip);

    tooltip.addEventListener("mouseleave", () => {
      cleanTooltip();
    });

    tooltip.addEventListener("click", (e) => {
      e.stopPropagation();
      cleanTooltip();
    });

    document.querySelector(".btn-delete").addEventListener("click", () => {
      cb.deleteHandler(index);
    });

    document
      .querySelector(".btn-edit")
      .addEventListener("click", () => cb.editHandler(index));
  }

  bindOpenModal(handler) {
    this.openModalBtn.addEventListener("click", handler);
  }

  bindCloseModal(handler) {
    this.closeModalBtn.addEventListener("click", handler);
  }

  bindAddExpense(handler) {
    this.addExpenseForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(this.addExpenseForm);
      const expense = {
        date: formData.get("date"),
        category: formData.get("category"),
        amount: parseFloat(formData.get("amount")),
      };
      handler(expense);

      this.closeModal();
    });
  }

  bindChangeDate(handler) {
    this.datePicker.addEventListener("change", (e) => handler(e.target.value));
  }

  bindPrevDay(handler) {
    this.prevDay.addEventListener("click", () => {
      let [year, monthIndex, day] = this.currentDate.value.split("-");

      let yesterday = new Date(
        parseInt(year),
        parseInt(monthIndex) - 1,
        parseInt(day)
      );
      yesterday.setDate(yesterday.getDate() - 1);

      this.currentDate.value = ExpensesController.getCalendarDate(yesterday);

      handler(this.currentDate.value);
    });
  }

  bindNextDay(handler) {
    this.nextDay.addEventListener("click", () => {
      const [year, monthIndex, day] = this.currentDate.value.split("-");

      const tomorrow = new Date(
        parseInt(year),
        parseInt(monthIndex) - 1,
        parseInt(day)
      );
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [maxYear, maxMonthIndex, maxDay] = this.currentDate.max.split("-");

      const max = new Date(
        parseInt(maxYear),
        parseInt(maxMonthIndex) - 1,
        parseInt(maxDay)
      );

      if (tomorrow > max) {
        return;
      }

      this.currentDate.value = ExpensesController.getCalendarDate(tomorrow);

      handler(this.currentDate.value);
    });
  }

  bindFilterButton(handler) {
    this.filterButton.addEventListener("click", handler);
  }

  renderEditableRow(expense, filters, submitHandler) {
    const li = document.getElementById(`expense-${expense.id}`);

    const options = Object.keys(filters)
      .sort()
      .map(
        (filter) =>
          `<option value="${filter}" ${
            filter === expense.category ? "selected" : ""
          }>${filter.charAt(0).toUpperCase() + filter.slice(1)}</option>`
      )
      .join("");

    li.insertAdjacentHTML(
      "afterbegin",
      `<form id="edit-expense" class="editable-row">
             <select name="category" required>
              ${options}
             </select>
             <div class="new-expense-amount">
               <span>$</span>
               <input
               value="${expense.amount.toFixed(2)}"
                 name="amount"
                 type="number"
                 placeholder="0.00"
                 min="0"
                 step="0.01"
                 required
                />
               <button id="update-expense" type="submit" class="btn btn-update">Save</button>
             </div>
            </form>`
    );

    const editableRow = document.getElementById("edit-expense");

    const selectElement = editableRow.querySelector("select");
    selectElement.focus();

    editableRow.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(e.target);

      const newValues = {
        category: data.get("category"),
        amount: parseFloat(data.get("amount")),
      };

      submitHandler(expense.id, newValues);

      cleanEditableRow();
    });

    const cleanEditableRow = () => {
      if (editableRow) {
        editableRow.remove();
      }
      window.removeEventListener("click", removeEditableRow);
      window.removeEventListener("touchend", removeEditableRow);
    };

    const removeEditableRow = (e) => {
      if (editableRow && !editableRow.contains(e.target)) {
        cleanEditableRow();
      }
    };

    window.addEventListener("click", removeEditableRow);
    window.addEventListener("touchend", removeEditableRow);
  }

  renderFilterDropdown(filters, setFilter, clearFilters) {
    const prevDropdown = document.getElementById("filters");

    if (prevDropdown) {
      prevDropdown.remove();
    } else {
      const filterOptions = Object.keys(filters)
        .sort()
        .map(
          (filter) => `<label for="${filter}">
            <span>${filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
                    <input
                     id="${filter}"
                     name="${filter}"
                     type="checkbox" 
                     class="filter-option"
                     ${filters[filter] ? "checked" : ""}
                    />
                  </label>`
        )
        .join("");

      const dropdown = `
        <form 
         id="filters" 
         class="filter-options">
          ${filterOptions}
          <button 
           id="clear-filters" 
           type="button" 
           class="btn btn-clear"
           aria-label="Clear all filters">
          <span>Clear</span>
          </button> 
        </form>`;

      this.filterButton.insertAdjacentHTML("afterend", dropdown);

      const form = document.getElementById("filters");

      form.addEventListener("change", (e) => {
        setFilter(e.target.name, e.target.checked);
      });

      const cleanDropdown = () => {
        if (form) form.remove();
        window.removeEventListener("click", handleClickOutsideDropdown);
        window.removeEventListener("touchend", handleClickOutsideDropdown);
        window.removeEventListener("resize", cleanDropdown);
      };

      const handleClickOutsideDropdown = (e) => {
        if (!form.contains(e.target)) {
          cleanDropdown();
        }
      };

      setTimeout(() => {
        window.addEventListener("click", handleClickOutsideDropdown);
        window.addEventListener("touchend", handleClickOutsideDropdown);
      }, 0);
      window.addEventListener("resize", cleanDropdown);

      const clear = document.getElementById("clear-filters");

      clear.addEventListener("click", (e) => {
        // e.stopPropagation();
        clearFilters();
        cleanDropdown();
      });
    }
  }

  setFilterOn() {
    this.filterButton.classList.replace("btn-filter", "btn-filter-active");
  }

  setFilterOff() {
    this.filterButton.classList.replace("btn-filter-active", "btn-filter");
  }

  openModal() {
    this.modal.showModal();
    this.modal.setAttribute("aria-hidden", "false");

    document
      .getElementById("date-input")
      .setAttribute("value", this.currentDate.value);

    this.modal.addEventListener("click", this.handleClickOutsideModal);
  }

  closeModal() {
    this.addExpenseForm.reset();
    this.modal.setAttribute("aria-hidden", "true");
    this.modal.removeEventListener("click", this.handleClickOutsideModal);
    this.modal.close();
  }

  #handleClickOutsideModal(e) {
    if (e.target === this.modal) {
      this.closeModal();
    }
  }

  initializeDatePickers(today) {
    this.currentDate.setAttribute("value", today);
    this.currentDate.setAttribute("max", today);

    document.getElementById("date-input").setAttribute("max", today);
  }
}

export default ExpensesView;
