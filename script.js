let clubs = [
  { name: "Robotics Club", leader: "Alex & Jamie", count: 7 },
  { name: "Art Club", leader: "Emma", count: 4 },
  { name: "Debate Club", leader: "Priya", count: 9 }
];

let bookmarks = [];
let swipeIndex = 0;

function renderClubs() {
  let list = document.getElementById("clubList");
  list.innerHTML = "";

  clubs.forEach(c => {
    let status = c.count < 8 ? "🔴 Low" : "🟢 Healthy";
    list.innerHTML += `<p><b>${c.name}</b> — ${c.leader} — ${c.count} members ${status}</p>`;
  });

  renderSwipe();
}

function addClub() {
  let name = document.getElementById("clubName").value;
  let leader = document.getElementById("clubLeader").value;
  let count = parseInt(document.getElementById("clubCount").value);

  clubs.push({ name, leader, count });

  document.getElementById("clubName").value = "";
  document.getElementById("clubLeader").value = "";
  document.getElementById("clubCount").value = "";

  renderClubs();
}

function getLowClubs() {
  return clubs.filter(c => c.count < 8);
}

function renderSwipe() {
  let low = getLowClubs();
  let card = document.getElementById("swipeCard");

  if (low.length === 0) {
    card.innerHTML = "<div class='swipe'>No low attendance clubs 🎉</div>";
    return;
  }

  let club = low[swipeIndex % low.length];

  card.innerHTML = `
    <div class="swipe">
      <h3>${club.name}</h3>
      <p>Leader: ${club.leader}</p>
      <p>Members: ${club.count}</p>
    </div>
  `;
}

function skipClub() {
  let low = getLowClubs();
  if (low.length === 0) return;
  swipeIndex++;
  renderSwipe();
}

function bookmarkClub() {
  let low = getLowClubs();
  if (low.length === 0) return;

  let club = low[swipeIndex % low.length];

  if (!bookmarks.includes(club)) {
    bookmarks.push(club);
  }

  renderBookmarks();
  skipClub();
}

function renderBookmarks() {
  let box = document.getElementById("bookmarks");
  box.innerHTML = "";

  bookmarks.forEach(b => {
    box.innerHTML += `<p>⭐ ${b.name}</p>`;
  });
}

renderClubs();
