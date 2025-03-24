/**
 * Task class represents a single task with name, description, due date and status
 */
class Task {
    constructor(name, description, dueDate, status = "pending") {
      this.name = name;         // Task name
      this.description = description; // Task description
      this.dueDate = dueDate;   // Due date for the task
      this.status = status;     // Task status (default: "pending")
    }
  }
  
  // Retrieve tasks from localStorage or initialize empty array
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
  // Get DOM elements
  const taskForm = document.getElementById("taskForm");
  const taskList = document.getElementById("taskList");
  const filterAll = document.getElementById("filterAll");
  const filterCompleted = document.getElementById("filterCompleted");
  const filterPending = document.getElementById("filterPending");
  const sortByDueDate = document.getElementById("sortByDueDate");
  
  /**
   * Renders tasks to the DOM with optional filtering
   * @param {string} filter - Filter type ("all", "completed", "pending")
   */
  function renderTasks(filter = "all") {
    // Clear the task list
    taskList.innerHTML = "";
  
    // Filter tasks based on status
    const filteredTasks = tasks.filter(task => {
      if (filter === "completed") return task.status === "completed";
      if (filter === "pending") return task.status === "pending";
      return true; // Show all tasks if no filter selected
    });
  
    // Create and append task elements to the DOM
    filteredTasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.status === "completed" ? "completed" : "";
      li.innerHTML = `
        <div>
          <strong>${task.name}</strong>
          <p>${task.description}</p>
          <small>Due: ${task.dueDate}</small>
        </div>
        <div>
          <button onclick="toggleStatus(${index})">${task.status === "completed" ? "Pending" : "Complete"}</button>
          <button onclick="editTask(${index})">Edit</button>
          <button onclick="deleteTask(${index})">Delete</button>
        </div>
      `;
      taskList.appendChild(li);
    });
  }
  
  // Form submission handler for adding new tasks
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
    // Get form values
    const taskName = document.getElementById("taskName").value.trim();
    const taskDescription = document.getElementById("taskDescription").value.trim();
    const taskDueDate = document.getElementById("taskDueDate").value;
  
    // Validate inputs
    if (!taskName) {
      alert("Task name cannot be empty!");
      return;
    }
  
    if (!taskDueDate) {
      alert("Due date cannot be empty!");
      return;
    }
  
    // Add new task and update storage
    tasks.push(new Task(taskName, taskDescription, taskDueDate));
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    taskForm.reset();
  });
  
  /**
   * Toggles task status between completed and pending
   * @param {number} index - Index of task in tasks array
   */
  function toggleStatus(index) {
    tasks[index].status = tasks[index].status === "completed" ? "pending" : "completed";
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
  
  /**
   * Edits an existing task
   * @param {number} index - Index of task in tasks array
   */
  function editTask(index) {
    const task = tasks[index];
    const newName = prompt("Edit task name:", task.name);
    const newDescription = prompt("Edit task description:", task.description);
    const newDueDate = prompt("Edit due date (YYYY-MM-DD):", task.dueDate);
  
    // Only update if valid input provided
    if (newName !== null && newName.trim() !== "" && newDueDate !== null && newDueDate.trim() !== "") {
      task.name = newName.trim();
      task.description = newDescription.trim();
      task.dueDate = newDueDate.trim();
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    }
  }
  
  /**
   * Deletes a task
   * @param {number} index - Index of task in tasks array
   */
  function deleteTask(index) {
    if (confirm("Are you sure you want to delete this task?")) {
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    }
  }
  
  // Event listeners for filtering and sorting
  filterAll.addEventListener("click", () => renderTasks("all"));
  filterCompleted.addEventListener("click", () => renderTasks("completed"));
  filterPending.addEventListener("click", () => renderTasks("pending"));
  
  // Sort tasks by due date
  sortByDueDate.addEventListener("click", () => {
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    renderTasks();
  });
  
  // Initial render when page loads
  renderTasks();