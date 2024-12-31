import { JSDOM } from "jsdom";

import ExpensesView from "../js/views/ExpensesView.js";
import ExpensesModel from "../js/models/ExpensesModel.js";
import { expect } from "chai";

describe("Expenses View", function () {
  let view;
  let model;

  beforeEach(() => {
    const dom = new JSDOM(
      `<!DOCTYPE html>
            <html>
            <body>
            <form>
            <input id="date-input" name="date" type="date"/>
            <input id="selected-date" type="date" name="date" />
            </form>
            <h1 id="running-total">
            <span>$</span>0.00
            </h1>
            <button id="filter-button"></button>
            <ul id="expense-list"></ul>
            </body>
            </html>`,
      {
        url: "http://localhost/",
      }
    );
    global.window = dom.window;
    global.document = dom.window.document;
    global.localStorage = dom.window.localStorage;

    localStorage.clear();

    view = new ExpensesView();
    model = new ExpensesModel();
  });

  it("renders an empty container if there are no expenses to display", function () {
    const expense = {
      amount: 24,
      date: "2024-12-30",
      category: "essentials",
    };

    model.addExpense(expense);
    view.renderExpenses(model.getExpensesByDate("2024-12-30"), {});

    let emptyListDiv = document.querySelector(".empty-list");
    expect(emptyListDiv).to.be.null;

    model.deleteExpense(0);
    view.renderExpenses([], {});

    const expenseItems = document.querySelectorAll(".expense-item");
    emptyListDiv = document.querySelector(".empty-list");

    // Confirm previous items are removed
    expect(emptyListDiv).to.not.be.null;
    expect(emptyListDiv.textContent).to.include(
      "No expenses for the selected criteria"
    );
    expect(expenseItems).to.have.lengthOf(0);
  });

  it("renders expenses as list items", function () {
    const expense1 = {
      amount: 24,
      date: "2024-12-30",
      category: "essentials",
    };

    const expense2 = {
      amount: 14,
      date: "2024-12-30",
      category: "wellness",
    };

    model.addExpense(expense1);
    model.addExpense(expense2);

    view.renderExpenses(model.getExpensesByDate("2024-12-30"), {});

    const emptyListDiv = document.querySelector(".empty-list");
    const expenseItems = document.querySelectorAll(".expense-item");
    const category1 = expenseItems[0].textContent.toLowerCase();
    const category2 = expenseItems[1].textContent.toLowerCase();

    expect(emptyListDiv).to.be.null;
    expect(expenseItems).to.have.lengthOf(2);
    expect(expenseItems[0].textContent).to.include("24");
    expect(expenseItems[1].textContent).to.include("14");
    expect(category1).to.include("essentials");
    expect(category2).to.include("wellness");
  });

  it("opens a list of available filters", function () {
    const filters = {
      entertainment: false,
      essentials: false,
      miscellaneous: false,
      payments: false,
      wellness: false,
    };

    view.renderFilterDropdown(filters);

    const dropdown = document.getElementById("filters");
    const options = dropdown.querySelectorAll(".filter-option");

    expect(dropdown).to.not.be.null;
    expect(options).to.have.lengthOf(Object.keys(options).length);
  });
});
