/* ============================================
   DECORATEC — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initActiveNavLink();
  initContactForm();
});

/* ---------- Navbar Scroll Effect ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;
  const scrollThreshold = 50;

  function handleScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  const overlay = document.getElementById('navOverlay');

  if (!toggle || !menu) return;

  function openMenu() {
    toggle.classList.add('active');
    menu.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.classList.remove('active');
    menu.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close menu when clicking a link
  const menuLinks = menu.querySelectorAll('.navbar__link, .navbar__cta');
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ---------- Smooth Scroll ---------- */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ---------- Scroll Reveal Animations ---------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Also reveal stagger children
        if (entry.target.classList.contains('stagger-children') ||
          entry.target.closest('.stagger-children')) {
          const parent = entry.target.classList.contains('stagger-children')
            ? entry.target
            : entry.target.closest('.stagger-children');

          const children = parent.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
          children.forEach(child => child.classList.add('visible'));
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* ---------- Active Navigation Link ---------- */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link[data-section]');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.dataset.section === sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ---------- Contact Form ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMessage = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit(form, successMessage);
  });
}

/**
 * Handles the contact form submission.
 * This function is designed to be easily extended with an API call.
 * 
 * @param {HTMLFormElement} form - The contact form element
 * @param {HTMLElement} successElement - The success message element
 */
async function handleFormSubmit(form, successElement) {
  const submitBtn = form.querySelector('#contactSubmit');
  const formData = new FormData(form);

  // Extract form values
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    service: formData.get('service'),
    message: formData.get('message'),
  };

  // Basic validation
  if (!data.name || !data.email || !data.message) {
    shakeElement(submitBtn);
    return;
  }

  // UI feedback: loading state
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
      <circle cx="12" cy="12" r="10" stroke-dasharray="40" stroke-dashoffset="10"/>
    </svg>
    Enviando...
  `;
  submitBtn.disabled = true;

  try {
    // ============================================================
    // API INTEGRATION POINT
    // Replace the timeout below with your API call, e.g.:
    //
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    //
    // if (!response.ok) throw new Error('Error al enviar el mensaje');
    // ============================================================

    // Simulate API call (remove when connecting real API)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Success
    form.style.display = 'none';
    if (successElement) {
      successElement.classList.add('visible');
    }

    console.log('DECORATEC — Form data:', data);

  } catch (error) {
    console.error('DECORATEC — Form error:', error);
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    alert('Hubo un error al enviar tu mensaje. Por favor intenta nuevamente.');
  }
}

/* ---------- Utility: Shake Animation ---------- */
function shakeElement(element) {
  element.style.animation = 'shake 0.5s ease-in-out';
  element.addEventListener('animationend', () => {
    element.style.animation = '';
  }, { once: true });
}

// Add shake keyframes dynamically
const shakeStyles = document.createElement('style');
shakeStyles.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
    20%, 40%, 60%, 80% { transform: translateX(4px); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(shakeStyles);
