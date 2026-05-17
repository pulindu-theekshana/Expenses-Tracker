const API_URL = 'http://127.0.0.1:5000/expenses';

const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalElement = document.getElementById('total');


async function fetchExpenses() {
    const response = await fetch(API_URL);

    const expenses = await response.json();

    expenseList.innerHTML = '';

    let total = 0;

    expenses.forEach(expense => {
        total += parseFloat(expense.amount);

        const div = document.createElement('div');
        div.classList.add('expense-item');

        div.innerHTML = `
            <div>
                <strong>${expense.title}</strong><br>
                Rs. ${expense.amount} - ${expense.category}
            </div>

            <button class="delete-btn" onclick="deleteExpense(${expense.id})">
                Delete
            </button>
        `;

        expenseList.appendChild(div);
    });

    totalElement.textContent = total.toFixed(2);
}


expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;

    const expenseData = {
        title,
        amount,
        category
    };

    await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expenseData)
    });

    expenseForm.reset();

    fetchExpenses();
});


async function deleteExpense(id) {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });

    fetchExpenses();
}


fetchExpenses();