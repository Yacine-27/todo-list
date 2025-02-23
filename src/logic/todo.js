import { formatDistanceToNow, format } from "date-fns";
export default class Todo {
  #title;
  #description;
  #dueDate;
  #priority;
  #isComplete = false;
  #id;
  static id = 0;

  constructor(title, description, priority, dueDate) {
    this.#title = title;
    this.#description = description;
    this.#priority = priority;
    this.#dueDate = dueDate;
    this.#id = Todo.id++;
  }
  static isFutureDate(date) {
    if (!date) return true;
    return new Date(date) >= new Date();
  }

  static getNextPriority(oldPriority) {
    const priorities = [1, 2, 3];
    const currentIndex = priorities.findIndex(
      (element) => element === oldPriority,
    );
    const newPriority =
      currentIndex === -1 || currentIndex === priorities.length - 1
        ? priorities[0]
        : priorities[currentIndex + 1];
    console.log(oldPriority, newPriority);
    return newPriority;
  }
  setId(id) {
    this.#id = id;
  }
  getId() {
    return this.#id;
  }
  setDone() {
    this.#isComplete = true;
  }
  setUndone() {
    this.#isComplete = false;
  }
  isDone() {
    return this.#isComplete;
  }

  setTitle(newTitle) {
    this.#title = newTitle;
  }

  getTitle() {
    return this.#title;
  }

  setDescription(newDescription) {
    this.#description = newDescription;
  }

  getDescription() {
    return this.#description;
  }

  setPriority(newPriority) {
    this.#priority = newPriority;
  }

  getPriority() {
    return this.#priority;
  }

  setDueDate(newDate) {
    if (!Todo.isFutureDate(newDate)) {
      console.log("not a valid date");
      return;
    }
    this.#dueDate = newDate;
  }

  getDueDate() {
    return this.#dueDate;
  }

  getDueDateDifference() {
    return formatDistanceToNow(this.#dueDate, { addSuffix: true });
  }

  getFormattedDate() {
    return format(this.#dueDate, "dd/MM/yyyy");
  }

  isOverDue() {
    return !this.isDone() && !Todo.isFutureDate(this.getDueDate());
  }

  toJSON() {
    return {
      title: this.getTitle(),
      description: this.getDescription(),
      dueDate: this.#dueDate,
      priority: this.getPriority(),
      isComplete: this.isDone(),
    };
  }
  static parseTodoString(todoObject) {
    const newTodo = new Todo(
      todoObject.title,
      todoObject.description ? todoObject.description : "",
      todoObject.priority ? todoObject.priority : "",
      todoObject.dueDate ? new Date(todoObject.dueDate) : "",
    );
    if (todoObject.isComplete) newTodo.setDone();
    return newTodo;
  }
}
