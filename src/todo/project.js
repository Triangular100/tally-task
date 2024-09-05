
export default class Project {

    constructor(id, title) {
        this.id = id;
        this.title = title;
        this.tasks = {};
    }

    addTask(task) {
        this.tasks[task.id] = task;
    }

    editTask(taskID, title, description, dueDate, priority) {
        const task = this.tasks[taskID];
        task.edit(title, description, dueDate, priority);
    }

    removeTask(taskID) {
        delete this.tasks[taskID];
    }

    getTasks() {
        return Object.values(this.tasks);
    }

}