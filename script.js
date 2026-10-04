const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");

const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";
let editTaskId = null;


// Add Task
addTaskBtn.addEventListener("click", addTask);

function addTask() {

    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task.");
        return;
    }

    if (editTaskId !== null) {

        const task = tasks.find(task => task.id === editTaskId);

        task.title = title;
        task.date = taskDate.value;
        task.time = taskTime.value;

        editTaskId = null;

        addTaskBtn.textContent = "Add Task";

    } else {

        const newTask = {
            id: Date.now(),
            title: title,
            date: taskDate.value,
            time: taskTime.value,
            completed: false
        };

        tasks.push(newTask);
    }

    saveTasks();
    displayTasks();

    clearInputs();
}


// Display Tasks
function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {

        filteredTasks = tasks.filter(task => !task.completed);

    } else if (currentFilter === "completed") {

        filteredTasks = tasks.filter(task => task.completed);

    }

    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.classList.add("task-item");

        if (task.completed) {
            li.classList.add("completed");
        }

        let dateTimeText = "";

        if (task.date || task.time) {

            dateTimeText =
                `${task.date || ""} ${task.time || ""}`;
        }

        li.innerHTML = `
            <div class="task-info">

                <div class="task-title">
                    ${task.title}
                </div>

                <div class="task-date">
                    ${dateTimeText}
                </div>

            </div>

            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})">
                    ${task.completed ? "Undo" : "Done"}
                </button>

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });
}


// Complete / Undo Task
function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    if (task) {
        task.completed = !task.completed;
    }

    saveTasks();
    displayTasks();
}


// Edit Task
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    taskInput.value = task.title;
    taskDate.value = task.date;
    taskTime.value = task.time;

    editTaskId = id;

    addTaskBtn.textContent = "Update Task";

    taskInput.focus();
}


// Delete Task
function deleteTask(id) {

    if (confirm("Are you sure you want to delete this task?")) {

        tasks = tasks.filter(task => task.id !== id);

        saveTasks();
        displayTasks();
    }
}


// Filter Tasks
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        displayTasks();
    });
});


// Clear Input Fields
function clearInputs() {

    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";
}


// Save Tasks in Browser
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Load Tasks when page opens
displayTasks();