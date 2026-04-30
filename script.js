// Replace your current script.js with this version

let clubs = JSON.parse(localStorage.getItem("clubs")) || [
  {
    name: "Robotics Club",
    leader: "Alex & Jamie",
    count: 7,
    members: ["Mia","Noah","Eli","Sara","Ben","Lila","Owen"],
    presentToday: []
  },
  {
    name: "Art Club",
    leader: "Emma",
    count: 4,
    members: ["Ruby","Cole","Skye","Nina"],
    presentToday: []
  },
  {
    name: "Debate Club",
    leader: "Priya",
    count: 9,
    members: ["Ava","Max","Leo","Finn","Kai","Jude","Ivy","Zoe","Mason"],
    presentToday: []
  }
];

let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
let swipeIndex = 0;

function saveData() {
  localStorage.setItem("clubs", JSON.stringify(clubs));
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function renderClubs() {
  let list = document.getElementById("clubList");
  list.innerHTML = "";

  clubs.forEach((club, index) => {
    let percent =
      club.count === 0
        ? 0
        : Math.round((club.presentToday.length / club.count) * 100);

    let status = club.count < 8 ? "🔴 Low Attendance Club" : "🟢 Healthy Club";

    let memberButtons = club.members.map(member => {
      let checked = club.presentToday.includes(member);
      return `
        <button 
          onclick="togglePresent(${index}, '${member}')"
          style="
            margin:4px;
            background:${checked ? '#28a745' : '#ddd'};
            color:${checked ? 'white' : 'black'};
          ">
          ${member}
        </button>
      `;
    }).join("");

    list.innerHTML += `
      <div style="margin-bottom:20px; padding:15px; border:1px solid #ccc; border-radius:12px;">
        <h3>${club.name}</h3>
        <p><b>Leader(s):</b> ${club.leader}</p>
        <p><b>Total Members:</b> ${club.count}</p>
        <p>${status}</p>

        <p><b>Today's Attendance:</b> ${club.presentToday.length}/${club.count}</p>
        <p><b>Attendance %:</b> ${percent}%</p>

        <p><b>Tap who showed up today:</b></p>
        ${memberButtons}

        <p style="margin-top:10px;">
          <b>Present Today:</b> 
          ${club.presentToday.length ? club.presentToday.join(", ") : "None yet"}
        </p>
      </div>
    `;
  });

  renderSwipe();
}

function togglePresent(clubIndex, memberName) {
  let club = clubs[clubIndex];

  if (club.presentToday.includes(memberName)) {
    club.presentToday = club.presentToday.filter(m => m !== memberName);
  } else {
    club.presentToday.push(memberName);
  }

  saveData();
  renderClubs();
}

function addClub() {
  let name = document.getElementById("clubName").value.trim();
  let leader = document.getElementById("clubLeader").value.trim();
  let count = parseInt(document.getElementById("clubCount").value);

  if (!name || !leader || isNaN(count)) {
    alert("Please complete all fields.");
    return;
  }

  let members = [];
  for (let i = 1; i <= count; i++) {
    members.push("Member " + i);
  }

  clubs.push({
    name,
    leader,
    count,
    members,
    presentToday: []
  });

  saveData();
  renderClubs();

  document.getElementById("clubName").value = "";
  document.getElementById("clubLeader").value = "";
  document.getElementById("clubCount").value = "";
}

function getLowClubs() {
  return clubs.filter(c => c.count < 8);
}

function renderSwipe() {
  let low = getLowClubs();
  let card = document.getElementById("swipeCard");

  if (!card) return;

  if (low.length === 0) {
    card.innerHTML = "<div>No low-attendance clubs 🎉</div>";
    return;
  }

  let club = low[swipeIndex % low.length];

  card.innerHTML = `
    <div>
      <h3>${club.name}</h3>
      <p>${club.count} members</p>
      <p>Leader: ${club.leader}</p>
    </div>
  `;
}

function skipClub() {
  swipeIndex++;
  renderSwipe();
}

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

function renderBookmarks() {
  let box = document.getElementById("bookmarks");
  if (!box) return;

  box.innerHTML = "";

  bookmarks.forEach(club => {
    box.innerHTML += `<p>⭐ ${club.name}</p>`;
  });
}

renderClubs();
renderBookmarks();
