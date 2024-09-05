import { createToDoItem } from "./content.js";
import { getToDo } from "../page.js";

export {
    refreshToDoList,
};

function refreshToDoList() {
    clearToDoList();
    loadToDoList();
}

function clearToDoList() {
    const list = document.querySelector("#content .list");
    list.innerHTML = "";
}

function loadToDoList() {
    const toDo = getToDo();
    updateContentTitle(toDo.getActiveViewTitle());
    for (const task of toDo.getTasks()) {
        addToDoItem(task);
    }
}

function updateContentTitle(text) {
    const title = document.querySelector("#content .header .title");
    title.textContent = text;
}

function addToDoItem(task) {
    const list = document.querySelector("#content .list");
    list.appendChild(createToDoItem(task));
}