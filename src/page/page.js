import "../styles/styles.js";
import createHeader from "./header/header.js";
import createNav from "./nav/nav.js";
import createContent from "./content/content.js";
import createForms from "./forms/forms.js";
import ToDo from "../todo/todo.js";

export { loadPage as default, getToDo };

let toDo;

function loadPage() {
    toDo = new ToDo();
    document.querySelector("body").appendChild(createPage());
}

function createPage() {
    const page = document.createElement("div");
    page.innerHTML = "Hi!";
    page.id = "page";
    page.appendChild(createHeader());
    page.appendChild(createNav());
    page.appendChild(createContent());
    page.appendChild(createForms());
    return page;
}

function getToDo() {
    return toDo;
}