(function() {
  'use strict';

  var main = document.getElementById('main-content');
  var gameEngine = null;

  function render(template, data) {
    var html = template(data || {});
    if (main) main.innerHTML = html;
  }

  function init() {
    registerRoutes();
    Router.init();
  }

  function registerRoutes() {
    Router.register('/', function() { showView('home'); });
    Router.register('/catalog', function() { showView('catalog'); });
    Router.register('/categories', function() { showView('categories'); });
    Router.register('/random', showRandomGame);
    Router.register('/about', function() { showView('about'); });
    Router.register('/game/:slug', showGame);
    Router.register('/category/:cat', function(cat) {
      showCategory(decodeURIComponent(cat));
    });
  }

  function showView(view) {
    if (gameEngine) { gameEngine = null; }

    switch (view) {
      case 'home':
        render(Views.renderHome, { games: GAMES });
        break;
      case 'catalog':
        renderCatalog();
        break;
      case 'categories':
        render(Views.renderCategories, { games: GAMES });
        setupCategoryClicks();
        break;
      case 'about':
        render(Views.renderAbout, { games: GAMES });
        break;
    }
  }

  function renderCatalog() {
    render(Views.renderCatalog, { games: GAMES, filter: {} });
    setupCatalogEvents();
  }

  function setupCatalogEvents() {
    var searchInput = document.getElementById('search-input');
    var filterSelect = document.getElementById('category-filter');
    var sortSelect = document.getElementById('sort-select');

    function refilter() {
      var query = searchInput ? searchInput.value : '';
      var cat = filterSelect ? filterSelect.value : '';
      var sort = sortSelect ? sortSelect.value : 'alpha';

      var filtered = GAMES.filter(function(g) {
        if (query && g.title.toLowerCase().indexOf(query.toLowerCase()) === -1 &&
            g.description.toLowerCase().indexOf(query.toLowerCase()) === -1 &&
            g.program.toLowerCase().indexOf(query.toLowerCase()) === -1) return false;
        if (cat && g.category !== cat) return false;
        return true;
      });

      if (sort === 'page') {
        filtered.sort(function(a, b) { return a.page - b.page; });
      } else {
        filtered.sort(function(a, b) { return a.title.localeCompare(b.title); });
      }

      var grid = document.getElementById('game-grid');
      if (!grid) return;

      if (filtered.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:var(--fg-dim);padding:2rem;">No games match your search criteria.</p>';
        return;
      }

      grid.innerHTML = filtered.map(function(g) {
        return '<div class="game-card">' +
          '<span class="program-tag">' + g.program + '</span>' +
          '<h3>' + g.title + '</h3>' +
          '<p class="description">' + g.description + '</p>' +
          '<div class="card-meta"><span>' + capitalize(g.category) + '</span></div>' +
          '<a href="#/game/' + g.slug + '" class="play-btn" data-slug="' + g.slug + '">Play</a>' +
          '</div>';
      }).join('');

      document.querySelectorAll('.play-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          Router.navigate('/game/' + btn.dataset.slug);
        });
      });
    }

    if (searchInput) searchInput.addEventListener('input', refilter);
    if (filterSelect) filterSelect.addEventListener('change', refilter);
    if (sortSelect) sortSelect.addEventListener('change', refilter);

    document.querySelectorAll('.play-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        Router.navigate('/game/' + btn.dataset.slug);
      });
    });
  }

  function setupCategoryClicks() {
    document.querySelectorAll('.category-card').forEach(function(card) {
      card.addEventListener('click', function(e) {
        // Let the link handle navigation
      });
    });
  }

  function showCategory(category) {
    var categoryGames = GAMES.filter(function(g) { return g.category === category; });
    var title = capitalize(category);

    render(Views.renderCatalog, { games: GAMES, filter: { category: category } });

    var pageHeader = main.querySelector('.page-header');
    if (pageHeader) {
      var backLink = document.createElement('a');
      backLink.href = '#/categories';
      backLink.className = 'back-link';
      backLink.innerHTML = '&larr; All Categories';
      backLink.style.display = 'block';
      backLink.style.marginBottom = '0.5rem';

      var h2 = pageHeader.querySelector('h2');
      if (h2) {
        pageHeader.insertBefore(backLink, h2);
        var span = document.createElement('span');
        span.className = 'count';
        span.textContent = categoryGames.length + ' game' + (categoryGames.length !== 1 ? 's' : '') + ' in this category';
        span.style.fontSize = '0.85rem';
        span.style.color = 'var(--fg-dim)';
        h2.parentNode.insertBefore(span, h2.nextSibling);
      }
    }

    setupCatalogEvents();
  }

  function showRandomGame() {
    if (!GAMES || GAMES.length === 0) return;
    var playable = GAMES.filter(function(g) { return g.dialect !== 'No code'; });
    var game = playable[Math.floor(Math.random() * playable.length)];
    Router.navigate('/game/' + game.slug);
  }

  function showGame(slug) {
    var game = GAMES.find(function(g) { return g.slug === slug; });
    if (!game) {
      if (main) main.innerHTML = '<div class="hero"><h1>Game not found</h1><a href="#/catalog" class="btn">Back to catalog</a></div>';
      return;
    }

    render(Views.renderGameView, { game: game });

    var backBtn = document.getElementById('back-to-catalog');
    if (backBtn) {
      backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        Router.navigate('/catalog');
      });
    }

    var terminalEl = document.getElementById('game-terminal');
    if (terminalEl) {
      gameEngine = new GameEngine('game-terminal');
      initGame(game);
    }
  }

  function initGame(game) {
    var slug = game.slug;

    if (typeof window.loadGame === 'function' && !window.GameImplementations[slug]) {
      window.loadGame(slug).then(function() {
        startGameImpl(game);
      }).catch(function() {
        showGameStub(game);
      });
    } else if (window.GameImplementations[slug]) {
      startGameImpl(game);
    } else {
      showGameStub(game);
    }
  }

  function startGameImpl(game) {
    try {
      GameImplementations[game.slug](gameEngine);
      gameEngine.setInstructions(getInstructions(game.slug));
    } catch (e) {
      console.error('Error starting game:', e);
      gameEngine.start(game.title);
      gameEngine.print('Error starting game: ' + e.message);
      gameEngine.end();
    }
  }

  function showGameStub(game) {
    gameEngine.start(game.title);
    gameEngine.print('Welcome to ' + game.title + '!\n');
    gameEngine.print('This game is from the book "101 BASIC Computer Games" by David H. Ahl.\n');
    gameEngine.print('Page ' + game.page + '\n\n');
    gameEngine.print('Implementation coming soon. ' + game.description + '\n');
    gameEngine.end();
  }

  function getInstructions(slug) {
    var instrs = {
      'aceydu': 'Acey-Ducey is a card game. The dealer deals two cards face up. You bet on whether the next card will fall between them in value.',
      'amazin': 'The computer generates a random maze. Find your way through it by typing directions (N, S, E, W).',
      'animal': 'Think of an animal. The computer tries to guess it by asking yes/no questions. If it fails, teach it a new animal!',
      'awari': 'Ancient African game where you move beans around pits. Capture more beans than your opponent.',
      'bagels': 'Guess a secret 3-digit number. After each guess you get clues: Fermi (right digit, right place), Pico (right digit, wrong place), Bagels (nothing right).',
      'banner': 'Type a message and the computer prints it as a large banner using letters made of asterisks.',
      'hammurabi': 'You govern ancient Sumeria. Manage grain, land, and population wisely to survive 10 years.',
      'lunarlander': 'Land a lunar module on the moon by controlling your descent rate and fuel consumption.',
      'mugwump': 'Hunt for 4 Mugwumps hiding on a 10x10 grid. Guess coordinates to find them in the fewest turns.',
      'tic-tac-toe': 'Play the classic game of Tic-Tac-Toe against the computer.',
      'hangman': 'Guess the word letter by letter before the man is hanged.',
      'golf': 'Choose your club and swing. Try to complete 18 holes with the fewest strokes.',
      'craps': 'Play the dice game Craps, Las Vegas style.',
      'nim': 'Remove objects from piles. The player who takes the last object loses.',
      'tower': 'Solve the Towers of Hanoi puzzle by moving disks from one peg to another.',
      'battleship': 'Decode a matrix to locate and destroy the enemy battleship.',
      'blackjack': 'Play Blackjack against the dealer. Get as close to 21 as possible without going over.',
      'poker': 'Play poker against the computer.',
      'roulette': 'Bet on numbers and colors at the European roulette table.',
      'slots': 'Pull the lever and try your luck on the one-arm bandit.',
      'mastermind': 'Guess the secret code. The computer gives feedback on each guess.',
      'reversi': 'Order a series of numbers by reversing the order of the first N numbers.',
      'hello': 'Talk with the computer as it plays the role of a friendly psychiatrist.',
      'bounce': 'Watch a ball bounce across the screen. Plot its trajectory.',
      'bomber': 'Fly bombing missions over enemy territory. Drop bombs on targets.',
      'kingdom': 'Govern an island kingdom. Make decisions about resources and population.',
      'stock': 'Simulate the stock market. Buy low, sell high.',
      'mancala': 'Ancient board game where players move stones around pits.',
      'gomon': 'Ancient board game of logic and strategy with colored stones.',
      'boxing': 'Fight a 3-round Olympic boxing match. Jab, hook, and uppercut!',
      'bowling': 'Roll the ball down the lane and knock down pins at the neighborhood bowling alley.',
      'football': 'Call plays and compete in a professional football game.',
      'hockey': 'Play ice hockey against Cornell University.',
      'baseball': 'Play a full baseball game. Pitch, hit, and field!',
      'basketball': 'Play basketball against the computer. Shoot and score!',
      'horses': 'Bet on horse races at the track.',
      'bullseye': 'Throw darts at the dartboard. Aim for the bullseye!',
      'bug': 'Roll dice to draw a bug. Complete your bug before your opponent!',
      'yahtzee': 'Roll dice to make scoring combinations in this classic dice game.',
      'war': 'Play the card game of War against the computer.',
      'civilwar': 'Command troops in Civil War battles. Strategic troop movement.',
      'traps': 'Trap a mystery number. The computer gives you clues.',
      'target': 'Destroy a target in 3-D space. Adjust your aim carefully.',
      'splat': 'Jump from a plane and open your parachute at the last possible moment!',
      'spacwr': 'Battle enemy ships in outer space with lasers and missiles.',
      'orbit': 'Destroy an orbiting enemy spaceship by calculating your trajectory.',
      'life': 'Watch John Conway\'s Game of Life evolve. Create patterns and observe.',
      'hex': 'Play Hexapawn, a chess-like game where pawns move forward and capture diagonally.',
      'hi-q': 'Remove pegs from a board by jumping one peg over another. Leave one!',
      'knight': 'Move a chess knight around the board visiting every square.',
      'calendar': 'Display a calendar for any year and month.',
      'chemist': 'Mix chemicals to dilute kryptocyanic acid safely.',
      'chief': 'Practice arithmetic with the Chief arithmetic drill.',
      'chomp': 'Eat a cookie without biting the poison piece! Multiplayer game.',
      'kinema': 'Practice kinematics problems with instant feedback.',
      'letter': 'Guess a mystery letter. The computer gives you clues.',
      'mathd': 'Practice arithmetic with pictures of dice.',
      'nicoma': 'The computer tries to guess the number you\'re thinking of.',
      'number': 'Match the mystery number with clues from the computer.',
      'pizza': 'Deliver pizzas around town. Navigate streets and manage time.',
      'queen': 'Play chess against the computer using only a queen.',
      'synonym': 'Test your knowledge of word synonyms.',
      'train': 'Practice time-speed-distance calculations.',
      'weekday': 'Find out on which day of the week any date falls.',
      '23mtch': 'Take matches from a pile. Don\'t take the last one!',
      '1check': 'Remove checkers from a board following the rules.',
      'salvo': 'Destroy enemy ships in this strategic naval battle game.',
      'salvo1': 'Destroy enemy outposts with careful targeting.'
    };
    return instrs[slug] || 'Explore the game to discover the rules.';
  }

  function loadGames() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/games.json', true);
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          GAMES = JSON.parse(xhr.responseText);
          init();
        } catch (e) {
          console.error('Failed to parse games data:', e);
        }
      } else {
        console.error('Failed to load games data, trying fetch...');
        fetchGames();
      }
    };
    xhr.onerror = function() {
      console.error('XHR failed, trying fetch...');
      fetchGames();
    };
    xhr.send();
  }

  function fetchGames() {
    fetch('data/games.json')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        GAMES = data;
        init();
      })
      .catch(function(err) {
        console.error('All loading methods failed:', err);
        if (main) main.innerHTML = '<div class="hero"><h1>Error</h1><p class="subtitle">Failed to load game data. Try running from a web server.</p></div>';
      });
  }

  loadGames();
})();
