class ExpenseController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    //Initial render
    this.view.renderExpenses(this.model.getExpensesByDate(this.getToday()), {
      handleEdit: this.handleEditClick.bind(this),
      delete: this.handleDeleteExpense.bind(this),
    });
    this.view.initializeDatePickers(this.getToday());

    // Bound View events
    this.view.bindOpenModal(this.#handleOpenModal.bind(this));
    this.view.bindCloseModal(this.#handleCloseModal.bind(this));
    this.view.bindAddExpense(this.#handleAddExpense.bind(this));
    this.view.bindChangeDate(this.#handleDateChange.bind(this));
    this.view.bindPrevDay(this.#handleDateChange.bind(this));
    this.view.bindNextDay(this.#handleDateChange.bind(this));
    this.view.bindFilterButton(this.handleFilterClick.bind(this));
  }

  #getCalendarDate(date = new Date()) {
    const locale = navigator.language;

    const year = new Intl.DateTimeFormat(locale, {
      year: "numeric",
    }).format(date);
    const month = new Intl.DateTimeFormat(locale, {
      month: "numeric",
    }).format(date);
    const day = new Intl.DateTimeFormat(locale, {
      day: "numeric",
    }).format(date);

    return `${year}-${month}-${day}`;
  }

  getToday() {
    return this.#getCalendarDate(new Date());
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
      this.updateList(expense.date);
    }
  }

  #isFilterActive() {
    return Object.values(this.model.activeFilters).reduce(
      (acc, curr) => acc + (curr ? 1 : 0),
      0
    )
      ? true
      : false;
  }

  #handleDateChange(date) {
    let list;

    if (this.#isFilterActive()) {
      list = this.model
        .getExpensesByDate(date)
        .filter((expense) => this.model.activeFilters[expense.category]);
    } else {
      list = this.model.getExpensesByDate(date);
    }

    this.view.renderExpenses(list, {
      handleEdit: this.handleEditClick.bind(this),
      delete: this.handleDeleteExpense.bind(this),
    });
  }

  handleEditClick(id) {
    console.log("handle edit");
    this.view.renderEditableRow(
      this.model.getExpenses()[id],
      this.model.activeFilters,
      this.editExpense.bind(this)
    );
  }

  editExpense(id, newValues) {
    this.model.updateExpense(id, newValues);
    this.view.renderExpenses(
      this.model.getExpensesByDate(this.view.currentDate.value)
    );
  }

  handleDeleteExpense(index) {
    this.model.deleteExpense(index);

    this.view.renderExpenses(
      this.model.getExpensesByDate(this.view.currentDate.value),
      {
        handleEdit: this.handleEditClick.bind(this),
        delete: this.handleDeleteExpense.bind(this),
      }
    );
  }

  handleFilterClick() {
    this.view.renderFilterDropdown(
      this.model.activeFilters,
      this.handleFilterChange.bind(this),
      this.clearFilters.bind(this)
    );
  }

  handleFilterChange(key, checked) {
    this.model.changeSelectedFilter(key, checked);

    if (this.#isFilterActive()) {
      this.view.setFilterOn();
    } else {
      this.view.setFilterOff();
    }

    this.updateList(this.view.currentDate.value);
  }

  clearFilters() {
    Object.keys(this.model.activeFilters).forEach((filter) =>
      this.model.changeSelectedFilter(filter, false)
    );

    this.view.setFilterOff();

    this.updateList(this.view.currentDate.value);
  }

  updateList(date) {
    let list;

    if (this.#isFilterActive()) {
      list = this.model
        .getExpensesByDate(date)
        .filter((expense) => this.model.activeFilters[expense.category]);
    } else {
      list = this.model.getExpensesByDate(this.view.currentDate.value);
    }

    this.view.renderExpenses(list, {
      handleEdit: this.handleEditClick.bind(this),
      delete: this.handleDeleteExpense.bind(this),
    });
  }
}

export default ExpenseController;
