import "./dateHeader.css";
const listHeaderDOM = document.querySelector(".list-header");

function getMonthInitialAndDay(date) {
  const options = { month: "short" };
  const month = date.toLocaleDateString("en-US", options);
  const day = date.getDate();
  return { month, day };
}

export const addDateHeader = function () {
  const { month, day } = getMonthInitialAndDay(new Date());
  const html = `<div class="list-header-date">
  <div class="list-header-date-month">${month}</div>
  <div class="list-header-date-day">${day}</div>
</div>`;
  listHeaderDOM.insertAdjacentHTML("afterbegin", html);
};
