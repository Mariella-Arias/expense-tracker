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
    this.activeFilters = {
      entertainment: false,
      essentials: false,
      miscellaneous: false,
      payments: false,
      wellness: false,
    };
  }

  addExpense(expense) {
    this.expenses.push(expense);
    this.updateLocalStorage();
  }

  deleteExpense(idx) {
    this.expenses.splice(idx, 1);
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    localStorage.setItem("expenses", JSON.stringify(this.expenses));
  }

  getExpensesByDate(date) {
    const mapped = this.expenses
      .map(
        (expense, idx) =>
          new Expense(idx, expense.amount, expense.category, expense.date)
      )
      .filter((expense) => expense.date === date);

    return mapped;
  }

  getExpenses() {
    return this.expenses.map(
      (expense, idx) =>
        new Expense(idx, expense.amount, expense.category, expense.date)
    );
  }

  changeSelectedFilter(key, isSelected) {
    this.activeFilters[key] = isSelected;
  }

  updateExpense(index, vals) {
    Object.assign(this.expenses[index], vals);
    this.updateLocalStorage();
  }
}

export default ExpensesModel;
