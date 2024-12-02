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
// const searchForm = document.getElementById('searchForm');
// searchForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const name = document.getElementById('searchInput').value;

//     const todoList = document.getElementById('todoList');
//     todoList.innerHTML = '';

//     try {
//         const response = await fetch(`/todos/${name}`);
//         if (!response.ok) {
//             alert(await response.text()); // Show error if user not found
//             return;
//         }

//         const user = await response.json();
//         user.todos.forEach((todo, index) => {
//             const li = document.createElement('li');
//             const todoLink = document.createElement('a');

//             todoLink.classList.add('delete-task');
//             todoLink.textContent = todo;
//             todoLink.href = '#'; // Make it clickable
//             todoLink.dataset.todoIndex = index; // Store index in a dataset attribute
//             todoLink.dataset.todo = todo; // Store todo text in a dataset attribute

//             li.appendChild(todoLink);
//             todoList.appendChild(li);
//         });
//     } catch (error) {
//         console.error('Error fetching todos:', error);
//         alert('Something went wrong.');
//     }
// });
const searchForm = document.getElementById('searchForm');
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('searchInput').value;

    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    try {
        const response = await fetch(`/todos/${name}`);
        if (!response.ok) {
            alert(await response.text());
            return;
        }

        const user = await response.json();
        user.todos.forEach((todo) => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('checkBoxes');
            checkbox.dataset.todo = todo.todo;
            checkbox.checked = todo.checked;

            const deleteLink = document.createElement('a');
            deleteLink.classList.add('delete-task');
            deleteLink.textContent = todo.todo;
            deleteLink.href = '#';
            deleteLink.dataset.todo = todo.todo;

            li.appendChild(checkbox);
            li.appendChild(deleteLink);
            todoList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching todos:', error);
        alert('Something went wrong.');
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
    if (e.target.classList.contains('delete-task')) {
        e.preventDefault();
        const name = document.getElementById('searchInput').value;
        const todo = e.target.dataset.todo;
        const checked = e.target.checked;

        const response = await fetch('/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, todo }),
        });

        const message = await response.text();
        if (!response.ok) {
            alert(message);
            return;
        }

        alert(message);
        e.target.parentElement.remove();
    }
});
