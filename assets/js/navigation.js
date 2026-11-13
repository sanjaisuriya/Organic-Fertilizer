/**
 * TerraPure Organics - Navigation & Layout Controls
 * Navbar stickiness, RTL toggle, Scroll-to-Top, Mobile menus
 */

(function () {
  'use strict';

  const RTL_STORAGE_KEY = 'terrapure-direction';

  // Horizontal exchange arrows (Top pointing Right, Bottom pointing Left)
  const SWAP_ICON_PATH = 'M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z';

  function getRtlSvg(dir) {
    const isRtl = (dir === 'rtl');
    const variantClass = isRtl ? 'rtl-icon-active' : '';
    return `<svg class="rtl-icon ${variantClass}" data-icon="swap_horiz" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="${SWAP_ICON_PATH}"/></svg>`;
  }

  // Apply Direction (RTL / LTR)
  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(RTL_STORAGE_KEY, dir);

    // Swap Bootstrap CSS: LTR <-> RTL
    const bsLtr = document.getElementById('bootstrap-ltr-css');
    const bsRtl = document.getElementById('bootstrap-rtl-css');
    if (bsLtr && bsRtl) {
      bsLtr.disabled = (dir === 'rtl');
      bsRtl.disabled = (dir === 'ltr');
    }

    const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
    rtlBtns.forEach(btn => {
      btn.innerHTML = getRtlSvg(dir);
      if (dir === 'rtl') {
        btn.setAttribute('title', 'Switch to Left-to-Right (LTR)');
        btn.setAttribute('aria-label', 'Switch to Left-to-Right');
      } else {
        btn.setAttribute('title', 'Switch to Right-to-Left (RTL)');
        btn.setAttribute('aria-label', 'Switch to Right-to-Left');
      }
    });
  }

  // Initialize Direction on load - only set dir attribute early (before DOM ready)
  // CSS swap will happen in DOMContentLoaded when elements are available
  const savedDir = localStorage.getItem(RTL_STORAGE_KEY) || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);

  document.addEventListener('DOMContentLoaded', () => {
    // Apply full direction (including Bootstrap CSS swap) now that DOM is ready
    const initialDir = localStorage.getItem(RTL_STORAGE_KEY) || 'ltr';
    applyDirection(initialDir);

    // 1. RTL Toggle Event
    const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
    rtlBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        applyDirection(newDir);
      });
    });

    // 2. Sticky Navbar on Scroll
    const navbar = document.querySelector('.navbar-custom');
    const scrollBtn = document.querySelector('.scroll-top-btn');

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;

      if (navbar) {
        if (scrollPos > 40) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      if (scrollBtn) {
        if (scrollPos > 350) {
          scrollBtn.classList.add('visible');
        } else {
          scrollBtn.classList.remove('visible');
        }
      }
    });

    // 3. Scroll-to-Top Button Click
    if (scrollBtn) {
      scrollBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // 4. Auto-collapse Bootstrap offcanvas/navbar on mobile link click
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
    const navCollapse = document.querySelector('.navbar-collapse');
    if (navCollapse && window.bootstrap) {
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (navCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
            if (bsCollapse) {
              bsCollapse.hide();
            }
          }
        });
      });
    }

    // 5. Active Link Detection based on pathname
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.navbar-nav .nav-link');
    allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath) {
        link.classList.add('active');
      } else if ((currentPath === '' || currentPath === 'index.html') && href === 'index.html') {
        link.classList.add('active');
      }
    });
  });
})();
