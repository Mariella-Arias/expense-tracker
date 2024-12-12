class App {
  constructor() {
    this.openModal = document.querySelector(".btn-add");
    this.closeModal = document.querySelector(".btn-close-modal");
    this.modal = document.getElementById("form-modal");
    this.form = document.getElementById("new-expense");
    this.total = document.getElementById("running-total");

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
    this.form.addEventListener("submit", this.#handleSubmit.bind(this));

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

    this.modal.showModal();
    this.modal.addEventListener("click", this.#handleClickOutside.bind(this));
  }

  #handleCloseModal() {
    this.modal.removeEventListener("click", this.#handleClickOutside);
    this.modal.close();
  }

  #init() {
    const dayFormatOptions = {
      weekday: "long",
    };

    const dateFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const locale = navigator.language;
    const currentDay = new Intl.DateTimeFormat(locale, dayFormatOptions).format(
      new Date()
    );
    const currentDate = new Intl.DateTimeFormat(
      locale,
      dateFormatOptions
    ).format(new Date());

    document.getElementById("current-day").textContent = currentDay;
    document.getElementById("current-date").textContent = currentDate;

    const key = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(new Date());

    localStorage.setItem(key, JSON.stringify(this.sampleExpenses));

    this.#setExpenses(key);
  }

  #getExpenses(dateStr) {
    const expenses = JSON.parse(localStorage.getItem(dateStr));

    if (expenses && expenses.length) {
      return expenses;
    } else {
      return [];
    }
  }

  #setExpenses(dateStr) {
    let expenses = this.#getExpenses(dateStr);

    let list = document.getElementById("expense-list");

    let total = 0;
    expenses.forEach(({ amount, category }, idx) => {
      total += amount;

      list.insertAdjacentHTML(
        "afterbegin",
        `<li>
         <div class="expense-item">
           <p class="body-text">${category}</p>
           <div class="expense-amount">
             <span>$${amount.toFixed(2)}</span>
             <button class="btn btn-edit">
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
    });

    this.total.textContent = `$${total.toFixed(2)}`;
  }
}

const app = new App();
