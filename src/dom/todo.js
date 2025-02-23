import "./todo.css";

export const todosListDOM = document.querySelector(".todos");

export const addTodoDOM = function (todo) {
  const html = `<div class="todo  ${
    todo.isDone() ? "done-todo" : ""
  } }" data-todo-id='${todo.getId()}'>
                  <button class="set-done ${
                    todo.isDone() ? "done-button" : ""
                  } "> ${todo.isDone() ? "Set Undone" : "Set Done"} </button>
                  <p class="todo-title">${todo.getTitle()} </p>
                  ${
                    todo.getDueDate()
                      ? `<p class="todo-date hidden">${todo.getDueDateDifference()} ${todo.isOverDue() ? "(Overdue 🕔)".toUpperCase() : ""}</p>`
                      : ""
                  } 
                  ${
                    todo.getPriority()
                      ? `<button class="todo-priority ${
                          todo.isDone() ? "done-button" : ""
                        } ${getPriorityClass(
                          todo.getPriority(),
                        )} hidden">${displayPriority(
                          todo.getPriority(),
                        )}</button>`
                      : ""
                  }
                  ${
                    todo.getDescription()
                      ? ` <p class="todo-description hidden">${todo.getDescription()}</p>`
                      : ""
                  }
                 
                  <button class="edit-todo-button hidden" >Edit</button>
                  <button class="remove-todo-button hidden">Remove</button>
                  <button class="expand-todo">🔽</button>
              </div>`;
  todosListDOM.insertAdjacentHTML("beforeend", html);
};

export const displayPriority = function (priorityNumber) {
  if (priorityNumber === 1) return "Low Priority";
  else if (priorityNumber === 2) return "Med. Priority";
  else if (priorityNumber === 3) return "High Priority";
  else return null;
};

export const getPriorityClass = function (priority) {
  return priority === 2
    ? "medium-priority"
    : priority === 3
      ? "high-priority"
      : "low-priority";
};
