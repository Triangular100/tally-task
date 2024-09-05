import Project from "./project.js";
import Task from "./task.js";
import { generateUniqueKey, loadObject, saveObject, today, addDays, isToday, isThisWeek, capitalize, compareDateAsc } from "../util/util.js";

export default class ToDo {

    constructor() {
        this.createUserToDoList();
        this.createView();
    }

    createUserToDoList() {
        // 
        // taskProjectIndex retrieves project a task is in
        //     {taskID: projectObject}}
        // projects retrieves project using its ID
        //     {projectID: projectObject}
        // defaultProject is where tasks that are not assigned to a project are assigned to
        //     projectObject
        // 

        this.taskProjectIndex = {};
        this.projects = this.loadUserProjects();
        this.DEFAULT_PROJECT_ID = "0";
        this.DEFAULT_PROJECT_NAME = "Default Project";
        this.defaultProject = this.loadUserDefaultProject();
    }

    createView() {
        // 
        // View determines what tasks are retrieved from getTasks()
        // Options
        //     all: uncompleted tasks
        //     today: uncompleted tasks due today
        //     week: uncompleted tasks due this week
        //     important: uncompleted important tasks
        //     complete: all completed tasks
        //     projectID: all uncompleted tasks for this project
        // 

        this.activeView = "all";
    }

    loadUserDefaultProject() {
        // Allow user to create tasks without assigning to a project
        // Under the hood, these tasks are added to a hidden project
        const projectJSON = loadObject("default-project");

        if (!projectJSON) {
            return this.newUserDefaultTasks();
        }

        return this.buildProject(projectJSON);
    }

    newUserDefaultTasks() {
        const project = new Project(this.DEFAULT_PROJECT_ID, this.DEFAULT_PROJECT_NAME);

        const t1 = new Task(generateUniqueKey(), "Create a project", "Start your own task list on TallyTask", today(), "high");
        const t2 = new Task(generateUniqueKey(), "Add tasks", "Add tasks to your new project", today(), "high");
        const t3 = new Task(generateUniqueKey(), "This is a completed task", "Oh hey there!", today(), "high", true);
        const t4 = new Task(generateUniqueKey(), "Task for tomorrow", "This is a task for tomorrow", addDays(today(), 1), "high");
        const t5 = new Task(generateUniqueKey(), "This is a medium priority task", "This is not an important task in your project", addDays(today(), 8), "medium");
        const t6 = new Task(generateUniqueKey(), "This is a low priority task", "This is not an important task in your project", addDays(today(), 7), "low");
        const t7 = new Task(generateUniqueKey(), "This is a none priority task", "This is not an important task in your project", addDays(today(), 6), "");
        const t8 = new Task(generateUniqueKey(), "This is a a task for the far future", "Time is like a river...", addDays(today(), 371), "high");

        project.addTask(t1);
        project.addTask(t2);
        project.addTask(t3);
        project.addTask(t4);
        project.addTask(t5);
        project.addTask(t6);
        project.addTask(t7);
        project.addTask(t8);

        this.taskProjectIndex[t1.id] = project;
        this.taskProjectIndex[t2.id] = project;
        this.taskProjectIndex[t3.id] = project;
        this.taskProjectIndex[t4.id] = project;
        this.taskProjectIndex[t5.id] = project;
        this.taskProjectIndex[t6.id] = project;
        this.taskProjectIndex[t7.id] = project;
        this.taskProjectIndex[t8.id] = project;

        return project;
    }

    loadUserProjects() {
        const projectsJSON = loadObject("projects");

        if (!projectsJSON || projectsJSON.length === 0) {
            return {};
        }

        return this.buildProjects(projectsJSON);
    }

    buildProjects(projectsJSON) {
        // format for projectsJSON:
        //     [
        //       {projectID: project.id,
        //        projectTitle: project.title,
        //          tasks: [
        //            {taskID: task.id,
        //             taskTitle: task.title,
        //             taskDescription: task.description,
        //             taskDueDate: task.dueDate,
        //             taskPriority: task.priority,
        //             taskComplete: task.complete
        //             },
        //             {nextTask...},...
        //          ],
        //       },
        //       {nextProject...},...
        //     ]

        const projects = {};

        for (const projectJSON of projectsJSON) {
            const project = this.buildProject(projectJSON);
            projects[project.id] = project;
        }

        return projects;
    }

    buildProject(projectJSON) {
        const project = new Project(projectJSON.projectID, projectJSON.title);
        for (const taskJSON of projectJSON.tasks) {
            const task = new Task(taskJSON.taskID, taskJSON.taskTitle, taskJSON.taskDescription, taskJSON.taskDueDate, taskJSON.taskPriority, taskJSON.taskComplete);
            project.addTask(task);
            this.taskProjectIndex[task.id] = project;
        }
        return project;
    }

    save() {
        const projects = this.unbuildProjects(Object.values(this.projects));
        const project = this.unbuildProject(this.defaultProject);

        saveObject("projects", projects);
        saveObject("default-project", project);

        // Save scenarios
        //     new, edit, or delete task
        //     new, edit, or delete project
    }

    unbuildProjects(projects) {
        const data = [];

        for (const project of projects) {
            data.push(this.unbuildProject(project));
        }

        return data;
    }

    unbuildProject(project) {
        const data = {};
        data.projectID = project.id;
        data.title = project.title;
        const tasksData = [];
        for (const task of Object.values(project.tasks)) {
            tasksData.push({
                taskID: task.id,
                taskTitle: task.title,
                taskDescription: task.description,
                taskDueDate: task.dueDate,
                taskPriority: task.priority,
                taskComplete: task.complete
            });
        }
        data.tasks = tasksData;

        return data;
    }

    isActiveViewAProject() {
        const project = this.projects[this.activeView];
        if (project) {
            return true;
        }
        return false;
    }

    getActiveProject() {
        return this.projects[this.activeView];
    }

    getActiveViewTitle() {
        if (this.isActiveViewAProject()) {
            return this.getActiveProject().title;
        }
        return capitalize(this.activeView);
    }

    createProject(title) {
        const projectID = generateUniqueKey();
        const project = new Project(projectID, title);
        this.projects[projectID] = project;
        this.save();
        return projectID;
    }

    removeProject(projectID) {
        const project = this.projects[projectID];
        for (let task of project.getTasks()) {
            delete this.taskProjectIndex[task.taskID];
        }
        delete this.projects[projectID];
        this.save();
    }

    createTask(projectID, title, description, dueDate, priority, complete = false) {
        const project = this.isDefault(projectID) ? this.defaultProject : this.projects[projectID];
        const taskID = generateUniqueKey();
        this.addTask(new Task(taskID, title, description, dueDate, priority, complete), project);
        return taskID;
    }

    addTask(task, project) {
        project.addTask(task);
        this.taskProjectIndex[task.id] = project;
        this.save();
    }

    toggleCompleteTask(task) {
        task.toggleComplete();
        this.save();
        return task.complete;
    }

    editTask(destProjectID, taskID, title, description, dueDate, priority) {
        // First edit task
        let currentProject = this.taskProjectIndex[taskID];
        currentProject.editTask(taskID, title, description, dueDate, priority);

        // Check if moving to a different project
        if (destProjectID === currentProject.id) {
            this.save();
            return;
        }

        // Remove task from old project
        const taskToMove = currentProject.tasks[taskID];
        this.removeTask(taskID);

        // Check if destination project is default project
        let destProject;
        if (this.isDefault(destProjectID)) {
            destProject = this.defaultProject;
        } else {
            destProject = this.projects[destProjectID];
        }

        // Add task to new project
        this.addTask(taskToMove, destProject);
        this.save();
    }

    editProject(projectID, title) {
        const project = this.projects[projectID];
        project.title = title;
        this.save();
    }

    removeTask(taskID) {
        const project = this.taskProjectIndex[taskID];
        project.removeTask(taskID);
        delete this.taskProjectIndex[taskID];
        this.save();
    }

    getProjectFromTaskID(taskID) {
        return this.taskProjectIndex[taskID];
    }

    getProjects() {
        return Object.values(this.projects);
    }

    /**
     * Returns a list of all projects,
     * Including project that 'projectless' tasks are assigned to.
     * @return {Project[]} 
     * @memberof ToDo
     */
    getAllProjects() {
        return [this.defaultProject].concat(Object.values(this.projects));
    }

    getTask(taskID) {
        // Get project then get task from project
        const project = this.taskProjectIndex[taskID];
        return project.tasks[taskID];
    }

    getTasks() {
        const project = this.projects[this.activeView];
        let tasks;

        if (project) {
            tasks = this.getTasksByProject(project);
        } else {
            tasks = this.getTasksByCriteria(this.activeView);
        }

        return this.sortTasks(tasks);
    }

    sortTasks(tasks) {
        // Sort tasks by criteria: overdue, importance, date

        tasks.sort((a, b) => {

            const overDue = this.calcOverDue(a, b);
            if (overDue < 0) {
                // Task a is overdue (and task b is not)
                return -1;
            } else if (overDue > 0) {
                // Task b is overdue (and task a is not)
                return 1;
            }

            let priority = this.calcPriority(a, b);
            // If higher priority on task a, then task a first
            if (priority < 0) {
                return -1;
            }
            if (priority > 0) {
                return 1;
            }

            // Compare due dates
            const temp = compareDateAsc(a.dueDate, b.dueDate);
            if (temp < 0) {
            } else if (temp > 0) {

            } else {
            }
            return compareDateAsc(a.dueDate, b.dueDate);
        });

        return tasks;
    }

    calcPriority(task1, task2) {
        // Return -1 if task1 has higher priority
        // Return 0 if task1 and task2 have same priority
        // Return 1 if task2 has higher priority

        if (task1.priority === task2.priority) {
            return 0;
        }

        const priorities = ["high", "medium", "low", ""];
        const priority1 = priorities.indexOf(task1.priority);
        const priority2 = priorities.indexOf(task2.priority);

        // If priority1 is higher, then place that first
        if (priority1 < priority2) {
            return -1;
        }

        return 1;
    }

    calcOverDue(task1, task2) {
        // Return -1 if task1 is overdue (and task2 is not overdue)
        // Return 0 if task1 and task2 are both overdue or not overdue
        // Return 1 if task2 is overdue (and task1 is not overdue)

        const overDueA = compareDateAsc(task1.dueDate, today());
        const overDueB = compareDateAsc(task2.dueDate, today());

        // If not equal, check if one is overdue
        if (overDueA !== overDueB) {
            // (Both task a and b cannot be overdue at this point)
            // Task a is overdue (and not task b)
            if (overDueA < 0) {
                return -1;
            }

            // Task b is overdue
            if (overDueB < 0) {
                return 1;
            }
        }

        return 0;
    }


    getTasksByProject(project) {
        const tasks = [];
        for (const task of project.getTasks()) {
            if (task.complete) {
                continue;
            }
            tasks.push(task);
        }
        return tasks;
    }
    getAllTasks(checkComplete = true) {
        const tasks = [];
        for (const project of this.getAllProjects()) {
            for (const task of project.getTasks()) {
                if (checkComplete && task.complete) {
                    continue;
                }
                tasks.push(task);
            }
        }
        return tasks;
    }

    getTasksByCriteria(type) {
        if (type === "all") {
            return this.getAllTasks();
        }
        if (type === "today") {
            return this.getTodayTasks();
        }
        if (type === "week") {
            return this.getWeekTasks();
        }
        if (type === "important") {
            return this.getImportantTasks();
        }
        if (type === "complete") {
            return this.getCompletedTasks();
        }
        return [];
    }

    getTodayTasks() {
        const tasks = [];
        for (const task of this.getAllTasks()) {
            if (!isToday(task.dueDate)) {
                continue;
            }
            tasks.push(task);
        }
        return tasks;
    }

    getWeekTasks() {
        const tasks = [];
        for (const task of this.getAllTasks()) {
            if (!isThisWeek(task.dueDate)) {
                continue;
            }
            tasks.push(task);
        }
        return tasks;
    }

    getImportantTasks() {
        const tasks = [];
        for (const task of this.getAllTasks()) {
            if (task.priority !== "high") {
                continue;
            }
            tasks.push(task);
        }
        return tasks;
    }

    getCompletedTasks() {
        const tasks = [];
        for (const task of this.getAllTasks(false)) {
            if (task.complete) {
                tasks.push(task);
            }
        }
        return tasks;
    }

    getProjectName(projectID) {
        return this.projects[projectID].title;
    }

    isDefault(project) {
        return (project === this.DEFAULT_PROJECT_ID) || (project.id === this.DEFAULT_PROJECT_ID);
    }

}