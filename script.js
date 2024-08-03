document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");
  const prioritySelect = document.getElementById("priority-select");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const newTask = {
      text: todoInput.value,
      completed: false,
      priority: prioritySelect.value,
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    todoInput.value = "";
  });

  const renderTasks = () => {
    todoList.innerHTML = "";
    tasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.className = task.completed ? "completed" : "";
      taskItem.innerHTML = `
    <span>${task.text}</span>
    <div class="task-actions">
        <button class="complete-btn">${
          task.completed ? "Undo" : "Complete"
        }</button>
        <button class="delete-btn">Delete</button>
    </div>
`;

      taskItem.querySelector(".complete-btn").addEventListener("click", () => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
      });

      taskItem.classList.add(task.priority);

      taskItem.querySelector(".delete-btn").addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      taskItem.querySelector("span").addEventListener("dblclick", () => {
        const span = taskItem.querySelector("span");
        const input = document.createElement("input");
        input.type = "text";
        input.value = span.textContent;
        taskItem.insertBefore(input, span);
        taskItem.removeChild(span);

        input.addEventListener("blur", () => {
          tasks[index].text = input.value;
          saveTasks();
          renderTasks();
        });

        input.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            tasks[index].text = input.value;
            saveTasks();
            renderTasks();
          }
        });

        input.focus();
      });

      todoList.appendChild(taskItem);
    });
  };

  renderTasks();
});
