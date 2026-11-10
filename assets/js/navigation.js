/**
 * TerraPure Organics - Navigation & Layout Controls
 * Navbar stickiness, RTL toggle, Scroll-to-Top, Mobile menus
 */

(function () {
  'use strict';

  const RTL_STORAGE_KEY = 'terrapure-direction';

  // Apply Direction (RTL / LTR)
  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(RTL_STORAGE_KEY, dir);

    const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
    rtlBtns.forEach(btn => {
      let icon = btn.querySelector('i');
      if (!icon) {
        btn.innerHTML = '<i class="bi bi-text-right"></i>';
        icon = btn.querySelector('i');
      }
      if (dir === 'rtl') {
        icon.className = 'bi bi-text-left';
        btn.setAttribute('title', 'Switch to Left-to-Right (LTR)');
        btn.setAttribute('aria-label', 'Switch to Left-to-Right');
      } else {
        icon.className = 'bi bi-text-right';
        btn.setAttribute('title', 'Switch to Right-to-Left (RTL)');
        btn.setAttribute('aria-label', 'Switch to Right-to-Left');
      }
    });
  }

  // Initialize Direction on load
  const savedDir = localStorage.getItem(RTL_STORAGE_KEY) || 'ltr';
  applyDirection(savedDir);

  document.addEventListener('DOMContentLoaded', () => {
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
