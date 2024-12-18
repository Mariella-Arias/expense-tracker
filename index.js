class App {
  constructor() {
    this.openModal = document.querySelector(".btn-add-expense");
    this.closeModal = document.querySelector(".btn-close-modal");
    this.modal = document.getElementById("form-modal");
    this.newExpenseForm = document.getElementById("new-expense");
    this.total = document.getElementById("running-total");
    this.datePicker = document.getElementById("date-picker");
    this.currentDate = document.getElementById("selected-date");
    this.prevDate = document.getElementById("nav-prev");
    this.nextDay = document.getElementById("nav-fwd");
    this.expenses = [];

    this.openModal.addEventListener("click", this.#handleOpenModal.bind(this));
    this.closeModal.addEventListener(
      "click",
      this.#handleCloseModal.bind(this)
    );
    this.newExpenseForm.addEventListener(
      "submit",
      this.#handleCreateExpense.bind(this)
    );
    this.datePicker.addEventListener(
      "change",
      this.#handleDateChange.bind(this)
    );
    this.prevDate.addEventListener("click", this.#goBackOne.bind(this));
    this.nextDay.addEventListener("click", this.#goForwardOne.bind(this));

    this.#init();
  }

  #handleCreateExpense(e) {
    const form = e.target;
    const formData = new FormData(form).entries();
    const jsonData = Object.fromEntries(formData);
    const { amount, date, category } = jsonData;

    const locale = navigator.language;

    const key = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(date));

    if (date === this.currentDate.value) {
      this.expenses.push({ amount, category });
      localStorage.setItem(key, JSON.stringify(this.expenses));
      this.#refreshContent();
    } else {
      let expensesFromStore = JSON.parse(localStorage.getItem(key));
      expensesFromStore.push({ amount, category });
      localStorage.setItem(key, expensesFromStore);
    }

    form.reset();
  }

  #handleClickOutsideModal(e) {
    if (e.target === this.modal) {
      this.#handleCloseModal();
    }
  }

  #handleOpenModal() {
    const locale = navigator.language;

    const maxYear = new Intl.DateTimeFormat(locale, {
      year: "numeric",
    }).format(new Date());
    const maxMonth = new Intl.DateTimeFormat(locale, {
      month: "numeric",
    }).format(new Date());
    const maxDay = new Intl.DateTimeFormat(locale, {
      day: "numeric",
    }).format(new Date());

    document
      .getElementById("date-input")
      .setAttribute("max", `${maxYear}-${maxMonth}-${maxDay}`);

    document
      .getElementById("date-input")
      .setAttribute("value", this.currentDate.value);

    this.modal.showModal();
    this.modal.addEventListener(
      "click",
      this.#handleClickOutsideModal.bind(this)
    );
  }

  #handleCloseModal() {
    this.newExpenseForm.reset();
    this.modal.removeEventListener("click", this.#handleClickOutsideModal);
    this.modal.close();
  }

  #init() {
    // Get today's date
    const locale = navigator.language;
    const year = new Intl.DateTimeFormat(locale, {
      year: "numeric",
    }).format(new Date());
    const month = new Intl.DateTimeFormat(locale, {
      month: "numeric",
    }).format(new Date());
    const day = new Intl.DateTimeFormat(locale, {
      day: "numeric",
    }).format(new Date());

    this.currentDate.setAttribute("value", `${year}-${month}-${day}`);
    this.currentDate.setAttribute("max", `${year}-${month}-${day}`);

    const key = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(new Date());

    // Set expenses
    this.expenses = JSON.parse(localStorage.getItem(key)) || [];

    this.#refreshContent();
  }

  #handleDateChange(e) {
    const locale = navigator.language;

    let key = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(e.target.value));

    this.expenses = JSON.parse(localStorage.getItem(key)) || [];

    this.#refreshContent();
  }

  #refreshContent() {
    const list = document.getElementById("expense-list");

    let total = 0;

    // Clear any elements that may already be in the list
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    if (this.expenses.length) {
      this.expenses.forEach(({ amount, category }, idx) => {
        total += Number(amount);

        list.insertAdjacentHTML(
          "afterbegin",
          `<li id="expense-${idx}">
             <div class="expense-item">
               <p class="body-text">${
                 category.charAt(0).toUpperCase() + category.slice(1)
               }
               </p>
               <div class="expense-amount">
                 <span>$${Number(amount).toFixed(2)}</span>
                 <button id="expense-options-${idx}" class="btn btn-open-tooltip">
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
            </li>`
        );

        const btnOpenTooltip = document.querySelector(".btn-open-tooltip");
        btnOpenTooltip.addEventListener("click", (e) => {
          this.#openTooltip.call(this, e, idx);
        });
      });
    } else {
      list.insertAdjacentHTML(
        "afterbegin",
        ` <div class="empty-list">
            <span>No expenses on this date</span>
          </div>`
      );
    }

    this.total.textContent = `$${Number(total).toFixed(2)}`;
  }

  #openTooltip(e, id) {
    document.querySelector("body").insertAdjacentHTML(
      "beforeend",
      `<div id="tooltip-${id}" class="tooltip">
          <button class="btn btn-edit">Edit</button>
          <button class="btn btn-delete">Delete</button>
         </div>`
    );

    const tooltip = document.getElementById(`tooltip-${id}`);
    tooltip.style.left = `${e.clientX}px`;
    tooltip.style.top = `${e.clientY}px`;

    const handleOutsideClick = (e) => {
      if (tooltip && !tooltip.contains(e.target)) {
        cleanTooltip();
      }
    };

    const cleanTooltip = () => {
      if (tooltip) tooltip.remove();
      window.removeEventListener("click", handleOutsideClick);
    };

    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    }, 0);

    document
      .getElementById(`tooltip-${id}`)
      .addEventListener("mouseleave", () => {
        cleanTooltip();
      });

    document.getElementById(`tooltip-${id}`).addEventListener("click", (e) => {
      e.stopPropagation();
      cleanTooltip();
    });

    document
      .querySelector(".btn-delete")
      .addEventListener("click", this.#deleteExpense.bind(this, id));

    document
      .querySelector(".btn-edit")
      .addEventListener("click", this.#insertEditableRow.bind(this, id));
  }

  #insertEditableRow(id) {
    const li = document.getElementById(`expense-${id}`);

    li.insertAdjacentHTML(
      "afterbegin",
      `<form id="editable-row" class="form-edit">
         <select name="category" required>
           <option value="" disabled selected hidden>Select</option>
           <option value="essentials">Essentials</option>
           <option value="entertainment">Entertainment</option>
           <option value="payments">Payments</option>
           <option value="wellness">Wellness</option>
           <option value="miscellanous">Miscellanous</option>
         </select>
         <div class="new-expense-amount">
           <span>$</span>
           <input
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

    const editableRow = document.getElementById("editable-row");

    const selectElement = editableRow.querySelector("select");
    selectElement.focus();

    editableRow.addEventListener("submit", (e) => {
      this.#handleExpenseChange.call(this, e, id);
      cleanEditableRow();
    });

    const cleanEditableRow = () => {
      if (editableRow) {
        editableRow.remove();
      }
      window.removeEventListener("click", removeEditableRow);
    };

    const removeEditableRow = (e) => {
      if (editableRow && !editableRow.contains(e.target)) {
        cleanEditableRow();
      }
    };

    window.addEventListener("click", removeEditableRow);

    for (const child of editableRow.childNodes) {
      if (child.tagName === "SELECT") {
        for (const option of child.options) {
          if (option.getAttribute("value") === this.expenses[id].category) {
            option.setAttribute("selected", "");
          }
        }
      }
    }

    const editAmount = document.querySelector(".new-expense-amount");

    for (const child of editAmount.childNodes) {
      if (child.tagName === "INPUT") {
        child.setAttribute(
          "value",
          Number(this.expenses[id].amount).toFixed(2)
        );
      }
    }
  }

  #handleExpenseChange(e, id) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form).entries();
    const jsonData = Object.fromEntries(formData);

    this.expenses[id] = { ...jsonData };

    const locale = navigator.language;

    const key = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(this.currentDate.value));

    localStorage.setItem(key, JSON.stringify(this.expenses));

    this.#refreshContent();
  }

  #deleteExpense(id) {
    this.expenses = this.expenses.filter((_, idx) => idx !== id);

    const locale = navigator.language;

    const key = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(this.currentDate.value));

    localStorage.setItem(key, JSON.stringify(this.expenses));

    this.#refreshContent();
  }

  #goBackOne() {
    let [year, monthIndex, day] = this.currentDate.value.split("-");

    let yesterday = new Date(Number(year), Number(monthIndex) - 1, Number(day));
    yesterday.setDate(yesterday.getDate() - 1);

    const locale = navigator.language;

    const prevYear = new Intl.DateTimeFormat(locale, {
      year: "numeric",
    }).format(new Date(yesterday));
    let prevMonth = new Intl.DateTimeFormat(locale, {
      month: "numeric",
    }).format(new Date(yesterday));
    let prevDay = new Intl.DateTimeFormat(locale, {
      day: "numeric",
    }).format(new Date(yesterday));

    if (prevMonth < 10) {
      prevMonth = "0" + prevMonth;
    }

    if (prevDay < 10) {
      prevDay = "0" + prevDay;
    }

    this.currentDate.setAttribute(
      "value",
      `${prevYear}-${prevMonth}-${prevDay}`
    );

    const key = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(yesterday));

    this.expenses = JSON.parse(localStorage.getItem(key)) || [];

    this.#refreshContent();
  }

  #goForwardOne() {
    const [year, monthIndex, day] = this.currentDate.value.split("-");

    const tomorrow = new Date(
      Number(year),
      Number(monthIndex) - 1,
      Number(day)
    );
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [maxYear, maxMonthIndex, maxDay] = this.currentDate.max.split("-");

    const max = new Date(
      Number(maxYear),
      Number(maxMonthIndex) - 1,
      Number(maxDay)
    );

    if (tomorrow > max) {
      return;
    }

    const locale = navigator.language;
    const nextYear = new Intl.DateTimeFormat(locale, {
      year: "numeric",
    }).format(new Date(tomorrow));
    let nextMonth = new Intl.DateTimeFormat(locale, {
      month: "numeric",
    }).format(new Date(tomorrow));
    let nextDay = new Intl.DateTimeFormat(locale, {
      day: "numeric",
    }).format(new Date(tomorrow));

    if (nextMonth < 10) {
      nextMonth = "0" + nextMonth;
    }

    if (nextDay < 10) {
      nextDay = "0" + nextDay;
    }

    this.currentDate.setAttribute(
      "value",
      `${nextYear}-${nextMonth}-${nextDay}`
    );

    const key = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(tomorrow));

    this.expenses = JSON.parse(localStorage.getItem(key)) || [];

    this.#refreshContent();
  }
}

const app = new App();
