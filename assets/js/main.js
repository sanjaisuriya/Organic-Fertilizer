/**
 * TerraPure Organics - Main Interactions & Dynamic Logic
 * Scroll Reveal, Product Filters, Modals, Dynamic Counters, Blog Filters
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Scroll Reveal Observer with IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal-fade-up');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 2. Animated Numerical Counters
  const counterElements = document.querySelectorAll('.counter-value');
  if (counterElements.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endValue = parseInt(target.getAttribute('data-target'), 10) || 0;
          const duration = 1800; // ms
          const stepTime = Math.max(Math.floor(duration / endValue), 20);
          let current = 0;
          const stepIncrement = Math.ceil(endValue / (duration / stepTime));

          const timer = setInterval(() => {
            current += stepIncrement;
            if (current >= endValue) {
              target.textContent = endValue.toLocaleString();
              clearInterval(timer);
            } else {
              target.textContent = current.toLocaleString();
            }
          }, stepTime);

          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // 3. Product Crop-based Filter on products.html
  const filterButtons = document.querySelectorAll('.crop-filter-btn');
  const productCards = document.querySelectorAll('.product-item-col');

  // Smooth scroll to product helper
  window.scrollToProduct = function(productId) {
    const targetCard = document.getElementById(productId);
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetCard.classList.add('highlight-target');
      setTimeout(() => targetCard.classList.remove('highlight-target'), 2000);
    }
  };

  const productSearchInput = document.getElementById('productSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  function filterCatalog() {
    const activeBtn = document.querySelector('.crop-filter-btn.active');
    const filterValue = activeBtn ? (activeBtn.getAttribute('data-filter') || 'all') : 'all';
    const searchQuery = productSearchInput ? productSearchInput.value.trim().toLowerCase() : '';

    productCards.forEach(card => {
      const cropTokens = (card.getAttribute('data-crops') || '').toLowerCase().split(/\s+/);
      const cardText = card.textContent.toLowerCase();

      const cropMatch = (filterValue === 'all') || cropTokens.includes(filterValue.toLowerCase());
      const searchMatch = !searchQuery || cardText.includes(searchQuery);

      if (cropMatch && searchMatch) {
        card.style.display = 'block';
        requestAnimationFrame(() => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 20);
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px) scale(0.96)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 260);
      }
    });
  }

  if (filterButtons.length > 0 && productCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        filterCatalog();
      });
    });

    if (productSearchInput) {
      productSearchInput.addEventListener('input', filterCatalog);
    }
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (productSearchInput) {
          productSearchInput.value = '';
          filterCatalog();
        }
      });
    }
  }

  // 4. Product Details Modal Dynamic Population
  const productDetailModal = document.getElementById('productDetailModal');
  if (productDetailModal) {
    const viewDetailBtns = document.querySelectorAll('.btn-view-product');
    viewDetailBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-name');
        const img = btn.getAttribute('data-img');
        const desc = btn.getAttribute('data-desc');
        const npk = btn.getAttribute('data-npk');
        const organicCarbon = btn.getAttribute('data-oc');
        const dosage = btn.getAttribute('data-dosage');
        const benefits = btn.getAttribute('data-benefits');

        const modalTitle = productDetailModal.querySelector('#modalProductTitle');
        const modalImg = productDetailModal.querySelector('#modalProductImg');
        const modalDesc = productDetailModal.querySelector('#modalProductDesc');
        const modalNpk = productDetailModal.querySelector('#modalProductNpk');
        const modalOc = productDetailModal.querySelector('#modalProductOc');
        const modalDosage = productDetailModal.querySelector('#modalProductDosage');
        const modalBenefits = productDetailModal.querySelector('#modalProductBenefits');

        if (modalTitle) modalTitle.textContent = title;
        if (modalImg) modalImg.src = img;
        if (modalDesc) modalDesc.textContent = desc;
        if (modalNpk) modalNpk.textContent = npk;
        if (modalOc) modalOc.textContent = organicCarbon;
        if (modalDosage) modalDosage.textContent = dosage;

        if (modalBenefits && benefits) {
          const listItems = benefits.split('|').map(b => `<li><i class="bi bi-check-circle-fill text-success me-2"></i>${b.trim()}</li>`).join('');
          modalBenefits.innerHTML = listItems;
        }
      });
    });
  }

  // 5. Blog Search & Category Filter on blog.html
  const blogSearchInput = document.getElementById('blogSearchInput');
  const blogCategoryBtns = document.querySelectorAll('.blog-cat-btn');
  const blogCards = document.querySelectorAll('.blog-item-col');

  function filterBlogs() {
    const searchTerm = blogSearchInput ? blogSearchInput.value.toLowerCase().trim() : '';
    const activeCatBtn = document.querySelector('.blog-cat-btn.active');
    const selectedCat = activeCatBtn ? activeCatBtn.getAttribute('data-category') : 'all';

    blogCards.forEach(card => {
      const title = (card.querySelector('.blog-title')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('p')?.textContent || '').toLowerCase();
      const cat = (card.getAttribute('data-category') || '').toLowerCase().trim();

      const matchesSearch = !searchTerm || title.includes(searchTerm) || desc.includes(searchTerm);
      const matchesCat = (selectedCat === 'all') || (cat === selectedCat);

      if (matchesSearch && matchesCat) {
        card.style.display = '';
        card.style.opacity = '1';
        card.classList.remove('d-none');
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
        card.classList.add('d-none');
      }
    });
  }

  if (blogSearchInput) {
    blogSearchInput.addEventListener('input', filterBlogs);
  }

  if (blogCategoryBtns.length > 0) {
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = (urlParams.get('cat') || urlParams.get('category') || '').toLowerCase().trim();
    if (catParam) {
      const matchBtn = document.querySelector(`.blog-cat-btn[data-category="${catParam}"]`);
      if (matchBtn) {
        blogCategoryBtns.forEach(b => b.classList.remove('active'));
        matchBtn.classList.add('active');
      }
    }

    blogCategoryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (e) e.preventDefault();
        blogCategoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterBlogs();
      });
    });

    filterBlogs();
  }

  // 6. Blog Reader Modal ("Read More" click)
  const blogReaderModal = document.getElementById('blogReaderModal');
  if (blogReaderModal) {
    const readBtns = document.querySelectorAll('.btn-read-blog, .read-blog-btn');
    readBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title');
        const img = btn.getAttribute('data-img');
        const author = btn.getAttribute('data-author') || 'Dr. K. Swaminathan (Lead Agronomist)';
        const date = btn.getAttribute('data-date') || 'November 2026';
        const bodyContent = btn.getAttribute('data-content');

        const titleEl = blogReaderModal.querySelector('#modalBlogTitle');
        const imgEl = blogReaderModal.querySelector('#modalBlogImg');
        const metaEl = blogReaderModal.querySelector('#modalBlogMeta');
        const contentEl = blogReaderModal.querySelector('#modalBlogContent');

        if (titleEl) titleEl.textContent = title;
        if (imgEl) imgEl.src = img;
        if (metaEl) metaEl.innerHTML = `<i class="bi bi-person me-1"></i> ${author} &bull; <i class="bi bi-calendar3 ms-2 me-1"></i> ${date}`;
        if (contentEl) contentEl.innerHTML = bodyContent;
      });
    });
  }

  // 7. Hash Navigation & Highlighting (e.g. from footer links)
  function handleHashNavigation() {
    const hash = window.location.hash;
    if (!hash || hash === '#') return;
    
    try {
      const targetEl = document.querySelector(hash);
      if (!targetEl) return;

      // If it's a product card on products.html, ensure it's visible and reset filter if needed
      if (targetEl.classList.contains('product-item-col')) {
        const allFilterBtn = document.querySelector('.crop-filter-btn[data-filter="all"]');
        if (allFilterBtn && !allFilterBtn.classList.contains('active')) {
          const filterButtons = document.querySelectorAll('.crop-filter-btn');
          filterButtons.forEach(b => b.classList.remove('active'));
          allFilterBtn.classList.add('active');
          const productCards = document.querySelectorAll('.product-item-col');
          productCards.forEach(c => {
            c.style.display = 'block';
            c.style.opacity = '1';
          });
        }
        targetEl.style.display = 'block';
        targetEl.style.opacity = '1';
      }

      setTimeout(() => {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const card = targetEl.querySelector('.farm-card') || targetEl;
        card.classList.add('highlight-target');
        setTimeout(() => card.classList.remove('highlight-target'), 2500);
      }, 150);
    } catch (e) {
      // Invalid selector or hash
    }
  }

  // Run on load and hash change
  window.addEventListener('load', handleHashNavigation);
  window.addEventListener('hashchange', handleHashNavigation);
});