const products = {
  myclinix: {
    name: 'MyClinix', category: 'FOR CLINICS, LABS & PATIENTS',
    tagline: ['A little less admin.', 'A lot more care.'],
    description: 'Bringing appointments, OPD queues, patient records, and lab referrals closer together, so your team can focus on the people in front of them.',
    features: ['Appointments, walk-ins, and live patient queues', 'Visit records, prescriptions, and clinic billing', 'Connected clinic, lab, and patient journeys'],
    preview: 'The everyday care journey', eyebrow: 'A CLEARER DAY, FROM DESK TO DOCTOR',
    steps: [
      ['At the front desk', 'A welcoming start', 'An appointment, a walk-in, or a patient check-in.'],
      ['With the doctor', 'More context. Better continuity.', 'The visit, the records, and the next step in care.'],
      ['After the visit', 'Keep care moving', 'Referrals, reports, and follow-up, closer together.'],
    ], note: 'More connected care. More time for people.', floatingTitle: 'Care, connected.', floatingDescription: 'One thoughtful step at a time.',
  },
  glamo: {
    name: 'Glamo', category: 'FOR SALONS & WELLNESS BUSINESSES',
    tagline: ['A little less juggling.', 'A lot more room to bloom.'],
    description: 'Bringing bookings, walk-ins, teams, and customer relationships into the rhythm of your salon. More room for the work you love, and the people who come back for it.',
    features: ['Appointments and walk-ins on one calendar', 'Services, staff schedules, and everyday billing', 'Customer relationships and your own business identity'],
    preview: 'The everyday salon journey', eyebrow: 'A SMOOTHER DAY, FROM BOOKING TO REBOOKING',
    steps: [
      ['Before the visit', 'Make room for the next booking', 'Bring the service, professional, and available time together.'],
      ['In the salon', 'Let your day flow', 'Keep appointments, walk-ins, and the team in step.'],
      ['Beyond the chair', 'Give them a reason to return', 'Keep customer connections at the heart of your business.'],
    ], note: 'Your creativity. Your customers. Your brand.', floatingTitle: 'Space to bloom.', floatingDescription: 'For the business you’re growing.',
  },
  imend: {
    name: 'i-Mend', category: 'FOR INDEPENDENT GARAGES & REPAIR WORKSHOPS',
    tagline: ['A little less paperwork.', 'A lot more workshop.'],
    description: 'Built around the way independent repair businesses work. From the first job card to clear estimates, customer approvals, and the final invoice. Starting with car workshops and two-wheeler garages.',
    features: ['Job cards, estimates, and repair progress', 'Clear customer approvals and service history', 'Workshop billing and everyday collections'],
    preview: 'The everyday workshop journey', eyebrow: 'A CLEARER JOB, FROM CHECK-IN TO HANDOVER',
    steps: [
      ['At check-in', 'Start with a clear job card', 'Capture the vehicle, the concern, and the work ahead.'],
      ['Before the repair', 'Build trust into the estimate', 'Give customers a clear view of the work to approve.'],
      ['At handover', 'Close the job. Keep the connection.', 'Bring the invoice, service history, and next visit together.'],
    ], note: 'More clarity for your workshop and your customers.', floatingTitle: 'Trust, built in.', floatingDescription: 'From the first estimate to the last detail.',
  },
};

const tabs = [...document.querySelectorAll('[role="tab"]')];
const panel = document.getElementById('product-panel');
const text = (id, value) => { document.getElementById(id).textContent = value; };
const lines = (id, values) => {
  const element = document.getElementById(id);
  element.replaceChildren();
  values.forEach((value, index) => {
    if (index) element.append(document.createElement('br'));
    element.append(document.createTextNode(value));
  });
};
function selectProduct(key, announce = true) {
  const product = products[key];
  if (!product) return;
  document.body.dataset.product = key;
  tabs.forEach(tab => {
    const selected = tab.dataset.product === key;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', `tab-${key}`);
  text('product-category', product.category);
  const brandDot = document.createElement('span');
  brandDot.textContent = '.';
  document.getElementById('product-name').replaceChildren(document.createTextNode(product.name), brandDot);
  lines('product-tagline', product.tagline);
  text('product-description', product.description);
  document.getElementById('product-features').replaceChildren(...product.features.map(value => {
    const li = document.createElement('li'); li.textContent = value; return li;
  }));
  text('preview-name', `${product.name} · ${product.preview}`);
  text('journey-eyebrow', product.eyebrow);
  text('journey-note', product.note);
  text('floating-title', product.floatingTitle);
  text('floating-description', product.floatingDescription);
  document.getElementById('journey-steps').replaceChildren(...product.steps.map((step, index) => {
    const row = document.createElement('div'); row.className = 'journey-row';
    const number = document.createElement('span'); number.className = 'journey-index'; number.textContent = `0${index + 1}`;
    const copy = document.createElement('div');
    ['small', 'b', 'p'].forEach((tag, position) => { const element = document.createElement(tag); element.textContent = step[position]; copy.append(element); });
    row.append(number, copy); return row;
  }));
  if (announce) {
    text('product-status', `${product.name} selected. Product introduction updated below.`);
    panel.classList.remove('panel-enter');
    void panel.offsetWidth;
    panel.classList.add('panel-enter');
  }
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectProduct(tab.dataset.product));
  tab.addEventListener('keydown', event => {
    const target = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
    if (target === null) return;
    event.preventDefault();
    tabs[target].focus();
    selectProduct(tabs[target].dataset.product);
  });
});
selectProduct('myclinix', false);

const header = document.querySelector('.site-header');
const menu = document.querySelector('.menu-toggle');
function closeMenu() { header.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); }
menu.addEventListener('click', () => {
  const open = header.classList.toggle('is-open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
document.querySelectorAll('#navigation a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && header.classList.contains('is-open')) { closeMenu(); menu.focus(); } });
document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });

const preference = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('.motion-toggle');
let userPaused = false;
function syncMotion() {
  const paused = userPaused || preference.matches;
  document.body.classList.toggle('motion-paused', paused);
  motionButton.hidden = preference.matches;
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.textContent = paused ? 'Resume motion ▷' : 'Pause motion Ⅱ';
}
motionButton.addEventListener('click', () => { userPaused = !userPaused; syncMotion(); });
preference.addEventListener('change', syncMotion);
syncMotion();
if ('IntersectionObserver' in window && !preference.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, { threshold: .1 });
  document.querySelectorAll('.reveal').forEach(element => { element.classList.add('reveal-ready'); observer.observe(element); });
}
text('year', new Date().getFullYear());
