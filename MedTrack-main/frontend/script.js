// -------------------- GO BACK BUTTON --------------------
function goBack() {
  window.history.back();
}

// -------------------- REGISTER --------------------
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const user = document.getElementById("regUser").value.trim();
    const pass = document.getElementById("regPass").value.trim();
    localStorage.setItem("user_" + user, pass);
    document.getElementById("message").textContent = "Account created successfully!";
    setTimeout(() => (window.location.href = "login.html"), 1500);
  });
}

// -------------------- LOGIN --------------------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value.trim();
    const storedPass = localStorage.getItem("user_" + user);
    const error = document.getElementById("errorMsg");

    if (storedPass && storedPass === pass) {
      localStorage.setItem("loggedInUser", user);
      window.location.href = "dashboard.html";
    } else {
      error.textContent = "Invalid username or password!";
    }
  });
}

// -------------------- DASHBOARD --------------------
if (window.location.pathname.endsWith("dashboard.html")) {
  const user = localStorage.getItem("loggedInUser");
  if (!user) window.location.href = "login.html";
  document.getElementById("welcomeMsg").textContent = `Welcome, ${user}!`;

  requestNotificationPermission();
  checkMedicineReminders();
  checkExpiryReminders();
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

function showProfile() {
  const user = localStorage.getItem("loggedInUser");
  alert(`Profile Info\n\nUsername: ${user}\nStatus: Active User`);
}

// -------------------- ADD MEDICINE --------------------
const addMedForm = document.getElementById("addMedForm");
if (addMedForm) {
  addMedForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("medName").value.trim();
    const date = document.getElementById("medDate").value;
    const time = document.getElementById("medTime").value;
    const food = document.getElementById("medFood").value;
    const days = document.getElementById("medDays").value;

    const medData = { name, date, time, food, days };
    localStorage.setItem("medicine_" + name, JSON.stringify(medData));

    document.getElementById("saveMsg").textContent = "💊 Medicine added successfully!";
    addMedForm.reset();
  });
}

// -------------------- VIEW MEDICINES --------------------
if (window.location.pathname.endsWith("viewMedicines.html")) {
  const medBody = document.getElementById("medicineBody");
  const emptyMsg = document.getElementById("emptyMsg");
  let hasMeds = false;

  for (let key in localStorage) {
    if (key.startsWith("medicine_")) {
      hasMeds = true;
      const med = JSON.parse(localStorage.getItem(key));

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${med.name}</td>
        <td>${med.date}</td>
        <td>${med.time}</td>
        <td>${med.food}</td>
        <td>${med.days}</td>
        <td><button class="delete-btn" onclick="deleteMedicine('${key}')">Delete</button></td>
      `;
      medBody.appendChild(row);
    }
  }

  if (hasMeds) emptyMsg.style.display = "none";
}

function deleteMedicine(key) {
  if (confirm("Are you sure you want to delete this medicine?")) {
    localStorage.removeItem(key);
    window.location.reload();
  }
}

// -------------------- NOTIFICATION SYSTEM --------------------
function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then((perm) => {
      console.log("Notification permission:", perm);
    });
  }
}

// -------------------- MEDICINE TIME REMINDER --------------------
function checkMedicineReminders() {
  for (let key in localStorage) {
    if (key.startsWith("medicine_")) {
      const med = JSON.parse(localStorage.getItem(key));
      if (!med.time) continue;

      const now = new Date();
      const [hour, minute] = med.time.split(":");
      const medTime = new Date();
      medTime.setHours(hour, minute, 0, 0);

      let delay = medTime.getTime() - now.getTime();
      if (delay < 0) delay += 24 * 60 * 60 * 1000; // next day if already passed

      setTimeout(() => {
        showNotification("💊 Medicine Reminder", `Time to take ${med.name} (${med.food})`);
      }, delay);
    }
  }
}

// -------------------- EXPIRY DATE REMINDER --------------------
function checkExpiryReminders() {
  for (let key in localStorage) {
    if (key.startsWith("medicine_")) {
      const med = JSON.parse(localStorage.getItem(key));
      if (!med.date) continue;

      const expiryDate = new Date(med.date);
      const now = new Date();
      const diffDays = (expiryDate - now) / (1000 * 60 * 60 * 24);

      if (diffDays <= 3 && diffDays > 0) {
        showNotification("⚠️ Expiry Reminder", `${med.name} is expiring in ${Math.ceil(diffDays)} days!`);
      }
    }
  }
}

// -------------------- SHOW NOTIFICATION --------------------
function showNotification(title, message) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      body: message,
      icon: "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
    });
  } else {
    alert(`${title}\n\n${message}`);
  }
}
