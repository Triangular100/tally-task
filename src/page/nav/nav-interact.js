import { createProjectItem, navActivate } from "./nav.js";
import { getToDo } from "../page.js";

export {
    hideNav,
    refreshNavProjects,
    selectNavOption,
};

function hideNav() {
    document.getElementById("nav").classList.toggle("hide");
}

function refreshNavProjects() {
    clearNavProjects();
    loadNavProjects();
}

function clearNavProjects() {
    const list = document.querySelector("#project-list");
    list.innerHTML = "";
}

function loadNavProjects() {
    const toDo = getToDo();
    for (const project of toDo.getProjects()) {
        addNavProject(project);
    }
}

function addNavProject(project) {
    const list = document.querySelector("#project-list");
    list.appendChild(createProjectItem(project));
}

function selectNavOption(id) {
    const ele = document.querySelector(`.nav-option#${id}`);
    navActivate(ele);
}