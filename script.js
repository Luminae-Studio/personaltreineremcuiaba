/* ======================================
   MATHEUS FISCHER - PERSONAL TRAINER
   Landing Page JavaScript
   ====================================== */

// ===== GOOGLE SHEETS CONFIG =====
// INSTRUCTIONS: Replace this URL with your Google Apps Script Web App URL
// Follow the setup guide in google-sheets-setup.md
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbz1hAi394ch4SLfyt6ecaALNKQZFRmd-XWxBuI-T-loPQDqH_rievyzbs-wicg4D3bs/exec'; // <-- COLE AQUI A URL DO SEU GOOGLE APPS SCRIPT

document.addEventListener('DOMContentLoaded', () => {

  // ===== LOADER =====
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => { loader.classList.add('hidden'); }, 800);
  });
  setTimeout(() => { loader.classList.add('hidden'); }, 3000); // fallback

  // ===== HEADER SCROLL =====
  const header = document.getElementById('header');
  const scrollTop = document.getElementById('scrollTop');
  
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) { header.classList.add('scrolled'); } else { header.classList.remove('scrolled'); }
    if (y > 400) { scrollTop.classList.add('visible'); } else { scrollTop.classList.remove('visible'); }
  });

  scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== MOBILE MENU =====
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const offset = header.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ===== SCROLL REVEAL ANIMATIONS =====
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== FAQ ACCORDION =====
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('faq-open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('faq-open'));
      if (!isOpen) item.classList.add('faq-open');
    });
  });

  // ===== PHONE MASK =====
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 11) val = val.slice(0, 11);
      if (val.length > 6) {
        val = `(${val.slice(0,2)}) ${val.slice(2,3)} ${val.slice(3,7)}-${val.slice(7)}`;
      } else if (val.length > 2) {
        val = `(${val.slice(0,2)}) ${val.slice(2)}`;
      } else if (val.length > 0) {
        val = `(${val}`;
      }
      e.target.value = val;
    });
  }

  // ===== COUNTER ANIMATION =====
  const counterElements = document.querySelectorAll('.about-stat-number');
  let counterDone = false;

  function animateCounters() {
    if (counterDone) return;
    counterDone = true;
    counterElements.forEach(el => {
      const text = el.textContent;
      const hasPlus = text.includes('+');
      const hasPercent = text.includes('%');
      const num = parseInt(text.replace(/\D/g, ''));
      const suffix = hasPlus ? '+' : hasPercent ? '%' : '';
      let current = 0;
      const step = Math.max(1, Math.floor(num / 40));
      const interval = setInterval(() => {
        current += step;
        if (current >= num) {
          current = num;
          clearInterval(interval);
        }
        el.textContent = current + suffix;
      }, 30);
    });
  }

  const aboutSection = document.querySelector('.about');
  if (aboutSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) animateCounters(); });
    }, { threshold: 0.3 });
    counterObserver.observe(aboutSection);
  }

});

// ===== SAVE LEAD TO GOOGLE SHEETS (via iframe - bypasses CORS) =====
function saveLeadToSheet(leadData) {
  if (!GOOGLE_SHEETS_URL) {
    console.warn('Google Sheets URL não configurada.');
    return;
  }

  // Create hidden iframe (if not exists)
  let iframe = document.getElementById('leads-iframe');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'leads-iframe';
    iframe.name = 'leads-iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }

  // Create hidden form targeting the iframe
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = GOOGLE_SHEETS_URL;
  form.target = 'leads-iframe';
  form.style.display = 'none';

  // Add each field as a hidden input
  for (const [key, value] of Object.entries(leadData)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }

  // Submit and cleanup
  document.body.appendChild(form);
  form.submit();
  setTimeout(() => form.remove(), 1000);
  console.log('✅ Lead enviado para Google Sheets!');
}

// ===== FORM HANDLER =====
function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const objective = document.getElementById('objective').value;
  const message = document.getElementById('message').value;

  // Build lead data object
  const leadData = {
    nome: name,
    whatsapp: phone,
    email: email || 'Não informado',
    objetivo: objective || 'Não informado',
    mensagem: message || 'Sem mensagem',
    data: new Date().toLocaleString('pt-BR', { timeZone: 'America/Cuiaba' }),
    origem: 'Formulário do Site'
  };

  // Save to Google Sheets (via hidden form - no CORS issues)
  saveLeadToSheet(leadData);

  // Build WhatsApp message
  let waMsg = `Olá Matheus! Meu nome é ${name}.`;
  if (objective) waMsg += `\nObjetivo: ${objective}`;
  if (message) waMsg += `\nMensagem: ${message}`;
  if (email) waMsg += `\nE-mail: ${email}`;
  waMsg += `\nWhatsApp: ${phone}`;

  // Show success
  document.getElementById('formContact').style.display = 'none';
  document.getElementById('formSuccess').classList.add('show');

  // Redirect to WhatsApp after delay
  setTimeout(() => {
    window.open(`https://wa.me/556599289007?text=${encodeURIComponent(waMsg)}`, '_blank');
  }, 1500);
}
