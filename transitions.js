/* ============================================================
   PAGE TRANSITIONS — runs in <head> before body renders
   ============================================================ */

// Fade in / fade out between pages
(function() {
  // Add class to html element immediately (body doesn't exist yet)
  document.documentElement.style.opacity = '0';
  document.documentElement.style.transition = 'opacity 0.18s ease';

  // Fade in once DOM + styles are loaded
  window.addEventListener('DOMContentLoaded', function() {
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        document.documentElement.style.opacity = '1';
      });
    });
  });

  // Intercept internal link clicks — fade out then navigate
  window.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a');
      if (!link) return;
      if (link.target === '_blank') return;
      if (link.hasAttribute('download')) return;
      if (link.hostname && link.hostname !== window.location.hostname) return;

      var href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;

      e.preventDefault();
      document.documentElement.style.opacity = '0';
      setTimeout(function() {
        window.location.href = href;
      }, 160);
    });

    // Restore on back/forward
    window.addEventListener('pageshow', function(e) {
      if (e.persisted) {
        document.documentElement.style.opacity = '1';
      }
    });
  });
})();