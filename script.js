let clubs = JSON.parse(localStorage.getItem("clubs")) || [];
let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
let swipeIndex = 0;

/* ---------- SAVE ---------- */
function save() {
  localStorage.setItem("clubs", JSON.stringify(clubs));
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

/* ---------- ADD CLUB ---------- */
function addClub() {
  let name = document.getElementById("name").value;
  let leader = document.getElementById("leader").value;
  let count = parseInt(document.getElementById("count").value);

  if (!name || !leader || isNaN(count)) return;

  let members = [];
  for (let i = 1; i <= count; i++) {
    members.push("Member " + i);
  }

  clubs.push({
    id: Date.now(),
    name,
    leader,
    members,
    presentToday: [],
    history: []
  });

  save();
  renderAll();
}

/* ---------- SWIPE SYSTEM ---------- */
function getLowClubs() {
  return clubs.filter(c => c.members.length < 8);
}

function renderSwipe() {
  let card = document.getElementById("swipeCard");
  if (!card) return;

  let low = getLowClubs();

  if (low.length === 0) {
    card.innerHTML = "No low attendance clubs 🎉";
    return;
  }

  let club = low[swipeIndex % low.length];

  card.innerHTML = `
    <h2>${club.name}</h2>
    <p>${club.members.length} members</p>
    <p>Leader: ${club.leader}</p>
  `;
}

function skipClub() {
  swipeIndex++;
  renderSwipe();
}

function bookmarkClub() {
  let low = getLowClubs();
  let club = low[swipeIndex % low.length];

  if (!bookmarks.find(b => b.id === club.id)) {
    bookmarks.push(club);
    save();
  }

  renderBookmarks();
  skipClub();
}

function renderBookmarks() {
  let box = document.getElementById("bookmarks");
  if (!box) return;

  box.innerHTML = "";
  bookmarks.forEach(c => {
    box.innerHTML += `<p>⭐ ${c.name}</p>`;
  });
}

/* ---------- DIRECTORY PAGE ---------- */
function renderDirectory() {
  let box = document.getElementById("clubDirectory");
  if (!box) return;

  box.innerHTML = "";

  clubs.forEach(c => {
    box.innerHTML += `
      <div class="club-box" onclick="openClub(${c.id})">
        <h2>${c.name}</h2>
        <p>${c.members.length} members</p>
        <p>${c.members.length < 8 ? '🔴 Low' : '🟢 Healthy'}</p>
      </div>
    `;
  });
}
/* ---------- OPEN CLUB ---------- */
function openClub(id) {
  window.location.href = "club.html?id=" + id;
}

/* ---------- CLUB DASHBOARD ---------- */
function getClub() {
  let id = new URLSearchParams(window.location.search).get("id");
  return clubs.find(c => c.id == id);
}

function renderClubPage() {
  let club = getClub();
  let box = document.getElementById("clubDashboard");
  if (!club || !box) return;

  let percent = club.members.length === 0 ? 0 :
    Math.round((club.presentToday.length / club.members.length) * 100);

  let membersHTML = club.members.map((m, i) => {
    let present = club.presentToday.includes(m);

    return `
      <div>
        <input value="${m}" onchange="editMember(${i}, this.value)">
        <button onclick="toggle('${m}')">${present ? 'Present' : 'Absent'}</button>
        <button onclick="deleteMember(${i})">X</button>
      </div>
    `;
  }).join("");

  box.innerHTML = `
    <div class="card">
      <h2>${club.name}</h2>
      <p>${club.leader}</p>
      <p>${percent}% attendance today</p>

      ${membersHTML}

      <button onclick="addMember()">➕ Add Member</button>
      <button onclick="saveDay()">💾 Save Attendance</button>

      <h3>History</h3>
      ${club.history.map(h => `<p>${h.date}: ${h.present.join(", ")}</p>`).join("")}
    </div>
  `;
}

/* ---------- MEMBER ACTIONS ---------- */
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
  if (!name) return;

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

/* ---------- INIT ---------- */
function renderAll() {
  renderSwipe();
  renderBookmarks();
  renderDirectory();
  renderClubPage();
}

renderAll();
