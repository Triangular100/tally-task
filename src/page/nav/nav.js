import allImg from "../../img/calendar-all.svg";
import todayImg from "../../img/calendar-today.svg";
import weekImg from "../../img/calendar-week.svg";
import importantImg from "../../img/calendar-important.svg";
import completeImg from "../../img/calendar-complete.svg";
import projectImg from "../../img/clipboard.svg";
import addProjectImg from "../../img/add.svg";

import { getToDo } from "../page.js";
import { showAddProjectForm, showEditProjectForm } from "../forms/forms.js";
import { refreshToDoList } from "../content/content.js";

export { createNav as default, createProjectItem, navActivate };
export { hideNav, refreshNavProjects, selectNavOption } from "./nav-interact.js";

function getOptions() {
    return [
        {
            title: "All",
            imgSrc: allImg,
        },
        {
            title: "Today",
            imgSrc: todayImg,
        },
        {
            title: "Week",
            imgSrc: weekImg,
        },
        {
            title: "Important",
            imgSrc: importantImg,
        },
        {
            title: "Complete",
            imgSrc: completeImg,
        }
    ];
}

function createNav() {
    const nav = document.createElement("nav");
    nav.id = "nav";

    nav.appendChild(createNavOptions(getOptions()));
    nav.appendChild(createNavProjects());

    return nav;
}

function createNavOptions(options) {
    const navOptions = document.createElement("ul");
    navOptions.classList.add("nav-options");
    navOptions.id = "home-nav-options";

    for (const option of options) {
        navOptions.appendChild(createNavOption(option));
    }

    return navOptions;
}

function createNavOption(option) {
    const navOption = document.createElement("li");
    navOption.classList.add("nav-option");
    navOption.id = option.title.toLowerCase();

    // When page is loaded, default selection to show all tasks
    if (option.title === "All") {
        navOption.classList.add("active");
    }

    navOption.appendChild(createNavOptionImg(option.imgSrc));
    navOption.appendChild(createNavOptionText(option.title));
    navOption.addEventListener("click", ev => navActivate(ev.currentTarget));

    return navOption;
}

function createNavOptionImg(imgSrc) {
    const optionImg = new Image();
    optionImg.src = imgSrc;
    optionImg.classList.add("img");
    return optionImg;
}

function createNavOptionText(title) {
    const optionText = document.createElement("span");
    optionText.textContent = title;
    return optionText;
}

function createNavProjects() {
    const projects = document.createElement("div");
    projects.classList.add("nav-projects");

    projects.appendChild(createProjectHeader());
    projects.appendChild(createProjectList());

    return projects;
}

function createProjectHeader() {
    const header = document.createElement("div");
    header.classList.add("project-header");
    header.appendChild(createProjectHeaderText());
    header.appendChild(createProjectHeaderAddProjectImg());
    return header;
}

function createProjectHeaderText() {
    const text = document.createElement("span");
    text.textContent = "Projects";
    return text;
}

function createProjectHeaderAddProjectImg() {
    const img = new Image();
    img.src = addProjectImg;

    img.classList.add("add-project");
    img.classList.add("rotate-90");
    img.addEventListener("click", () => showAddProjectForm());

    return img;
}

function createProjectList() {
    const projectList = document.createElement("ul");
    projectList.id = "project-list";
    projectList.classList.add("nav-options");

    const toDo = getToDo();
    for (const project of toDo.getProjects()) {
        projectList.appendChild(createProjectItem(project));
    }

    return projectList;
}

function createProjectItem(project) {
    const projectItem = document.createElement("li");
    projectItem.classList.add("nav-option");
    projectItem.id = project.id;

    projectItem.appendChild(createProjectItemImg(project));
    projectItem.appendChild(createProjectItemText(project.title));
    projectItem.addEventListener("click", ev => navActivate(ev.currentTarget));

    return projectItem;
}

function createProjectItemImg(project) {
    const img = new Image();
    img.src = projectImg;
    img.classList.add("img");

    img.addEventListener("click", () => {
        showEditProjectForm(project);
    });

    return img;
}

function createProjectItemText(title) {
    const text = document.createElement("span");
    text.textContent = title;
    return text;
}

function navActivate(ele) {
    // Make navigation option active
    if (!activateNavOption(ele)) {
        // If already active, do nothing
        return;
    }
    getToDo().activeView = ele.id;
    refreshToDoList();
}

function activateNavOption(ele) {
    // Check if not already active
    if (ele.classList.contains("active")) {
        return false;
    }

    // Deactivate current active option
    const activeOption = document.querySelector(".nav-option.active");
    if (activeOption) {
        activeOption.classList.remove("active");
    }

    ele.classList.add("active");
    return true;
}