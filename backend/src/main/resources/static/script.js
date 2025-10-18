// Track number of medicines taken
let totalMedicines = 3;
let takenCount = 0;

// Mark medicine as taken
function markTaken(btn) {
  if (!btn.classList.contains("taken")) {
    btn.classList.add("taken");
    btn.classList.add('fade-in');
    btn.innerText = "✅ Taken";
    btn.style.backgroundColor = "#4caf50";
    takenCount++;
    updateProgress();
    showToast('Marked as taken', 'success');
    setTimeout(() => btn.classList.remove('fade-in'), 600);
  } else {
    // allow unmarking
    btn.classList.remove('taken');
    btn.innerText = 'Mark Taken';
    btn.style.backgroundColor = '';
    takenCount = Math.max(0, takenCount - 1);
    updateProgress();
    showToast('Marked as not taken', 'error');
  }
}

// Update progress bar
function updateProgress() {
  const progress = document.getElementById("progress");
  const progressText = document.getElementById("progress-text");
  if (!progress || !progressText) return; // not present on this page
  let percent = Math.round((takenCount / totalMedicines) * 100);
  progress.style.width = percent + "%";
  progressText.innerText = percent + "% taken";
}

// Show reminder popup after a delay
setTimeout(() => {
  showPopup();
}, 5000); // show reminder after 5 seconds (you can change)

function showPopup() {
  const p = document.getElementById("reminderPopup");
  if (p) p.style.display = "flex";
}

function closePopup() {
  const p = document.getElementById("reminderPopup");
  if (p) p.style.display = "none";
}

// Toast helper
function showToast(message, type = 'default', timeout = 3200) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = 'toast ' + (type === 'success' ? 'success' : type === 'error' ? 'error' : '');
  t.textContent = message;
  container.appendChild(t);
  // trigger animation
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.style.transition = 'all .28s ease';
    t.style.opacity = 0;
    t.style.transform = 'translateY(12px) scale(.98)';
    setTimeout(() => t.remove(), 300);
  }, timeout);
  return t;
}

// expose globally for other scripts
window.showToast = showToast;