// DOM Elements
const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const summaryOutput = document.getElementById('summary-output');

// Load Expenses from Local Storage on Page Load
document.addEventListener('DOMContentLoaded', loadExpensesFromLocalStorage);

// Handle Form Submit
expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const date = document.getElementById('expense-date').value;
    const category = document.getElementById('expense-category').value;
    const amount = document.getElementById('expense-amount').value;
    const description = document.getElementById('expense-description').value || 'No description';

    // Create expense object
    const expense = {
        date,
        category,
        amount: parseFloat(amount),
        description
    };

    // Add expense to local storage
    addExpenseToLocalStorage(expense);

    // Clear form
    expenseForm.reset();

    // Refresh UI
    displayExpenses();
    calculateSummary();
});

// Add Expense to Local Storage
function addExpenseToLocalStorage(expense) {
    let expenses = getExpensesFromLocalStorage();
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Get Expenses from Local Storage
function getExpensesFromLocalStorage() {
    return localStorage.getItem('expenses') ? JSON.parse(localStorage.getItem('expenses')) : [];
}

// Load Expenses and Display Them
function loadExpensesFromLocalStorage() {
    displayExpenses();
    calculateSummary();
}

// Display Expenses
function displayExpenses() {
    let expenses = getExpensesFromLocalStorage();
    expenseList.innerHTML = '';

    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${expense.date} - ${expense.category}: ₹${formatCurrency(expense.amount)} (${expense.description})</span>
            <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
        `;
        expenseList.appendChild(li);
    });
}

// Delete Expense
function deleteExpense(index) {
    let expenses = getExpensesFromLocalStorage();
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
    calculateSummary();
}

// Calculate and Display Summary
function calculateSummary() {
    let expenses = getExpensesFromLocalStorage();
    let total = 0;
    let summary = {};

    expenses.forEach(expense => {
        total += expense.amount;

        if (summary[expense.category]) {
            summary[expense.category] += expense.amount;
        } else {
            summary[expense.category] = expense.amount;
        }
    });

    // Generate summary output
    let summaryHTML = `<p>Total Expenses: ₹${formatCurrency(total)}</p>`;
    for (const category in summary) {
        summaryHTML += `<p>${category}: ₹${formatCurrency(summary[category])}</p>`;
    }
    summaryOutput.innerHTML = summaryHTML;
}

// Format currency for Indian Rupees
function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
