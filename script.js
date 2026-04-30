let clubs = JSON.parse(localStorage.getItem("clubs")) || [];
let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
let swipeIndex = 0;

if (clubs.length === 0) {
  clubs = [
    {
      name: "Robotics Club",
      leader: "Alex & Jamie",
      members: ["Mia","Noah","Eli","Sara","Ben","Lila","Owen"],
      presentToday: []
    },
    {
      name: "Art Club",
      leader: "Emma",
      members: ["Ruby","Cole","Skye","Nina"],
      presentToday: []
    },
    {
      name: "Debate Club",
      leader: "Priya",
      members: ["Ava","Max","Leo","Finn","Kai","Jude","Ivy","Zoe","Mason"],
      presentToday: []
    }
  ];
  save();
}

function save() {
  localStorage.setItem("clubs", JSON.stringify(clubs));
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

/* ---------------- SWIPE PAGE ---------------- */

function renderSwipe() {
  let low = clubs.filter(c => c.members.length < 8);
  let card = document.getElementById("swipeCard");
  if (!card) return;

  if (low.length === 0) {
    card.innerHTML = "<p>No low clubs 🎉</p>";
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
  let low = clubs.filter(c => c.members.length < 8);
  let club = low[swipeIndex % low.length];

  if (!bookmarks.find(b => b.name === club.name)) {
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

/* ---------------- ALL CLUBS PAGE ---------------- */

function renderDirectory() {
  let box = document.getElementById("clubDirectory");
  if (!box) return;

  box.innerHTML = "";

  clubs.forEach(c => {
    box.innerHTML += `
      <div class="card">
        <h2>${c.name}</h2>
        <p>Leader: ${c.leader}</p>
        <p>Members: ${c.members.length}</p>
      </div>
    `;
  });
}

/* ---------------- LEADER DASHBOARD ---------------- */

function loadLeaderClub() {
  let name = document.getElementById("leaderClubName").value;
  let club = clubs.find(c => c.name.toLowerCase() === name.toLowerCase());

  let view = document.getElementById("leaderView");

  if (!club) {
    view.innerHTML = "<p>Club not found</p>";
    return;
  }

  let percent = club.members.length === 0 ? 0 :
    Math.round((club.presentToday.length / club.members.length) * 100);

  let members = club.members.map(m => {
    let checked = club.presentToday.includes(m);
    return `
      <button onclick="toggle(${clubs.indexOf(club)}, '${m}')"
      style="background:${checked?'green':'#ddd'}">
        ${m}
      </button>
    `;
  }).join("");

  view.innerHTML = `
    <div class="card">
      <h2>${club.name}</h2>
      <p>${club.leader}</p>
      <p>${percent}% attendance today</p>
      <p>${club.presentToday.join(", ")}</p>
      ${members}
    </div>
  `;
}

function toggle(i, m) {
  let club = clubs[i];

  if (club.presentToday.includes(m)) {
    club.presentToday = club.presentToday.filter(x => x !== m);
  } else {
    club.presentToday.push(m);
  }

  save();
  loadLeaderClub();
}

/* ---------------- INIT ---------------- */

renderSwipe();
renderBookmarks();
renderDirectory();
