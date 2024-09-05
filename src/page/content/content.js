import uncheckedImg from "../../img/circle.svg";
import checkedImg from "../../img/check-blue.svg";
import addImg from "../../img/add.svg";
import lowImg from "../../img/low.svg";
import mediumImg from "../../img/medium.svg";
import highImg from "../../img/high.svg";
import noneImg from "../../img/none.svg";

import { getToDo } from "../page.js";
import { showAddTaskForm, showViewTaskForm } from "../forms/forms.js";
import { compareDateAsc, today } from "../../util/date.js";

export { createContent as default, createToDoItem };
export { refreshToDoList } from "./content-interact.js";

function createContent() {
    const content = document.createElement("div");
    content.id = "content";
    content.appendChild(createContentTitle("All"));
    content.appendChild(createToDoList());
    return content;
}

function createContentTitle(text) {
    const contentTitle = document.createElement("div");
    contentTitle.classList.add("header");
    contentTitle.appendChild(createContentTitleText(text));
    contentTitle.appendChild(createContentAddTaskImg());
    return contentTitle;
}

function createContentTitleText(text) {
    const titleText = document.createElement("p");
    titleText.textContent = text;
    titleText.classList.add("title");
    return titleText;
}

function createContentAddTaskImg() {
    const addTask = new Image();
    addTask.src = addImg;

    addTask.classList.add("img");
    addTask.classList.add("rotate-90");
    addTask.addEventListener("click", () => showAddTaskForm());

    return addTask;
}

function createToDoList() {
    const list = document.createElement("ul");
    list.classList.add("list");

    const toDo = getToDo();
    for (const task of toDo.getTasks()) {
        if (task.complete) {
            continue;
        }
        list.appendChild(createToDoItem(task));
    }

    return list;
}

function createToDoItem(task) {
    const item = document.createElement("li");
    item.classList.add("item");

    const check = createCheckBox(task);
    item.appendChild(check);
    item.appendChild(createTitle(task));
    item.appendChild(createDueDate(task));
    item.appendChild(createPriority(task));

    // When user clicks on task, show task details
    item.addEventListener("click", ev => {
        // If marking task as complete (clicking checkbox) don't show details
        if (ev.target === check) {
            return;
        }

        showViewTaskForm(task);
    });

    return item;
}

function createCheckBox(task) {
    const checkbox = new Image();

    checkbox.src = task.complete ? checkedImg : uncheckedImg;

    checkbox.classList.add("img");
    checkbox.classList.add("checkbox");

    checkbox.addEventListener("click", () => {
        complete = getToDo().toggleCompleteTask(task);
        checkbox.src = complete ? checkedImg : uncheckedImg;
    });

    return checkbox;
}

function createTitle(task) {
    const title = document.createElement("p");
    title.textContent = task.title;
    title.classList.add("title");
    return title;
}

function createDueDate(task) {
    const dueDate = document.createElement("p");
    dueDate.textContent = task.dueDate;

    const overDue = (compareDateAsc(task.dueDate, today())) < 0;
    if (overDue) {
        dueDate.classList.add("overdue");
    }

    dueDate.classList.add("due-date");
    return dueDate;
}

function createPriority(task) {
    const priority = task.priority;

    let priorityImg = new Image();
    priorityImg.classList.add("img");

    if (priority === "high") {
        priorityImg.src = highImg;
    } else if (priority === "medium") {
        priorityImg.src = mediumImg;
    } else if (priority === "low") {
        priorityImg.src = lowImg;
    } else {
        priorityImg.src = noneImg;
    }

    return priorityImg;
}
