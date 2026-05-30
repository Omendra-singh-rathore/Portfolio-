// Typing effect configuration
const typingTextElement = document.getElementById('typing-text');
const typingPhrases = [
  'I build modern and interactive web experiences.',
  'I turn complex ideas into elegant interfaces.',
  'I focus on performance, detail, and accessibility.'
];
const typingSpeed = 40;
const typingPause = 1600;

let typingPhraseIndex = 0;
let typingCharIndex = 0;
let isDeleting = false;

/**
 * Runs a smooth typing / deleting loop through the configured phrases.
 */
function runTypingEffect() {
  const currentPhrase = typingPhrases[typingPhraseIndex];

  if (!isDeleting) {
    typingCharIndex++;
    typingTextElement.textContent = currentPhrase.slice(0, typingCharIndex);

    if (typingCharIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(runTypingEffect, typingPause);
      return;
    }
  } else {
    typingCharIndex--;
    typingTextElement.textContent = currentPhrase.slice(0, typingCharIndex);

    if (typingCharIndex === 0) {
      isDeleting = false;
      typingPhraseIndex = (typingPhraseIndex + 1) % typingPhrases.length;
    }
  }

  const nextDelay = isDeleting ? typingSpeed / 1.4 : typingSpeed;
  setTimeout(runTypingEffect, nextDelay);
}

// Scroll reveal using IntersectionObserver
const revealElements = document.querySelectorAll('.reveal-on-scroll');

/**
 * Initializes scroll-based reveal animations for elements.
 */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/**
 * Sets up smooth scrolling for in-page navigation links.
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      event.preventDefault();

      targetEl.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
}

/**
 * Highlights the active section in the navbar and moves the underline indicator.
 */
function initNavbarActiveState() {
  const navLinks = document.querySelectorAll('.nav-underline-link');
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const indicator = document.querySelector('.navbar-underline-indicator');

  function setActiveLinkBySection() {
    const scrollPos =
      window.scrollY + (window.innerHeight * 0.2 || 0) + (window.innerWidth < 992 ? 0 : 70);

    let activeSectionId = sections[0]?.id;
    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) {
        activeSectionId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${activeSectionId}`;
      link.classList.toggle('active', isActive);
      if (isActive && indicator && window.innerWidth >= 992) {
        const rect = link.getBoundingClientRect();
        const navbarRect = link.closest('.navbar').getBoundingClientRect();
        indicator.style.opacity = '1';
        indicator.style.width = `${rect.width}px`;
        indicator.style.transform = `translateX(${rect.left - navbarRect.left}px)`;
      }
    });
  }

  window.addEventListener('scroll', setActiveLinkBySection, { passive: true });
  window.addEventListener('resize', setActiveLinkBySection);

  // Also update active state on manual nav clicks to feel snappy
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
      if (indicator && window.innerWidth >= 992) {
        const rect = link.getBoundingClientRect();
        const navbarRect = link.closest('.navbar').getBoundingClientRect();
        indicator.style.opacity = '1';
        indicator.style.width = `${rect.width}px`;
        indicator.style.transform = `translateX(${rect.left - navbarRect.left}px)`;
      }
    });
  });

  // Initial run
  window.addEventListener('load', setActiveLinkBySection);
}

/**
 * Handles contact form validation and simulated submission feedback.
 */
function initContactFormValidation() {
  const form = document.getElementById('contact-form');
  const statusElement = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    statusElement.textContent = '';
    statusElement.className = 'form-status-message';

    let isValid = true;

    const requiredFields = ['name', 'email', 'subject', 'message'];
    requiredFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (!field) return;

      const value = field.value.trim();

      if (!value) {
        field.classList.add('is-invalid');
        isValid = false;
      } else {
        field.classList.remove('is-invalid');
      }
    });

    const emailField = document.getElementById('email');
    const emailValue = emailField.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue && !emailPattern.test(emailValue)) {
      emailField.classList.add('is-invalid');
      isValid = false;
    }

    if (!isValid) {
      statusElement.textContent = 'Please correct the highlighted fields and try again.';
      statusElement.classList.add('error');
      return;
    }

    statusElement.textContent = 'Message sent successfully. I will get back to you shortly.';
    statusElement.classList.add('success');
    form.reset();
  });

  // Clear validation state on input
  form.querySelectorAll('input, textarea').forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
      statusElement.textContent = '';
      statusElement.className = 'form-status-message';
    });
  });
}

/**
 * Sets the current year in the footer.
 */
function initCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initSmoothScroll();
  initNavbarActiveState();
  initContactFormValidation();
  initCurrentYear();
  runTypingEffect();
});

