/**
 * TerraPure Organics - Form Handling & Fertilizer Calculator
 * Handles Contact Form, Bulk Enquiry, Service Modal, and Interactive Calculators
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // Input Validation & Real-Time Filtering:
  // - Full Name: Letters, spaces, hyphens, dots, apostrophes ONLY (NO numbers)
  // - Phone / WhatsApp: Numbers, leading '+', spaces, hyphens ONLY (NO letters)
  // =========================================================================
  const nameInputs = document.querySelectorAll('#srvName, #fullName, input[name="name"], input[name="fullName"]');
  const phoneInputs = document.querySelectorAll('#srvPhone, #phoneNumber, input[type="tel"], input[name="phone"]');

  // --- Name Inputs: Block Numbers strictly ---
  nameInputs.forEach((input) => {
    // 1. Block number keys on keydown
    input.addEventListener('keydown', (e) => {
      // Allow control/navigation keys: Backspace, Tab, Enter, Escape, Delete, Arrows, Home, End
      const controlKeys = [
        'Backspace', 'Tab', 'Enter', 'Escape', 'Delete',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End'
      ];
      if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // Block any numeric characters (0-9)
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        return false;
      }
    });

    // 2. Real-time input scrubbing (handles mobile autocomplete, dictation, paste)
    input.addEventListener('input', function () {
      const sanitized = this.value.replace(/[0-9]/g, '');
      if (this.value !== sanitized) {
        this.value = sanitized;
      }
      if (!/[0-9]/.test(this.value)) {
        this.setCustomValidity('');
      }
    });

    // 3. Paste event sanitization
    input.addEventListener('paste', function (e) {
      const pasteText = (e.clipboardData || window.clipboardData)?.getData('text') || '';
      if (/[0-9]/.test(pasteText)) {
        e.preventDefault();
        const cleaned = pasteText.replace(/[0-9]/g, '');
        const start = this.selectionStart;
        const end = this.selectionEnd;
        this.value = this.value.substring(0, start) + cleaned + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + cleaned.length;
        this.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  });

  // --- Phone Inputs: Block Letters strictly ---
  phoneInputs.forEach((input) => {
    // 1. Block letters and disallowed symbols on keydown
    input.addEventListener('keydown', function (e) {
      const controlKeys = [
        'Backspace', 'Tab', 'Enter', 'Escape', 'Delete',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End'
      ];
      if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // Block any alphabetical letters (a-z, A-Z)
      if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        return false;
      }

      // Allow digits and standard phone symbols (+, -, space)
      if (/^[0-9+\s-]$/.test(e.key)) {
        // '+' is only allowed as the first character
        if (e.key === '+' && (input.selectionStart !== 0 || input.value.includes('+'))) {
          e.preventDefault();
          return false;
        }
        return;
      }

      // Block all other symbols
      e.preventDefault();
      return false;
    });

    // 2. Real-time input scrubbing (handles mobile predictive text, autofill)
    input.addEventListener('input', function () {
      // Strip any letters or invalid characters
      let sanitized = this.value.replace(/[^0-9+\s-]/g, '');
      // Ensure '+' only appears at the beginning
      if (sanitized.indexOf('+') > 0) {
        const hasLeading = sanitized.charAt(0) === '+';
        sanitized = (hasLeading ? '+' : '') + sanitized.slice(hasLeading ? 1 : 0).replace(/\+/g, '');
      }
      if (this.value !== sanitized) {
        this.value = sanitized;
      }
      if (!/[a-zA-Z]/.test(this.value)) {
        this.setCustomValidity('');
      }
    });

    // 3. Paste event sanitization
    input.addEventListener('paste', function (e) {
      const pasteText = (e.clipboardData || window.clipboardData)?.getData('text') || '';
      if (/[a-zA-Z]/.test(pasteText) || /[^0-9+\s-]/.test(pasteText)) {
        e.preventDefault();
        let cleaned = pasteText.replace(/[^0-9+\s-]/g, '');
        if (cleaned.indexOf('+') > 0) {
          const hasLeading = cleaned.charAt(0) === '+';
          cleaned = (hasLeading ? '+' : '') + cleaned.slice(hasLeading ? 1 : 0).replace(/\+/g, '');
        }
        const start = this.selectionStart;
        const end = this.selectionEnd;
        this.value = this.value.substring(0, start) + cleaned + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + cleaned.length;
        this.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  });

  // 1. Bulk Order Enquiry Form Handler (contact.html)
  const contactForm = document.getElementById('bulkOrderForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Explicit Name & Phone validation
      const nameInp = contactForm.querySelector('#fullName');
      if (nameInp && /[0-9]/.test(nameInp.value)) {
        nameInp.setCustomValidity('Please enter letters only (no numbers).');
      } else if (nameInp) {
        nameInp.setCustomValidity('');
      }

      const phoneInp = contactForm.querySelector('#phoneNumber');
      if (phoneInp && /[a-zA-Z]/.test(phoneInp.value)) {
        phoneInp.setCustomValidity('Please enter numbers only (no letters).');
      } else if (phoneInp) {
        phoneInp.setCustomValidity('');
      }

      // Check HTML5 validity
      if (!contactForm.checkValidity()) {
        e.stopPropagation();
        contactForm.classList.add('was-validated');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Processing Enquiry...
      `;

      // Simulate API submission
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Show toast or alert modal
        showNotification(
          'Enquiry Submitted Successfully!',
          'Thank you for contacting TerraPure Organics. Our agricultural logistics team will contact you within 2 hours with customized wholesale pricing and delivery schedules.',
          'success'
        );

        contactForm.reset();
        contactForm.classList.remove('was-validated');
      }, 1200);
    });
  }

  // 2. Service Quick Enquiry Form Handler (services.html)
  const serviceForm = document.getElementById('serviceEnquiryForm');
  if (serviceForm) {
    serviceForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Explicit Name & Phone validation
      const srvNameInp = serviceForm.querySelector('#srvName');
      if (srvNameInp && /[0-9]/.test(srvNameInp.value)) {
        srvNameInp.setCustomValidity('Please enter letters only (no numbers).');
      } else if (srvNameInp) {
        srvNameInp.setCustomValidity('');
      }

      const srvPhoneInp = serviceForm.querySelector('#srvPhone');
      if (srvPhoneInp && /[a-zA-Z]/.test(srvPhoneInp.value)) {
        srvPhoneInp.setCustomValidity('Please enter numbers only (no letters).');
      } else if (srvPhoneInp) {
        srvPhoneInp.setCustomValidity('');
      }

      if (!serviceForm.checkValidity()) {
        e.stopPropagation();
        serviceForm.classList.add('was-validated');
        return;
      }

      const submitBtn = serviceForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Submitting...`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        showNotification(
          'Service Request Received!',
          'Our soil specialist and agronomy consultant has received your inquiry. We will contact you shortly to schedule your consultation.',
          'success'
        );

        serviceForm.reset();
        serviceForm.classList.remove('was-validated');

        // Close modal if inside one
        const modalEl = serviceForm.closest('.modal');
        if (modalEl && window.bootstrap) {
          const bsModal = bootstrap.Modal.getInstance(modalEl);
          if (bsModal) bsModal.hide();
        }
      }, 1000);
    });
  }

  // 3. Quick Manure & Fertilizer Calculator (home-2.html)
  const calcForm = document.getElementById('fertilizerCalculator');
  if (calcForm) {
    const cropSelect = document.getElementById('calcCrop');
    const areaInput = document.getElementById('calcAcreage');
    const resultBox = document.getElementById('calcResult');
    const manureOutput = document.getElementById('outputManure');
    const vermiOutput = document.getElementById('outputVermicompost');
    const neemOutput = document.getElementById('outputNeem');

    // Dosage rates per acre in metric tons / kg
    const cropDosageMap = {
      rice: { manureTons: 3.5, vermiKg: 400, neemKg: 100 },
      banana: { manureTons: 8.0, vermiKg: 800, neemKg: 250 },
      coconut: { manureTons: 5.0, vermiKg: 500, neemKg: 150 },
      vegetables: { manureTons: 6.0, vermiKg: 750, neemKg: 200 },
      sugarcane: { manureTons: 10.0, vermiKg: 1000, neemKg: 300 },
      fruits: { manureTons: 7.0, vermiKg: 650, neemKg: 200 }
    };

    function calculateDosage() {
      const crop = cropSelect ? cropSelect.value : 'vegetables';
      const acres = parseFloat(areaInput ? areaInput.value : 1) || 1;
      const rates = cropDosageMap[crop] || cropDosageMap.vegetables;

      const totalManure = (rates.manureTons * acres).toFixed(1);
      const totalVermi = Math.round(rates.vermiKg * acres);
      const totalNeem = Math.round(rates.neemKg * acres);

      if (manureOutput) manureOutput.textContent = `${totalManure} Metric Tons`;
      if (vermiOutput) vermiOutput.textContent = `${totalVermi} Kg (${Math.ceil(totalVermi / 50)} Bags of 50kg)`;
      if (neemOutput) neemOutput.textContent = `${totalNeem} Kg (${Math.ceil(totalNeem / 50)} Bags of 50kg)`;

      if (resultBox) {
        resultBox.classList.remove('d-none');
      }
    }

    if (calcForm) {
      calcForm.addEventListener('input', calculateDosage);
      calculateDosage(); // initial run
    }
  }

  // 4. Newsletter Subscription Form
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        showNotification(
          'Subscribed!',
          'Thank you for subscribing to our organic farming insights and seasonal guidance digest.',
          'success'
        );
        input.value = '';
      }
    });
  });

  // Reusable Notification Banner / Toast
  function showNotification(title, message, type = 'success') {
    let container = document.getElementById('terrapure-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'terrapure-toast-container';
      container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      container.style.zIndex = '9999';
      document.body.appendChild(container);
    }

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-bg-${type === 'success' ? 'success' : 'primary'} border-0 show shadow-lg`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <strong><i class="bi bi-check-circle-fill me-2"></i> ${title}</strong>
          <div class="mt-1 small">${message}</div>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    container.appendChild(toastEl);

    // Auto remove after 5 seconds
    setTimeout(() => {
      toastEl.classList.remove('show');
      setTimeout(() => toastEl.remove(), 400);
    }, 5000);

    const closeBtn = toastEl.querySelector('.btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toastEl.classList.remove('show');
        setTimeout(() => toastEl.remove(), 400);
      });
    }
  }

  window.showTerraNotification = showNotification;
});
