/**
 * LET'S BUILD THE CHILD FOUNDATION (LBTC) - INTERACTIVE JS MODULE
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFAQAccordion();
  initApplicationModal();
  initContactForm();
  initCounters();
});

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('mobileDrawerClose');

  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
}

/**
 * FAQ Accordion Toggle
 */
function initFAQAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close all active items
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/**
 * Application Modal Logic
 */
function initApplicationModal() {
  const modalBackdrop = document.getElementById('applicationModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const applyBtns = document.querySelectorAll('.trigger-apply-modal');
  const modalForm = document.getElementById('modalApplicationForm');

  if (!modalBackdrop) return;

  function openModal(programTitle) {
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    const titleElem = document.getElementById('modalProgramTitle');
    if (titleElem && programTitle) {
      titleElem.textContent = programTitle;
    }
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  applyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pTitle = btn.dataset.program || 'Scholarship Application';
      openModal(pTitle);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = modalForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting Application...';

      setTimeout(() => {
        alert('Thank you! Your preliminary application has been received. Our review committee will contact you via email/phone regarding next steps.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
        modalForm.reset();
        closeModal();
      }, 1200);
    });
  }
}

/**
 * Contact Form Front-End Handler
 */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !subject || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Message...';

    setTimeout(() => {
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';

      const successNotice = document.createElement('div');
      successNotice.style.background = 'var(--bg-mint)';
      successNotice.style.border = '1px solid var(--secondary-green)';
      successNotice.style.borderRadius = 'var(--radius-md)';
      successNotice.style.padding = '20px';
      successNotice.style.marginTop = '20px';
      successNotice.innerHTML = `
        <h4 style="color: var(--secondary-green-dark); margin-bottom: 6px;">✅ Message Sent Successfully</h4>
        <p style="color: var(--neutral-slate); font-size: 0.95rem;">Thank you, ${name}. We have received your enquiry regarding "${subject}". Our team aims to respond within 2–3 business days.</p>
      `;
      contactForm.insertAdjacentElement('beforebegin', successNotice);
      successNotice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1000);
  });
}

/**
 * Animated Stat Counter Script (IntersectionObserver triggered)
 * Counts up smoothly from 0 to target number when element is scrolled into view.
 */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = parseInt(counter.getAttribute('data-duration'), 10) || 1800; // ms
        
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          // Smooth ease-out quad formula
          const currentVal = Math.floor(progress * (2 - progress) * target);
          counter.textContent = `${prefix}${currentVal}${suffix}`;
          
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            counter.textContent = `${prefix}${target}${suffix}`;
          }
        };
        
        window.requestAnimationFrame(step);
        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(counter => observer.observe(counter));
}

