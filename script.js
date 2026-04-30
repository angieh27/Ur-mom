let clubs = JSON.parse(localStorage.getItem("clubs")) || [];

function save() {
  localStorage.setItem("clubs", JSON.stringify(clubs));
}

/* ---------------- CREATE CLUB ---------------- */

function addClub() {
  let name = document.getElementById("name").value;
  let leader = document.getElementById("leader").value;
  let count = parseInt(document.getElementById("count").value);

  let members = [];
  for (let i = 1; i <= count; i++) members.push("Member " + i);

  clubs.push({
    id: Date.now(),
    name,
    leader,
    members,
    presentToday: [],
    history: []
  });

  save();
  renderIndex();
}

/* ---------------- INDEX PAGE ---------------- */

function renderIndex() {
  let box = document.getElementById("clubList");
  if (!box) return;

  box.innerHTML = "";

  clubs.forEach(c => {
    let status = c.members.length < 8 ? "LOW" : "HEALTHY";

    box.innerHTML += `
      <div class="club-box" onclick="openClub(${c.id})">
        <h3>${c.name}</h3>
        <p>${c.leader}</p>
        <p>Members: ${c.members.length}</p>
        <p>Status: ${status}</p>
      </div>
    `;
  });
}

/* ---------------- OPEN CLUB PAGE ---------------- */

function openClub(id) {
  window.location.href = "club.html?id=" + id;
}

/* ---------------- CLUB DASHBOARD ---------------- */

function getClub() {
  let id = new URLSearchParams(window.location.search).get("id");
  return clubs.find(c => c.id == id);
}

function renderClubPage() {
  let club = getClub();
  if (!club) return;

  let box = document.getElementById("clubDashboard");

  let percent = club.members.length === 0 ? 0 :
    Math.round((club.presentToday.length / club.members.length) * 100);

  let membersUI = club.members.map((m, i) => `
    <div>
      <input value="${m}" onchange="editMember(${i}, this.value)">
      <button onclick="toggle('${m}')">Present</button>
      <button onclick="deleteMember(${i})">X</button>
    </div>
  `).join("");

  box.innerHTML = `
    <h2>${club.name}</h2>
    <p>${club.leader}</p>
    <p>${percent}% attendance today</p>

    <h3>Members</h3>
    ${membersUI}

    <button onclick="addMember()">+ Add Member</button>
    <button onclick="saveDay()">Save Attendance Day</button>

    <h3>History</h3>
    ${renderHistory(club)}
  `;
}

function toggle(name) {
  let club = getClub();

  if (club.presentToday.includes(name)) {
    club.presentToday = club.presentToday.filter(x => x !== name);
  } else {
    club.presentToday.push(name);
  }

  save();
  renderClubPage();
}

function addMember() {
  let club = getClub();
  let name = prompt("Member name:");
  club.members.push(name);
  save();
  renderClubPage();
}

function editMember(i, val) {
  let club = getClub();
  club.members[i] = val;
  save();
}

function deleteMember(i) {
  let club = getClub();
  club.members.splice(i, 1);
  save();
  renderClubPage();
}

function saveDay() {
  let club = getClub();

  club.history.push({
    date: new Date().toLocaleDateString(),
    present: [...club.presentToday]
  });

  club.presentToday = [];
  save();
  renderClubPage();
}

function renderHistory(club) {
  return club.history.map(h =>
    `<p><b>${h.date}</b>: ${h.present.join(", ")}</p>`
  ).join("");
}

/* ---------------- INIT ---------------- */

renderIndex();
renderClubPage();
