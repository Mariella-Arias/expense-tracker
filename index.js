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
    this.filterButton = document.getElementById("filter-button");
    this.activeFilters = {
      entertainment: false,
      essentials: false,
      miscellaneous: false,
      payments: false,
      wellness: false,
    };

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
    this.filterButton.addEventListener(
      "click",
      this.#toggleFilterDropdown.bind(this)
    );
    this.#init();
  }

  #toggleFilterDropdown(e) {
    const dropdownPrev = document.getElementById("filters");

    if (dropdownPrev) {
      dropdownPrev.remove();
    } else {
      const filterOptions = Object.keys(this.activeFilters)
        .sort()
        .map(
          (filter) => `<label htmlFor="${filter}">
          <span>${filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
                  <input
                   type="checkbox" 
                   name="${filter}"
                   ${this.activeFilters[filter] ? "checked" : ""}
                  />
                </label>`
        )
        .join("");

      const dropdown = `<form id="filters" class="filter-options">${filterOptions}<button id="clear-filters" type="button" class="btn btn-clear"><span>Clear</span></button> 
          </form>`;

      this.filterButton.insertAdjacentHTML("afterend", dropdown);

      const clear = document.getElementById("clear-filters");
      const form = document.getElementById("filters");

      form.addEventListener("change", (e) => {
        this.activeFilters[e.target.name] = e.target.checked;

        const activeFilters = Object.values(this.activeFilters).reduce(
          (acc, curr) => acc + (curr ? 1 : 0),
          0
        );

        if (activeFilters) {
          document
            .getElementById("filter-button")
            .classList.remove("btn-filter");
          document
            .getElementById("filter-button")
            .classList.add("btn-filter-active");
        } else {
          document
            .getElementById("filter-button")
            .classList.remove("btn-filter-active");
          document.getElementById("filter-button").classList.add("btn-filter");
        }
        this.#refreshContent();
      });

      const cleanDropdown = () => {
        if (form) form.remove();
        window.removeEventListener("click", handleOutsideClick);
        window.removeEventListener("resize", cleanDropdown);
      };

      const handleOutsideClick = (e) => {
        if (!form.contains(e.target)) {
          cleanDropdown();
        }
      };

      setTimeout(() => {
        window.addEventListener("click", handleOutsideClick);
      }, 0);

      window.addEventListener("resize", cleanDropdown);

      clear.addEventListener("click", (e) => {
        e.stopPropagation();

        for (const filter in this.activeFilters) {
          this.activeFilters[filter] = false;
        }
        this.#refreshContent();
        cleanDropdown();

        document
          .getElementById("filter-button")
          .classList.remove("btn-filter-active");
        document.getElementById("filter-button").classList.add("btn-filter");
      });
    }
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

    const activeFilters = Object.values(this.activeFilters).reduce(
      (acc, curr) => acc + (curr ? 1 : 0),
      0
    );

    // Clear any elements that may already be in the list
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    if (this.expenses.length) {
      this.expenses.forEach(({ amount, category }, idx) => {
        if (activeFilters) {
          if (this.activeFilters[category]) {
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
          }
        } else {
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
        }
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
      "afterbegin",
      `<div id="tooltip-${id}" class="tooltip">
          <button class="btn btn-edit">Edit</button>
          <button class="btn btn-delete">Delete</button>
         </div>`
    );

    const tooltip = document.getElementById(`tooltip-${id}`);
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
      listEl.removeEventListener("scroll", cleanTooltip);
      window.removeEventListener("resize", cleanTooltip);
    };

    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    }, 0);

    const listEl = document.getElementById("expense-list");

    listEl.addEventListener("scroll", cleanTooltip);
    window.addEventListener("resize", cleanTooltip);

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

    const options = Object.keys(this.activeFilters)
      .sort()
      .map(
        (filter) =>
          `<option value="${filter}" ${
            filter === this.expenses[id].category ? "selected" : ""
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
             value="${Number(this.expenses[id].amount).toFixed(2)}"
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

    this.currentDate.value = `${prevYear}-${prevMonth}-${prevDay}`;

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

    this.currentDate.value = `${nextYear}-${nextMonth}-${nextDay}`;

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
