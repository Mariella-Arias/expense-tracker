import ExpensesModel from "./js/models/ExpensesModel.js";
import ExpensesView from "./js/views/ExpensesView.js";
import ExpensesController from "./js/controllers/ExpensesController.js";

document.addEventListener("DOMContentLoaded", () => {
  const model = new ExpensesModel();
  const view = new ExpensesView();
  new ExpensesController(model, view, { enableBindings: true });
});
