class Expense {
  constructor(id, amount, category, date) {
    this.id = id;
    this.amount = amount;
    this.category = category;
    this.date = date;
  }
}

class ExpensesModel {
  constructor() {
    this.expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    this.filters = {
      entertainment: false,
      essentials: false,
      miscellaneous: false,
      payments: false,
      wellness: false,
    };
  }

  addExpense(expense) {
    this.expenses.push(expense);
    this.#updateLocalStorage();
  }

  deleteExpense(idx) {
    this.expenses.splice(idx, 1);
    this.#updateLocalStorage();
  }

  updateExpense(idx, vals) {
    Object.assign(this.expenses[idx], vals);
    this.#updateLocalStorage(this.expenses);
  }

  getExpenses() {
    return this.expenses.map(
      (expense, idx) =>
        new Expense(idx, expense.amount, expense.category, expense.date)
    );
  }

  /**
   * @params
   *  date: YEAR-MONTH-DAY, 2024-12-03
   */
  getExpensesByDate(date) {
    const mapped = this.expenses
      .map(
        (expense, idx) =>
          new Expense(idx, expense.amount, expense.category, expense.date)
      )
      .filter((expense) => expense.date === date);

    return mapped;
  }

  changeFilter(key, isSelected) {
    this.filters[key] = isSelected;
  }

  #updateLocalStorage() {
    localStorage.setItem("expenses", JSON.stringify(this.expenses));
  }
}

export default ExpensesModel;