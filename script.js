// Replace your current script.js with this upgraded version.
// Keeps previous features + adds:
// ✅ Edit member names
// ✅ Delete members (X button)
// ✅ Add members (+ button)
// ✅ Saves all changes with localStorage
// ✅ Attendance tracking
// ✅ Percentage calculations
// ✅ Club bookmarks / swipe system

let clubs = JSON.parse(localStorage.getItem("clubs")) || [];
let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
let swipeIndex = 0;

// Starter clubs first load only
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
  saveData();
}

function saveData() {
  localStorage.setItem("clubs", JSON.stringify(clubs));
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function renderClubs() {
  let list = document.getElementById("clubList");
  if (!list) return;

  list.innerHTML = "";

  clubs.forEach((club, clubIndex) => {
    let count = club.members.length;
    let percent = count === 0 ? 0 :
      Math.round((club.presentToday.length / count) * 100);

    let status = count < 8 ? "🔴 Low Attendance Club" : "🟢 Healthy Club";

    let membersHTML = club.members.map((member, memberIndex) => {
      let checked = club.presentToday.includes(member);

      return `
        <div style="margin:6px 0; display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
          
          <input 
            value="${member}"
            onchange="editMember(${clubIndex}, ${memberIndex}, this.value)"
            style="padding:6px;border-radius:8px;border:1px solid #ccc;width:130px;"
          >

          <button onclick="togglePresent(${clubIndex}, '${member}')"
          style="background:${checked ? 'green':'#ddd'};
          color:${checked ? 'white':'black'};">
          ${checked ? 'Present' : 'Absent'}
          </button>

          <button onclick="deleteMember(${clubIndex}, ${memberIndex})"
          style="background:red;color:white;">
          ✕
          </button>
        </div>
      `;
    }).join("");

    list.innerHTML += `
      <div class="card" style="margin-bottom:20px;">
        <h3>${club.name}</h3>
        <p><b>Leader(s):</b> ${club.leader}</p>
        <p><b>Total Members:</b> ${count}</p>
        <p>${status}</p>
        <p><b>Attendance Today:</b> ${club.presentToday.length}/${count}</p>
        <p><b>${percent}% Present</b></p>

        <h4>Members</h4>
        ${membersHTML}

        <button onclick="addMember(${clubIndex})">➕ Add Member</button>
      </div>
    `;
  });

  renderSwipe();
}

function addMember(clubIndex) {
  let newName = prompt("Enter new member name:");
  if (!newName) return;

  clubs[clubIndex].members.push(newName);
  saveData();
  renderClubs();
}

function editMember(clubIndex, memberIndex, newName) {
  if (!newName.trim()) return;

  let oldName = clubs[clubIndex].members[memberIndex];

  clubs[clubIndex].members[memberIndex] = newName;

  // Update attendance list if present
  let attendance = clubs[clubIndex].presentToday;
  let pos = attendance.indexOf(oldName);

  if (pos !== -1) {
    attendance[pos] = newName;
  }

  saveData();
}

function deleteMember(clubIndex, memberIndex) {
  let member = clubs[clubIndex].members[memberIndex];

  clubs[clubIndex].members.splice(memberIndex, 1);
  clubs[clubIndex].presentToday =
    clubs[clubIndex].presentToday.filter(m => m !== member);

  saveData();
  renderClubs();
}

function togglePresent(clubIndex, memberName) {
  let attendance = clubs[clubIndex].presentToday;

  if (attendance.includes(memberName)) {
    clubs[clubIndex].presentToday =
      attendance.filter(m => m !== memberName);
  } else {
    attendance.push(memberName);
  }

  saveData();
  renderClubs();
}

function addClub() {
  let name = document.getElementById("clubName").value.trim();
  let leader = document.getElementById("clubLeader").value.trim();
  let count = parseInt(document.getElementById("clubCount").value);

  if (!name || !leader || isNaN(count)) return;

  let members = [];
  for (let i = 1; i <= count; i++) {
    members.push("Member " + i);
  }

  clubs.push({
    name,
    leader,
    members,
    presentToday: []
  });

  saveData();
  renderClubs();
}

function getLowClubs() {
  return clubs.filter(c => c.members.length < 8);
}

function renderSwipe() {
  let low = getLowClubs();
  let card = document.getElementById("swipeCard");
  if (!card) return;

  if (low.length === 0) {
    card.innerHTML = "No low attendance clubs 🎉";
    return;
  }

  let club = low[swipeIndex % low.length];

  card.innerHTML = `
    <h3>${club.name}</h3>
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
  if (low.length === 0) return;

  let club = low[swipeIndex % low.length];

  if (!bookmarks.find(b => b.name === club.name)) {
    bookmarks.push(club);
  }

  saveData();
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
