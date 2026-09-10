const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(expanded));
  navigation.classList.toggle('open', expanded);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
  }
});
document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach((item) => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    let count = 0;
    document.querySelectorAll('[data-category]').forEach((project) => {
      project.hidden =
        button.dataset.filter !== 'all' &&
        project.dataset.category !== button.dataset.filter;
      if (!project.hidden) count++;
    });
    document.querySelector('#filter-result').textContent =
      count + ' projects shown';
  });
});
const collaboratorQuotes = [
  {
    quote:
      "“They asked the questions we hadn't thought to ask. The result felt like us — just clearer, braver and a lot better.”",
    name: 'Jamie Lawson',
    role: 'Founder, Velo Collective',
    initials: 'JL',
  },
  {
    quote:
      '“Our projects finally have room to breathe. Every detail, from the first sketch to the mobile experience, was considered.”',
    name: 'Mara Chen',
    role: 'Director, Form / Space',
    initials: 'MC',
  },
];
document.querySelectorAll('[data-quote]').forEach((button) => {
  button.addEventListener('click', () => {
    const selected = collaboratorQuotes[Number(button.dataset.quote)];
    document.querySelector('#collaborator-quote').textContent = selected.quote;
    document.querySelector('.quote-person .avatar').textContent =
      selected.initials;
    document.querySelector('.quote-person strong').textContent = selected.name;
    document.querySelector('.quote-person div > span').textContent =
      selected.role;
    document.querySelectorAll('[data-quote]').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button));
    });
  });
});
const cases = {
  velo: {
    name: 'Velo Collective',
    type: 'BRAND STRATEGY / IDENTITY',
    description:
      'A welcoming cycling club needed an identity that felt as good at the café as it did on the road.',
    challenge:
      'Replace competitive cycling clichés with a clear, inclusive personality. The identity had to work at speed, on fabric and at a very small scale.',
    solution:
      'A compact wordmark, acid-yellow colour system and direct language carry through apparel, ride cards and membership materials. A concise guide keeps every application consistent.',
  },
  folio: {
    name: 'Folio Finance',
    type: 'PRODUCT STRATEGY / WEB EXPERIENCE',
    description:
      'A considered personal finance experience that puts clarity ahead of complexity.',
    challenge:
      'Make a financial overview understandable without reducing useful detail. Help people distinguish available money, committed spending and longer-term goals.',
    solution:
      'A legible balance hierarchy, consistent transaction language and lightweight comparative charts create a calm overview. The interface system includes focus, empty and validation states.',
  },
  form: {
    name: 'Form / Space',
    type: 'ART DIRECTION / DEVELOPMENT',
    description:
      'An editorial website for an architecture practice interested in the spaces between things.',
    challenge:
      'Let a broad body of work feel cohesive without forcing every project into the same composition.',
    solution:
      'An adaptable grid, clear project taxonomy and quiet transitions create a framework that gives each project room. Responsive image rules preserve the reading rhythm across screens.',
  },
  common: {
    name: 'Common Ground',
    type: 'NAMING / BRAND SYSTEM',
    description:
      'A neighbourhood roaster with one simple belief: good coffee should bring people together.',
    challenge:
      'Build a recognisable identity that could live comfortably on a bag, a shopfront and a local event poster.',
    solution:
      'A conversational name, two complementary typographic voices and an optimistic colour system. The identity kit sets clear rules while leaving space for local stories.',
  },
};
const dialog = document.querySelector('#case-dialog');
document.querySelectorAll('[data-project]').forEach((button) =>
  button.addEventListener('click', () => {
    const project = cases[button.dataset.project];
    document.querySelector('#case-title').textContent = project.name;
    document.querySelector('#case-type').textContent = project.type;
    document.querySelector('#case-description').textContent =
      project.description;
    const details = document.querySelector('.case-details');
    details.replaceChildren();
    for (const [heading, text] of [
      ['The challenge', project.challenge],
      ['The approach', project.solution],
    ]) {
      const section = document.createElement('section');
      const title = document.createElement('h3');
      const paragraph = document.createElement('p');
      title.textContent = heading;
      paragraph.textContent = text;
      section.append(title, paragraph);
      details.append(section);
    }
    dialog.showModal();
  }),
);
document
  .querySelector('.dialog-close')
  .addEventListener('click', () => dialog.close());
document
  .querySelector('#case-contact')
  .addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (
    event.target === dialog &&
    event.clientX < dialog.getBoundingClientRect().left
  )
    dialog.close();
});
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.06 },
);
document
  .querySelectorAll(
    '.section-head,.service-row,.studio-content,.steps article,.quote-person',
  )
  .forEach((element) => {
    element.classList.add('reveal');
    observer.observe(element);
  });
document.querySelector('.hero').addEventListener('pointermove', (event) => {
  if (!reducedMotion.matches && event.pointerType === 'mouse')
    document
      .querySelector('.hero-symbol')
      .style.setProperty(
        '--turn',
        (event.clientX / window.innerWidth - 0.5) * 50 + 'deg',
      );
});
const counterObserver = new IntersectionObserver((entries) =>
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    counterObserver.unobserve(entry.target);
    if (reducedMotion.matches) return;
    const target = Number(entry.target.dataset.count);
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / 700, 1);
      entry.target.textContent = String(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }),
);
document
  .querySelectorAll('[data-count]')
  .forEach((element) => counterObserver.observe(element));
const briefForm = document.querySelector('#brief-form');
briefForm.addEventListener('input', (event) => {
  event.target.setCustomValidity?.('');
});
briefForm.addEventListener('submit', (event) => {
  event.preventDefault();
  for (const name of ['name', 'message']) {
    const field = briefForm.elements.namedItem(name);
    const minimum = name === 'message' ? 20 : 1;
    field.setCustomValidity(
      field.value.trim().length < minimum
        ? name === 'message'
          ? 'Please describe your project in at least 20 characters.'
          : 'Please enter your name.'
        : '',
    );
  }
  if (!briefForm.reportValidity()) return;
  const values = new FormData(event.currentTarget);
  const content =
    'NOVA STUDIO — PROJECT BRIEF\n\nName: ' +
    values.get('name').trim() +
    '\nEmail: ' +
    values.get('email').trim() +
    '\n\nProject\n' +
    values.get('message').trim() +
    '\n\nPrepared ' +
    new Date().toISOString().slice(0, 10) +
    '\nThis brief was saved locally; it has not been sent to the studio.';
  const url = URL.createObjectURL(
    new Blob([content], { type: 'text/plain;charset=utf-8' }),
  );
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'nova-project-brief.txt';
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector('#brief-status').textContent =
    'Your brief is ready. Keep it, refine it, and share it when you’re ready.';
});
