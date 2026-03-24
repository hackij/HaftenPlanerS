const labels = {
  start: 'Start',
  'schritt-1': 'Schritt 1',
  'schritt-2': 'Schritt 2',
  'schritt-3': 'Schritt 3',
  'schritt-4': 'Schritt 4',
  'schritt-5': 'Schritt 5',
  'schritt-6': 'Schritt 6',
  'schritt-7': 'Schritt 7',
  'schritt-8': 'Schritt 8',
  'schritt-9': 'Schritt 9',
  'schritt-10': 'Schritt 10',
  'dein-ablauf': 'Dein Ablauf'
};

let navRoot;

export function initNavigation(container, steps, onNavigate) {
  navRoot = container;
  navRoot.innerHTML = '';

  steps.forEach((step) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'step-nav__button';
    button.dataset.step = step;
    button.textContent = labels[step] ?? step;
    button.addEventListener('click', () => onNavigate(step));
    navRoot.appendChild(button);
  });
}

export function setActiveStep(activeStep) {
  if (!navRoot) return;

  navRoot.querySelectorAll('.step-nav__button').forEach((button) => {
    const isActive = button.dataset.step === activeStep;
    button.classList.toggle('is-active', isActive);

    if (isActive) {
      button.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });
}
