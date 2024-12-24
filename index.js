import ExpenseModel from "./js/models/ExpenseModel.js";
import ExpenseView from "./js/views/ExpenseView.js";
import ExpenseController from "./js/controllers/ExpenseController.js";

document.addEventListener("DOMContentLoaded", () => {
  const model = new ExpenseModel();
  const view = new ExpenseView();
  new ExpenseController(model, view);
});
