import "./project.css";
import { addTodoDOM, todosListDOM } from "./todo";
const projectsDOM = document.querySelector(".projects");

export const displayProject = function (project) {
  const html = `<li class="project" data-project-id="${project.getId()}" >
                  <p class='project-name' contenteditable='true' spellcheck="false">${project.getName()}</p>
                  <button class="remove-project">x</button>
                </li>`;
  projectsDOM.insertAdjacentHTML("beforeend", html);
};

export const displayProjectTodos = function (project) {
  todosListDOM.innerHTML = "";
  project.getAllTodos().forEach((todo) => addTodoDOM(todo));
};
