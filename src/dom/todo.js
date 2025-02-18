import "./todo.css";

export const todosListDOM = document.querySelector(".todos");

export const addTodoDOM = function (todo) {
  const html = `<div class="todo" data-todo-id='${todo.getId()}'>
                  <button class="set-done"> ${
                    todo.isDone() ? "Set Undone" : "Set Done"
                  } </button>
                  <p class="todo-title">${todo.getTitle()}</p>
                  ${
                    todo.getDueDate()
                      ? `<p class="todo-date">${todo.getDueDateDifference()}</p>`
                      : ""
                  } 
                  ${
                    todo.getPriority()
                      ? `<button class="todo-priority">${displayPriority(
                          todo.getPriority()
                        )}</button>`
                      : ""
                  }
                  ${
                    todo.getDescription()
                      ? ` <p class="todo-description">${todo.getDescription()}</p>`
                      : ""
                  }
                 
                  <button class="edit-todo-button" >Edit</button>
                  <button class="remove-todo-button">Remove</button>
              </div>`;
  todosListDOM.insertAdjacentHTML("beforeend", html);
};

export const displayPriority = function (priorityNumber) {
  if (priorityNumber === 1) return "Low Priority";
  else if (priorityNumber === 2) return "Med. Priority";
  else if (priorityNumber === 3) return "High Priority";
  else return null;
};
