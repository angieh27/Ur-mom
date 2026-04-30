// script.js
// Saves club data in browser using localStorage

let clubs = JSON.parse(localStorage.getItem("clubs")) || [
  { name: "Robotics Club", leader: "Alex & Jamie", count: 7 },
  { name: "Art Club", leader: "Emma", count: 4 },
  { name: "Debate Club", leader: "Priya", count: 9 }
];

let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
let swipeIndex = 0;

// Save all data
function saveData() {
  localStorage.setItem("clubs", JSON.stringify(clubs));
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

// Render all clubs
function renderClubs() {
  let list = document.getElementById("clubList");
  list.innerHTML = "";

  clubs.forEach(c => {
    let status = c.count < 8 ? "🔴 Low Attendance" : "🟢 Healthy";
    list.innerHTML += `
      <p>
        <b>${c.name}</b><br>
        Leaders: ${c.leader}<br>
        Members: ${c.count}<br>
        ${status}
      </p>
      <hr>
    `;
  });

  renderSwipe();
}

// Add new club
function addClub() {
  let name = document.getElementById("clubName").value.trim();
  let leader = document.getElementById("clubLeader").value.trim();
  let count = parseInt(document.getElementById("clubCount").value);

  if (!name || !leader || isNaN(count)) {
    alert("Please fill out all fields.");
    return;
  }

  clubs.push({ name, leader, count });

  saveData();
  renderClubs();

  document.getElementById("clubName").value = "";
  document.getElementById("clubLeader").value = "";
  document.getElementById("clubCount").value = "";
}

// Clubs with low attendance
function getLowClubs() {
  return clubs.filter(c => c.count < 8);
}

// Swipe section
function renderSwipe() {
  let low = getLowClubs();
  let card = document.getElementById("swipeCard");

  if (low.length === 0) {
    card.innerHTML = "<div class='swipe'>No low-attendance clubs 🎉</div>";
    return;
  }

  let club = low[swipeIndex % low.length];

  card.innerHTML = `
    <div class="swipe">
      <h3>${club.name}</h3>
      <p>Leader(s): ${club.leader}</p>
      <p>${club.count} members</p>
    </div>
  `;
}

// Skip club
function skipClub() {
  swipeIndex++;
  renderSwipe();
}

// Bookmark club
function bookmarkClub() {
  let low = getLowClubs();
  if (low.length === 0) return;

  let club = low[swipeIndex % low.length];

  if (!bookmarks.find(b => b.name === club.name)) {
    bookmarks.push(club);
    saveData();
  }

  renderBookmarks();
  skipClub();
}

// Show bookmarks
function renderBookmarks() {
  let box = document.getElementById("bookmarks");
  box.innerHTML = "";

  if (bookmarks.length === 0) {
    box.innerHTML = "<p>No bookmarks yet.</p>";
    return;
  }

  bookmarks.forEach(b => {
    box.innerHTML += `<p>⭐ ${b.name}</p>`;
  });
}

// First load
renderClubs();
renderBookmarks();
