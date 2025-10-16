// Track number of medicines taken
let totalMedicines = 3;
let takenCount = 0;

// Mark medicine as taken
function markTaken(btn) {
  if (!btn.classList.contains("taken")) {
    btn.classList.add("taken");
    btn.innerText = "✅ Taken";
    btn.style.backgroundColor = "#4caf50";
    takenCount++;
    updateProgress();
  }
}

// Update progress bar
function updateProgress() {
  const progress = document.getElementById("progress");
  const progressText = document.getElementById("progress-text");
  let percent = Math.round((takenCount / totalMedicines) * 100);
  progress.style.width = percent + "%";
  progressText.innerText = percent + "% taken";
}

// Show reminder popup after a delay
setTimeout(() => {
  showPopup();
}, 5000); // show reminder after 5 seconds (you can change)

function showPopup() {
  document.getElementById("reminderPopup").style.display = "flex";
}

function closePopup() {
  document.getElementById("reminderPopup").style.display = "none";
}
