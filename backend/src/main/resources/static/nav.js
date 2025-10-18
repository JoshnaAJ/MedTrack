// nav.js - dynamically render site nav based on login state
(function () {
  const AUTH_KEY = 'medtrack_auth_v1';

  function getUser() {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch (e) { return null; }
  }

  function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  function render() {
    const nav = document.querySelector('header nav');
    if (!nav) return;
    const user = getUser();
    if (user && user.token) {
      const name = escapeHtml(user.name || user.email || 'User');
      nav.innerHTML = `
        <a href="index.html">Home</a>
        <a href="dashboard.html">Dashboard</a>
        <a href="#" id="nav-logout">Logout (${name})</a>
      `;
      const lo = document.getElementById('nav-logout');
      if (lo) lo.addEventListener('click', (e) => { e.preventDefault(); localStorage.removeItem(AUTH_KEY); window.location.href = 'login.html'; });
    } else {
      nav.innerHTML = `
        <a href="index.html">Home</a>
        <a href="login.html">Login</a>
        <a href="register.html">Register</a>
      `;
    }
  }

  document.addEventListener('DOMContentLoaded', render);
})();
