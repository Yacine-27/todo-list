import "./style.css";
import { displayProject, displayProjectTodos } from "./dom/project";
import { addDateHeader } from "./dom/dateHeader";
import Project from "./logic/project";
import Todo from "./logic/todo";
import {
  addTodoDOM,
  displayPriority,
  getPriorityClass,
  todosListDOM,
} from "./dom/todo";
import { addErrorMessage, removeErrorMessage } from "./dom/errorMessage";
import AddProjectInfo from "./dom/projectInfo";

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
const resetFormButton = document.querySelector(".reset-form");
const sortButton = document.querySelector(".sort-by-date");

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
  AddProjectInfo(selectedProject);
  todoFormDOM.classList.remove("hidden");
  sortButton.classList.remove("hidden");
};

const addProject = function (projectName) {
  const project = new Project(projectName);
  projects.push(project);
  displayProject(project);
  selectProject(project.getId());
};

const removeProject = function (id) {
  projects.splice(
    projects.findIndex((project) => project.getId() === id),
    1
  );
  selectProjectDOM(id).remove();
  todosListDOM.innerHTML = "";
  selectedProject = null;
  todoFormDOM.classList.add("hidden");
  sortButton.classList.add("hidden");
  document.querySelector(".project-info")?.remove();
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
  AddProjectInfo(selectedProject);
};

const removeTodo = function (todoId) {
  selectedProject.remove(todoId);
  findTodoDom(todoId).remove();
};

const changeTodoPriority = function (todoId) {
  const todo = selectedProject.getTodo(todoId);
  const priorityButton = findTodoDom(todoId).querySelector(".todo-priority");
  const newPriority = Todo.getNextPriority(todo.getPriority());
  todo.setPriority(newPriority);
  priorityButton.textContent = displayPriority(todo.getPriority());
  priorityButton.classList.remove("medium-priority", "high-priority");
  priorityButton.classList.add(getPriorityClass(newPriority));
};

const toggleDone = function (todoId) {
  const todo = selectedProject.getTodo(todoId);
  const todoDOM = findTodoDom(todoId);
  const buttonText = todoDOM.querySelector(".set-done");
  if (todo.isDone()) {
    todo.setUndone();
    buttonText.textContent = "Set Done";
    todoDOM.classList.remove("done-todo");
    todoDOM.querySelector(".set-done").classList.remove("done-button");
    todoDOM.querySelector(".todo-priority")?.classList.remove("done-button");
  } else {
    todo.setDone();
    buttonText.textContent = "Set Undone";
    todoDOM.classList.add("done-todo");
    todoDOM.querySelector(".set-done").classList.add("done-button");
    todoDOM.querySelector(".todo-priority")?.classList.add("done-button");
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

const sortTodos = function () {
  selectedProject.sortByDate();
  displayProjectTodos(selectedProject);
};

const resetForm = function () {
  todoFormDOM.reset();
};

const editProjectName = function (newName) {
  selectedProject.setName(newName);
  AddProjectInfo(selectedProject);
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

projectsListDOM.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    if (!event.target.classList.contains("project-name")) return;
    editProjectName(event.target.textContent);
    event.target.blur();
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

sortButton.addEventListener("click", sortTodos);

resetFormButton.addEventListener("click", resetForm);

todosListDOM.addEventListener("click", function (event) {
  const todo = event.target.closest(".todo");
  const todoId = Number(todo.dataset.todoId);
  if (event.target.classList.contains("remove-todo-button")) {
    removeTodo(todoId);
    AddProjectInfo(selectedProject);
  }
  if (event.target.classList.contains("edit-todo-button")) {
    editTodo(todoId);
    AddProjectInfo(selectedProject);
  }
  if (event.target.classList.contains("todo-priority")) {
    changeTodoPriority(todoId);
  }
  if (event.target.classList.contains("set-done")) {
    toggleDone(todoId);
    AddProjectInfo(selectedProject);
  }
  if (event.target.classList.contains("expand-todo")) {
    toggleExpanded(todoId, event.target);
  }
});

const toggleExpanded = function (todoId, collapseButton) {
  const todoDom = findTodoDom(todoId);

  if (todoDom.classList.contains("expanded-todo")) {
    collapseButton.textContent = "🔽";
    collapseTodo(todoId);
  } else {
    collapseButton.textContent = "🔼";
    expandTodo(todoId);
  }
};

const expandTodo = function (todoId) {
  const todoDOM = findTodoDom(todoId);
  todoDOM.classList.add("expanded-todo");
  Array.from(todoDOM.children).forEach((widget) =>
    widget.classList.remove("hidden")
  );
};

const collapseTodo = function (todoId) {
  const todoDOM = findTodoDom(todoId);
  todoDOM.classList.remove("expanded-todo");
  Array.from(todoDOM.children).forEach((widget) => {
    if (
      widget.classList.contains("set-done") ||
      widget.classList.contains("todo-title") ||
      widget.classList.contains("expand-todo")
    )
      return;
    widget.classList.add("hidden");
  });
};

document.addEventListener("click", function (event) {
  if (!todoFormDOM.contains(event.target)) {
    collapseForm();
  }
});

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

// TODO: try allowing to edit the project name.

// TODO: show todo date (Maybe expanding the todo element).
// TODO: after finishing advanced css course, try apply transition on the form and adding projects / todos etc..
