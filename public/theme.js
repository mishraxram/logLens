// Light / dark theme. Runs in <head> before the page paints, so there is no flash of the wrong theme.
// First visit: follow the system setting. After the app-bar button is pressed: remember the choice in this browser.
(function () {
  var KEY = 'loglens-theme';
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* private mode or blocked storage: just follow the system */ }
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    var b = document.getElementById('themeBtn');
    if (!b) return;
    var label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    b.setAttribute('aria-label', label);
    b.title = label;
  }

  apply(saved === 'light' || saved === 'dark' ? saved : mq.matches ? 'dark' : 'light');
  // Until the user picks one, keep following the system setting if it changes
  mq.addEventListener('change', function (e) { if (!saved) apply(e.matches ? 'dark' : 'light'); });

  document.addEventListener('DOMContentLoaded', function () {
    apply(document.documentElement.dataset.theme);
    var b = document.getElementById('themeBtn');
    if (!b) return;
    b.addEventListener('click', function () {
      saved = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, saved); } catch (e) { /* still switches for this visit */ }
      apply(saved);
    });
  });
})();
