import closeImg from "../../img/close.svg";
import { getToDo } from "../page.js";
import { refreshToDoList } from "../content/content.js";
import { formatDate } from "../../util/util.js";

export { createAddTask as default, showAddTaskForm, refreshAddTaskFormProjectSelect };

function createAddTask() {
    const formContainer = document.createElement("div");
    formContainer.classList.add("add-task-form-container");
    formContainer.classList.add("form-container");

    formContainer.appendChild(createAddTaskForm());

    formContainer.addEventListener("click", ev => {
        if (ev.target === formContainer) {
            formContainer.classList.remove("active");
        }
    });

    return formContainer;
}

function showAddTaskForm() {
    // When user has a project selected in nav automatically select it in dropdown selection
    // If no active project, then select default option ("Select a project")
    selectActiveProject();
    document.querySelector(".add-task-form-container").classList.add("active");
}

function selectActiveProject() {

    // Deselect all options    
    const projectOptions = document.querySelectorAll(".project-option");
    for (let i = 0; i < projectOptions.length; i++) {
        projectOptions[i].selected = false;;
    }

    // Retrieve project if active
    const toDo = getToDo();
    if (!toDo.isActiveViewAProject()) {
        return;
    }
    const project = toDo.getActiveProject();

    // Select active project in selection
    const activeProject = document.querySelector(`option#${project.id}`);
    activeProject.selected = true;
}

function hideAddTaskForm() {
    document.querySelector(".add-task-form-container").classList.remove("active");
}

function refreshAddTaskFormProjectSelect() {
    // Remove all project options from select and load objects from toDo
    removeProjectSelectOptions();
    loadProjectSelectOptions();
}

function removeProjectSelectOptions() {
    const projectSelect = document.querySelector("#select-task-project");
    projectSelect.innerHTML = "";
}

function loadProjectSelectOptions() {
    const projectSelect = document.querySelector("#select-task-project");
    const toDo = getToDo();
    for (const project of toDo.getAllProjects()) {
        projectSelect.appendChild(createProjectOption(toDo, project));
    }
}

function createAddTaskForm() {
    const form = document.createElement("form");
    form.classList.add("add-task-form");
    form.classList.add("form");
    form.addEventListener("submit", ev => formSubmitHandler(ev, form));

    form.appendChild(createCloseButton());
    form.appendChild(createAddTaskTitle());
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
        hideAddTaskForm();
    });

    return buttonImg;
}

function createAddTaskTitle() {
    const title = document.createElement("h2");
    title.classList.add("title");
    title.textContent = "Add Task";
    return title;
}

function createTitleInput() {
    const titleInput = document.createElement("input");
    titleInput.id = "input-task-title";
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("name", "input-task-title");
    titleInput.setAttribute("placeholder", "Title (Required)");
    titleInput.setAttribute("required", true);
    return titleInput;
}

function createDescriptionInput() {
    const descriptionInput = document.createElement("input");
    descriptionInput.id = "input-task-description";
    descriptionInput.setAttribute("type", "text");
    descriptionInput.setAttribute("name", "input-task-description");
    descriptionInput.setAttribute("placeholder", "Description");
    return descriptionInput;
}

function createDueDateInput() {
    const dueDateInput = document.createElement("input");
    dueDateInput.id = "input-task-due-date";
    dueDateInput.setAttribute("type", "date");
    dueDateInput.setAttribute("name", "input-task-due-date");
    return dueDateInput;
}

function createPrioritySelect() {
    const prioritySelect = document.createElement("select");
    prioritySelect.id = "select-task-priority";
    prioritySelect.setAttribute("name", "select-task-priority");
    prioritySelect.appendChild(createPriorityOption("Select Priority", ""));
    prioritySelect.appendChild(createPriorityOption("Low", "low"));
    prioritySelect.appendChild(createPriorityOption("Medium", "medium"));
    prioritySelect.appendChild(createPriorityOption("High", "high"));

    return prioritySelect;
}

function createPriorityOption(text, value) {
    const option = document.createElement("option");
    option.textContent = text;
    option.value = value;
    return option;
}

function createProjectSelect() {
    const projectSelect = document.createElement("select");
    projectSelect.id = "select-task-project";
    projectSelect.setAttribute("name", "select-task-project");

    const toDo = getToDo();
    for (const project of toDo.getAllProjects()) {
        projectSelect.appendChild(createProjectOption(toDo, project));
    }

    return projectSelect;
}

function createProjectOption(toDo, project) {
    const option = document.createElement("option");
    option.classList.add("project-option");
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
    submitButton.textContent = "Add Task";
    return submitButton;
}

function formSubmitHandler(ev, form) {
    ev.preventDefault();

    const [title, description, dueDate, priority, projectID] = getFormValues(form);
    resetForm(form);
    getToDo().createTask(projectID, title, description, dueDate, priority);

    // Update content tasks
    // (Will not enable project in navigation menu since it may be confusing)
    refreshToDoList();
    hideAddTaskForm();
}

function getFormValues(form) {
    return [
        form.elements["input-task-title"].value,
        form.elements["input-task-description"].value,
        formatDate(form.elements["input-task-due-date"].value),
        form.elements["select-task-priority"].value,
        form.elements["select-task-project"].value
    ];
}

function resetForm(form) {
    form.elements["input-task-title"].value = "";
    form.elements["input-task-description"].value = "";
    form.elements["input-task-due-date"].value = "";
    form.elements["select-task-priority"].selectedIndex = 0;
    // Form select-task-project is calculated when showing form
}