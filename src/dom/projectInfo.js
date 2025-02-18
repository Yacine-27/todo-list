import "./projectInfo.css";

const projectHeaderDOM = document.querySelector(".list-header");

export default function () {
  const html = `<div class="project-info">
                  <h3>4 Todos done out of 6 , 67% .</h3>
                </div>`;
  projectHeaderDOM.insertAdjacentHTML("afterend", html);
}
