// API-backed auth that talks to the Spring Boot backend at port 8081
(function () {
  // safe fallback for showToast if script.js not yet loaded
  if (!window.showToast) {
    window.showToast = function (msg, type) {
      try { console.info('toast:', type, msg); } catch (e) {}
    };
  }
  const AUTH_KEY = 'medtrack_auth_v1';
  const API_BASE = 'http://localhost:8081/api/auth';

  async function postJson(url, body) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const text = await res.text();
    let json = null;
    try { json = text ? JSON.parse(text) : null; } catch (e) { /* ignore */ }
    return { ok: res.ok, status: res.status, body: json || text };
  }

  const auth = {
    register: async function ({ name, email, password }) {
      const r = await postJson(API_BASE + '/register', { name, email, password });
      const ok = r.ok;
      if (window.showToast) {
        if (ok) window.showToast('Registration successful', 'success');
        else window.showToast('Registration failed', 'error');
      }
      return ok;
    },
    login: async function (email, password) {
      const r = await postJson(API_BASE + '/login', { email, password });
      if (r.ok && r.body && r.body.token) {
        // store token and basic profile
        localStorage.setItem(AUTH_KEY, JSON.stringify({ token: r.body.token, email: r.body.email, name: r.body.name }));
        if (window.showToast) window.showToast('Login successful', 'success');
        return true;
      }
      if (window.showToast) window.showToast('Invalid credentials', 'error');
      return false;
    },
    logout: function () {
      localStorage.removeItem(AUTH_KEY);
    },
    currentUser: function () {
      try {
        return JSON.parse(localStorage.getItem(AUTH_KEY));
      } catch (e) {
        return null;
      }
    },
    apiFetch: async function (path, opts = {}) {
      const user = this.currentUser();
      const headers = opts.headers || {};
      if (user && user.token) headers['Authorization'] = 'Bearer ' + user.token;
      const res = await fetch('http://localhost:8081' + path, Object.assign({}, opts, { headers }));
      const text = await res.text();
      let body = null; try { body = text ? JSON.parse(text) : null; } catch(e) { body = text; }
      return { ok: res.ok, status: res.status, body };
    },
    ensureAuth: function () {
      const u = this.currentUser();
      if (!u) {
        window.location.href = 'login.html';
        return false;
      }
      return u;
    }
  };

  window.auth = auth;
})();