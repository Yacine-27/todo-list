import Todo from "./todo";

export default class Project {
  static id = 0;
  #todos;
  #name;
  #id;
  constructor(name) {
    this.#todos = [];
    this.#name = name;
    this.#id = Project.id++;
  }
  getId() {
    return this.#id;
  }
  setId(id) {
    this.#id = id;
  }
  setStaticId(id) {
    Project.id = id;
  }
  getName() {
    return this.#name;
  }
  setName(newName) {
    this.#name = newName;
  }
  getTodo(id) {
    return this.#todos.find((todo) => todo.getId() === id);
  }
  getAllTodos() {
    return this.#todos;
  }
  add(todo) {
    this.#todos.push(todo);
  }
  remove(id) {
    const index = this.#todos.findIndex((todo) => todo.getId() === id);
    if (index !== -1) this.#todos.splice(index, 1);
  }
  setDone(id) {
    this.getTodo(id).setDone();
  }
  sortByDate() {
    this.#todos.sort((a, b) => a.getDueDate() - b.getDueDate());
  }

  getTodosNumber() {
    return this.#todos.length;
  }

  getDoneNumber() {
    return this.#todos.reduce((acc, todo) => acc + (todo.isDone() ? 1 : 0), 0);
  }

  percentage() {
    return this.#todos.length === 0
      ? "0"
      : ((this.getDoneNumber() / this.#todos.length) * 100).toFixed(0);
  }

  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      todos: this.getAllTodos().map((todo) => todo.toJSON()),
    };
  }
  static parseProjectString(projectObj) {
    const project = new Project(projectObj.name);
    project.setId(projectObj.id);
    projectObj.todos.forEach((todo) => project.add(Todo.parseTodoString(todo)));
    return project;
  }
}
