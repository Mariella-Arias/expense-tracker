class ExpensesController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    //Initial render
    this.view.initializeDatePickers(this.#getToday());
    this.#updateList(this.#getToday());

    // Bound View events
    this.view.bindOpenModal(this.#handleOpenModal.bind(this));
    this.view.bindCloseModal(this.#handleCloseModal.bind(this));
    this.view.bindAddExpense(this.#handleAddExpense.bind(this));
    this.view.bindChangeDate(this.#updateList.bind(this));
    this.view.bindPrevDay(this.#updateList.bind(this));
    this.view.bindNextDay(this.#updateList.bind(this));
    this.view.bindFilterButton(this.#handleFilterClick.bind(this));
  }

  static getCalendarDate(date = new Date()) {
    const locale = navigator.language;

    const year = new Intl.DateTimeFormat(locale, {
      year: "numeric",
    }).format(date);
    const month = new Intl.DateTimeFormat(locale, {
      month: "2-digit",
    }).format(date);
    const day = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
    }).format(date);

    return `${year}-${month}-${day}`;
  }

  #getToday() {
    return ExpensesController.getCalendarDate(new Date());
  }

  #handleOpenModal() {
    this.view.openModal();
  }

  #handleCloseModal() {
    this.view.closeModal();
  }

  #handleAddExpense(expense) {
    this.model.addExpense(expense);

    if (this.view.currentDate.value === expense.date) {
      this.#updateList(expense.date);
    }
  }

  #isFilterActive() {
    return Object.values(this.model.filters).reduce(
      (acc, curr) => acc + (curr ? 1 : 0),
      0
    )
      ? true
      : false;
  }

  #handleEditExpense(id) {
    this.view.renderEditableRow(
      this.model.getExpenses()[id],
      this.model.filters,
      this.#editExpense.bind(this)
    );
  }

  #editExpense(id, newValues) {
    this.model.updateExpense(id, newValues);
    this.#updateList(this.view.currentDate.value);
  }

  #handleDeleteExpense(index) {
    this.model.deleteExpense(index);
    this.#updateList(this.view.currentDate.value);
  }

  #handleFilterClick() {
    this.view.renderFilterDropdown(
      this.model.filters,
      this.#handleFilterChange.bind(this),
      this.#clearFilters.bind(this)
    );
  }

  #handleFilterChange(key, checked) {
    this.model.changeFilter(key, checked);

    if (this.#isFilterActive()) {
      this.view.setFilterOn();
    } else {
      this.view.setFilterOff();
    }

    this.#updateList(this.view.currentDate.value);
  }

  #clearFilters() {
    Object.keys(this.model.filters).forEach((filter) =>
      this.model.changeFilter(filter, false)
    );

    this.view.setFilterOff();

    this.#updateList(this.view.currentDate.value);
  }

  #updateList(date) {
    let list;

    if (this.#isFilterActive()) {
      list = this.model
        .getExpensesByDate(date)
        .filter((expense) => this.model.filters[expense.category]);
    } else {
      list = this.model.getExpensesByDate(this.view.currentDate.value);
    }

    this.view.renderExpenses(list, {
      editHandler: this.#handleEditExpense.bind(this),
      deleteHandler: this.#handleDeleteExpense.bind(this),
    });
  }
}

export default ExpensesController;
