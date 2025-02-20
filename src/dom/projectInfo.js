import "./projectInfo.css";

const header = document.querySelector(".list-header");

export default function (project) {
  const projectInfoDOM = document.querySelector(".project-info");
  const html = `<div class="project-info">
                  <h3> ${
                    project.getTodosNumber() === 0
                      ? `${project.getName()} doesn't have any todos yet`
                      : `${project.getDoneNumber()} Todos done out of ${project.getTodosNumber()} , ${project.percentage()} % .`
                  } </h3>
                </div>`;
  if (projectInfoDOM) {
    projectInfoDOM.remove();
  }
  header.insertAdjacentHTML("afterend", html);
}
// where do we wanna run this ? with initial run (check if there is selected project) , with each done and undone , with changing projects with adding and removing todos . we also wanna remove the element when removing a project or no projects.
