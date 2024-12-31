import { expect } from "chai";
import { JSDOM } from "jsdom";

import ExpensesModel from "../js/models/ExpensesModel.js";

describe("Expenses Model", function () {
  let model;

  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html>`, { url: "http://localhost/" });
    global.window = dom.window;
    global.document = dom.window.document;
    global.localStorage = dom.window.localStorage;

    localStorage.clear();
    model = new ExpensesModel();
  });

  it("initializes with an empty expenses list if localStorage is empty", function () {
    expect(model.getExpenses()).to.deep.equal([]);
  });

  it("saves a new expense in local storage", function () {
    const newExpense = {
      amount: 24,
      date: "2024-12-30",
      category: "essentials",
    };

    model.addExpense(newExpense);

    expect(JSON.parse(localStorage.getItem("expenses"))).to.deep.equal([
      newExpense,
    ]);
  });

  it("deletes an expense by index", function () {
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

    model.deleteExpense(0);

    expect(JSON.parse(localStorage.getItem("expenses"))).to.deep.equal([
      expense2,
    ]);
  });

  it("returns a list of expenses by date", function () {
    const expense1 = {
      amount: 24,
      date: "2024-12-20",
      category: "essentials",
    };
    const expense2 = {
      amount: 14,
      date: "2024-12-30",
      category: "wellness",
    };

    model.addExpense(expense1);
    model.addExpense(expense2);

    expect(model.getExpensesByDate("2024-12-20")).to.deep.equal([
      { ...expense1, id: 0 },
    ]);
  });

  it("updates an expense by index", function () {
    const expense = {
      amount: 24,
      date: "2024-12-30",
      category: "essentials",
    };

    model.addExpense(expense);
    model.updateExpense(0, { category: "miscellaneous" });

    expect(JSON.parse(localStorage.getItem("expenses"))[0].category).to.equal(
      "miscellaneous"
    );
  });

  it("changes a filter state", function () {
    model.changeFilter("wellness", true);
    expect(model.filters.wellness).to.be.true;

    model.changeFilter("wellness", false);
    expect(model.filters.wellness).to.be.false;
  });
});
