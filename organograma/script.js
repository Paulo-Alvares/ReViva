function teamToClass(team) {
  switch (team.toLowerCase()) {
    case "diretoria":
      return "team-diretoria";
    case "tecnologia":
      return "team-tecnologia";
    case "finanças":
      return "team-financas";
    // ... adicione conforme necessário
    default:
      return "";
  }
}

function createNode(employee) {
  const wrapper = document.createElement("div");
  wrapper.className = `node ${teamToClass(employee.team)}`;

  const hasChildren = employees.some((e) => e.managerId === employee.id);
  let arrow = null;
  if (hasChildren) {
    arrow = document.createElement("span");
    arrow.className = "arrow collapsed";
    wrapper.appendChild(arrow);
  }

  const img = document.createElement("img");
  img.src = employee.photo;
  img.alt = `${employee.name} foto`;
  wrapper.appendChild(img);

  const info = document.createElement("div");
  info.className = "node-info";
  info.innerHTML = `<strong>${employee.name} ${employee.surname}</strong><br><small>${employee.role}</small>`;
  wrapper.appendChild(info);

  info.addEventListener("click", () => showEmployeeModal(employee.id));

  let childrenContainer = null;
  if (hasChildren) {
    childrenContainer = document.createElement("div");
    childrenContainer.className = "child-list";
    childrenContainer.style.display = "none";

    employees
      .filter((e) => e.managerId === employee.id)
      .forEach((child) => {
        childrenContainer.appendChild(createNode(child));
      });
    wrapper.appendChild(childrenContainer);

    arrow.addEventListener("click", (e) => {
      e.stopPropagation();
      if (childrenContainer.style.display === "none") {
        childrenContainer.style.display = "";
        arrow.classList.remove("collapsed");
        arrow.classList.add("expanded");
      } else {
        childrenContainer.style.display = "none";
        arrow.classList.remove("expanded");
        arrow.classList.add("collapsed");
      }
    });
  }
  return wrapper;
}

function renderOrgChart() {
  const container = document.getElementById("org-chart");
  container.innerHTML = "";
  employees
    .filter((e) => e.managerId === null)
    .forEach((rootEmp) => container.appendChild(createNode(rootEmp)));
}

function showEmployeeModal(empId) {
  const emp = employees.find((e) => e.id === empId);
  if (!emp) return;
  const modal = document.getElementById("modal");
  const body = document.getElementById("modal-body");
  body.innerHTML = `
    <div style="text-align:center">
      <img src="${
        emp.photo
      }" style="border-radius:50%; width:90px; border:2px solid #eee;"><br>
      <strong style="font-size:1.32em">${emp.name} ${emp.surname}</strong><br>
      <small><b>${emp.role}</b><br>Equipe: ${emp.team}</small>
    </div>
    <hr>
    <strong>Descrição:</strong> ${emp.description || ""}<br><br>
    <strong>Responsabilidades:</strong> ${emp.responsibilities || ""}<br><br>
    <strong>País:</strong> ${emp.country || ""}<br>
    <strong>Tempo de empresa:</strong> ${emp.time || ""}
  `;
  modal.classList.add("show");
}

document.getElementById("close-modal").onclick = () => {
  document.getElementById("modal").classList.remove("show");
};

window.onclick = function (event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) modal.classList.remove("show");
};

renderOrgChart();
