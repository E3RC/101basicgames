const Router = {
  routes: {},
  currentRoute: null,

  init() {
    window.addEventListener('hashchange', () => this.resolve());
    this.resolve();
  },

  register(pattern, handler) {
    this.routes[pattern] = handler;
  },

  resolve() {
    const hash = window.location.hash.slice(1) || '/';
    const clean = hash.split('?')[0];

    let matched = false;
    for (const [pattern, handler] of Object.entries(this.routes)) {
      const regex = new RegExp('^' + pattern.replace(/:\w+/g, '([^/]+)') + '$');
      const match = clean.match(regex);
      if (match) {
        const params = match.slice(1);
        matched = true;
        this.currentRoute = pattern;
        handler(...params);
        break;
      }
    }

    if (!matched) {
      const main = document.getElementById('main-content');
      if (main) main.innerHTML = '<div class="hero"><h1>404</h1><p class="subtitle">Page not found</p><a href="#/" class="btn">Back home</a></div>';
    }

    this.updateNav();
  },

  updateNav() {
    const hash = window.location.hash.slice(1) || '/';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href').slice(2) || '/';
      link.classList.toggle('active', hash.startsWith(href));
    });
  },

  navigate(path) {
    window.location.hash = '#' + path;
  }
};
