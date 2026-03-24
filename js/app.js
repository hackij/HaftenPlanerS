const labels = {
  'schritt-1': '1',
  'schritt-2': '2',
  'schritt-3': '3',
  'schritt-4': '4',
  'schritt-5': '5',
  'schritt-6': '6',
  'schritt-9': '7',
  'schritt-10': 'Übung',
  'dein-ablauf': 'Checkliste'
};

let navRoot;

function initNavigation(container, steps, onNavigate) {
  navRoot = container;
  navRoot.innerHTML = '';

  steps.forEach((step) => {
    const item = document.createElement('div');
    item.className = 'step-nav__item';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'step-nav__button';
    button.dataset.step = step;
    button.textContent = labels[step] ?? step;
    button.addEventListener('click', () => onNavigate(step));
    if (step === 'schritt-10' || step === 'dein-ablauf') {
      button.classList.add('step-nav__button--label');
      item.classList.add('step-nav__item--named');
    }
    item.appendChild(button);
    navRoot.appendChild(item);
  });
}

function setActiveStep(activeStep) {
  if (!navRoot) return;

  navRoot.querySelectorAll('.step-nav__button').forEach((button) => {
    const isActive = button.dataset.step === activeStep;
    button.classList.toggle('is-active', isActive);
  });
}

const ORDERED_STEPS = [
  'schritt-1',
  'schritt-2',
  'schritt-3',
  'schritt-4',
  'schritt-5',
  'schritt-6',
  'schritt-9',
  'schritt-10',
  'dein-ablauf'
];

function bindCalculationEvents(stepId, navigateTo) {
  attachNextButton(stepId, navigateTo);

  if (stepId === 'schritt-2') {
    bindHeightVisualization();
  }

  if (stepId === 'schritt-6') {
    bindECalculation();
  }

  if (stepId === 'schritt-5') {
    bindPitchLogic();
  }

  if (stepId === 'schritt-10') {
    bindExerciseIntroChecks();
    bindPracticeCheck();
    bindHaftenCheck();
  }

}

function bindExerciseIntroChecks() {
  const roofButton = document.getElementById('check-roof-form');
  const roofInput = document.getElementById('roof-form-input');
  const roofFeedback = document.getElementById('roof-form-feedback');

  if (roofButton && roofInput && roofFeedback) {
    roofButton.addEventListener('click', () => {
      const value = roofInput.value.trim().toLowerCase();
      const normalized = value.replace(/\s+/g, ' ');
      const isCorrect = normalized === 'pultdach';

      roofFeedback.textContent = isCorrect
        ? '✅ Richtig. Das Referenzgebäude hat ein Pultdach.'
        : '❌ Noch nicht ganz. Schau dir die Dachfläche noch einmal genau an.';
      roofFeedback.className = `input-feedback ${isCorrect ? 'is-success' : 'is-error'}`;
    });
  }

  const zoneButton = document.getElementById('check-windzone');
  const zoneFeedback = document.getElementById('windzone-feedback');

  if (zoneButton && zoneFeedback) {
    zoneButton.addEventListener('click', () => {
      const selected = document.querySelector('input[name="windzone-choice"]:checked');
      if (!selected) {
        zoneFeedback.textContent = 'Bitte wähle zuerst eine Windzone aus.';
        zoneFeedback.className = 'input-feedback is-error';
        return;
      }

      const isCorrect = selected.value === '1';
      zoneFeedback.textContent = isCorrect
        ? '✅ Genau. Das Beispielgebäude befindet sich in Windzone 1.'
        : '❌ Noch nicht richtig. Für Bayreuth ist in diesem Lernbeispiel Windzone 1 maßgebend.';
      zoneFeedback.className = `input-feedback ${isCorrect ? 'is-success' : 'is-error'}`;
    });
  }
}

function calculateE(h, b) {
  const e1 = 2 * h;
  const e2 = b;
  const value = Math.min(e1, e2);

  return { e1, e2, value };
}

function calculateZoneDimensions(e) {
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
  const eChoice = document.getElementById('e-choice');
  const eQuarter = document.getElementById('e-quarter');
  const eTenth = document.getElementById('e-tenth');
  const button = document.getElementById('calculate-e');
  const checkbox = document.getElementById('e-correct');
  const feedback = document.getElementById('e-feedback');

  if (!eChoice || !eQuarter || !eTenth || !button || !checkbox || !feedback) return;

  const parseValue = (value) => Number(String(value).trim().replace(',', '.'));

  const calculate = () => {
    const selectedE = parseValue(eChoice.value);
    const quarter = parseValue(eQuarter.value);
    const tenth = parseValue(eTenth.value);

    if (![selectedE, quarter, tenth].every(Number.isFinite)) {
      checkbox.checked = false;
      feedback.textContent = 'Bitte trage in alle drei Felder Zahlen ein.';
      return;
    }

    const isCorrect =
      Math.abs(selectedE - 10) < 0.01 &&
      Math.abs(quarter - 2.5) < 0.01 &&
      Math.abs(tenth - 1) < 0.01;

    checkbox.checked = isCorrect;
    feedback.textContent = isCorrect
      ? 'Richtig. Du hast e sowie e/4 und e/10 korrekt bestimmt.'
      : 'Noch nicht ganz. Prüfe noch einmal den Vergleich für e sowie die Ableitung von e/4 und e/10.';
  };

  button.addEventListener('click', calculate);
}

function bindPitchLogic() {
  const input = document.getElementById('roof-pitch');
  const value = document.getElementById('roof-pitch-value');
  const output = document.getElementById('roof-pitch-result');
  const surface = document.getElementById('pitch-zone-surface');
  const eaves = document.getElementById('pitch-zone-eaves');
  const verge = document.getElementById('pitch-zone-verge');
  const corner = document.getElementById('pitch-zone-corner');
  const surfaceRow = document.getElementById('pitch-row-surface');
  const eavesRow = document.getElementById('pitch-row-eaves');
  const vergeRow = document.getElementById('pitch-row-verge');
  const example = document.getElementById('pitch-example');

  if (!input || !value || !output) return;

  const update = () => {
    const angle = Number(input.value);
    value.textContent = `${angle}°`;

    if (angle > 30) {
      output.textContent = 'Bei mehr als 30° wird der Flächenbereich als H geführt. Für die Randbereiche musst du jetzt genauer hinschauen, weil G und F je nach Dachkante unterschiedlich angesetzt werden.';
      if (surface) surface.textContent = 'H';
      if (eaves) eaves.textContent = 'F';
      if (verge) verge.textContent = 'G';
      if (corner) corner.textContent = 'Fhoch';
      if (surfaceRow) surfaceRow.classList.add('is-shifted');
      if (eavesRow) eavesRow.classList.add('is-shifted');
      if (vergeRow) vergeRow.classList.add('is-shifted');
      if (example) {
        example.textContent = 'Beispiel über 30°: An der Traufseite wird nun F angenommen, da dies ab einer Neigung größer 30° gilt. Am Ortgang kann G angesetzt werden.';
      }
      return;
    }

    output.textContent = 'Bei 30° oder weniger wird der Flächenbereich als J geführt. In unserem Lernbeispiel gilt an der Traufseite G, am Ortgang dagegen F.';
    if (surface) surface.textContent = 'J';
    if (eaves) eaves.textContent = 'G';
    if (verge) verge.textContent = 'F';
    if (corner) corner.textContent = 'Fhoch';
    if (surfaceRow) surfaceRow.classList.remove('is-shifted');
    if (eavesRow) eavesRow.classList.remove('is-shifted');
    if (vergeRow) vergeRow.classList.remove('is-shifted');
    if (example) {
      example.textContent = 'Beispiel 20°: An der Traufseite nimmst du G. Am Ortgang nimmst du F, weil G dort nur bei Dachneigungen über 30° gilt.';
    }
  };

  input.addEventListener('input', update);
  update();
}

function bindPracticeCheck() {
  const button = document.getElementById('check-result');
  const widthInput = document.getElementById('input-width');
  const lengthInput = document.getElementById('input-length');
  const feedback = document.getElementById('result-feedback');

  if (!button || !widthInput || !lengthInput || !feedback) return;

  button.addEventListener('click', () => {
    const width = Number.parseFloat(String(widthInput.value).replace(',', '.'));
    const length = Number.parseFloat(String(lengthInput.value).replace(',', '.'));

    if (width === 1 && length === 2.5) {
      feedback.innerText = '✅ Richtig! Die Randbereiche wurden korrekt berechnet.';
      return;
    }

    feedback.innerText = '❌ Noch nicht ganz richtig. Überprüfe deine Berechnung von e.';
  });
}

function bindHaftenCheck() {
  const button = document.getElementById('check-haften');
  const result = document.getElementById('haften-result');
  const fhoch = document.getElementById('fhoch');
  const f = document.getElementById('f');
  const g = document.getElementById('g');
  const j = document.getElementById('j');

  if (!button || !result || !fhoch || !f || !g || !j) return;

  button.addEventListener('click', () => {
    let correct = 0;

    if (fhoch.value === '290') correct++;
    if (f.value === '330') correct++;
    if (g.value === '420') correct++;
    if (j.value === '500') correct++;

    if (correct === 4) {
      result.innerHTML = '✅ Perfekt! Alle Haftabstände sind korrekt.';
      result.className = 'input-feedback is-success';
      return;
    }

    result.innerHTML = '❌ Noch nicht ganz richtig. Überprüfe deine Werte nochmal.';
    result.className = 'input-feedback is-error';
  });
}

function bindHeightVisualization() {
  const slider = document.getElementById('building-height-slider');
  const value = document.getElementById('building-height-value');
  const building = document.getElementById('height-building');
  const gradient = document.getElementById('wind-gradient');
  const label = document.getElementById('height-wind-label');
  const note = document.getElementById('height-visual-note');
  const arrows = Array.from(document.querySelectorAll('.arrow'));

  if (!slider || !value || !building || !gradient || !label || !note || arrows.length === 0) return;

  const update = () => {
    const height = Number(slider.value);
    const min = Number(slider.min);
    const max = Number(slider.max);
    const ratio = (height - min) / (max - min);

    value.textContent = `${height} m`;
    building.style.height = `${42 + ratio * 42}%`;
    building.style.boxShadow = `0 16px 28px rgba(15, 23, 42, ${0.08 + ratio * 0.12})`;
    gradient.style.opacity = `${0.7 + ratio * 0.35}`;
    gradient.style.background = `linear-gradient(
      to top,
      rgba(59,130,246,${0.04 + ratio * 0.02}),
      rgba(${Math.round(96 + ratio * 92)}, ${Math.round(125 - ratio * 36)}, ${Math.round(196 - ratio * 88)}, ${0.14 + ratio * 0.1}),
      rgba(239,68,68,${0.08 + ratio * 0.34})
    )`;

    arrows.forEach((arrow, index) => {
      const arrowRatio = (index + 1) / arrows.length;
      const width = 60 + index * 10 + ratio * 12;
      const opacity = 0.28 + arrowRatio * 0.12 + ratio * 0.18;
      const thickness = 2 + index * 1.35 + ratio * 1.2;
      arrow.style.width = `${Math.min(width, 96)}%`;
      arrow.style.opacity = `${Math.min(opacity, 0.95)}`;
      arrow.style.height = `${Math.min(thickness, 8)}px`;
    });

    if (height <= 10) {
      label.textContent = 'Geringe Windbelastung';
      note.textContent = 'Bei Gebäudehöhen von 5 bis 10 m ist die Windbelastung vergleichsweise gering. Die Dachfläche liegt noch stärker im geschützten Bereich.';
    } else if (height <= 20) {
      label.textContent = 'Mittlere Windbelastung';
      note.textContent = 'Bei Gebäudehöhen von 10 bis 20 m nehmen Windgeschwindigkeit und Windsog spürbar zu. Die Dachdeckung wird stärker beansprucht.';
    } else if (height <= 50) {
      label.textContent = 'Erhöhte Windbelastung';
      note.textContent = 'Bei Gebäudehöhen von 20 bis 50 m wirken deutlich stärkere Windkräfte auf das Dach. Entsprechend müssen die Haften enger gesetzt werden.';
    } else {
      label.textContent = 'Hohe Windbelastung';
      note.textContent = 'Bei Gebäudehöhen von 50 bis 55 m ist die Windbelastung besonders hoch. Hier muss mit sehr starken Windsogkräften auf die Dachdeckung gerechnet werden.';
    }
  };

  slider.addEventListener('input', update);
  update();
}

function formatNumber(value) {
  return value.toFixed(2).replace('.', ',').replace(/,00$/, '');
}

function imagePlaceholder(title, fileHint, caption) {
  return `
    <figure class="reference-figure">
      <img
        src="${fileHint}"
        class="reference-image"
        alt="${title}"
        onerror="this.parentElement.outerHTML='<div class=&quot;placeholder-image&quot;><div class=&quot;placeholder-image__content&quot;><span class=&quot;placeholder-label&quot;>Bildplatzhalter</span><h3 class=&quot;visual-card__title&quot;>${title}</h3><p class=&quot;visual-caption&quot;>Zukünftige Datei: ${fileHint}</p><p class=&quot;visual-caption&quot;>${caption}</p></div></div>'"
      />
      <figcaption class="visual-caption">${caption}</figcaption>
    </figure>
  `;
}

function nextButton(step) {
  return `<button class="primary-btn" type="button" data-next-step="${step}">Weiter zum nächsten Schritt</button>`;
}

function getStepContent(stepId) {
  const steps = {
    'schritt-1': `
      <div class="step-panel" id="step1">
        <div class="step1-body">
          <div class="step-copy windzone-copy">
            <span class="step-tag">Schritt 1</span>
            <h2 class="step-title">🌍 Gebäudelage und Windzone</h2>
            <p>Im ersten Schritt wird betrachtet, wo sich das Gebäude befindet. Der Standort ist entscheidend, weil die Windbelastung regional unterschiedlich ist.</p>
            <p>Deutschland ist dafür in vier Windzonen eingeteilt. Mit steigender Windzone nehmen die zu erwartenden Windgeschwindigkeiten zu.</p>
            <p>Das hat direkte Auswirkungen auf die Dachkonstruktion: Je höher die Windbelastung, desto größer ist der Windsog auf die Dachdeckung.</p>
            <p>👉 <strong>Folge für die Praxis:</strong> Die Haften müssen so angeordnet werden, dass sie den auftretenden Windsog sicher aufnehmen können. In höheren Windzonen sind daher in der Regel kleinere Haftabstände erforderlich.</p>
            <p>Für Bayern und insbesondere für Oberfranken gilt meist Windzone 1.</p>
          </div>
          <div class="step1-image step7-image">
            <span class="image-click-badge">Klick</span>
            <img src="assets/images/windzones-placeholder.jpg" class="windzone-map guide-image lightbox-image" alt="Windzonenkarte von Deutschland" />
          </div>
        </div>
        <div class="button-row button-row--center">${nextButton('schritt-2')}</div>
      </div>
    `,
    'schritt-2': `
      <div class="step-grid step-grid--step2">
        <div class="step-copy">
          <span class="step-tag">Schritt 2</span>
          <h2 class="step-title">🏢 Gebäudehöhe</h2>
          <p>Im nächsten Schritt wird die Gebäudehöhe betrachtet. Warum ist das wichtig? Weil sich mit zunehmender Höhe auch die Windverhältnisse verändern.</p>
          <p>Mit steigender Gebäudehöhe nimmt die Windgeschwindigkeit zu. Dadurch wirken auf das Dach stärkere Windsogkräfte.</p>
          <p>👉 <strong>Bedeutung für die Praxis:</strong> Je höher ein Gebäude ist, desto größer ist die Belastung auf die Dachdeckung. Damit das Dach sicher befestigt ist, müssen die Haften enger gesetzt werden, also kleinere Haftabstände gewählt werden.</p>
          <ul class="info-list">
            <li><strong>Hinweis:</strong> Die Gebäudehöhe wird vom tiefsten Punkt des Gebäudes bis zum höchsten Punkt (z. B. First) gemessen.</li>
            <li><strong>Beispiel:</strong> Für unser Leitgebäude wird eine Gebäudehöhe von 9 m angesetzt.</li>
          </ul>
        </div>
        <div class="step2-visual-layout graphic-container">
          <div class="simulation-wrapper">
            <div class="wind-container">
              <div class="wind-area">
                <div class="wind-gradient" id="wind-gradient" aria-hidden="true"></div>
                <div class="label-top">hohe Windbelastung</div>
                <div class="label-bottom">geringe Windbelastung</div>
                <div id="height-building" class="building" aria-hidden="true"></div>
                <div class="wind-lines" aria-hidden="true">
                  <div class="arrow a1"></div>
                  <div class="arrow a2"></div>
                  <div class="arrow a3"></div>
                  <div class="arrow a4"></div>
                </div>
                <div class="wind-visual__meter">
                  <strong id="building-height-value">9 m</strong>
                </div>
              </div>
              <div class="height-slider-wrap">
                <span class="height-slider-hint">Ziehen</span>
                <input id="building-height-slider" class="height-slider" type="range" min="5" max="55" step="1" value="9" aria-label="Gebäudehöhe einstellen" />
              </div>
            </div>
          </div>
          <div class="info-inline">
            <strong id="height-wind-label">Mittlere Windbelastung</strong>
            <p id="height-visual-note">Mit zunehmender Höhe nehmen Windgeschwindigkeit und Windsog zu. Das Dach wird stärker beansprucht.</p>
          </div>
          <div class="button-row">${nextButton('schritt-3')}</div>
        </div>
      </div>
    `,
    'schritt-3': `
      <div class="step-content step3-layout" id="step3">
        <div class="step3-body">
          <div class="step-copy">
            <span class="step-tag">Schritt 3</span>
            <h2 class="step-title">📏 Einfluss der Scharbreite</h2>
            <p>Bei der Planung eines Blechdaches spielt auch die Scharbreite eine wichtige Rolle. Je breiter eine Schar ist, desto größer ist ihre Fläche, die vom Wind belastet wird.</p>
            <p>Gleichzeitig können Haften nur am Unterdecker befestigt werden.</p>
            <p><strong>ℹ️ Das bedeutet:</strong> Bei breiteren Scharen stehen weniger Befestigungsmöglichkeiten pro Fläche zur Verfügung. Damit die Dachdeckung trotzdem sicher gegen Windsog befestigt ist, müssen die Haftabstände kleiner gewählt werden.</p>
            <p>Die Scharbreite beeinflusst also direkt die Haftabstände. Wie groß diese Abstände genau sein dürfen, wird später anhand von Tabellen aus den Fachregeln bestimmt.</p>
          </div>
          <div class="result-box">
            <h3 class="result-box__title">Beispiel</h3>
            <p>Für dieselbe Dachfläche muss immer eine ausreichende Anzahl an Haften vorhanden sein, damit die Dachdeckung sicher gegen Windsog befestigt ist.</p>
            <p>Werden breitere Scharen verwendet, stehen auf derselben Fläche weniger Befestigungspunkte zur Verfügung.</p>
            <p class="callout">Deshalb gilt: Je größer die Scharbreite, desto kleiner müssen die Haftabstände gewählt werden.</p>
            <div class="example-image-wrap">
              <span class="image-click-badge example-click-badge">Klick</span>
              <img src="assets/images/Haften pro Schar.jpg" class="example-image guide-image lightbox-image" alt="Beispiel zur Verteilung von Haften pro Schar" />
            </div>
          </div>
        </div>
        <div class="button-row">${nextButton('schritt-4')}</div>
      </div>
    `,
    'schritt-4': `
      <div class="step-grid">
        <div class="step-copy">
          <span class="step-tag">Schritt 4</span>
          <h2 class="step-title">💨 Windsog am Dach verstehen</h2>
          <p>Im nächsten Schritt wird betrachtet, wie sich Wind auf einem Dach verhält. Trifft Wind auf die Dachfläche, strömt er zunächst entlang der Oberfläche nach oben.</p>
          <p>Am hinteren Dachrand löst sich die Strömung von der Dachfläche. Dabei entstehen Wirbel, die die Luft nach oben ziehen.</p>
          <p>Diese Strömungseffekte erzeugen einen Windsog, der an der Dachkante besonders stark wirkt und die Dachdeckung nach oben abheben kann.</p>
          <p>👉 <strong>Bedeutung für die Praxis:</strong> Dachränder und insbesondere Eckbereiche sind stärker belastet als die übrige Dachfläche. Damit die Dachdeckung sicher befestigt ist, müssen in diesen Bereichen die Haften enger gesetzt werden.</p>
          <p class="callout">Merke: Dachkante = hohe Windsogbelastung → kleinere Haftabstände erforderlich</p>
        </div>
        <div class="step4-graphic">
          <img src="Windsog_am_Pultdach.jpg" alt="Windsog am Pultdach" />
        </div>
      </div>
      <div class="button-row">${nextButton('schritt-5')}</div>
    `,
    'schritt-5': `
      <div class="step-grid step-grid--step5">
        <div class="step-copy">
          <span class="step-tag">Schritt 5</span>
          <h2 class="step-title">🧩 Randbereiche des Daches</h2>
          <p>Im nächsten Schritt wird betrachtet, wie sich die Windbelastung auf dem Dach verteilt. Der Wind wirkt nämlich nicht überall gleich stark.</p>
          <p>Während die Luft über die Dachfläche strömt, entstehen besonders an den Dachkanten und Ecken stärkere Strömungen und Wirbel. Dadurch treten dort höhere Windsogkräfte auf als in der Mitte der Dachfläche.</p>
          <p>👉 <strong>Bedeutung für die Praxis:</strong> Da die Belastung unterschiedlich ist, können die Haften nicht überall gleich angeordnet werden. Das Dach wird deshalb in verschiedene Bereiche mit unterschiedlicher Beanspruchung eingeteilt.</p>
          <p>Man unterscheidet drei Bereiche:</p>
          <ul class="info-list zone-list">
            <li><strong>Flächenbereich</strong><span class="zone-badge">H / J</span></li>
            <li><strong>Randbereich</strong><span class="zone-badge">F / G</span></li>
            <li><strong>Eckbereich</strong><span class="zone-badge">Fhoch</span></li>
          </ul>
          <div class="zone-explanation">
            <p><strong>Flächenbereich</strong> <span class="zone-badge">H / J</span>: Dieser Bereich liegt in der Mitte der Dachfläche. Hier ist der Windsog am geringsten → größere Haftabstände möglich.</p>
            <p><strong>Randbereich</strong> <span class="zone-badge">F / G</span>: Dieser Bereich verläuft entlang der Dachkanten. Durch Strömungsablösungen entstehen hier höhere Windsogkräfte → kleinere Haftabstände erforderlich.</p>
            <p><strong>Eckbereich</strong> <span class="zone-badge">Fhoch</span>: An den Dachecken treffen Strömungen aus zwei Richtungen aufeinander. Hier treten die größten Windsogkräfte auf → kleinste Haftabstände notwendig.</p>
          </div>
          <p>Die Bezeichnungen H, J, F, G und Fhoch stammen aus den Fachregeln für Metallarbeiten im Dachbereich. Sie werden verwendet, um in den Tabellen die passenden Haftabstände für jeden Bereich auszuwählen.</p>
          <p><strong>❗️ Wichtig:</strong> Die Zuordnung der Randbereiche hängt auch von der Dachneigung ab. Je nach Neigung ändern sich die Bezeichnungen an Traufe und Ortgang.</p>
          <div class="step5-tools">
            <div class="result-box zone-summary">
              <h3 class="result-box__title">Zuordnung für später</h3>
              <div class="zone-summary__row" id="pitch-row-surface"><span>Flächenbereich</span><span class="zone-badge" id="pitch-zone-surface">J</span></div>
              <div class="zone-summary__row" id="pitch-row-eaves"><span>Randbereich Traufseite</span><span class="zone-badge" id="pitch-zone-eaves">G</span></div>
              <div class="zone-summary__row" id="pitch-row-verge"><span>Randbereich Ortgang</span><span class="zone-badge" id="pitch-zone-verge">F</span></div>
              <div class="zone-summary__row"><span>Eckbereich</span><span class="zone-badge" id="pitch-zone-corner">Fhoch</span></div>
            </div>
            <div class="interactive-panel pitch-panel">
              <label for="roof-pitch">Dachneigung</label>
              <p class="pitch-observe">Ziehe den Regler über <strong>30°</strong> und beobachte, wie sich die Randbereiche verändern.</p>
              <div class="pitch-slider-wrap">
                <input id="roof-pitch" type="range" min="5" max="45" step="1" value="20" />
                <div class="pitch-threshold" aria-hidden="true">
                  <span class="pitch-threshold__line"></span>
                  <span class="pitch-threshold__label">30°</span>
                </div>
              </div>
              <div class="result-value" id="roof-pitch-value">20°</div>
              <p id="roof-pitch-result"></p>
              <p class="callout" id="pitch-example">Beispiel 20°: An der Traufseite nimmst du G. Am Ortgang nimmst du F, weil G dort nur bei Dachneigungen über 30° gilt.</p>
            </div>
          </div>
          <div class="button-row">${nextButton('schritt-6')}</div>
        </div>
        <div class="step5-reference">
          ${imagePlaceholder(
            'Dachzonen nach Fachregel',
            'assets/images/pultdach-zones-placeholder.jpg',
            ''
          )}
        </div>
      </div>
    `,
    'schritt-6': `
      <div class="step-grid">
        <div class="step-copy">
          <span class="step-tag">Schritt 6</span>
          <h2 class="step-title">🧮 Maß e berechnen</h2>
          <p>Um die Randbereiche des Daches festlegen zu können, muss zuerst das Maß <strong>e</strong> bestimmt werden. Dieses Maß legt fest, wie breit die Randbereiche entlang der Dachkanten sind.</p>
          <p>👉 <strong>Vorgehen:</strong> Zur Berechnung werden zwei Gebäudemaße herangezogen:</p>
          <div class="pill-group">
            <span class="pill">Gebäudehöhe (h)</span>
            <span class="pill">längste Gebäudeseite (b)</span>
          </div>
          <p>Daraus werden zwei Werte berechnet:</p>
          <div class="formula-grid">
            <div class="formula-box"><strong>Formel 1</strong><div class="formula">e = 2 × h</div></div>
            <div class="formula-box"><strong>Formel 2</strong><div class="formula">e = b</div></div>
          </div>
          <p>Anschließend werden beide Ergebnisse verglichen. 👉 Der kleinere Wert ist maßgebend und wird als Maß <strong>e</strong> verwendet.</p>
          <p>👉 <strong>Bedeutung für die Praxis:</strong> Mit dem ermittelten e-Wert können im nächsten Schritt die Randbereiche am Dach festgelegt werden. Diese bilden die Grundlage für die Auswahl der richtigen Haftabstände.</p>
          <div class="interactive-panel">
            <div class="input-grid">
              <label>Anhand von unserem Beispielgebäude entscheide ich mich für e =
                <input id="e-choice" type="text" inputmode="decimal" placeholder="e" />
              </label>
              <label>Länge Randbereich (e / 4):
                <input id="e-quarter" type="text" inputmode="decimal" placeholder="e / 4" />
              </label>
              <label>Breite Randbereich (e / 10):
                <input id="e-tenth" type="text" inputmode="decimal" placeholder="e / 10" />
              </label>
            </div>
            <p class="input-hint">Berechne zuerst das Maß e und leite daraus die Breite und Länge der Randbereiche ab.</p>
            <div class="button-row">
              <button class="primary-btn" id="calculate-e" type="button">Ergebnis prüfen</button>
            </div>
            <label class="result-check">
              <input id="e-correct" type="checkbox" disabled />
              <span>Ergebnis korrekt</span>
            </label>
            <p id="e-feedback"></p>
          </div>
          <div class="button-row">${nextButton('schritt-9')}</div>
        </div>
        <div class="step5-reference">
          ${imagePlaceholder(
            'Dachzonen nach Fachregel',
            'assets/images/pultdach-zones-placeholder.jpg',
            ''
          )}
        </div>
      </div>
    `,
    'schritt-9': `
      <div class="step-panel">
        <div class="step7-container">
          <div class="step7-text">
            <span class="step-tag">Schritt 7</span>
            <h2 class="step-title">📊 Haftabstände aus Tabelle ermitteln</h2>
            <p>Um die richtigen Haftabstände zu ermitteln, werden die Tabellen der Klempnerfachregel verwendet.</p>
            <p>Die folgende Anleitung zeigt dir Schritt für Schritt, wie du die passenden Werte findest.</p>
          </div>
          <div class="step7-body">
            <div class="step7-image">
              <img src="assets/images/Vorgehen_Haftenplan.jpg" class="guide-image" alt="Vorgehen zum Bestimmen der Haftabstände aus der Tabelle" />
            </div>
            <div class="steps-container">
              <div class="step-row">
                <div class="step-circle">1</div>
                <div class="step-pill">🌍 Richtige Tabelle auswählen (Windzone 1, Pultdach)</div>
              </div>
              <div class="step-row">
                <div class="step-circle">2</div>
                <div class="step-pill">🏢 Spalte für Gebäudehöhe auswählen</div>
              </div>
              <div class="step-row">
                <div class="step-circle">3</div>
                <div class="step-pill">📏 Spalte für Scharenbreite auswählen</div>
              </div>
              <div class="step-row">
                <div class="step-circle">4</div>
                <div class="step-pill">📐 Zeile für Dachneigung auswählen</div>
              </div>
              <div class="step-row">
                <div class="step-circle">5</div>
                <div class="step-pill">📊 Haftabstände je nach Bereich ablesen</div>
              </div>
              <div class="attention-box">
                ❗ Achtung:
                Der obere Wert ist der Haftenabstand in mm,
                der untere Wert ist die Haftanzahl pro m².
              </div>
            </div>
          </div>
        </div>
        <div class="button-row">${nextButton('schritt-10')}</div>
      </div>
    `,
    'schritt-10': `
      <div class="step8-container">
        <div class="step8-text">
          <h2 class="step-title">✍️ Übung</h2>
          <p>Wende dein Wissen jetzt selbst an.</p>
          <p>Erstelle für das folgende Gebäude einen Haftenverlegeplan.</p>
          <p>Folgende Details zum Gebäude sind bekannt.</p>
        </div>
        <div class="exercise-brief">
          <div class="exercise-brief__image">
            <img src="assets/images/pultdach-übung.png" alt="Referenzgebäude für die Übung" />
          </div>
          <div class="exercise-brief__facts card">
            <h3>Gebäudedetails</h3>
            <dl class="exercise-facts">
              <div><dt>Standort</dt><dd>Bayreuth</dd></div>
              <div><dt>Gebäudelänge</dt><dd>10 m</dd></div>
              <div><dt>Gebäudebreite</dt><dd>10 m</dd></div>
              <div><dt>Gebäudehöhe</dt><dd>9 m</dd></div>
              <div><dt>Dachneigung</dt><dd>20°</dd></div>
              <div><dt>Scharbreite</dt><dd>590 mm</dd></div>
            </dl>
          </div>
        </div>
        <div class="input-section exercise-question">
          <h3>1. Dachform bestimmen</h3>
          <p>Welche Dachform hat das Referenzgebäude?</p>
          <label for="roof-form-input">Dachform</label>
          <input type="text" id="roof-form-input" placeholder="z. B. ..." autocomplete="off" />
          <button id="check-roof-form" type="button">Überprüfen</button>
          <p id="roof-form-feedback" class="input-feedback"></p>
        </div>
        <div class="input-section exercise-question">
          <h3>2. Windzone bestimmen</h3>
          <p>In welcher Windzone befindet sich das Gebäude?</p>
          <div class="choice-group" role="radiogroup" aria-label="Windzone auswählen">
            <label class="choice-option"><input type="radio" name="windzone-choice" value="1" /> <span>WZ 1</span></label>
            <label class="choice-option"><input type="radio" name="windzone-choice" value="2" /> <span>WZ 2</span></label>
            <label class="choice-option"><input type="radio" name="windzone-choice" value="3" /> <span>WZ 3</span></label>
            <label class="choice-option"><input type="radio" name="windzone-choice" value="4" /> <span>WZ 4</span></label>
          </div>
          <button id="check-windzone" type="button">Überprüfen</button>
          <p id="windzone-feedback" class="input-feedback"></p>
        </div>
        <div class="step8-h5p">
          <div class="exercise-section-heading">
            <h3>3. Haftbereiche festlegen</h3>
            <p>Definieren Sie die Haftbereiche am Dach.</p>
          </div>
          <iframe src="Festlegung_der_Randbereiche.html" class="h5p-frame" title="Übung zur Festlegung der Randbereiche"></iframe>
        </div>
        <div class="step8-input">
          <div class="input-group">
            <h3>4. Randbereiche berechnen</h3>
            <p>Bestimme für das Referenzgebäude die Breite und Länge der Randbereiche.</p>
            <label>Breite des Randbereichs (e / 10)</label>
            <input type="number" id="input-width" inputmode="decimal" />
            <label>Länge des Randbereichs (e / 4)</label>
            <input type="number" id="input-length" inputmode="decimal" />
            <button id="check-result" type="button">Überprüfen</button>
            <p id="result-feedback"></p>
          </div>
          <div class="input-section">
            <h3>5. Haftabstände bestimmen</h3>
            <p>Trage die richtigen Haftabstände für die jeweiligen Dachbereiche des Referenzgebäudes ein:</p>
            <div class="input-grid input-grid--haften">
              <label>Fhoch:
                <input type="number" id="fhoch" placeholder="mm" inputmode="numeric" />
              </label>
              <label>F:
                <input type="number" id="f" placeholder="mm" inputmode="numeric" />
              </label>
              <label>G:
                <input type="number" id="g" placeholder="mm" inputmode="numeric" />
              </label>
              <label>J:
                <input type="number" id="j" placeholder="mm" inputmode="numeric" />
              </label>
            </div>
            <button id="check-haften" type="button">Überprüfen</button>
            <p id="haften-result" class="input-feedback"></p>
          </div>
        </div>
        <div class="step8-navigation">
          <button class="primary-btn next-button" type="button" data-next-step="dein-ablauf">Weiter</button>
        </div>
      </div>
    `,
    'dein-ablauf': `
      <div class="final-grid">
        <div class="step-copy">
          <h2 class="step-title">✅ Checkliste</h2>
          <p>Jetzt geht es darum, aus dem Beispiel deinen eigenen klaren Arbeitsablauf abzuleiten. Nicht einzelne Zahlen sind am wichtigsten, sondern die Reihenfolge deiner Gedanken.</p>
          <p>Wenn du Aufgaben zum Haftenverlegeplan löst, solltest du die Schritte sicher und in sinnvoller Reihenfolge abrufen können.</p>
          <p class="callout">Formuliere diese Struktur später in deinen eigenen Worten. Dann merkst du sie dir leichter und kannst sie auch in neuen Aufgaben anwenden.</p>
          <div class="button-row">
            <button class="ghost-btn" type="button" data-go-to="start">Zurück zum Start</button>
          </div>
        </div>
        <div class="checklist-box">
          <h3 class="checklist__title">Checkliste für deinen Ablauf</h3>
          <ol class="checklist">
            <li><label class="checklist-item"><input type="checkbox" /> <span>Windzone und Dachform ermitteln</span></label></li>
            <li><label class="checklist-item"><input type="checkbox" /> <span>Gebäudehöhe ermitteln</span></label></li>
            <li><label class="checklist-item"><input type="checkbox" /> <span>Scharenbreite festlegen</span></label></li>
            <li><label class="checklist-item"><input type="checkbox" /> <span>Dachneigung ermitteln</span></label></li>
            <li><label class="checklist-item"><input type="checkbox" /> <span>Relevante Bereiche nach Neigung festlegen</span></label></li>
            <li><label class="checklist-item"><input type="checkbox" /> <span>e berechnen und die Länge (e/4) und Breite (e/10) der Randbereiche ermitteln</span></label></li>
            <li><label class="checklist-item"><input type="checkbox" /> <span>Haftabstände pro Dachbereich in der Tabelle nachschlagen</span></label></li>
          </ol>
          <p class="footer-note">Tipp: Schreibe dir diesen Ablauf einmal selbst auf und sprich ihn laut durch. So entsteht deine eigene sichere Arbeitsstruktur.</p>
        </div>
      </div>
    `
  };

  return steps[stepId] ?? '<p>Schritt nicht gefunden.</p>';
}

const WIND_CANVAS_WIDTH = 900;
const WIND_CANVAS_HEIGHT = 400;
const PARTICLE_LIMIT = 120;
let windSimulation = null;

function setupVisualizations(stepId) {
  teardownWindSimulation();
}

function initWindSimulation() {
  teardownWindSimulation();

  const canvas = document.getElementById('windCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = WIND_CANVAS_WIDTH;
  canvas.height = 360;
  canvas.setAttribute('aria-label', 'Klare Windsimulation über einem Pultdach');

  windSimulation = {
    canvas,
    ctx,
    roof: {
      wallX: 215,
      wallBottomY: 292,
      wallTopY: 232,
      roofStartX: 215,
      roofStartY: 232,
      roofEndX: 545,
      roofEndY: 136,
      baseY: 292
    },
    lines: createWindLines(),
    animationFrame: 0,
    phase: 0
  };

  drawWindScene();
  windSimulation.animationFrame = requestAnimationFrame(animateWind);
}

function createWindLines() {
  return Array.from({ length: 36 }, (_, index) => {
    const verticalProgress = index / 35;
    return {
      baseY: 255 - verticalProgress * 150,
      amplitude: 0.8 + verticalProgress * 2.1,
      speed: 0.24 + verticalProgress * 0.42,
      offset: index * 28,
      alpha: 0.14 + verticalProgress * 0.3
    };
  });
}

function updateWindLines() {
  if (!windSimulation) return;

  windSimulation.phase += 0.018;
}

function drawRoofProfile() {
  if (!windSimulation) return;

  const { ctx, roof } = windSimulation;
  const { wallX, wallBottomY, wallTopY, roofStartX, roofStartY, roofEndX, roofEndY, baseY } = roof;

  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(wallX, wallBottomY);
  ctx.lineTo(wallX, wallTopY);
  ctx.lineTo(roofEndX, roofEndY);
  ctx.lineTo(roofEndX, baseY);
  ctx.lineTo(wallX, baseY);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(wallX, wallBottomY);
  ctx.lineTo(wallX, wallTopY);
  ctx.lineTo(roofEndX, roofEndY);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(17, 17, 17, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(wallX - 42, baseY);
  ctx.lineTo(roofEndX + 32, baseY);
  ctx.stroke();

  ctx.restore();
}

function drawWindLines() {
  if (!windSimulation) return;

  const { ctx, lines, roof, phase } = windSimulation;
  const totalTravel = WIND_CANVAS_WIDTH + 240;
  const roofLength = roof.roofEndX - roof.roofStartX;
  const vortexX = roof.roofEndX + 18;
  const vortexY = roof.roofEndY - 18;

  lines.forEach((line, index) => {
    ctx.save();
    ctx.strokeStyle = `rgba(0, 0, 0, ${Math.min(0.9, line.alpha + 0.28)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();

    let started = false;
    for (let t = 0; t <= totalTravel; t += 18) {
      const x = t + ((phase * 90 * line.speed + line.offset) % totalTravel) - 120;
      if (x < -30 || x > WIND_CANVAS_WIDTH + 40) continue;

      let y = line.baseY + Math.sin((x * 0.02) + phase + index * 0.3) * line.amplitude;

      if (x >= roof.roofStartX && x <= roof.roofEndX) {
        const progress = (x - roof.roofStartX) / roofLength;
        const roofY = roof.roofStartY + (roof.roofEndY - roof.roofStartY) * progress;
        y = roofY - 18 - progress * 4 + Math.sin((x * 0.018) + phase + index * 0.15) * (line.amplitude * 0.35);
      }

      if (x > roof.roofEndX) {
        const edgeDistance = x - roof.roofEndX;
        const separation = Math.min(1, edgeDistance / 120);
        const vortexShare = Math.max(0, Math.min(1, (edgeDistance - 8) / 54));

        if (index % 5 === 0 || (index + 2) % 7 === 0) {
          const orbitAngle = phase * 1.7 + index * 0.45 + vortexShare * Math.PI * 1.8;
          const radius = 10 + vortexShare * 18;
          const swirlX = vortexX + Math.cos(orbitAngle) * radius * 0.75;
          const swirlY = vortexY + Math.sin(orbitAngle) * radius * 0.52 - vortexShare * 10;
          y = swirlY;
          if (!started) {
            ctx.moveTo(swirlX, swirlY);
            started = true;
          } else {
            ctx.lineTo(swirlX, swirlY);
          }
          continue;
        }

        const lift = separation * (22 + index * 0.32);
        y = roof.roofEndY - 18 - lift + Math.sin(phase * 2.4 + index * 0.28 + separation * 4) * (4 + separation * 6);
      }

      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
    ctx.restore();
  });
}

function drawEdgeVortices() {
  if (!windSimulation) return;

  const { ctx, roof, phase } = windSimulation;
  const vortexX = roof.roofEndX + 24;
  const vortexY = roof.roofEndY - 18;

  ctx.save();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.92;

  for (let ring = 0; ring < 4; ring += 1) {
    const radius = 8 + ring * 5 + Math.sin(phase * 2 + ring * 0.7) * 0.8;
    ctx.beginPath();
    ctx.arc(vortexX, vortexY, radius, Math.PI * (0.2 + ring * 0.08), Math.PI * (1.95 + ring * 0.08));
    ctx.stroke();
  }

  ctx.restore();
}

function drawSuctionArrows() {
  if (!windSimulation) return;

  const { ctx, roof, phase } = windSimulation;
  const pulse = 0.75 + Math.sin(phase * 4) * 0.15;

  ctx.save();
  ctx.strokeStyle = `rgba(255, 140, 140, ${pulse})`;
  ctx.fillStyle = `rgba(255, 140, 140, ${pulse})`;
  ctx.lineWidth = 2;

  [0, 20, 40].forEach((offset) => {
    const x = roof.roofEndX + 6 + offset;
    const y = roof.roofEndY - 8 - offset * 0.3;

    ctx.beginPath();
    ctx.moveTo(x, y + 24);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 5, y + 7);
    ctx.lineTo(x + 5, y + 7);
    ctx.closePath();
    ctx.fill();
  });

  ctx.restore();
}

function animateWind(timestamp) {
  if (!windSimulation) return;

  updateWindLines();
  drawWindScene();
  windSimulation.animationFrame = requestAnimationFrame(animateWind);
}

function drawWindScene() {
  if (!windSimulation) return;

  const { ctx, roof } = windSimulation;
  ctx.clearRect(0, 0, WIND_CANVAS_WIDTH, 360);

  const sky = ctx.createLinearGradient(0, 0, 0, 360);
  sky.addColorStop(0, 'rgba(80, 130, 255, 0.12)');
  sky.addColorStop(1, 'rgba(80, 130, 255, 0.02)');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIND_CANVAS_WIDTH, 360);

  ctx.strokeStyle = 'rgba(162, 186, 216, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, roof.baseY);
  ctx.lineTo(WIND_CANVAS_WIDTH, roof.baseY);
  ctx.stroke();

  ctx.fillStyle = 'rgba(70, 90, 112, 0.18)';
  ctx.fillRect(0, roof.baseY + 2, WIND_CANVAS_WIDTH, 360 - roof.baseY);

  drawWindLines();
  drawEdgeVortices();
  drawSuctionArrows();
  drawRoofProfile();
}

function drawCanvasLabel(ctx, text, x, y) {
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

function createHouseGeometry() {
  const width = 300;
  const height = 120;
  const left = (WIND_CANVAS_WIDTH - width) / 2;
  const right = left + width;
  const baseY = 300;
  const topLeftY = baseY - height;
  const slopeDrop = Math.tan((15 * Math.PI) / 180) * width;
  const topRightY = topLeftY - slopeDrop;

  return {
    left,
    right,
    width,
    baseY,
    topLeftY,
    topRightY,
    slope: (topRightY - topLeftY) / width,
    windwardVortex: { x: left + 18, y: topLeftY - 14, radius: 50 },
    leewardVortex: { x: right + 10, y: topRightY + 22, radius: 56 }
  };
}

function spawnParticle(randomized = false) {
  const yBase = 102 + Math.random() * 130;
  return {
    x: randomized ? Math.random() * WIND_CANVAS_WIDTH * 0.4 - 80 : -20,
    y: randomized ? yBase : 96 + Math.random() * 140,
    vx: 1.6 + Math.random() * 1.3,
    vy: (Math.random() - 0.5) * 0.18,
    size: 1.4 + Math.random() * 1.9,
    alpha: 0.42 + Math.random() * 0.4,
    glow: 0.28 + Math.random() * 0.25,
    color: Math.random() > 0.45 ? 'rgba(180, 232, 255, 0.95)' : 'rgba(255, 255, 255, 0.92)'
  };
}

function resetParticle(particle) {
  const fresh = spawnParticle(false);
  Object.assign(particle, fresh, {
    x: -30 - Math.random() * 90,
    y: 92 + Math.random() * 150
  });
}

function getRoofProgress(particle, roof) {
  const onRoofX = particle.x >= roof.left - 36 && particle.x <= roof.right + 30;
  if (!onRoofX) {
    return { onRoof: false };
  }

  const roofY = roof.topLeftY + roof.slope * (particle.x - roof.left);
  const aboveRoof = particle.y <= roofY + 42 && particle.y >= roofY - 34;
  return { onRoof: aboveRoof };
}

function applyWindwardVortex(particle, roof, timeScale, windFactor) {
  const vortex = roof.windwardVortex;
  const dx = particle.x - vortex.x;
  const dy = particle.y - vortex.y;
  const distance = Math.hypot(dx, dy);
  if (distance > vortex.radius) return;

  const influence = (1 - distance / vortex.radius) * 0.22 * windFactor;
  particle.vx += (-dy / Math.max(distance, 8)) * influence * 3.1 * timeScale;
  particle.vy += (dx / Math.max(distance, 8)) * influence * 2.7 * timeScale;
  particle.vx += 0.08 * windFactor * timeScale;
  particle.vy -= 0.045 * windFactor * timeScale;
}

function applyLeewardDrop(particle, roof, timeScale, windFactor) {
  if (particle.x < roof.right - 8) return;

  particle.vx += 0.01 * timeScale;
  particle.vy += 0.038 * timeScale * windFactor;

  const vortex = roof.leewardVortex;
  const dx = particle.x - vortex.x;
  const dy = particle.y - vortex.y;
  const distance = Math.hypot(dx, dy);
  if (distance > vortex.radius) return;

  const influence = (1 - distance / vortex.radius) * 0.17 * windFactor;
  particle.vx += (-dy / Math.max(distance, 8)) * influence * 2.1 * timeScale;
  particle.vy += (dx / Math.max(distance, 8)) * influence * 1.6 * timeScale;
}

function formatNumber(value) {
  return value.toFixed(2).replace('.', ',').replace(/,00$/, '');
}

function teardownWindSimulation() {
  if (!windSimulation) return;
  if (windSimulation.animationFrame) cancelAnimationFrame(windSimulation.animationFrame);
  windSimulation = null;
}

const steps = [
  'schritt-1',
  'schritt-2',
  'schritt-3',
  'schritt-4',
  'schritt-5',
  'schritt-6',
  'schritt-9',
  'schritt-10',
  'dein-ablauf'
];

const state = {
  activeStep: 'schritt-1'
};

let stepContent;
const exampleDataByStep = {
  'schritt-1': ['Pultdach', 'Windzone: 1'],
  'schritt-2': ['Pultdach', 'Windzone: 1', 'Gebäudehöhe: 9 m', 'Längste Gebäudekante: 10 m'],
  'schritt-3': ['Pultdach', 'Windzone: 1', 'Gebäudehöhe: 9 m', 'Längste Gebäudekante: 10 m', 'Scharbreite: 590 mm'],
  'schritt-4': ['Pultdach', 'Windzone: 1', 'Gebäudehöhe: 9 m', 'Längste Gebäudekante: 10 m', 'Scharbreite: 590 mm'],
  'schritt-5': ['Pultdach', 'Windzone: 1', 'Gebäudehöhe: 9 m', 'Längste Gebäudekante: 10 m', 'Scharbreite: 590 mm', 'Dachneigung: 20°'],
  'schritt-6': ['Pultdach', 'Windzone: 1', 'Gebäudehöhe: 9 m', 'Längste Gebäudekante: 10 m', 'Scharbreite: 590 mm', 'Dachneigung: 20°', 'e = 10 m'],
  'schritt-9': ['Pultdach', 'Windzone: 1', 'Gebäudehöhe: 9 m', 'Längste Gebäudekante: 10 m', 'Scharbreite: 590 mm', 'Dachneigung: 20°', 'e = 10 m'],
  'schritt-10': ['Pultdach', 'Windzone: 1', 'Gebäudehöhe: 9 m', 'Längste Gebäudekante: 10 m', 'Scharbreite: 590 mm', 'Dachneigung: 20°', 'e = 10 m'],
  'dein-ablauf': ['Pultdach', 'Windzone: 1', 'Gebäudehöhe: 9 m', 'Längste Gebäudekante: 10 m', 'Scharbreite: 590 mm', 'Dachneigung: 20°', 'e = 10 m']
};

function renderStep(stepId) {
  if (!stepContent) return;

  state.activeStep = stepId;
  setActiveStep(stepId);

  stepContent.classList.remove('fade-enter');
  stepContent.innerHTML = `<div class="step"><div class="step-inner">${getStepContent(stepId)}</div></div>`;
  requestAnimationFrame(() => stepContent.classList.add('fade-enter'));

  bindGlobalStepControls();
  bindCalculationEvents(stepId, navigateTo);
  setupVisualizations(stepId);
  setupEmbeddedExercises();
}

function navigateTo(stepId) {
  if (stepId === 'start') {
    const landingPage = document.getElementById('landing-page');
    const appContent = document.getElementById('app-content');

    if (landingPage && appContent) {
      appContent.classList.remove('visible');
      appContent.classList.add('hidden');
      landingPage.style.display = 'flex';
      requestAnimationFrame(() => {
        landingPage.style.opacity = '1';
      });
      window.scrollTo(0, 0);
    }
    return;
  }

  if (!steps.includes(stepId) || !stepContent) return;
  window.scrollTo(0, 0);
  renderStep(stepId);
  requestAnimationFrame(() => window.scrollTo(0, 0));
  setTimeout(() => window.scrollTo(0, 0), 60);
}

function showStep(stepId) {
  navigateTo(stepId);
}

function bindGlobalStepControls() {
  document.querySelectorAll('[data-go-to]').forEach((button) => {
    button.addEventListener('click', () => navigateTo(button.dataset.goTo));
  });
}

function initGuideImageLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  const preview = document.getElementById('image-lightbox-preview');
  const closeButton = document.getElementById('image-lightbox-close');

  if (!lightbox || !preview || lightbox.dataset.bound === 'true') return;

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    preview.removeAttribute('src');
    preview.alt = '';
    document.body.classList.remove('lightbox-open');
  };

  document.addEventListener('click', (event) => {
    const image = event.target.closest('.guide-image, .lightbox-image');
    if (image) {
      preview.src = image.getAttribute('src');
      preview.alt = image.getAttribute('alt') || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      return;
    }

    if (event.target.closest('[data-lightbox-close="true"]')) {
      closeLightbox();
    }
  });

  closeButton.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLightbox();
    }
  });

  lightbox.dataset.bound = 'true';
}

function initExampleLightbox() {
  const lightbox = document.getElementById('example-lightbox');
  const content = document.getElementById('example-lightbox-content');
  const closeButton = document.getElementById('example-lightbox-close');

  if (!lightbox || !content || !closeButton || lightbox.dataset.bound === 'true') return;

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    content.innerHTML = '';
    document.body.classList.remove('lightbox-open');
  };

  document.addEventListener('click', (event) => {
    const example = event.target.closest('[data-example-expand="true"]');
    if (example && !event.target.closest('.guide-image')) {
      const clone = example.cloneNode(true);
      clone.classList.remove('expandable-example');
      clone.removeAttribute('data-example-expand');
      const badge = clone.querySelector('.example-click-badge');
      if (badge) badge.remove();
      content.innerHTML = '';
      content.appendChild(clone);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      return;
    }

    if (event.target.closest('[data-example-close="true"]')) {
      closeLightbox();
    }
  });

  closeButton.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLightbox();
    }
  });

  lightbox.dataset.bound = 'true';
}

function setupEmbeddedExercises() {
  document.querySelectorAll('.h5p-frame').forEach((frame) => {
    if (frame.dataset.enhanced === 'true') return;

    const resizeFrame = () => {
      try {
        const doc = frame.contentDocument;
        if (!doc) return;

        const bodyTop = doc.body ? doc.body.getBoundingClientRect().top : 0;
        const measuredNodes = [
          doc.querySelector('.h5p-container'),
          doc.querySelector('.h5p-content')
        ].filter(Boolean);

        if (!measuredNodes.length) return;

        const contentHeight = measuredNodes.reduce((maxHeight, node) => {
          const rect = node.getBoundingClientRect();
          const visualHeight = Math.ceil(rect.bottom - bodyTop);
          const scrollHeight = node.scrollHeight || 0;
          return Math.max(maxHeight, visualHeight, scrollHeight);
        }, 0);

        const viewportWidth = window.innerWidth || 1280;
        const minimumHeight = viewportWidth <= 768 ? 420 : 560;
        const maximumHeight = viewportWidth <= 768 ? 620 : 760;
        const nextHeight = Math.min(Math.max(contentHeight + 20, minimumHeight), maximumHeight);
        frame.style.height = `${nextHeight}px`;
      } catch (error) {
        // Same-origin only; if access fails we keep the CSS fallback height.
      }
    };

    frame.setAttribute('scrolling', 'no');
    frame.style.overflow = 'hidden';
    frame.addEventListener('load', () => {
      resizeFrame();
      setTimeout(resizeFrame, 120);
      setTimeout(resizeFrame, 360);
    });

    if (frame.contentDocument?.readyState === 'complete') {
      resizeFrame();
      setTimeout(resizeFrame, 120);
    }

    frame.dataset.enhanced = 'true';
  });
}

function updateExampleBox(stepId) {
  const windzone = document.getElementById('ex-windzone');
  const roof = document.getElementById('ex-roof');
  const height = document.getElementById('ex-height');
  const schar = document.getElementById('ex-schar');
  const pitchValue = document.getElementById('ex-pitch');
  const eValue = document.getElementById('ex-e');
  const quarterValue = document.getElementById('ex-quarter');
  const tenthValue = document.getElementById('ex-tenth');

  if (!roof || !windzone || !height || !schar || !pitchValue || !eValue || !quarterValue || !tenthValue) return;

  const nextValues = {
    windzone: '',
    height: '',
    schar: '',
    pitch: '',
    e: '',
    quarter: '',
    tenth: ''
  };

  if (stepId === 'schritt-1') {
    nextValues.windzone = 'Windzone 1';
  }

  if (stepId === 'schritt-2') {
    nextValues.windzone = 'Windzone 1';
    nextValues.height = 'h = 9 m';
  }

  if (stepId === 'schritt-3' || stepId === 'schritt-4' || stepId === 'schritt-5') {
    nextValues.windzone = 'Windzone 1';
    nextValues.height = 'h = 9 m';
    nextValues.schar = '590 mm';
  }

  if (stepId === 'schritt-6' || stepId === 'schritt-9' || stepId === 'schritt-10' || stepId === 'dein-ablauf') {
    nextValues.windzone = 'Windzone 1';
    nextValues.height = 'h = 9 m';
    nextValues.schar = '590 mm';
    nextValues.e = 'e = 10 m';
  }

  if (stepId === 'schritt-5' || stepId === 'schritt-6' || stepId === 'schritt-9' || stepId === 'schritt-10' || stepId === 'dein-ablauf') {
    nextValues.pitch = '20°';
  }

  if (stepId === 'schritt-9' || stepId === 'schritt-10' || stepId === 'dein-ablauf') {
    nextValues.quarter = 'e/4 = 2,5 m';
    nextValues.tenth = 'e/10 = 1 m';
  }

  const applyValue = (element, value) => {
    const previous = element.dataset.value ?? '';
    element.classList.remove('is-new');
    element.textContent = value;
    element.dataset.value = value;
    element.classList.toggle('active', Boolean(value));

    if (value && value !== previous) {
      element.classList.remove('is-new');
      void element.offsetWidth;
      element.classList.add('is-new');
    }
  };

  roof.classList.add('active');
  applyValue(windzone, nextValues.windzone);
  applyValue(height, nextValues.height);
  applyValue(schar, nextValues.schar);
  applyValue(pitchValue, nextValues.pitch);
  applyValue(eValue, nextValues.e);
  applyValue(quarterValue, nextValues.quarter);
  applyValue(tenthValue, nextValues.tenth);
}

document.addEventListener('DOMContentLoaded', () => {
  stepContent = document.getElementById('step-content');
  const enterButton = document.getElementById('enterApp');
  const landingPage = document.getElementById('landing-page');
  const appContent = document.getElementById('app-content');

  initGuideImageLightbox();
  initExampleLightbox();

  initNavigation(document.getElementById('step-nav'), steps, navigateTo);
  renderStep(state.activeStep);

  if (enterButton && landingPage && appContent) {
    enterButton.addEventListener('click', () => {
      landingPage.style.opacity = '0';
      appContent.classList.remove('hidden');
      window.scrollTo(0, 0);

      setTimeout(() => {
        landingPage.style.display = 'none';
      }, 400);

      setTimeout(() => {
        appContent.classList.add('visible');
      }, 50);

      showStep('schritt-1');
    });
  }
});
