/**
 * Sariaya Biodiversity Portfolio - Interactive Scripts
 * Ridge-to-Reef Environmental Documentation
 * Vanilla JavaScript (ES6+) with zero external dependencies
 */

(() => {
  'use strict';

  // =========================================================================
  // 1. MOBILE NAVIGATION TOGGLE
  // =========================================================================
  const initMobileNavigation = () => {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (!navToggle || !navMenu) return;

    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : navToggle.getAttribute('aria-expanded') !== 'true';
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navMenu.classList.toggle('is-open', isOpen);
    };

    navToggle.addEventListener('click', () => toggleMenu());

    // Close menu when navigation link is clicked
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        toggleMenu(false);
        navToggle.focus();
      }
    });
  };

  // =========================================================================
  // 2. THEME SWITCHER (LIGHT / DARK MODE)
  // =========================================================================
  const initThemeSwitcher = () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    // Determine initial theme from local storage or system preference
    const savedTheme = localStorage.getItem('sariaya-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', initialTheme);

    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('sariaya-theme', newTheme);
      themeToggleBtn.setAttribute('aria-label', `Switch to ${currentTheme} theme`);
    });
  };

  // =========================================================================
  // 3. INTERACTIVE HABITAT SPECIMEN FILTER
  // =========================================================================
  const initSpecimenFilter = () => {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const specimenCards = document.querySelectorAll('.specimen-card');
    if (!filterTabs.length || !specimenCards.length) return;

    filterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        // Update active tab states & ARIA attributes
        filterTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const filterValue = tab.getAttribute('data-filter');

        // Filter cards
        specimenCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  };

  // =========================================================================
  // 4. INTERACTIVE SPECIMEN MODAL DIALOG
  // =========================================================================
  const initSpecimenModal = () => {
    const modal = document.getElementById('specimen-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const closeSecondaryBtn = document.getElementById('modal-close-secondary');
    const openButtons = document.querySelectorAll('.open-modal-btn');

    if (!modal) return;

    const modalTitle = document.getElementById('modal-title');
    const modalZone = document.getElementById('modal-zone');
    const modalImage = document.getElementById('modal-image');
    const modalStatus = document.getElementById('modal-status');
    const modalDesc = document.getElementById('modal-desc');

    let previousActiveElement = null;

    const openModal = (triggerBtn) => {
      previousActiveElement = triggerBtn;

      // Populate modal data from dataset
      if (modalTitle) modalTitle.textContent = triggerBtn.dataset.title || 'Specimen Details';
      if (modalZone) modalZone.textContent = triggerBtn.dataset.zone || 'Ecological Corridor';
      if (modalStatus) modalStatus.textContent = triggerBtn.dataset.status || 'Active Monitoring';
      if (modalDesc) modalDesc.textContent = triggerBtn.dataset.desc || '';
      if (modalImage) {
        modalImage.src = triggerBtn.dataset.image || './assets/large.jpg';
        modalImage.alt = triggerBtn.dataset.imageAlt || 'Specimen photograph';
      }

      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        modal.setAttribute('open', '');
      }

      if (closeBtn) closeBtn.focus();
    };

    const closeModal = () => {
      if (typeof modal.close === 'function') {
        modal.close();
      } else {
        modal.removeAttribute('open');
      }

      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };

    openButtons.forEach((btn) => {
      btn.addEventListener('click', () => openModal(btn));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeSecondaryBtn) closeSecondaryBtn.addEventListener('click', closeModal);

    // Close on clicking backdrop
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on Escape key
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });
  };

  // =========================================================================
  // 5. INTERACTIVE RIDGE-TO-REEF ACCORDION
  // =========================================================================
  const initAccordion = () => {
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    if (!accordionTriggers.length) return;

    accordionTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        const panelId = trigger.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);

        // Close other panels for clean single-panel view
        accordionTriggers.forEach((otherTrigger) => {
          if (otherTrigger !== trigger) {
            otherTrigger.setAttribute('aria-expanded', 'false');
            const otherPanel = document.getElementById(otherTrigger.getAttribute('aria-controls'));
            if (otherPanel) otherPanel.hidden = true;
          }
        });

        // Toggle clicked panel
        trigger.setAttribute('aria-expanded', String(!isExpanded));
        if (panel) {
          panel.hidden = isExpanded;
        }
      });
    });
  };

  // =========================================================================
  // 6. CONTACT FORM VALIDATION & STATIC UI FEEDBACK
  // =========================================================================
  const initContactForm = () => {
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    if (!form || !formStatus) return;

    const clearErrors = () => {
      const errorSpans = form.querySelectorAll('.field-error');
      const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
      errorSpans.forEach((span) => { span.textContent = ''; });
      inputs.forEach((input) => { input.classList.remove('has-error'); });
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;

      // Validate Name
      const nameInput = document.getElementById('contact-name');
      const nameError = document.getElementById('name-error');
      if (!nameInput.value.trim()) {
        nameInput.classList.add('has-error');
        if (nameError) nameError.textContent = 'Please provide your full name.';
        isValid = false;
      }

      // Validate Email
      const emailInput = document.getElementById('contact-email');
      const emailError = document.getElementById('email-error');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
        emailInput.classList.add('has-error');
        if (emailError) emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      // Validate Topic
      const topicSelect = document.getElementById('contact-topic');
      const topicError = document.getElementById('topic-error');
      if (!topicSelect.value) {
        topicSelect.classList.add('has-error');
        if (topicError) topicError.textContent = 'Please select an inquiry topic.';
        isValid = false;
      }

      // Validate Message
      const messageTextarea = document.getElementById('contact-message');
      const messageError = document.getElementById('message-error');
      if (!messageTextarea.value.trim() || messageTextarea.value.trim().length < 10) {
        messageTextarea.classList.add('has-error');
        if (messageError) messageError.textContent = 'Please enter a message of at least 10 characters.';
        isValid = false;
      }

      if (!isValid) {
        formStatus.hidden = false;
        formStatus.className = 'form-status-alert error';
        formStatus.textContent = 'Please correct the errors in the highlighted fields above.';
        return;
      }

      // Simulate successful submission for static portfolio
      formStatus.hidden = false;
      formStatus.className = 'form-status-alert success';
      formStatus.textContent = 'Thank you for your message! Your collaboration inquiry has been recorded.';
      form.reset();

      setTimeout(() => {
        formStatus.hidden = true;
      }, 7000);
    });
  };

  // =========================================================================
  // INITIALIZATION ON DOM READY
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initMobileNavigation();
    initThemeSwitcher();
    initSpecimenFilter();
    initSpecimenModal();
    initAccordion();
    initContactForm();
  });
})();
