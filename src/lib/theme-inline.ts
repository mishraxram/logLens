// Light / dark theme script, put INLINE in <head> by Base.astro so the first paint never waits for a network request.
// The worker CSP allows exactly this text by its SHA-256 hash; scripts/check-csp.ts fails the build check if they drift.
// What it does: saved choice (localStorage) else dark (the console look, also best on a projector) -> <html data-theme>;
// the app-bar button flips and saves it.
export const THEME_JS =
  "(function(){var K='loglens-theme',s=null;try{s=localStorage.getItem(K)}catch(e){}" +
  "function a(t){document.documentElement.dataset.theme=t;var b=document.getElementById('themeBtn');if(!b)return;var l=t==='dark'?'Switch to light theme':'Switch to dark theme';b.setAttribute('aria-label',l);b.title=l}" +
  "a(s==='light'||s==='dark'?s:'dark');" +
  "document.addEventListener('DOMContentLoaded',function(){a(document.documentElement.dataset.theme);var b=document.getElementById('themeBtn');if(!b)return;" +
  "b.addEventListener('click',function(){s=document.documentElement.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem(K,s)}catch(e){}a(s)})})})();";
