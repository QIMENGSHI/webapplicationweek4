// Add Todo
const form = document.getElementById('todoForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('userInput').value;
    const todo = document.getElementById('todoInput').value;
    event.target.reset();

    const response = await fetch('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, todo }),
    });

    const message = await response.text();
    document.getElementById('message').innerText = message;
});

// Search Todos by User
const searchForm = document.getElementById('searchForm');
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('searchInput').value;

    const response = await fetch(`/todos/${name}`);
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    if (response.ok) {
        const user = await response.json();
        user.todos.forEach((todo) => {
            const li = document.createElement('li');
            li.textContent = todo;
            todoList.appendChild(li);
        });
    } else {
        alert(await response.text());
    }
});

// Delete User
const deleteButton = document.getElementById('deleteUser');
deleteButton.addEventListener('click', async () => {
    const name = document.getElementById('searchInput').value;

    const response = await fetch('/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });

    const message = await response.text();
    alert(message);
});

// Delete Todo
document.getElementById('todoList').addEventListener('click', async (e) => {
    if (e.target.tagName === 'LI') {
        const name = document.getElementById('searchInput').value;
        const todo = e.target.textContent;

        const response = await fetch('/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, todo }),
        });

        const message = await response.text();
        alert(message);
        e.target.remove();
    }
});
