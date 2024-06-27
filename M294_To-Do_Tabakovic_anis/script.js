document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoList = document.getElementById('todo-list');
    const searchInput = document.getElementById('search');
    const closeModalButtons = document.querySelectorAll('.close');

    let todos = [];

    // Event Listener für das Hinzufügen eines neuen To-Dos
    todoForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const newTodo = {
            title: document.getElementById('title').value.trim(),
            description: document.getElementById('description').value.trim(),
            author: document.getElementById('author').value.trim(),
            category: document.getElementById('category').value,
            important: document.getElementById('important').checked,
            urgent: document.getElementById('urgent').checked,
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value,
            progress: document.getElementById('progress').value,
        };

        // Prüfen, ob das Startdatum vor dem Enddatum liegt
        if (new Date(newTodo.startDate) > new Date(newTodo.endDate)) {
            alert('Das Startdatum darf nicht nach dem Enddatum liegen.');
            return;
        }

        // Zusätzliche Validierungen
        if (newTodo.title.length > 255 || newTodo.author.length > 20) {
            alert('Die Länge des Titels oder Autors überschreitet das erlaubte Maximum.');
            return;
        }

        if (!newTodo.title || !newTodo.description || !newTodo.author || !newTodo.category || !newTodo.startDate || !newTodo.endDate) {
            alert('Alle Felder müssen ausgefüllt werden.');
            return;
        }

        todos.push(newTodo);
        renderTodos(todos);
        todoForm.reset();
    });

    // Event Listener für die Suchfunktion
    searchInput.addEventListener('input', function () {
        const filteredTodos = todos.filter(todo =>
            todo.title.includes(searchInput.value) ||
            todo.author.includes(searchInput.value) ||
            todo.category.includes(searchInput.value)
        );
        renderTodos(filteredTodos);
    });

    // Funktion zum Rendern der To-Dos
    function renderTodos(todosToRender) {
        // Sortieren der To-Dos nach Wichtigkeit und Dringlichkeit
        todosToRender.sort((a, b) => {
            if (a.important && a.urgent) return -1;
            if (b.important && b.urgent) return 1;
            if (a.important && !a.urgent) return -1;
            if (b.important && !b.urgent) return 1;
            if (!a.important && a.urgent) return 1;
            if (!b.important && b.urgent) return -1;
            return 0;
        });

        todoList.innerHTML = '';
        todosToRender.forEach((todo, index) => {
            const todoItem = document.createElement('div');
            todoItem.className = 'todo-item';
            todoItem.innerHTML = `
                <div>
                    <span>Titel:</span> ${todo.title}
                </div>
                <div>
                    <span>Priorität:</span> ${getPriorityLabel(todo)}
                </div>
                <div>
                    <span>Enddatum:</span> ${todo.endDate}
                </div>
                <div class="todo-item-actions">
                    <button class="view-btn" data-index="${index}">👁️</button>
                    <button class="edit-btn" data-index="${index}">✏️</button>
                    <button class="delete-btn" data-index="${index}">🗑️</button>
                </div>
            `;
            todoList.appendChild(todoItem);
        });

        // Event Listener für das Löschen eines To-Dos
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                todos.splice(index, 1);
                renderTodos(todos);
            });
        });

        // Event Listener für das Bearbeiten eines To-Dos
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                openEditModal(index);
            });
        });

        // Event Listener für das Anzeigen der Details eines To-Dos
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                viewTodoDetails(index);
            });
        });
    }

    // Funktion zum Ermitteln der Priorität eines To-Dos
    function getPriorityLabel(todo) {
        if (todo.important && todo.urgent) return 'Sofort erledigen';
        if (todo.important && !todo.urgent) return 'Einplanen und Wohlfühlen';
        if (!todo.important && todo.urgent) return 'Gib es ab';
        return 'Weg damit';
    }

    // Funktion zum Öffnen des Bearbeitungsdialogs
    function openEditModal(index) {
        const todo = todos[index];
        document.getElementById('edit-index').value = index;
        document.getElementById('edit-title').value = todo.title;
        document.getElementById('edit-description').value = todo.description;
        document.getElementById('edit-author').value = todo.author;
        document.getElementById('edit-category').value = todo.category;
        document.getElementById('edit-important').checked = todo.important;
        document.getElementById('edit-urgent').checked = todo.urgent;
        document.getElementById('edit-start-date').value = todo.startDate;
        document.getElementById('edit-end-date').value = todo.endDate;
        document.getElementById('edit-progress').value = todo.progress;
        document.getElementById('edit-modal').style.display = 'block';
    }

    // Event Listener für das Speichern eines bearbeiteten To-Dos
    document.getElementById('edit-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const index = document.getElementById('edit-index').value;
        const todo = todos[index];

        todo.title = document.getElementById('edit-title').value.trim();
        todo.description = document.getElementById('edit-description').value.trim();
        todo.author = document.getElementById('edit-author').value.trim();
        todo.category = document.getElementById('edit-category').value;
        todo.important = document.getElementById('edit-important').checked;
        todo.urgent = document.getElementById('edit-urgent').checked;
        todo.startDate = document.getElementById('edit-start-date').value;
        todo.endDate = document.getElementById('edit-end-date').value;
        todo.progress = document.getElementById('edit-progress').value;

        // Prüfen, ob das Startdatum vor dem Enddatum liegt
        if (new Date(todo.startDate) > new Date(todo.endDate)) {
            alert('Das Startdatum darf nicht nach dem Enddatum liegen.');
            return;
        }

        // Zusätzliche Validierungen
        if (todo.title.length > 255 || todo.author.length > 20) {
            alert('Die Länge des Titels oder Autors überschreitet das erlaubte Maximum.');
            return;
        }

        if (!todo.title || !todo.description || !todo.author || !todo.category || !todo.startDate || !todo.endDate) {
            alert('Alle Felder müssen ausgefüllt werden.');
            return;
        }

        renderTodos(todos);
        document.getElementById('edit-modal').style.display = 'none';
    });

    // Funktion zum Anzeigen der Details eines To-Dos
    function viewTodoDetails(index) {
        const todo = todos[index];
        const viewContent = `
            <div>
                <span>Titel:</span> ${todo.title}
            </div>
            <div>
                <span>Beschreibung:</span> ${todo.description}
            </div>
            <div>
                <span>Autor:</span> ${todo.author}
            </div>
            <div>
                <span>Kategorie:</span> ${todo.category}
            </div>
            <div>
                <span>Wichtig:</span> ${todo.important ? 'Ja' : 'Nein'}
            </div>
            <div>
                <span>Dringend:</span> ${todo.urgent ? 'Ja' : 'Nein'}
            </div>
            <div>
                <span>Startdatum:</span> ${todo.startDate}
            </div>
            <div>
                <span>Enddatum:</span> ${todo.endDate}
            </div>
            <div>
                <span>Fortschritt:</span> ${todo.progress}%
            </div>
        `;
        document.getElementById('view-content').innerHTML = viewContent;
        document.getElementById('view-modal').style.display = 'block';
    }

    // Event Listener für das Schliessen der Modaldialoge
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function () {
            document.getElementById('edit-modal').style.display = 'none';
            document.getElementById('view-modal').style.display = 'none';
        });
    });

    // Event Listener für das Schliessen der Modaldialoge beim Klick ausserhalb des Dialogs
    window.addEventListener('click', function (e) {
        if (e.target === document.getElementById('edit-modal')) {
            document.getElementById('edit-modal').style.display = 'none';
        }
        if (e.target === document.getElementById('view-modal')) {
            document.getElementById('view-modal').style.display = 'none';
        }
    });

    // Render todos on page load
    renderTodos(todos);
});
