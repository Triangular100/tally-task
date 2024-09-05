import closeImg from "../../img/close.svg";
import { getToDo } from "../page.js";
import { capitalize } from "../../util/util.js";
import { refreshToDoList } from "../content/content.js";
import { showEditTaskForm } from "./edit-task-form.js";

export { createViewTask as default, showViewTaskForm };

let confirmDeleteTimeout;
let confirmDeleteClickCount = 0;
function createViewTask() {
    // View Task isn't a form
    // Follows other *-form.js for consistency
    const formContainer = document.createElement("div");
    formContainer.classList.add("view-task-form-container");
    formContainer.classList.add("form-container");

    formContainer.appendChild(createViewTaskForm());

    formContainer.addEventListener("click", ev => {
        if (ev.target === formContainer) {
            hideViewTaskForm();
        }
    });

    return formContainer;
}

function showViewTaskForm(task) {
    populateViewTaskForm(task);
    addActionButtonContext(task.id);
    document.querySelector(".view-task-form-container").classList.add("active");
}

function hideViewTaskForm() {
    document.querySelector(".view-task-form-container").classList.remove("active");
    removeDeleteTaskTimeout();
}

function populateViewTaskForm(task) {
    const [viewTitle, viewDesc, viewDueDate, viewPri] = getViewTaskFormComponents();
    viewTitle.textContent = task.title;
    viewDesc.textContent = task.description ? task.description : "No description";
    viewDueDate.textContent = "Due: " + (task.dueDate ? task.dueDate : "No due date");
    viewPri.textContent = "Priority: " + (task.priority ? capitalize(task.priority) : "No priority");
}

function addActionButtonContext(taskID) {
    document.querySelector(".view-task-form .edit-button").id = taskID;
    document.querySelector(".view-task-form .remove-button").id = taskID;
}

function getViewTaskFormComponents() {
    return [
        document.querySelector(".task-title"),
        document.querySelector(".task-description"),
        document.querySelector(".task-due-date"),
        document.querySelector(".task-priority"),
    ];
}

function createViewTaskForm() {
    const viewTaskForm = document.createElement("div");
    viewTaskForm.classList.add("view-task-form");
    viewTaskForm.classList.add("form");

    viewTaskForm.appendChild(createCloseButton());
    viewTaskForm.appendChild(createTitle());
    viewTaskForm.appendChild(createTaskComponent("task-title"));
    viewTaskForm.appendChild(createTaskComponent("task-description"));
    viewTaskForm.appendChild(createTaskComponent("task-due-date"));
    viewTaskForm.appendChild(createTaskComponent("task-priority"));
    viewTaskForm.appendChild(createActionButtons());

    return viewTaskForm;
}

function createCloseButton() {
    const buttonImg = new Image();
    buttonImg.src = closeImg;
    buttonImg.classList.add("close-button");

    buttonImg.addEventListener("click", ev => {
        ev.preventDefault();
        hideViewTaskForm();
    });

    return buttonImg;
}

function createTitle() {
    const title = document.createElement("p");
    title.classList.add("title");
    title.textContent = "Task Info";
    return title;
}

function createTaskComponent(cls) {
    const taskComponent = document.createElement("div");
    taskComponent.classList.add(cls);
    return taskComponent;
}

function createActionButtons() {
    const actionButtons = document.createElement("div");
    actionButtons.classList.add("action-buttons");
    actionButtons.appendChild(createRemoveButton());
    actionButtons.appendChild(createEditButton());
    return actionButtons;
}

function createRemoveButton() {
    const removeButton = document.createElement("button");
    // Button ID will be task ID
    removeButton.id = "";
    removeButton.classList.add("remove-button");
    removeButton.textContent = "Delete Task";

    removeButton.addEventListener("click", () => {
        confirmDeleteClickCount++;
        if (confirmDeleteClickCount === 1) {
            removeButton.classList.add("shake");
            removeButton.textContent = "Confirm Delete?";
            confirmDeleteTimeout = setTimeout(() => {
                confirmDeleteClickCount = 0;
                removeButton.classList.remove("shake");
                removeButton.textContent = "Delete Task";
            }, 2000);
        }
        else if (confirmDeleteClickCount === 2) {
            // User has confirmed deletion
            // Remove task and refresh list
            getToDo().removeTask(removeButton.id);
            refreshToDoList();
            hideViewTaskForm();
        }
    });

    return removeButton;
}

function removeDeleteTaskTimeout() {
    clearTimeout(confirmDeleteTimeout);
    confirmDeleteClickCount = 0;

    const removeButton = document.querySelector(".view-task-form .shake");
    if (!removeButton) {
        return;
    }

    removeButton.classList.remove("shake");
    removeButton.textContent = "Delete Task";
}

function createEditButton() {
    const editButton = document.createElement("button");
    editButton.id = "";
    editButton.classList.add("edit-button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
        // Pass task object to edit task form
        showEditTaskForm(getToDo().getTask(editButton.id));
        hideViewTaskForm();
    });

    return editButton;
}
