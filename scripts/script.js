document.addEventListener("DOMContentLoaded", () => {
  renderOrgChart();

  const modal = document.getElementById("modal");
  document.getElementById("close-modal").onclick = () =>
    modal.classList.remove("show");
  window.onclick = (event) => {
    if (event.target === modal) modal.classList.remove("show");
  };
});

function teamToClass(team) {
  if (!team) return "";
  const teamSanitized = team
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
  return `team-${teamSanitized}`;
}

function createEmployeeSubtree(employee) {
  const nodeWrapper = document.createElement("div");
  nodeWrapper.className = "node-wrapper";

  const node = document.createElement("div");
  node.className = `node ${teamToClass(employee.team)}`;
  node.addEventListener("click", (e) => {
    if (!e.target.closest(".arrow")) {
      showEmployeeModal(employee);
    }
  });

  const img = document.createElement("img");
  img.className = "node-photo";
  img.src = employee.photo;
  img.alt = `${employee.name} foto`;
  node.appendChild(img);

  const info = document.createElement("div");
  info.className = "node-info";

  // Cria o marcador colorido do time
  const teamDot = document.createElement("span");
  teamDot.className = `team-dot ${teamToClass(employee.team)}`;

  // Monta o conteúdo
  info.appendChild(teamDot);
  info.innerHTML += `<strong>${employee.name} ${employee.surname}</strong><br><small>${employee.role}</small>`;

  node.appendChild(info);

  nodeWrapper.appendChild(node);

  const children = employees.filter((e) => e.managerId === employee.id);
  if (children.length > 0) {
    const arrow = document.createElement("span");
    arrow.className = "arrow collapsed";
    node.appendChild(arrow);

    const childList = document.createElement("div");
    childList.className = "child-list hidden";

    children.forEach((child) => {
      childList.appendChild(createEmployeeSubtree(child));
    });
    nodeWrapper.appendChild(childList);

    const toggleChildren = (e) => {
      e.stopPropagation();
      const isHidden = childList.classList.toggle("hidden");
      arrow.classList.toggle("collapsed", isHidden);
      arrow.classList.toggle("expanded", !isHidden);
    };

    arrow.addEventListener("click", toggleChildren);
  }

  return nodeWrapper;
}

function renderOrgChart() {
  const container = document.getElementById("org-chart");
  container.innerHTML = "";

  const ceo = employees.find((e) => e.managerId === null);
  if (!ceo) return;

  const ceoLevel = document.createElement("div");
  ceoLevel.className = "level ceo-level";

  const ceoNode = document.createElement("div");
  ceoNode.className = `node ${teamToClass(ceo.team)}`;
  ceoNode.addEventListener("click", () => showEmployeeModal(ceo));

  const ceoImg = document.createElement("img");
  ceoImg.className = "node-photo";
  ceoImg.src = ceo.photo;
  ceoImg.alt = `${ceo.name} foto`;
  ceoNode.appendChild(ceoImg);

  const ceoInfo = document.createElement("div");
  ceoInfo.className = "node-info";
  ceoInfo.innerHTML = `<strong>${ceo.name} ${ceo.surname}</strong><br><small>${ceo.role}</small>`;
  ceoNode.appendChild(ceoInfo);

  ceoLevel.appendChild(ceoNode);
  container.appendChild(ceoLevel);

  const teamLeaders = employees.filter((e) => e.managerId === ceo.id);
  if (teamLeaders.length === 0) return;

  const teamsLevel = document.createElement("div");
  teamsLevel.className = "level teams-level";

  teamLeaders.forEach((leader) => {
    const teamColumn = document.createElement("div");
    teamColumn.className = "team-column";
    teamColumn.appendChild(createEmployeeSubtree(leader));
    teamsLevel.appendChild(teamColumn);
  });

  container.appendChild(teamsLevel);
}

function showEmployeeModal(emp) {
  const modal = document.getElementById("modal");
  const body = document.getElementById("modal-body");
  const teamClassName = teamToClass(emp.team);

  body.innerHTML = `
    <div class="modal-header">
      <img 
        class="modal-photo ${teamClassName}" 
        src="${emp.photo}" 
        alt="${emp.name} foto"
      >
      <strong>${emp.name} ${emp.surname}</strong> <br>
      <small><b>${emp.role}</b> | ${emp.team}</small>
    </div>
    <hr class="${teamClassName}">
    <p>
      <strong>Descrição:</strong> <br> 
      ${emp.description || "N/A"}
    </p>
    <p>
      <strong>Responsabilidades:</strong> <br>
      ${emp.responsibilities || "N/A"}
    </p>
    <img class="modal-mascot-1" src="./assets/team/mascots/${teamClassName}-1.svg" alt="Mascote ReViva" />
    <img class="modal-mascot-2" src="./assets/team/mascots/${teamClassName}-2.svg" alt="Mascote ReViva" />
  `;

  modal.classList.add("show");
}
