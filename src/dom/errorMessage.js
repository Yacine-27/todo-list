const todoFormDOM = document.querySelector(".add-todo-form");
export const addErrorMessage = function (message) {
  const html = `<div class="error-message">
                  <h3>${message}</h3>
                </div>`;
  todoFormDOM.insertAdjacentHTML("beforebegin", html);
};

export const removeErrorMessage = function () {
  if (document.querySelector(".error-message"))
    document.querySelector(".error-message").remove();
};
