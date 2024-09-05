import closeImg from "../../img/close.svg";
import { getToDo } from "../page.js";
import { refreshNavProjects, selectNavOption } from "../nav/nav.js";
import { refreshAddTaskFormProjectSelect } from "./add-task-form.js";
import { refreshEditTaskFormProjectSelect } from "./edit-task-form.js";

export { createEditProject as default, showEditProjectForm };

let confirmDeleteTimeout;
let confirmDeleteClickCount = 0;

function createEditProject() {
    const formContainer = document.createElement("div");
    formContainer.classList.add("edit-project-form-container");
    formContainer.classList.add("form-container");

    formContainer.appendChild(createEditProjectForm());

    formContainer.addEventListener("click", ev => {
        if (ev.target === formContainer) {
            hideEditProjectForm();
        }
    });

    return formContainer;
}

function showEditProjectForm(project) {
    populateEditProjectForm(project);
    // Add form context
    document.querySelector(".edit-project-form").id = project.id;
    document.querySelector(".edit-project-form .remove-button").id = project.id;
    document.querySelector(".edit-project-form-container").classList.add("active");
}

function hideEditProjectForm() {
    document.querySelector(".edit-project-form-container").classList.remove("active");
    removeDeleteProjectTimeout();
}

function populateEditProjectForm(project) {
    document.querySelector("#input-edit-project-title").value = project.title;
}

function createEditProjectForm() {
    const form = document.createElement("form");
    form.classList.add("edit-project-form");
    form.classList.add("form");

    form.addEventListener("submit", ev => formSubmitHandler(ev, form));

    form.appendChild(createCloseButton());
    form.appendChild(createEditProjectTitle());
    form.appendChild(createTitleInput());
    form.appendChild(createActionButtons());

    return form;
}

function createCloseButton() {
    const buttonImg = new Image();
    buttonImg.src = closeImg;
    buttonImg.classList.add("close-button");

    buttonImg.addEventListener("click", ev => {
        ev.preventDefault();
        hideEditProjectForm();
    });

    return buttonImg;
}

function createEditProjectTitle() {
    const title = document.createElement("h2");
    title.classList.add("title");
    title.textContent = "Edit Project";
    return title;
}

function createTitleInput() {
    const titleInput = document.createElement("input");
    titleInput.id = "input-edit-project-title";
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("name", "input-edit-project-title");
    titleInput.setAttribute("placeholder", "Title (Required)");
    titleInput.setAttribute("required", true);
    return titleInput;
}

function createActionButtons() {
    const actionButtons = document.createElement("div");
    actionButtons.classList.add("action-buttons");
    actionButtons.appendChild(createRemoveButton());
    actionButtons.appendChild(createSubmitButton());
    return actionButtons;
}

function createRemoveButton() {
    const removeButton = document.createElement("button");
    // Button ID will be project ID
    removeButton.id = "";
    removeButton.classList.add("remove-button");
    removeButton.textContent = "Delete Project";

    // User must click delete button twice to delete project
    removeButton.addEventListener("click", ev => {
        ev.preventDefault();
        confirmDeleteClickCount++;

        if (confirmDeleteClickCount === 1) {
            removeButton.classList.add("shake");
            removeButton.textContent = "Confirm Delete?";
            confirmDeleteTimeout = setTimeout(() => {
                confirmDeleteClickCount = 0;
                removeButton.classList.remove("shake");
                removeButton.textContent = "Delete Project";
            }, 2000);
        }
        else if (confirmDeleteClickCount === 2) {
            // User confirmed deletion
            getToDo().removeProject(removeButton.id);
            refreshNavProjects();
            selectNavOption("all");
            refreshAddTaskFormProjectSelect();
            refreshEditTaskFormProjectSelect();
            hideEditProjectForm();
        }
    });

    return removeButton;
}

function removeDeleteProjectTimeout() {
    clearTimeout(confirmDeleteTimeout);
    confirmDeleteClickCount = 0;

    const removeButton = document.querySelector(".edit-project-form .shake");
    if (!removeButton) {
        return;
    }

    removeButton.classList.remove("shake");
    removeButton.textContent = "Delete Project";
}

function createSubmitButton() {
    const submitButton = document.createElement("button");
    submitButton.classList.add("submit-button");
    submitButton.textContent = "Save";
    return submitButton;
}

function formSubmitHandler(ev, form) {
    ev.preventDefault();

    const projectID = form.id;
    const title = form.elements["input-edit-project-title"].value;

    getToDo().editProject(projectID, title);
    refreshNavProjects();
    refreshAddTaskFormProjectSelect();
    refreshEditTaskFormProjectSelect();
    hideEditProjectForm();
}