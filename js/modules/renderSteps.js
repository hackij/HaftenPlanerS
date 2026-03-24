function imagePlaceholder(title, fileHint, caption) {
  return `
    <div class="placeholder-image">
      <div class="placeholder-image__content">
        <span class="placeholder-label">Bildplatzhalter</span>
        <h3 class="visual-card__title">${title}</h3>
        <p class="visual-caption">Zukuenftige Datei: ${fileHint}</p>
        <p class="visual-caption">${caption}</p>
      </div>
    </div>
  `;
}

function nextButton(step) {
  return `<button class="primary-btn" type="button" data-next-step="${step}">Weiter zum naechsten Schritt</button>`;
}

export function getStepContent(stepId) {
  const steps = {
    start: `
      <div class="hero-grid" id="welcome">
        <div class="step-copy">
          <span class="step-tag">Start</span>
          <h2 class="step-title">Haftenverlegeplan verstehen</h2>
          <p class="lead">Schritt fuer Schritt zum sicheren und fachgerechten Vorgehen</p>
          <p>Diese Lernapp zeigt dir Schritt fuer Schritt, wie ein Haftenverlegeplan fuer ein Pultdach aufgebaut wird.</p>
          <p>Richtig gewaehlte Haftabstaende sind nicht nur fuer Pruefungsaufgaben wichtig, sondern vor allem fuer die sichere Verlegung von Blechscharen auf der Baustelle.</p>
          <p>Windsog kann zu hohen Belastungen am Dach fuehren. Werden Haften falsch angeordnet oder mit zu grossen Abstaenden gesetzt, kann es zu Schaeden, Funktionsproblemen und Gewaehrleistungsfaellen kommen.</p>
          <p>Besonders wichtig wird das Thema auch dann, wenn spaeter zusaetzliche Anlagen wie Photovoltaik auf dem Dach montiert werden. Solche Einbauten koennen die Belastung des Dachsystems erhoehen.</p>
          <p>Das Ziel dieser App ist, dass du nicht nur ein Beispiel verstehst, sondern dir eine eigene klare Struktur aneignest, wie du bei Aufgaben zum Haftenverlegeplan vorgehst.</p>
          <div class="button-row">
            <button id="startAppButton" class="start-button" type="button">App starten</button>
          </div>
        </div>
        <div class="hero-image-wrap">
          <img src="assets/images/pultdach-windzonen.jpg" class="hero-image" alt="Pultdach mit Windzonen als Einfuehrungsbild der Lernapp" />
        </div>
      </div>
    `,
    'schritt-1': `
      <div class="step-grid" id="step1">
        <div class="step-copy">
          <span class="step-tag">Schritt 1</span>
          <h2 class="step-title">Gebaeudelage und Windzone</h2>
          <p>Deutschland ist in vier Windzonen eingeteilt. Diese Einteilung hilft dabei, die zu erwartenden Windbelastungen fuer ein Dach richtig abzuschaetzen.</p>
          <p>Fuer unser Leitbeispiel nehmen wir einen Standort in Bayern / Oberfranken an. Dieser Bereich gehoert zur Windzone 1.</p>
          <div class="metric-row">
            <div class="metric-chip"><strong>vref</strong><br />22,5 m/s</div>
            <div class="metric-chip"><strong>qref</strong><br />0,32 kN/m²</div>
          </div>
          <p class="callout">Der Bemessungsstaudruck ist vereinfacht gesagt der Rechenwert, mit dem die Windbeanspruchung auf das Bauteil angesetzt wird. Je hoeher dieser Wert, desto groesser ist die Belastung fuer Dach und Befestigung.</p>
          <ul class="info-list">
            <li><strong>Merke:</strong> Bevor du rechnest, klaere immer zuerst den Standort.</li>
            <li><strong>Lernziel:</strong> Die Windzone ist eine Grundlage fuer spaetere Tabellenwerte bei den Haftabstaenden.</li>
          </ul>
          <div class="button-row">${nextButton('schritt-2')}</div>
        </div>
        ${imagePlaceholder(
          'Windzonenkarte Deutschland',
          'assets/images/windzones-placeholder.jpg',
          'Platz fuer eine spaetere Deutschlandkarte mit den vier Windzonen.'
        )}
      </div>
    `,
    'schritt-2': `
      <div class="step-grid">
        <div class="step-copy">
          <span class="step-tag">Schritt 2</span>
          <h2 class="step-title">Gebaeudehoehe bestimmen</h2>
          <p>Die Gebaeudehoehe wird vom tiefsten Punkt bis zum hoechsten Punkt des Gebaeudes gemessen. Sie beeinflusst die Windbeanspruchung und damit die Einteilung der Dachbereiche.</p>
          <p>Im gefuehrten Beispiel arbeiten wir mit einem Pultdach und setzen die Gebaeudehoehe auf <strong>h = 9 m</strong>.</p>
          <ul class="info-list">
            <li><strong>Praxisblick:</strong> Hoehere Gebaeude liegen meist staerker im Wind.</li>
            <li><strong>Pruefung:</strong> Die Hoehe ist oft eine der ersten Angaben in der Aufgabe.</li>
          </ul>
          <div class="button-row">${nextButton('schritt-3')}</div>
        </div>
        <div class="visual-card">
          <div class="visual-card__content">
            <span class="visual-card__eyebrow">Profil</span>
            <h3 class="visual-card__title">Vereinfachtes Dachprofil</h3>
            <p class="visual-caption">Platzhalter fuer eine spaetere Profildarstellung mit Hoehenmass von der Traufe bis zur hohen Dachkante.</p>
            <div class="badge-row">
              <span class="badge">Dachform: Pultdach</span>
              <span class="badge">Beispielhoehe: 9 m</span>
            </div>
          </div>
        </div>
      </div>
    `,
    'schritt-3': `
      <div class="step-grid">
        <div class="step-copy">
          <span class="step-tag">Schritt 3</span>
          <h2 class="step-title">Scharbreite verstehen</h2>
          <p>In unserem Beispiel betraegt die Scharbreite <strong>590 mm</strong>. Diese Breite spielt spaeter bei den zulaessigen Haftabstaenden eine wichtige Rolle.</p>
          <p>Je breiter eine Schar ist, desto staerker koennen Windkraefte wirken. Deshalb muessen bei groesseren Breiten die Befestigungsabstaende oft kleiner gewaehlt werden.</p>
          <ul class="info-list">
            <li><strong>Wichtig:</strong> Scharbreite nie nur als Mass sehen, sondern immer als Belastungsfaktor mitdenken.</li>
            <li><strong>Leitfrage:</strong> Welche Tabelle passt zur gewaehlten Scharbreite?</li>
          </ul>
          <div class="button-row">${nextButton('schritt-4')}</div>
        </div>
        <div class="visual-card">
          <div class="visual-card__content">
            <span class="visual-card__eyebrow">Schar</span>
            <h3 class="visual-card__title">590 mm als Lernbeispiel</h3>
            <p class="visual-caption">Technische Flaeche fuer eine spaetere Detailgrafik einer Stehfalz-Schar mit markierter Nutzbreite.</p>
            <div class="badge-row">
              <span class="badge">Scharbreite: 590 mm</span>
              <span class="badge">breiter = oft dichter haften</span>
            </div>
          </div>
        </div>
      </div>
    `,
    'schritt-4': `
      <div class="step-grid">
        <div class="step-copy">
          <span class="step-tag">Schritt 4</span>
          <h2 class="step-title">Windsog verstehen</h2>
          <p>Stroemt Wind ueber das Dach, entstehen Druckunterschiede. Dabei kann auf der Dachoberflaeche ein Sog entstehen, der die Bekleidung nach oben ziehen will.</p>
          <p>Besonders kritisch sind Rand- und Eckbereiche. Dort ist die Beanspruchung hoeher als in der Dachmitte.</p>
          <p class="callout">Merke fuer die Praxis: Der Mittelpunkt eines Daches ist meist weniger kritisch als die Dachraender und Ecken.</p>
          <ul class="info-list">
            <li><strong>Beobachtung:</strong> Ueber der Dachflaeche beschleunigt die Stroemung und wird an den Kanten abgeloest.</li>
            <li><strong>Wichtig:</strong> Genau dort entstehen Wirbel und die kritischsten Windsogzonen fuer den Haftenverlegeplan.</li>
          </ul>
          <div class="button-row">${nextButton('schritt-5')}</div>
        </div>
        <div class="simulation-card">
          <div class="simulation-card__header">
            <span class="visual-card__eyebrow">Canvas Simulation</span>
            <h3 class="visual-card__title">Windsog am Pultdach</h3>
            <p class="visual-caption">Starte die Animation und beobachte, wie Luftstroemung, Wirbel und Sogzonen an den Dachkanten zunehmen.</p>
          </div>
          <div id="wind-simulation" class="wind-simulation"></div>
          <div class="button-row simulation-controls">
            <button class="primary-btn" id="wind-start" type="button">Wind starten</button>
            <button class="secondary-btn" id="wind-strong" type="button">Starker Wind</button>
          </div>
          <div class="simulation-explanation">
            <p>Wenn Wind auf ein Gebaeude trifft, wird die Luftstroemung an den Dachkanten abgelenkt. Dabei entstehen Luftwirbel.</p>
            <p>Diese Wirbel erzeugen Unterdruck (Windsog) auf der Dachflaeche.</p>
            <p>Besonders stark ist dieser Effekt an den Dachraendern und an den Ecken des Gebaeudes.</p>
            <p>Deshalb muessen in diesen Bereichen kleinere Haftabstaende gewaehlt werden.</p>
          </div>
        </div>
      </div>
    `,
    'schritt-5': `
      <div class="step-grid">
        <div class="step-copy">
          <span class="step-tag">Schritt 5</span>
          <h2 class="step-title">Dachbereiche bestimmen</h2>
          <p>Fuer den Haftenverlegeplan wird das Dach in Belastungszonen eingeteilt. Beim Pultdach sind in der Lernregel vor allem die Bereiche <strong>H</strong>, <strong>G</strong>, <strong>F</strong> und <strong>Fhoch</strong> wichtig.</p>
          <ul class="info-list">
            <li><strong>H</strong>: geringste Belastung</li>
            <li><strong>G</strong>: erhoehte Belastung</li>
            <li><strong>F / Fhoch</strong>: hoechste Belastung</li>
          </ul>
          <p>Diese Einteilung hilft dir spaeter dabei, Rand- und Eckbereiche enger zu befestigen als die Mitte.</p>
          <div class="button-row">${nextButton('schritt-6')}</div>
        </div>
        ${imagePlaceholder(
          'Dachzonen nach Fachregel',
          'assets/images/pultdach-zones-placeholder.jpg',
          'Platz fuer eine spaetere Pultdach-Grafik mit eingezeichneten Zonen H, G, F und Fhoch.'
        )}
      </div>
    `,
    'schritt-6': `
      <div class="step-grid">
        <div class="step-copy">
          <span class="step-tag">Schritt 6</span>
          <h2 class="step-title">e Wert berechnen</h2>
          <p>Fuer die Einteilung der Dachbereiche wird der Wert <strong>e</strong> benoetigt. Dazu werden zwei Wege gerechnet:</p>
          <div class="formula-grid">
            <div class="formula-box"><strong>Formel 1</strong><br />e = 2 x h</div>
            <div class="formula-box"><strong>Formel 2</strong><br />e = b</div>
          </div>
          <p>Der kleinere Wert ist entscheidend. In diesem Lernbeispiel sind die Felder bereits mit <strong>h = 12</strong> und <strong>b = 20</strong> vorbelegt.</p>
          <div class="interactive-panel">
            <div class="input-grid">
              <label>h in m
                <input id="e-height" type="number" min="0.1" step="0.1" value="12" />
              </label>
              <label>b in m
                <input id="e-width" type="number" min="0.1" step="0.1" value="20" />
              </label>
            </div>
            <div class="button-row">
              <button class="primary-btn" id="calculate-e" type="button">e Wert berechnen</button>
            </div>
          </div>
          <div class="button-row">${nextButton('schritt-7')}</div>
        </div>
        <div class="result-box">
          <h3 class="result-box__title">Ergebnis</h3>
          <div class="result-value" id="e-result">20,00 m</div>
          <p id="e-result-details">2 x h = 24,00 m | b = 20,00 m | entscheidend ist der kleinere Wert.</p>
          <p class="callout">Wenn du in der Aufgabe mehrere Masse hast, halte immer fest, welcher Wert am Ende fuer e wirklich angesetzt wird.</p>
        </div>
      </div>
    `,
    'schritt-7': `
      <div class="step-copy">
        <span class="step-tag">Schritt 7</span>
        <h2 class="step-title">Randbereiche berechnen</h2>
        <p>Hier leitest du aus dem Mass <strong>e</strong> die Randbereiche des Daches ab. So wird sichtbar, wie aus den Gebaeudeabmessungen die Zonen fuer den Haftenverlegeplan entstehen.</p>
      </div>
      <div class="interactive-panel zone-calculator">
        <div class="input-grid">
          <label>Gebaeudehoehe h (m)
            <input id="zone-height" type="number" min="0.1" step="0.1" value="12" />
          </label>
          <label>Gebaeudelaenge b (m)
            <input id="zone-length" type="number" min="0.1" step="0.1" value="20" />
          </label>
          <label>Dachneigung (°)
            <input id="zone-pitch" type="number" min="0" max="90" step="1" value="15" />
          </label>
        </div>
        <div class="button-row zone-calculator__actions">
          <button class="primary-btn" id="update-zones" type="button">Berechnung aktualisieren</button>
        </div>
        <div class="zone-results">
          <div class="result-box">
            <h3 class="result-box__title">Berechnung</h3>
            <div class="result-value" id="zone-e-result">20 m</div>
            <p id="zone-e-details">Berechnung:<br />e = min(2 x h, b)<br /><br />2 x 12 = 24 m<br />b = 20 m<br /><br />Massgebend: e = 20 m</p>
          </div>
          <div class="result-box">
            <h3 class="result-box__title">Zoneabmessungen</h3>
            <div class="result-grid">
              <div class="formula-box"><strong>Randbereich Laenge</strong><br /><span id="zone-length-result">5 m</span></div>
              <div class="formula-box"><strong>Randbereich Breite</strong><br /><span id="zone-width-result">2 m</span></div>
            </div>
            <p id="zone-pitch-note">Dachneigung ≤ 30°: Der Flaechenbereich wird als J angezeigt, die Randzonen bleiben G und die Eckbereiche F.</p>
          </div>
        </div>
      </div>
      <div class="zone-layout">
        <div class="zone-panel zone-panel--dynamic">
          <div class="zone-panel__header">
            <span class="visual-card__eyebrow">Dynamische Ansicht</span>
            <h3 class="visual-card__title">Automatisch berechnete Dachbereiche</h3>
            <p class="visual-caption">Die Grafik zeigt, wie sich F-, G- und Flaechenbereiche aus dem Mass e ableiten und bei Aenderungen direkt neu gezeichnet werden.</p>
          </div>
          <div id="roof-zone-visualization" class="roof-zone-visualization"></div>
          <p class="zone-note">Da Windsogkraefte am Dachrand staerker wirken als in der Flaeche, muss die Dachflaeche in verschiedene Bereiche unterteilt werden.</p>
          <p class="zone-note">Diese Bereiche werden anhand des Masses e bestimmt.</p>
          <p class="zone-note">Die dargestellte Grafik zeigt, wie sich die Randbereiche aus den Gebaeudeabmessungen ableiten.</p>
        </div>
        <div class="zone-panel zone-panel--reference">
          <div class="zone-panel__header">
            <span class="visual-card__eyebrow">Fachregel</span>
            <h3 class="visual-card__title">Referenzgrafik aus den Klempnerfachregeln</h3>
          </div>
          ${imagePlaceholder(
            'Pultdach-Zonen im Vergleich',
            'assets/images/pultdach-zones-placeholder.jpg',
            'Hier wird spaeter die Referenzgrafik aus den Fachregeln angezeigt.'
          )}
          <p class="visual-caption">Vergleiche die automatisch berechneten Dachbereiche mit der Darstellung aus den Fachregeln.</p>
        </div>
      </div>
      <div class="button-row">${nextButton('schritt-8')}</div>
    `,
    'schritt-8': `
      <div class="step-grid">
        <div class="step-copy">
          <span class="step-tag">Schritt 8</span>
          <h2 class="step-title">Dachneigung beruecksichtigen</h2>
          <p>Die Dachneigung veraendert die Bewertung einzelner Dachbereiche. Deshalb muss sie immer mitgeprueft werden.</p>
          <ul class="info-list">
            <li><strong>bei alpha &gt; 30°</strong>: G wird zu F</li>
            <li><strong>bei alpha ≤ 30°</strong>: H wird zu J</li>
          </ul>
          <p>Nutze den Regler und beobachte, wie sich die Einordnung aendert.</p>
          <div class="button-row">${nextButton('schritt-9')}</div>
        </div>
        <div class="interactive-panel">
          <label>Dachneigung
            <input id="roof-pitch" type="range" min="5" max="45" step="1" value="18" />
          </label>
          <div class="result-value" id="roof-pitch-value">18°</div>
          <p id="roof-pitch-result"></p>
        </div>
      </div>
    `,
    'schritt-9': `
      <div class="step-grid">
        <div class="step-copy">
          <span class="step-tag">Schritt 9</span>
          <h2 class="step-title">Haftabstaende bestimmen</h2>
          <p>Die zulaessigen Haftabstaende werden nicht frei geschaetzt, sondern aus Tabellen der Fachregeln abgeleitet.</p>
          <p>Dabei spielen vor allem drei Faktoren zusammen: <strong>Windzone</strong>, <strong>Dachbereich</strong> und <strong>Scharbreite</strong>.</p>
          <p class="callout">In der realen Planung schaust du jetzt in die passende Tabelle und liest fuer den jeweiligen Dachbereich den richtigen Abstand ab.</p>
          <div class="button-row">${nextButton('schritt-10')}</div>
        </div>
        <div class="table-placeholder">
          <h3 class="result-box__title">Vereinfachte Lerntabelle</h3>
          <div class="table-row"><span>Dachbereich</span><span>Beispielwert</span><span>Deutung</span></div>
          <div class="table-row"><span>H / Mitte</span><span>groesserer Abstand</span><span>geringere Beanspruchung</span></div>
          <div class="table-row"><span>G / Rand</span><span>engerer Abstand</span><span>erhoehte Beanspruchung</span></div>
          <div class="table-row"><span>F / Ecke</span><span>sehr enger Abstand</span><span>hoechste Beanspruchung</span></div>
          <div class="result-box">
            <h3 class="result-box__title">Ergebnisfeld</h3>
            <p>Hier kann spaeter ein konkreter Tabellenwert fuer das Leitbeispiel eingeblendet werden.</p>
            <div class="badge-row">
              <span class="badge">Windzone 1</span>
              <span class="badge">590 mm Schar</span>
              <span class="badge">Bereich ablesen</span>
            </div>
          </div>
        </div>
      </div>
    `,
    'schritt-10': `
      <div class="step-grid">
        <div class="step-copy">
          <span class="step-tag">Schritt 10</span>
          <h2 class="step-title">Beispiel Haftverlegeplan</h2>
          <p>Am Ende fuehrst du alle Informationen zusammen. In den Rand- und Eckbereichen werden die Haften dichter gesetzt, in der Mitte darf der Abstand groesser sein.</p>
          <p>So entsteht ein nachvollziehbarer Haftverlegeplan fuer das Pultdach.</p>
          <div class="button-row">
            <button class="primary-btn" type="button" data-next-step="dein-ablauf">Zum eigenen Ablauf</button>
            <button class="secondary-btn" type="button">Was passiert bei zu wenigen Haften?</button>
          </div>
        </div>
        <div class="warning-box">
          <h3 class="result-box__title">Visualisierung des Verlegeplans</h3>
          <div class="plan-grid">
            <div class="plan-column plan-column--edge"><span>F</span></div>
            <div class="plan-column plan-column--transition"><span>G</span></div>
            <div class="plan-column plan-column--mid"><span>H</span></div>
            <div class="plan-column plan-column--transition"><span>G</span></div>
            <div class="plan-column plan-column--edge"><span>F</span></div>
          </div>
          <p>Der Platzhalter zeigt: aussen dichter, innen weiter. Spaeter kann hier eine animierte Warnung oder Simulation eingefuegt werden.</p>
        </div>
      </div>
    `,
    'dein-ablauf': `
      <div class="final-grid">
        <div class="step-copy">
          <span class="step-tag">Abschluss</span>
          <h2 class="step-title">Dein persoenlicher Ablauf</h2>
          <p>Jetzt geht es darum, aus dem Beispiel deinen eigenen klaren Arbeitsablauf abzuleiten. Nicht einzelne Zahlen sind am wichtigsten, sondern die Reihenfolge deiner Gedanken.</p>
          <p>Wenn du Aufgaben zum Haftenverlegeplan loest, solltest du die Schritte sicher und in sinnvoller Reihenfolge abrufen koennen.</p>
          <p class="callout">Formuliere diese Struktur spaeter in deinen eigenen Worten. Dann merkst du sie dir leichter und kannst sie auch in neuen Aufgaben anwenden.</p>
          <div class="button-row">
            <button class="ghost-btn" type="button" data-go-to="start">Zurueck zum Start</button>
          </div>
        </div>
        <div class="checklist-box">
          <h3 class="checklist__title">Checkliste fuer deinen Ablauf</h3>
          <ol class="checklist">
            <li>Gebaeudelage pruefen</li>
            <li>Windzone bestimmen</li>
            <li>Gebaeudehoehe ermitteln</li>
            <li>Scharenbreite festlegen</li>
            <li>Dachbereiche bestimmen</li>
            <li>e Wert berechnen</li>
            <li>Randzonen festlegen</li>
            <li>Dachneigung pruefen</li>
            <li>Haftabstaende aus Tabelle bestimmen</li>
            <li>Haftverlegeplan erstellen</li>
          </ol>
          <p class="footer-note">Tipp: Schreibe dir diesen Ablauf einmal selbst auf und sprich ihn laut durch. So entsteht deine eigene sichere Arbeitsstruktur.</p>
        </div>
      </div>
    `
  };

  return steps[stepId] ?? '<p>Schritt nicht gefunden.</p>';
}
