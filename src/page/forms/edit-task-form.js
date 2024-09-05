import closeImg from "../../img/close.svg";
import { getToDo } from "../page.js";
import { refreshToDoList } from "../content/content.js";
import { formatDate } from "../../util/util.js";

export { createEditTask as default, showEditTaskForm, refreshEditTaskFormProjectSelect };

function createEditTask() {
    const formContainer = document.createElement("div");
    formContainer.classList.add("edit-task-form-container");
    formContainer.classList.add("form-container");

    formContainer.appendChild(createEditTaskForm());

    formContainer.addEventListener("click", ev => {
        if (ev.target === formContainer) {
            formContainer.classList.remove("active");
        }
    });

    return formContainer;
}

function showEditTaskForm(task) {
    populateEditTaskForm(task);
    // Add form context
    document.querySelector(".edit-task-form").id = task.id;
    document.querySelector(".edit-task-form-container").classList.add("active");
}

function hideEditTaskForm() {
    document.querySelector(".edit-task-form-container").classList.remove("active");
}

function refreshEditTaskFormProjectSelect() {
    removeProjectSelectOptions();
    loadProjectSelectOptions();
}

function removeProjectSelectOptions() {
    const projectSelect = document.querySelector("#select-edit-task-project");
    projectSelect.innerHTML = "";
}

function loadProjectSelectOptions() {
    const projectSelect = document.querySelector("#select-edit-task-project");
    const toDo = getToDo();
    for (const project of toDo.getAllProjects()) {
        projectSelect.appendChild(createProjectOption(toDo, project));
    }
}

function populateEditTaskForm(task) {
    const [eTitle, eDesc, eDueDate, ePriOptions, eProjectOptions] = getEditTaskFormComponents();
    // Populate with task details
    eTitle.value = task.title;
    eDesc.value = task.description;
    eDueDate.value = formatDate(task.dueDate, "yyyy-MM-dd");

    // Select task priority in form selection
    for (let i = 0; i < ePriOptions.length; i++) {
        if (ePriOptions[i].value === task.priority) {
            ePriOptions[i].selected = true;
        } else {
            ePriOptions[i].selected = false;
        }
    }

    // Select task project in form project selection
    const activeProjectID = getToDo().getProjectFromTaskID(task.id).id;
    for (let i = 0; i < eProjectOptions.length; i++) {
        if (eProjectOptions[i].value === activeProjectID) {
            eProjectOptions[i].selected = true;
        } else {
            eProjectOptions[i].selected = false;
        }
    }
}

function getEditTaskFormComponents() {
    return [
        document.querySelector("#input-edit-task-title"),
        document.querySelector("#input-edit-task-description"),
        document.querySelector("#input-edit-task-due-date"),
        document.querySelector("#select-edit-task-priority"),
        document.querySelector("#select-edit-task-project"),
    ];
}

function createEditTaskForm() {
    const form = document.createElement("form");
    form.classList.add("edit-task-form");
    form.classList.add("form");
    // Form ID will be taskID
    form.addEventListener("submit", ev => formSubmitHandler(ev, form));

    form.appendChild(createCloseButton());
    form.appendChild(createEditTaskTitle());
    form.appendChild(createTitleInput());
    form.appendChild(createDescriptionInput());
    form.appendChild(createDueDateInput());
    form.appendChild(createPrioritySelect());
    form.appendChild(createProjectSelect());
    form.appendChild(createActionButtons());

    return form;
}

function createCloseButton() {
    const buttonImg = new Image();
    buttonImg.src = closeImg;
    buttonImg.classList.add("close-button");

    buttonImg.addEventListener("click", ev => {
        ev.preventDefault();
        hideEditTaskForm();
    });

    return buttonImg;
}

function createEditTaskTitle() {
    const title = document.createElement("h2");
    title.classList.add("title");
    title.textContent = "Edit Task";
    return title;
}

function createTitleInput() {
    const titleInput = document.createElement("input");
    titleInput.id = "input-edit-task-title";
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("name", "input-edit-task-title");
    titleInput.setAttribute("placeholder", "Title (Required)");
    titleInput.setAttribute("required", true);
    return titleInput;
}

function createDescriptionInput() {
    const descriptionInput = document.createElement("input");
    descriptionInput.id = "input-edit-task-description";
    descriptionInput.setAttribute("type", "text");
    descriptionInput.setAttribute("name", "input-edit-task-description");
    descriptionInput.setAttribute("placeholder", "Description");
    return descriptionInput;
}

function createDueDateInput() {
    const dueDateInput = document.createElement("input");
    dueDateInput.id = "input-edit-task-due-date";
    dueDateInput.setAttribute("type", "date");
    dueDateInput.setAttribute("name", "input-edit-task-due-date");
    return dueDateInput;
}

function createPrioritySelect() {
    const prioritySelect = document.createElement("select");
    prioritySelect.id = "select-edit-task-priority";
    prioritySelect.setAttribute("name", "select-edit-task-priority");
    prioritySelect.appendChild(createPriorityOption("Select Priority", ""));
    prioritySelect.appendChild(createPriorityOption("Low", "low"));
    prioritySelect.appendChild(createPriorityOption("Medium", "medium"));
    prioritySelect.appendChild(createPriorityOption("High", "high"));

    return prioritySelect;
}

function createPriorityOption(text, value) {
    const option = document.createElement("option");
    option.classList.add("edit-task-priority-option");
    option.textContent = text;
    option.value = value;
    return option;
}

function createProjectSelect() {
    const projectSelect = document.createElement("select");
    projectSelect.id = "select-edit-task-project";
    projectSelect.setAttribute("name", "select-edit-task-project");

    const toDo = getToDo();
    for (const project of toDo.getAllProjects()) {
        projectSelect.appendChild(createProjectOption(toDo, project));
    }

    return projectSelect;
}

function createProjectOption(toDo, project) {
    const option = document.createElement("option");
    option.classList.add("edit-task-project-option");
    option.id = project.id;

    if (toDo.isDefault(project)) {
        option.textContent = "Select a project";
    } else {
        option.textContent = project.title;
    }

    option.value = project.id;
    return option;
}

function createActionButtons() {
    const actionButtons = document.createElement("div");
    actionButtons.classList.add("action-buttons");
    actionButtons.appendChild(createSubmitButton());
    return actionButtons;
}

function createSubmitButton() {
    const submitButton = document.createElement("button");
    submitButton.classList.add("submit-button");
    submitButton.textContent = "Save";
    return submitButton;
}

function formSubmitHandler(ev, form) {
    ev.preventDefault();

    const taskID = form.id;
    const [title, description, dueDate, priority, projectID] = getFormValues(form);
    getToDo().editTask(projectID, taskID, title, description, dueDate, priority);

    // Form gets reloaded when shown, so no need to resetForm

    refreshToDoList();
    hideEditTaskForm();
}

function getFormValues(form) {
    return [
        form.elements["input-edit-task-title"].value,
        form.elements["input-edit-task-description"].value,
        formatDate(form.elements["input-edit-task-due-date"].value),
        form.elements["select-edit-task-priority"].value,
        form.elements["select-edit-task-project"].value,
    ];
}