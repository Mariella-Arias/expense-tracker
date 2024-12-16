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
    this.expenses = [];

    this.openModal.addEventListener("click", this.#handleOpenModal.bind(this));
    this.closeModal.addEventListener(
      "click",
      this.#handleCloseModal.bind(this)
    );
    this.newExpenseForm.addEventListener(
      "submit",
      this.#handleSubmit.bind(this)
    );
    this.datePicker.addEventListener(
      "change",
      this.#handleDateChange.bind(this)
    );
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
      this.#refreshContent();
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
      timeZone: "UTC",
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
    this.expenses = this.expenses.filter((_, idx) => idx !== id);
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

    // console.log("New date: ", `${prevYear}-${prevMonth}-${prevDay}`);
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
