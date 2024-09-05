import closeImg from "../../img/close.svg";
import { getToDo } from "../page.js";
import { refreshNavProjects } from "../nav/nav.js";
import { refreshAddTaskFormProjectSelect } from "./add-task-form.js";
import { refreshEditTaskFormProjectSelect } from "./edit-task-form.js";

export { createAddProject as default, showAddProjectForm };

function createAddProject() {
    const formContainer = document.createElement("div");
    formContainer.classList.add("add-project-form-container");
    formContainer.classList.add("form-container");

    formContainer.appendChild(createAddProjectForm());

    formContainer.addEventListener("click", ev => {
        if (ev.target === formContainer) {
            formContainer.classList.remove("active");
        }
    });

    return formContainer;
}

function showAddProjectForm() {
    document.querySelector(".add-project-form-container").classList.add("active");
}

function hideAddProjectForm() {
    document.querySelector(".add-project-form-container").classList.remove("active");
}

function createAddProjectForm() {
    const form = document.createElement("form");
    form.classList.add("add-task-form");
    form.classList.add("form");
    form.addEventListener("submit", ev => formSubmitHandler(ev, form));

    form.appendChild(createCloseButton());
    form.appendChild(createAddProjectTitle());
    form.appendChild(createAddProjectTitleInput());
    form.appendChild(createActionButtons());

    return form;
}

function createCloseButton() {
    const buttonImg = new Image();
    buttonImg.src = closeImg;
    buttonImg.classList.add("close-button");

    buttonImg.addEventListener("click", ev => {
        ev.preventDefault();
        hideAddProjectForm();
    });

    return buttonImg;
}

function createAddProjectTitle() {
    const title = document.createElement("h2");
    title.classList.add("title");
    title.textContent = "Add Project";
    return title;
}

function createAddProjectTitleInput() {
    const titleInput = document.createElement("input");
    titleInput.id = "input-project-title";
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("name", "input-project-title");
    titleInput.setAttribute("placeholder", "Title (Required)");
    titleInput.setAttribute("required", true);
    return titleInput;
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
    submitButton.textContent = "Add Project";
    return submitButton;
}

function formSubmitHandler(ev, form) {
    ev.preventDefault();

    const title = getFormValues(form);
    resetForm(form);
    getToDo().createProject(title);

    // Refresh navigation project menu
    // Refresh project select in add-task-form and edit-task-form
    refreshNavProjects();
    refreshAddTaskFormProjectSelect();
    refreshEditTaskFormProjectSelect();
    hideAddProjectForm();
}

function getFormValues(form) {
    return form.elements["input-project-title"].value;
}

function resetForm(form) {
    form.elements["input-project-title"].value = "";
}