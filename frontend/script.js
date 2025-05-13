let expenses = [];

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("expense-form");
  const descInput = document.getElementById("desc");
  const amountInput = document.getElementById("amount");
  const expenseList = document.getElementById("expense-list");
  const totalEl = document.getElementById("total");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const desc = descInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (!desc || isNaN(amount)) return;

    // Call the backend to add expense
    const expense = { description: desc, amount };
    fetch("http://localhost:8080/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(expense)
    })
    .then(response => response.json())
    .then(() => fetchExpenses())
    .catch(error => console.error("Error adding expense:", error));

    descInput.value = "";
    amountInput.value = "";
  });

  function renderExpenses() {
    expenseList.innerHTML = "";
    let total = 0;
    expenses.forEach((exp, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${exp.description} - ₹${exp.amount.toFixed(2)}
        <button onclick="deleteExpense(${exp.id})">❌</button>`;
      expenseList.appendChild(li);
      total += exp.amount;
    });
    totalEl.textContent = total.toFixed(2);
  }

  function fetchExpenses() {
    fetch("http://localhost:8080/api/expenses")
      .then(response => response.json())
      .then(data => {
        expenses = data;
        renderExpenses();
      })
      .catch(error => console.error("Error fetching expenses:", error));
  }

  window.deleteExpense = function (id) {
    fetch(`http://localhost:8080/api/expenses/${id}`, {
      method: "DELETE"
    })
    .then(() => fetchExpenses())
    .catch(error => console.error("Error deleting expense:", error));
  };

  // Fetch expenses on load
  fetchExpenses();
});
