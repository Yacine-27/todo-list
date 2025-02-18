import "./style.css";
import { displayProject, displayProjectTodos } from "./dom/project";
import { addDateHeader } from "./dom/dateHeader";
import Project from "./logic/project";
import Todo from "./logic/todo";
import { addTodoDOM, displayPriority, todosListDOM } from "./dom/todo";
import { addErrorMessage, removeErrorMessage } from "./dom/errorMessage";

addDateHeader();

let projects = [];
let defaultProjectNames = 0;
let selectedProject = null;
//DOM elements
const addProjectDOM = document.querySelector(".add-project-input");
const projectsListDOM = document.querySelector(".projects");
const projectsDOM = document.getElementsByClassName("project");
const todoFormDOM = document.querySelector(".add-todo-form");
const nameWidgetDOM = document.querySelector(".widget-name-input");
const collapseFormButton = document.querySelector(".collapse-form");

const findProject = function (id) {
  return projects.find((project) => project.getId() === id);
};
const selectProjectDOM = function (id) {
  return projectsListDOM.querySelector(`[data-project-id="${id}"]`);
};

const selectProject = function (id) {
  Array.from(projectsDOM).forEach((project) => {
    project.classList.remove("selected-project");
  });
  selectedProject = projects.find((project) => project.getId() === id);
  displayProjectTodos(selectedProject);
  selectProjectDOM(id).classList.add("selected-project");

  todoFormDOM.classList.remove("hidden");
};

const addProject = function (projectName) {
  const project = new Project(projectName);
  projects.push(project);
  displayProject(project);
  selectProject(project.getId());
};

const removeProject = function (id) {
  projects.splice(
    projects.findIndex((project) => project.id === id),
    1
  );
  selectProjectDOM(id).remove();
  todosListDOM.innerHTML = "";
  selectedProject = null;
  todoFormDOM.classList.add("hidden");
};

const displaySavedProjects = function () {
  projects.forEach((project) => displayProject(project));
};

const incrementDefaultName = function (projectName) {
  if (projectName.startsWith("New Project")) {
    defaultProjectNames++;
  }
};

const expandForm = function () {
  document.querySelector(".name-widget-label").classList.remove("hidden");
  document.querySelector(".name-widget-label").classList.add("hidden");
  Array.from(todoFormDOM.children).forEach((widget) =>
    widget.classList.remove("hidden")
  );
};

const collapseForm = function () {
  document.querySelector(".name-widget-label").classList.add("hidden");
  Array.from(todoFormDOM.children).forEach((widget) => {
    if (!widget.classList.contains("name-widget"))
      widget.classList.add("hidden");
  });
  removeErrorMessage();
};

const findTodoDom = function (todoId) {
  return todosListDOM.querySelector(`[data-todo-id="${todoId}"]`);
};

const addTodo = function (todo) {
  selectedProject.add(todo);
  addTodoDOM(todo);
};

const removeTodo = function (todoId) {
  selectedProject.remove(todoId);
  findTodoDom(todoId).remove();
};

const changeTodoPriority = function (todoId) {
  const todo = selectedProject.getTodo(todoId);
  Todo.setNextPriority(todo);
  findTodoDom(todoId).querySelector(".todo-priority").textContent =
    displayPriority(todo.getPriority());
};

const toggleDone = function (todoId) {
  const todo = selectedProject.getTodo(todoId);
  const buttonText = findTodoDom(todoId).querySelector(".set-done");
  if (todo.isDone()) {
    todo.setUndone();
    buttonText.textContent = "Set Done";
  } else {
    todo.setDone();
    buttonText.textContent = "Set Undone";
  }
};

const editTodo = function (todoId) {
  const todo = selectedProject.getTodo(todoId);
  todoFormDOM.querySelector("#name").value = todo.getTitle();
  todoFormDOM.querySelector("#todo-date").value = todo.getDueDate()
    ? todo.getDueDate().toISOString().slice(0, 16)
    : "";
  todoFormDOM.querySelector("#description").value = todo.getDescription()
    ? todo.getDescription()
    : "";
  if (todo.getPriority())
    todoFormDOM.querySelector(
      `input[name="priority"][value="${todo.getPriority()}"]`
    ).checked = true;

  removeTodo(todoId);
  setTimeout(expandForm, 0);
};

console.log(projects);
addProjectDOM.addEventListener("focus", function () {
  this.value = `New Project ${
    defaultProjectNames === 0 ? "" : defaultProjectNames
  }`;
});

addProjectDOM.addEventListener("focusout", function () {
  this.value = "+ Add a Project";
});

addProjectDOM.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    if (!this.value) return;
    const projectName = this.value;
    incrementDefaultName(projectName);
    addProject(projectName);
    this.value = "+ Add a list";
    this.blur();
  }
});

projectsListDOM.addEventListener("click", (event) => {
  const project = event.target.closest(".project");
  const id = Number(project.dataset.projectId);
  if (event.target.classList.contains("remove-project")) {
    removeProject(id);
    return;
  }
  selectProject(id);
});

nameWidgetDOM.addEventListener("focus", expandForm);

collapseFormButton.addEventListener("click", collapseForm);

todoFormDOM.addEventListener("submit", function (event) {
  event.preventDefault();
  let formData = Object.fromEntries(new FormData(this).entries());
  try {
    const todo = new Todo(
      formData.name,
      formData.description ? formData.description : "",
      formData.priority ? Number(formData.priority) : 0,
      formData.date ? new Date(formData.date) : ""
    );
    addTodo(todo);
    this.reset();
    collapseForm();
  } catch (e) {
    addErrorMessage(e.message);
  }
});

todosListDOM.addEventListener("click", function (event) {
  const todo = event.target.closest(".todo");
  const todoId = Number(todo.dataset.todoId);
  if (event.target.classList.contains("remove-todo-button")) {
    removeTodo(todoId);
  }
  if (event.target.classList.contains("edit-todo-button")) {
    editTodo(todoId);
  }
  if (event.target.classList.contains("todo-priority")) {
    changeTodoPriority(todoId);
  }
  if (event.target.classList.contains("set-done")) {
    toggleDone(todoId);
  }
});

document.addEventListener("click", function (event) {
  if (!todoFormDOM.contains(event.target)) {
    collapseForm();
  }
});

const getSavedprojects = function () {
  Object.keys(localStorage).forEach((key) => {
    let projectObject = localStorage.getItem(key);
    projects.push(Project.parseProjectString(projectObject));
  });
};

const saveAllProjects = function () {
  localStorage.clear();
  projects.forEach((project) =>
    localStorage.setItem(project.getName(), JSON.stringify(project))
  );
};

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.length === 0) return;
  getSavedprojects();
  projects.forEach((project) => incrementDefaultName(project.getName()));
  displaySavedProjects();
  selectProject(projects[0].getId());
});

window.addEventListener("unload", saveAllProjects);

/////////////////////////////// test & commit.

//TODO: work on todo apperance (priority and hiding buttons and style change when the todo is done).
//TODO: implement sorting projects and todos.
//// DAY //////////
//TODO: show completion percentage and number of completed todos.
//TODO: show todo date (Maybe expanding the todo element).
//TODO: implement expanding and collapsing todo with some cool transitions.
//TODO: try allowing to edit the project name.
//TODO: handle setting the todo to done or working on it.
//TODO: after finsishing advanced css course, try apply transition on the form and adding projects / todos etc..
//TODO: revisit incrementing the default projects
