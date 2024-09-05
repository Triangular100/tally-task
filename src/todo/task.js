export default class Task {

    constructor(id, title, description, dueDate, priority = "", complete = false) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.complete = complete;
    }

    toggleComplete() {
        this.complete = !this.complete;
        return this.complete;
    }

    edit(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }

}