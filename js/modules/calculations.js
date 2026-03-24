import { updateRoofZones } from './visualization.js';

const ORDERED_STEPS = [
  'start',
  'schritt-1',
  'schritt-2',
  'schritt-3',
  'schritt-4',
  'schritt-5',
  'schritt-6',
  'schritt-7',
  'schritt-8',
  'schritt-9',
  'schritt-10',
  'dein-ablauf'
];

export function bindCalculationEvents(stepId, navigateTo) {
  attachNextButton(stepId, navigateTo);

  if (stepId === 'schritt-6') {
    bindECalculation();
  }

  if (stepId === 'schritt-7') {
    bindZoneCalculation();
  }

  if (stepId === 'schritt-8') {
    bindPitchLogic();
  }
}

export function calculateE(h, b) {
  const e1 = 2 * h;
  const e2 = b;
  const value = Math.min(e1, e2);

  return { e1, e2, value };
}

export function calculateZoneDimensions(e) {
  return {
    length: e / 4,
    width: e / 10
  };
}

function attachNextButton(stepId, navigateTo) {
  const currentIndex = ORDERED_STEPS.indexOf(stepId);

  document.querySelectorAll('[data-next-step]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.nextStep;
      if (target) {
        navigateTo(target);
        return;
      }

      const fallback = currentIndex >= 0 ? currentIndex + 1 : -1;
      if (ORDERED_STEPS[fallback]) {
        navigateTo(ORDERED_STEPS[fallback]);
      }
    });
  });
}

function bindECalculation() {
  const hInput = document.getElementById('e-height');
  const bInput = document.getElementById('e-width');
  const output = document.getElementById('e-result');
  const details = document.getElementById('e-result-details');
  const button = document.getElementById('calculate-e');

  if (!hInput || !bInput || !output || !details || !button) return;

  const calculate = () => {
    const h = Number(hInput.value);
    const b = Number(bInput.value);

    if (!Number.isFinite(h) || !Number.isFinite(b) || h <= 0 || b <= 0) {
      output.textContent = 'Bitte gueltige Werte eingeben';
      details.textContent = 'Beide Felder muessen groesser als 0 sein.';
      return;
    }

    const { e1, e2, value } = calculateE(h, b);
    output.textContent = `${formatNumber(value)} m`;
    details.textContent = `2 x h = ${formatNumber(e1)} m | b = ${formatNumber(e2)} m | entscheidend ist der kleinere Wert.`;
  };

  button.addEventListener('click', calculate);
  calculate();
}

function bindZoneCalculation() {
  const hInput = document.getElementById('zone-height');
  const bInput = document.getElementById('zone-length');
  const pitchInput = document.getElementById('zone-pitch');
  const button = document.getElementById('update-zones');

  const eResult = document.getElementById('zone-e-result');
  const eDetails = document.getElementById('zone-e-details');
  const lengthResult = document.getElementById('zone-length-result');
  const widthResult = document.getElementById('zone-width-result');
  const pitchResult = document.getElementById('zone-pitch-note');

  if (!hInput || !bInput || !pitchInput || !button || !eResult || !eDetails || !lengthResult || !widthResult || !pitchResult) {
    return;
  }

  const recalculate = () => {
    const h = Number(hInput.value);
    const b = Number(bInput.value);
    const pitch = Number(pitchInput.value);

    if (![h, b, pitch].every(Number.isFinite) || h <= 0 || b <= 0 || pitch < 0) {
      eResult.textContent = 'Bitte gueltige Werte eingeben';
      eDetails.textContent = 'Fuer die Berechnung muessen alle Eingaben plausibel sein.';
      lengthResult.textContent = '-';
      widthResult.textContent = '-';
      pitchResult.textContent = 'Die Dachneigung konnte nicht ausgewertet werden.';
      return;
    }

    const { e1, e2, value: e } = calculateE(h, b);
    const { length, width } = calculateZoneDimensions(e);
    const centerLabel = pitch > 30 ? 'H' : 'J';
    const edgeLabel = pitch > 30 ? 'F' : 'G';

    eResult.textContent = `${formatNumber(e)} m`;
    eDetails.innerHTML = `Berechnung:<br />e = min(2 x h, b)<br /><br />2 x ${formatNumber(h)} = ${formatNumber(e1)} m<br />b = ${formatNumber(e2)} m<br /><br />Massgebend: e = ${formatNumber(e)} m`;
    lengthResult.textContent = `${formatNumber(length)} m`;
    widthResult.textContent = `${formatNumber(width)} m`;
    pitchResult.textContent =
      pitch > 30
        ? 'Dachneigung > 30°: Der Bereich G wird zu F. Die Randzonen werden dadurch strenger bewertet.'
        : 'Dachneigung ≤ 30°: Der Flaechenbereich wird als J angezeigt, die Randzonen bleiben G und die Eckbereiche F.';

    updateRoofZones({
      h,
      b,
      pitch,
      e,
      zoneLength: length,
      zoneWidth: width,
      labels: {
        corner: 'F',
        edge: edgeLabel,
        center: centerLabel
      }
    });
  };

  button.addEventListener('click', recalculate);
  recalculate();
}

function bindPitchLogic() {
  const input = document.getElementById('roof-pitch');
  const value = document.getElementById('roof-pitch-value');
  const output = document.getElementById('roof-pitch-result');

  if (!input || !value || !output) return;

  const update = () => {
    const angle = Number(input.value);
    value.textContent = `${angle}°`;

    if (angle > 30) {
      output.textContent = 'Bei mehr als 30° wird der Bereich G wie F behandelt. Die Randbereiche werden also strenger bewertet.';
      return;
    }

    output.textContent = 'Bei 30° oder weniger bleibt G unveraendert. In der Lernregel gilt: H wird zu J, wenn diese Einteilung gefordert ist.';
  };

  input.addEventListener('input', update);
  update();
}

function formatNumber(value) {
  return value.toFixed(2).replace('.', ',').replace(/,00$/, '');
}
