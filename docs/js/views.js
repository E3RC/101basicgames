var Views = {};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

Views.renderHome = function(data) {
  var games = data.games || [];
  var count = games.length;
  var categories = {};
  games.forEach(function(g) { categories[g.category] = (categories[g.category] || 0) + 1; });
  var catCount = Object.keys(categories).length;

  return [
    '<section class="hero">',
    '  <h1>101 BASIC Computer Games</h1>',
    '  <p class="subtitle">A digital archive of the classic 1973 BASIC computer games book by David H. Ahl. Play, explore, and relive the dawn of personal computing.</p>',
    '  <div class="hero-actions">',
    '    <a href="#/random" class="btn btn-primary" id="btn-random">Play Random Game</a>',
    '    <a href="#/catalog" class="btn" id="btn-browse">Browse Catalog</a>',
    '  </div>',
    '</section>',
    '<div class="progress-stats">',
    '  <div class="stat-card"><div class="stat-value">' + count + '</div><div class="stat-label">Total Games</div></div>',
    '  <div class="stat-card"><div class="stat-value">' + catCount + '</div><div class="stat-label">Categories</div></div>',
    '  <div class="stat-card"><div class="stat-value">' + games.filter(function(g) { return g.dialect && g.dialect !== 'No code'; }).length + '</div><div class="stat-label">With Code</div></div>',
    '  <div class="stat-card"><div class="stat-value">1973</div><div class="stat-label">Original Year</div></div>',
    '</div>'
  ].join('\n');
};

Views.renderCatalog = function(data) {
  var games = data.games || [];
  var filter = data.filter || {};
  var search = (filter.search || '').toLowerCase();
  var category = filter.category || '';
  var sortBy = filter.sortBy || 'alpha';

  var filtered = games.filter(function(g) {
    if (search && g.title.toLowerCase().indexOf(search) === -1 && g.description.toLowerCase().indexOf(search) === -1 && g.program.toLowerCase().indexOf(search) === -1) {
      return false;
    }
    if (category && g.category !== category) {
      return false;
    }
    return true;
  });

  if (sortBy === 'page') {
    filtered.sort(function(a, b) { return a.page - b.page; });
  } else {
    filtered.sort(function(a, b) { return a.title.localeCompare(b.title); });
  }

  var catMap = {};
  games.forEach(function(g) { catMap[g.category] = true; });
  var catList = Object.keys(catMap).sort();

  var cardsHtml = filtered.map(function(g) {
    return '<div class="game-card">' +
      '<span class="program-tag">' + g.program + '</span>' +
      '<h3>' + g.title + '</h3>' +
      '<p class="description">' + g.description + '</p>' +
      '<div class="card-meta">' +
      '<span>' + capitalize(g.category) + '</span>' +
      '</div>' +
      '<a href="#/game/' + g.slug + '" class="play-btn" data-slug="' + g.slug + '">Play</a>' +
      '</div>';
  }).join('\n');

  var catOptions = '<option value="">All Categories</option>' +
    catList.map(function(c) {
      return '<option value="' + c + '"' + (c === category ? ' selected' : '') + '>' + capitalize(c) + '</option>';
    }).join('\n');

  return '<div class="page-header">' +
    '<h2>Game Catalog</h2>' +
    '<div class="search-bar">' +
    '<input type="text" class="search-input" id="search-input" placeholder="Search games..." value="' + (filter.search || '') + '">' +
    '<select class="filter-select" id="category-filter">' + catOptions + '</select>' +
    '<select class="filter-select" id="sort-select"><option value="alpha"' + (sortBy === 'alpha' ? ' selected' : '') + '>A-Z</option><option value="page"' + (sortBy === 'page' ? ' selected' : '') + '>By Page</option></select>' +
    '</div>' +
    '</div>' +
    '<div class="game-grid" id="game-grid">' +
    (filtered.length ? cardsHtml : '<p style="text-align:center;color:var(--fg-dim);padding:2rem;">No games match your search criteria. Try a different query.</p>') +
    '</div>';
};

Views.renderGameView = function(data) {
  var game = data.game;
  if (!game) return '<div class="hero"><h1>Game not found</h1><a href="#/catalog" class="btn">Back to catalog</a></div>';

  return '<div class="game-view">' +
    '<div class="game-view-header">' +
    '<a href="#/catalog" class="back-link" id="back-to-catalog">&larr; Back to Catalog</a>' +
    '<h2>' + game.title + '</h2>' +
    '<div class="game-meta">' +
    '<span>Program: ' + game.program + '</span>' +
    '<span>Category: ' + capitalize(game.category) + '</span>' +
    '<span>Dialect: ' + game.dialect + '</span>' +
    '<span>Page: ' + game.page + '</span>' +
    '</div>' +
    '</div>' +
    '<div id="game-terminal"></div>' +
    '</div>';
};

Views.renderCategories = function(data) {
  var games = data.games || [];
  var catCounts = {};
  games.forEach(function(g) {
    catCounts[g.category] = (catCounts[g.category] || 0) + 1;
  });
  var sorted = Object.keys(catCounts).sort();

  var cards = sorted.map(function(cat) {
    return '<a href="#/category/' + encodeURIComponent(cat) + '" class="category-card" data-category="' + cat + '">' +
      '<h3>' + capitalize(cat) + '</h3>' +
      '<div class="count">' + catCounts[cat] + ' game' + (catCounts[cat] !== 1 ? 's' : '') + '</div>' +
      '</a>';
  }).join('\n');

  return '<div class="page-header"><h2>Categories</h2></div>' +
    '<div class="categories-grid">' + cards + '</div>';
};

Views.renderAbout = function() {
  return '<div class="about-content">' +
    '<h2>About This Project</h2>' +
    '<p><em>101 BASIC Computer Games</em> (originally published as <em>101 BASIC Computer Games</em> in 1973, later republished as <em>BASIC Computer Games</em> in 1978) is a landmark book by David H. Ahl that helped spark the home computer revolution. It contains the source code for over 100 games written in the BASIC programming language, designed to be typed in and run on a variety of early computer systems.</p>' +
    '<p>This website is a digital archive and tribute to that collection, providing:</p>' +
    '<ul>' +
    '<li>A browsable catalog of all games from the book</li>' +
    '<li>Playable terminal-style recreations of all 106 games</li>' +
    '<li>Historical reference information including original BASIC source code where available</li>' +
    '</ul>' +

    '<h2>Attribution</h2>' +
    '<p>All game titles, descriptions, and BASIC source code are the intellectual property of their original authors as published in the book. This is an educational, non-commercial fan project.</p>' +
    '<ul>' +
    '<li>Book: <em>101 BASIC Computer Games</em> by David H. Ahl (1973)</li>' +
    '<li>Digital Edition: <em>BASIC Computer Games</em> by David H. Ahl (1978) &mdash; ISBN 0-89480-052-3</li>' +
    '<li>Source code transcribed from public-domain scans and text conversions</li>' +
    '</ul>' +
    '<h2>Technical Notes</h2>' +
    '<p>This site is built with vanilla JavaScript and CSS. No frameworks, no build tools &mdash; just the way the pioneers did it. Games are data-driven from a JSON catalog. The terminal interface emulates the teletype-style interaction of the original BASIC programs.</p>' +
    '<h2>Colophon</h2>' +
    '<p>This entire project was built using <a href="https://github.com/anomalyco/opencode" target="_blank" rel="noopener">OpenCode</a>, an open-source AI coding assistant. All game implementations and site infrastructure were generated entirely with free AI models — no paid APIs, no proprietary tools, no human-written code. Proof that open-source AI can build real, playable software from scratch.</p>' +
    '</div>';
};
