class App {
  constructor() {
    this.openModal = document.querySelector(".btn-add");
    this.closeModal = document.querySelector(".btn-close-modal");
    this.modal = document.getElementById("form-modal");
    this.newExpenseForm = document.getElementById("new-expense");
    this.total = document.getElementById("running-total");
    this.datePicker = document.getElementById("date-picker");
    this.currentDate = document.getElementById("selected-date");
    this.prevDate = document.getElementById("nav-prev");
    this.nextDay = document.getElementById("nav-fwd");

    this.sampleExpenses = [
      { amount: 150, category: "Food" },
      { amount: 50, category: "Clothes" },
      { amount: 20, category: "Travel" },
      { amount: 15, category: "Food" },
    ];

    this.openModal.addEventListener("click", this.#handleOpenModal.bind(this));
    this.closeModal.addEventListener(
      "click",
      this.#handleCloseModal.bind(this)
    );
    this.newExpenseForm.addEventListener(
      "submit",
      this.#handleSubmit.bind(this)
    );
    this.datePicker.addEventListener("change", this.#updateExpenses.bind(this));
    this.prevDate.addEventListener("click", this.#goBackOne.bind(this));
    this.nextDay.addEventListener("click", this.#goForwardOne.bind(this));

    this.#init();
  }

  #handleSubmit(e) {
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

    let expensesPrev = JSON.parse(localStorage.getItem(key));

    if (expensesPrev) {
      expensesPrev.push({ amount, category });
      localStorage.setItem(key, JSON.stringify(expensesPrev));
    } else {
      localStorage.setItem(key, JSON.stringify([{ amount, category }]));
    }

    if (date === this.currentDate.value) {
      this.#updateExpenses();
    }

    form.reset();
  }

  #handleClickOutside(e) {
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
    this.modal.addEventListener("click", this.#handleClickOutside.bind(this));
  }

  #handleCloseModal() {
    this.newExpenseForm.reset();
    this.modal.removeEventListener("click", this.#handleClickOutside);
    this.modal.close();
  }

  #init() {
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

    // Set today's expenses
    this.#updateExpenses();
  }

  // dateStr: string, 'month/day/fullYear'
  #getExpenses(dateStr) {
    const expenses = JSON.parse(localStorage.getItem(dateStr));

    if (expenses && expenses.length) {
      return expenses;
    } else {
      return [];
    }
  }

  #updateExpenses(e) {
    const locale = navigator.language;
    let key;

    if (e) {
      key = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(e.target.value));
    } else {
      key = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(this.currentDate.value));
    }

    const expenses = this.#getExpenses(key);

    const list = document.getElementById("expense-list");

    let total = 0;

    // Clear any elements that may already be in the list
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    if (expenses.length) {
      expenses.forEach(({ amount, category }, idx) => {
        total += Number(amount);

        list.insertAdjacentHTML(
          "afterbegin",
          `<li id="expense-${idx}">
           <div class="expense-item">
             <p class="body-text">${
               category.charAt(0).toUpperCase() + category.slice(1)
             }</p>
             <div class="expense-amount">
               <span>$${Number(amount).toFixed(2)}</span>
               <button id="expense-options-${idx}" class="btn btn-options">
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

        document
          .querySelector(".btn-options")
          .addEventListener("click", this.#expenseOptions.bind(this, idx));
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

  #expenseOptions(id) {
    const btn = document.getElementById(`expense-options-${id}`);

    btn.insertAdjacentHTML(
      "beforebegin",
      `<div id="tooltip-edit" class="tooltip-edit">
        <button class="btn btn-edit">Edit</button>
        <button class="btn btn-delete">Delete</button>
       </div>`
    );

    document
      .getElementById("tooltip-edit")
      .addEventListener("mouseleave", () =>
        document.getElementById("tooltip-edit").remove()
      );

    const locale = navigator.language;

    const key = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(this.currentDate.value));

    document
      .querySelector(".btn-delete")
      .addEventListener("click", this.#deleteExpense.bind(this, key, id));
  }

  #deleteExpense(key, id) {
    let expenses = JSON.parse(localStorage.getItem(key));

    expenses = expenses.filter((_, idx) => idx !== id);
    localStorage.setItem(key, JSON.stringify(expenses));

    this.#updateExpenses();
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
    this.#updateExpenses();
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

    this.#updateExpenses();
  }
}

const app = new App();
