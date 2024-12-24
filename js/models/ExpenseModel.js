class ExpenseModel {
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
    return this.expenses.filter((expense) => expense.date === date);
  }

  getExpenses() {
    return this.expenses;
  }

  changeSelectedFilter(key, isSelected) {
    this.activeFilters[key] = isSelected;
  }
}

export default ExpenseModel;
