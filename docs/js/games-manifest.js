window.GameImplementations = window.GameImplementations || {};
window._loadedGames = window._loadedGames || {};

window.loadGame = function(slug) {
  if (window.GameImplementations[slug]) return Promise.resolve();
  if (window._loadedGames[slug]) return window._loadedGames[slug];

  var p = new Promise(function(resolve, reject) {
    var script = document.createElement('script');
    script.src = 'js/games/' + slug + '.js';
    script.onload = function() {
      window._loadedGames[slug] = null;
      if (window.GameImplementations[slug]) {
        resolve();
      } else {
        reject(new Error('Game file loaded but implementation not found for: ' + slug));
      }
    };
    script.onerror = function() {
      window._loadedGames[slug] = null;
      reject(new Error('Failed to load game: ' + slug));
    };
    document.head.appendChild(script);
  });

  window._loadedGames[slug] = p;
  return p;
};
