/* ============================================================
   ANIMATIONS.JS
   GSAP-powered motion choreography.
   Loads after DOM ready. Requires GSAP + ScrollTrigger (CDN).
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Guard — only run if GSAP loaded
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded — skipping animations.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ──────────────────────────────────────────────────────
     1. PROJECT IMAGE PARALLAX
     Images move at ~60% of scroll speed, creating depth.
     The image inner content shifts upward as you scroll past.
  ────────────────────────────────────────────────────── */
  document.querySelectorAll('.project-image-placeholder').forEach(img => {
    gsap.to(img, {
      yPercent: -12,          // moves up slightly as you scroll
      ease: 'none',
      scrollTrigger: {
        trigger: img,
        start: 'top bottom',  // when top of image hits bottom of viewport
        end: 'bottom top',    // when bottom of image leaves top of viewport
        scrub: 1.2,           // smooth lag — higher = more butter
      }
    });
  });

  /* ──────────────────────────────────────────────────────
     2. WORK SECTION — STAGGERED CARD REVEAL
     When each project card enters view, its tags, title,
     role, desc, and link stagger in with 0.1s between each.
  ────────────────────────────────────────────────────── */
  document.querySelectorAll('.project-card').forEach(card => {
    const targets = [
      card.querySelector('.project-tags'),
      card.querySelector('.project-title'),
      card.querySelector('.project-role'),
      card.querySelector('.project-desc'),
      card.querySelector('.project-link'),
    ].filter(Boolean);

    // Start hidden
    gsap.set(targets, { opacity: 0, y: 20 });

    ScrollTrigger.create({
      trigger: card,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power2.out',
          stagger: 0.1,       // 0.1s between each element
        });
      }
    });
  });

  /* ──────────────────────────────────────────────────────
     3. MAGNETIC BUTTON — elastic settle on return
     All .btn-primary elements get magnetic pull on hover.
     On leave, elastic ease snaps back with weighted bounce.
  ────────────────────────────────────────────────────── */
  document.querySelectorAll('.btn-primary, .nav-resume').forEach(btn => {
    const strength = 0.38; // how far the button follows the cursor (0–1)

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;

      gsap.to(btn, {
        x: dx,
        y: dy,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: true,
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 1.1,
        // Elastic ease — settles with a physical weighted bounce
        ease: 'elastic.out(1, 0.38)',
        overwrite: true,
      });
    });
  });

  /* ──────────────────────────────────────────────────────
     4. SECTION HEADERS — fade + slide as bonus
     Section labels and h2s drift up softly on scroll.
  ────────────────────────────────────────────────────── */
  document.querySelectorAll('.section-label, .section-header h2').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        }
      }
    );
  });

  /* ──────────────────────────────────────────────────────
     5. ABOUT SECTION — text paragraphs stagger in
  ────────────────────────────────────────────────────── */
  const aboutParagraphs = document.querySelectorAll('.about-content p, .about-pg-bio p');
  if (aboutParagraphs.length) {
    gsap.fromTo(aboutParagraphs,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: aboutParagraphs[0],
          start: 'top 82%',
          once: true,
        }
      }
    );
  }

  /* ──────────────────────────────────────────────────────
     6. SKILL CARDS — staggered lift on scroll
  ────────────────────────────────────────────────────── */
  const skillGroups = document.querySelectorAll('.skill-group');
  if (skillGroups.length) {
    gsap.fromTo(skillGroups,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: skillGroups[0],
          start: 'top 82%',
          once: true,
        }
      }
    );
  }

  /* ──────────────────────────────────────────────────────
     7. MAGNETIC CURSOR DOT
     Small white dot follows cursor inside magnetic buttons.
  ────────────────────────────────────────────────────── */
  const magCursor = document.getElementById('magCursor');
  if (magCursor) {
    document.querySelectorAll('.btn-primary, .nav-resume').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        magCursor.style.left = e.clientX + 'px';
        magCursor.style.top  = e.clientY + 'px';
        magCursor.classList.add('visible');
      });
      btn.addEventListener('mouseleave', () => {
        magCursor.classList.remove('visible');
      });
    });
  }

  /* ──────────────────────────────────────────────────────
     8. CUSTOM CURSOR OUTLINE
     Follows mouse with lag. Changes state on context.
  ────────────────────────────────────────────────────── */
  const outline = document.getElementById('cursorOutline');
  if (outline) {
    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      outline.classList.add('ready');
    });

    // Smooth lag loop
    function followCursor() {
      // Lerp — 0.12 = smooth lag, higher = snappier
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      outline.style.left = curX + 'px';
      outline.style.top  = curY + 'px';
      requestAnimationFrame(followCursor);
    }
    followCursor();

    // Context: project card
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseenter', () => outline.classList.add('on-project'));
      card.addEventListener('mouseleave', () => outline.classList.remove('on-project'));
    });

    // Context: buttons
    document.querySelectorAll('.btn-primary, .nav-resume, .btn-secondary').forEach(btn => {
      btn.addEventListener('mouseenter', () => outline.classList.add('on-btn'));
      btn.addEventListener('mouseleave', () => outline.classList.remove('on-btn'));
    });

    // Context: links
    document.querySelectorAll('a:not(.btn-primary):not(.nav-resume)').forEach(link => {
      link.addEventListener('mouseenter', () => outline.classList.add('on-link'));
      link.addEventListener('mouseleave', () => outline.classList.remove('on-link'));
    });

    // Hide when cursor leaves window
    document.addEventListener('mouseleave', () => { outline.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { outline.style.opacity = ''; });
  }

  /* ──────────────────────────────────────────────────────
     9. DIRECTIONAL NAV UNDERLINE — exit to right on hover-out
     CSS handles enter-from-left. JS adds exit-right class.
  ────────────────────────────────────────────────────── */
  document.querySelectorAll('.nav-links a:not(.nav-resume)').forEach(link => {
    link.addEventListener('mouseleave', () => {
      // Briefly set exit class so underline slides out to the right
      link.classList.add('nav-exiting');
      setTimeout(() => link.classList.remove('nav-exiting'), 320);
    });
  });

  /* ──────────────────────────────────────────────────────
     CLEANUP
     Refresh ScrollTrigger after fonts / images load
     to fix position calculation issues.
  ────────────────────────────────────────────────────── */
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

});