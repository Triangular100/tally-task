
import createAddTaskForm from "./add-task-form.js";
import createAddProjectForm from "./add-project-form.js";
import createViewTaskForm from "./view-task-form.js";
import createEditTaskForm from "./edit-task-form.js";
import createEditProjectForm from "./edit-project-form.js";

export { showAddTaskForm } from "./add-task-form.js";
export { showAddProjectForm } from "./add-project-form.js";
export { showViewTaskForm } from "./view-task-form.js";
export { showEditProjectForm } from "./edit-project-form.js";
export { createForms as default };

function createForms() {
    const formContainers = document.createElement("div");
    formContainers.appendChild(createAddTaskForm());
    formContainers.appendChild(createAddProjectForm());
    formContainers.appendChild(createViewTaskForm());
    formContainers.appendChild(createEditTaskForm());
    formContainers.appendChild(createEditProjectForm());
    return formContainers;
}