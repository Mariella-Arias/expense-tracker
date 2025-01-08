import { expect } from "chai";
import { JSDOM } from "jsdom";

import ExpensesView from "../js/views/ExpensesView.js";
import ExpensesModel from "../js/models/ExpensesModel.js";
import ExpensesController from "../js/controllers/ExpensesController.js";

describe("Expenses Controller", function () {
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
  });

  it("initializes date pickers with today's date", function () {
    new ExpensesController(new ExpensesModel(), new ExpensesView(), {
      enableBindings: false,
    });

    const selectedDate = document.getElementById("selected-date");
    const dateInput = document.getElementById("date-input");

    const today = ExpensesController.getCalendarDate(
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    );
    expect(selectedDate.getAttribute("value")).to.equal(today);
    expect(selectedDate.getAttribute("max")).to.equal(today);
    expect(dateInput.getAttribute("max")).to.equal(today);
  });

  it("static method formats a date to YYYY-MM-DD", function () {
    const date = new Date(Date.UTC(2023, 11, 25));
    const formattedDate = ExpensesController.getCalendarDate(date);

    expect(formattedDate).to.equal("2023-12-25");
  });

  it("updates expense list when a new expense is added for the current date", function () {
    const model = new ExpensesModel();
    const view = new ExpensesView();
    const controller = new ExpensesController(model, view, {
      enableBindings: false,
    });

    view.currentDate.value = "2024-12-30";

    controller.handleAddExpense({
      amount: 50,
      date: "2024-12-30",
      category: "wellness",
    });

    const expenseItems = document.querySelectorAll(".expense-item");
    const text = expenseItems[0].textContent.toLowerCase();

    expect(expenseItems).to.have.lengthOf(1);
    expect(text).to.include("50");
    expect(text).to.include("wellness");
  });

  it("does not update expense when a new expense is added for a different date", function () {
    const model = new ExpensesModel();
    const view = new ExpensesView();
    const controller = new ExpensesController(model, view, {
      enableBindings: false,
    });

    view.currentDate.value = "2024-12-25";

    controller.handleAddExpense({
      amount: 50,
      date: "2024-12-30",
      category: "wellness",
    });

    const expenseItems = document.querySelectorAll(".expense-item");

    expect(expenseItems).to.have.lengthOf(0);
  });
});
