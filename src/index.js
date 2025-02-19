import "./style.css";
import { displayProject, displayProjectTodos } from "./dom/project";
import { addDateHeader } from "./dom/dateHeader";
import Project from "./logic/project";
import Todo from "./logic/todo";
import { addTodoDOM, displayPriority, todosListDOM } from "./dom/todo";
import { addErrorMessage, removeErrorMessage } from "./dom/errorMessage";

addDateHeader();

let projects = [];
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
  console.log(project);
  console.log(projects);
  projects.push(project);
  displayProject(project);
  selectProject(project.getId());
};

const removeProject = function (id) {
  console.log(projects);
  console.log(projects.findIndex((project) => project.getId() === id));
  projects.splice(
    projects.findIndex((project) => project.getId() === id),
    1
  );
  console.log(projects);
  selectProjectDOM(id).remove();
  todosListDOM.innerHTML = "";
  selectedProject = null;
  todoFormDOM.classList.add("hidden");
};

const displaySavedProjects = function () {
  projects.forEach((project) => displayProject(project));
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

addProjectDOM.addEventListener("focus", function () {
  this.value = "";
});

addProjectDOM.addEventListener("focusout", function () {
  this.value = "+ Add a Project";
});

addProjectDOM.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    if (!this.value) return;
    const projectName = this.value;
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

//Remove default names
//Fix localStorage

/////////////////

//TODO: work on todo apperance (priority and hiding buttons and style change when the todo is done).
//TODO: implement sorting projects and todos.
//TODO: show completion percentage and number of completed todos.
//TODO: show todo date (Maybe expanding the todo element).
//TODO: implement expanding and collapsing todo with some cool transitions.
//TODO: try allowing to edit the project name.
//TODO: handle setting the todo to done or working on it.
//TODO: after finsishing advanced css course, try apply transition on the form and adding projects / todos etc..

// const army = new Project("Army");
// const life = new Project("Life");
// const js = new Project("JS");

// projects.push(army, life, js);
// console.log(projects);

// console.log(projects);
// const wife = new Project("Wife");
// projects.push(wife);
// console.log(projects);

const saveAllProjects = function () {
  localStorage.clear();
  projects.forEach((project) =>
    localStorage.setItem(project.getName(), JSON.stringify(project))
  );
};

window.addEventListener("unload", saveAllProjects);

const getSavedprojects = function () {
  let highestId = 0;
  Object.keys(localStorage).forEach((key) => {
    const projectString = localStorage.getItem(key);
    const projectObject = JSON.parse(projectString);
    highestId = projectObject.id > highestId ? projectObject.id : highestId;
    projects.push(Project.parseProjectString(projectObject));
  });
  Project.id = highestId + 1;
};

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.length === 0) return;
  getSavedprojects();
  displaySavedProjects();
  selectProject(projects[0].getId());
});

// // projects.splice(
// //   projects.findIndex((project) => project.getId() === 2),
// //   1
// // );

// // console.log(projects);
// // console.log(projects.length);

// // console.log(Array.isArray(projects)); // Should be true
// // console.log(Object.keys(projects)); // Should show ["0", "1", "2"]
// // console.log(Object.getOwnPropertyDescriptors(projects)); // See if `length` is messed up
// // console.log(projects.map((p, i) => ({ i, p }))); // Check index access
// console.log(projects);
