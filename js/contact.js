import './app.js';

const form = document.querySelector('[data-contact-form]');
const status = document.querySelector('[data-form-status]');
const draftKey = 'srk-contact-draft';
try {
  const saved = JSON.parse(localStorage.getItem(draftKey) || '{}');
  Object.entries(saved).forEach(([name, value]) => { if (form.elements[name]) form.elements[name].value = value; });
} catch { /* A damaged draft should never block the form. */ }
form.addEventListener('input', () => { const draft = Object.fromEntries(new FormData(form)); try { localStorage.setItem(draftKey, JSON.stringify(draft)); } catch { /* Private browsing may disable storage. */ } });
form.addEventListener('submit', (event) => {
  event.preventDefault(); status.textContent = '';
  if (!form.checkValidity()) { form.reportValidity(); status.textContent = 'Please complete the highlighted fields.'; return; }
  status.textContent = 'Thank you. Your message has been recorded for this demonstration.';
  form.reset(); try { localStorage.removeItem(draftKey); } catch { /* Non-critical. */ }
});
