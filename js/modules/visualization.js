const WIND_CANVAS_WIDTH = 900;
const WIND_CANVAS_HEIGHT = 400;
const PARTICLE_LIMIT = 120;
const ZONE_CANVAS_WIDTH = 900;
const ZONE_CANVAS_HEIGHT = 460;

let windSimulation = null;
let zoneVisualization = null;

export function setupVisualizations(stepId) {
  if (stepId === 'schritt-4') {
    initWindSimulation();
  } else {
    teardownWindSimulation();
  }

  if (stepId === 'schritt-7') {
    initRoofZoneVisualization();
  } else {
    teardownZoneVisualization();
  }
}

export function initWindSimulation() {
  teardownWindSimulation();

  const host = document.getElementById('wind-simulation');
  const startButton = document.getElementById('wind-start');
  const strongButton = document.getElementById('wind-strong');

  if (!host || !startButton || !strongButton) return;

  const canvas = document.createElement('canvas');
  canvas.width = WIND_CANVAS_WIDTH;
  canvas.height = WIND_CANVAS_HEIGHT;
  canvas.setAttribute('aria-label', 'Animation zum Windsog auf einem Pultdach');
  host.replaceChildren(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const roof = createHouseGeometry();

  windSimulation = {
    canvas,
    ctx,
    roof,
    particles: Array.from({ length: PARTICLE_LIMIT }, () => spawnParticle(true)),
    animationFrame: 0,
    running: false,
    strongWind: false,
    labelsVisible: false,
    lastTime: 0,
    intensity: 1,
    targetIntensity: 1
  };

  drawWindScene();
  startButton.addEventListener('click', startWind);
  strongButton.addEventListener('click', increaseWind);
}

export function createParticles() {
  if (!windSimulation) return;
  windSimulation.particles = Array.from({ length: PARTICLE_LIMIT }, () => spawnParticle(true));
}

export function updateParticles(delta) {
  if (!windSimulation) return;

  const { particles, roof } = windSimulation;
  const timeScale = delta / 16.666;
  const windFactor = windSimulation.intensity;

  particles.forEach((particle) => {
    particle.x += particle.vx * timeScale * windFactor;
    particle.y += particle.vy * timeScale * windFactor;

    const roofProgress = getRoofProgress(particle, roof);

    if (roofProgress.onRoof) {
      particle.vx += 0.02 * timeScale * windFactor;
      particle.vy += (-0.02 - roof.slope * 0.03) * timeScale;
      particle.glow = 0.55;
    } else {
      particle.glow = Math.max(0.25, particle.glow - 0.02 * timeScale);
    }

    applyWindwardVortex(particle, roof, timeScale, windFactor);
    applyLeewardDrop(particle, roof, timeScale, windFactor);

    particle.vx *= 0.995;
    particle.vy *= 0.992;

    if (particle.x > WIND_CANVAS_WIDTH + 60 || particle.y < -40 || particle.y > WIND_CANVAS_HEIGHT + 40) {
      resetParticle(particle);
    }
  });
}

export function drawHouse() {
  if (!windSimulation) return;

  const { ctx, roof } = windSimulation;
  const { left, right, baseY, topLeftY, topRightY } = roof;

  ctx.save();
  ctx.fillStyle = 'rgba(24, 30, 40, 0.85)';
  ctx.strokeStyle = 'rgba(154, 177, 206, 0.4)';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(left, baseY);
  ctx.lineTo(left, topLeftY);
  ctx.lineTo(right, topRightY);
  ctx.lineTo(right, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = 'rgba(215, 228, 245, 0.85)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(left, topLeftY);
  ctx.lineTo(right, topRightY);
  ctx.stroke();

  ctx.restore();
}

export function drawParticles() {
  if (!windSimulation) return;

  const { ctx, particles } = windSimulation;

  particles.forEach((particle) => {
    const glow = 6 + particle.glow * 18;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = particle.color;
    ctx.shadowBlur = glow;
    ctx.shadowColor = particle.color;
    ctx.globalAlpha = particle.alpha;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

export function drawVortex() {
  if (!windSimulation) return;

  const { ctx, roof } = windSimulation;
  const windward = roof.windwardVortex;
  const leeward = roof.leewardVortex;
  const strength = windSimulation.intensity;

  [windward, leeward].forEach((vortex, index) => {
    const gradient = ctx.createRadialGradient(vortex.x, vortex.y, 6, vortex.x, vortex.y, vortex.radius);
    const edgeColor = index === 0 ? `rgba(255, 127, 80, ${0.08 * strength})` : `rgba(90, 169, 255, ${0.07 * strength})`;
    gradient.addColorStop(0, index === 0 ? `rgba(255, 84, 84, ${0.16 * strength})` : `rgba(120, 205, 255, ${0.12 * strength})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.save();
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(vortex.x, vortex.y, vortex.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = edgeColor;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.45;

    for (let ring = 0; ring < 3; ring += 1) {
      ctx.beginPath();
      ctx.arc(vortex.x, vortex.y, 14 + ring * 12 + strength * 2, Math.PI * (0.2 + ring * 0.2), Math.PI * (1.55 + ring * 0.2));
      ctx.stroke();
    }

    ctx.restore();
  });
}

export function drawZones() {
  if (!windSimulation) return;

  const { ctx, roof } = windSimulation;
  const boost = windSimulation.strongWind ? 1.45 : 1;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(roof.left, roof.topLeftY);
  ctx.lineTo(roof.right, roof.topRightY);
  ctx.lineTo(roof.right, roof.topRightY + 22);
  ctx.lineTo(roof.left, roof.topLeftY + 22);
  ctx.closePath();
  ctx.clip();

  const lowLoad = ctx.createLinearGradient(roof.left, roof.topLeftY, roof.right, roof.topRightY);
  lowLoad.addColorStop(0, 'rgba(255, 210, 120, 0)');
  lowLoad.addColorStop(0.22, `rgba(255, 153, 51, ${0.16 * boost})`);
  lowLoad.addColorStop(0.42, 'rgba(86, 192, 255, 0.2)');
  lowLoad.addColorStop(0.58, 'rgba(86, 192, 255, 0.2)');
  lowLoad.addColorStop(0.78, `rgba(255, 125, 64, ${0.18 * boost})`);
  lowLoad.addColorStop(1, `rgba(255, 72, 72, ${0.26 * boost})`);
  ctx.fillStyle = lowLoad;
  ctx.fillRect(roof.left, roof.topLeftY - 12, roof.width, 40);

  const cornerGlow = ctx.createRadialGradient(roof.right - 18, roof.topRightY + 4, 6, roof.right - 18, roof.topRightY + 4, 42);
  cornerGlow.addColorStop(0, `rgba(255, 72, 72, ${0.24 * boost})`);
  cornerGlow.addColorStop(1, 'rgba(255, 72, 72, 0)');
  ctx.fillStyle = cornerGlow;
  ctx.fillRect(roof.right - 72, roof.topRightY - 26, 96, 96);

  ctx.restore();

  if (!windSimulation.labelsVisible) return;

  ctx.save();
  ctx.font = '600 15px "Avenir Next", "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(236, 244, 255, 0.94)';
  ctx.strokeStyle = 'rgba(16, 24, 36, 0.55)';
  ctx.lineWidth = 3;
  drawCanvasLabel(ctx, 'Flaechenbereich', roof.left + roof.width * 0.42, roof.topLeftY - 26);
  drawCanvasLabel(ctx, 'Randbereich', roof.left + roof.width * 0.14, roof.topLeftY - 38);
  drawCanvasLabel(ctx, 'Eckbereich', roof.right - 62, roof.topRightY - 28);
  ctx.restore();
}

export function startWind() {
  if (!windSimulation) return;
  windSimulation.running = true;
  windSimulation.labelsVisible = true;
  windSimulation.targetIntensity = windSimulation.strongWind ? 1.9 : 1.15;

  if (!windSimulation.animationFrame) {
    windSimulation.lastTime = 0;
    windSimulation.animationFrame = requestAnimationFrame(animateWind);
  }
}

export function increaseWind() {
  if (!windSimulation) return;
  windSimulation.strongWind = true;
  windSimulation.labelsVisible = true;
  windSimulation.running = true;
  windSimulation.targetIntensity = 2.35;

  if (!windSimulation.animationFrame) {
    windSimulation.lastTime = 0;
    windSimulation.animationFrame = requestAnimationFrame(animateWind);
  }
}

export function drawRoofZones() {
  if (!zoneVisualization) return;

  const { ctx, data, fade } = zoneVisualization;
  const roof = getRoofZoneGeometry(data);

  ctx.clearRect(0, 0, ZONE_CANVAS_WIDTH, ZONE_CANVAS_HEIGHT);
  drawZoneBackground(ctx, roof);
  drawZoneGrid(ctx, roof);
  drawZoneAreas(ctx, roof, data.labels, fade);
  drawZoneDimensions(ctx, roof, data);
  drawZoneLegend(ctx, roof, data.labels, fade);
}

export function updateRoofZones(data = readRoofZoneInputs()) {
  if (!data) return;

  if (!zoneVisualization) {
    initRoofZoneVisualization();
  }

  if (!zoneVisualization) return;

  zoneVisualization.data = data;
  zoneVisualization.fade = 0;
  zoneVisualization.targetFade = 1;

  if (!zoneVisualization.animationFrame) {
    zoneVisualization.animationFrame = requestAnimationFrame(animateRoofZones);
  }
}

function initRoofZoneVisualization() {
  teardownZoneVisualization();

  const host = document.getElementById('roof-zone-visualization');
  if (!host) return;

  const canvas = document.createElement('canvas');
  canvas.width = ZONE_CANVAS_WIDTH;
  canvas.height = ZONE_CANVAS_HEIGHT;
  canvas.setAttribute('aria-label', 'Berechnete Dachzonen fuer das Pultdach');
  host.replaceChildren(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  zoneVisualization = {
    canvas,
    ctx,
    data: readRoofZoneInputs(),
    fade: 1,
    targetFade: 1,
    animationFrame: 0
  };

  drawRoofZones();
}

function animateWind(timestamp) {
  if (!windSimulation) return;

  const delta = windSimulation.lastTime ? Math.min(32, timestamp - windSimulation.lastTime) : 16.666;
  windSimulation.lastTime = timestamp;
  windSimulation.intensity += (windSimulation.targetIntensity - windSimulation.intensity) * 0.035;

  updateParticles(delta);
  drawWindScene();
  windSimulation.animationFrame = requestAnimationFrame(animateWind);
}

function drawWindScene() {
  if (!windSimulation) return;

  const { ctx, roof } = windSimulation;
  ctx.clearRect(0, 0, WIND_CANVAS_WIDTH, WIND_CANVAS_HEIGHT);

  const sky = ctx.createLinearGradient(0, 0, 0, WIND_CANVAS_HEIGHT);
  sky.addColorStop(0, 'rgba(80, 130, 255, 0.12)');
  sky.addColorStop(1, 'rgba(80, 130, 255, 0.01)');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIND_CANVAS_WIDTH, WIND_CANVAS_HEIGHT);

  ctx.strokeStyle = 'rgba(162, 186, 216, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, roof.baseY + 1);
  ctx.lineTo(WIND_CANVAS_WIDTH, roof.baseY + 1);
  ctx.stroke();

  ctx.fillStyle = 'rgba(70, 90, 112, 0.18)';
  ctx.fillRect(0, roof.baseY + 2, WIND_CANVAS_WIDTH, WIND_CANVAS_HEIGHT - roof.baseY);

  drawZones();
  drawHouse();
  drawVortex();
  drawParticles();
}

function animateRoofZones() {
  if (!zoneVisualization) return;

  zoneVisualization.fade += (zoneVisualization.targetFade - zoneVisualization.fade) * 0.14;
  if (Math.abs(zoneVisualization.targetFade - zoneVisualization.fade) < 0.01) {
    zoneVisualization.fade = zoneVisualization.targetFade;
  }

  drawRoofZones();

  if (zoneVisualization.fade !== zoneVisualization.targetFade) {
    zoneVisualization.animationFrame = requestAnimationFrame(animateRoofZones);
    return;
  }

  zoneVisualization.animationFrame = 0;
}

function getRoofZoneGeometry(data) {
  const marginX = 72;
  const top = 64;
  const roofWidth = ZONE_CANVAS_WIDTH - marginX * 2;
  const roofHeight = 220;
  const left = marginX;
  const zoneLengthPx = Math.max(70, (data.zoneLength / Math.max(data.b, 1)) * roofWidth);
  const zoneWidthPx = Math.max(24, (data.zoneWidth / Math.max(data.b, 1)) * roofHeight * 1.8);

  return {
    left,
    top,
    width: roofWidth,
    height: roofHeight,
    zoneLengthPx: Math.min(zoneLengthPx, roofWidth * 0.34),
    zoneWidthPx: Math.min(zoneWidthPx, roofHeight * 0.24),
    right: left + roofWidth,
    bottom: top + roofHeight
  };
}

function drawZoneBackground(ctx, roof) {
  const glow = ctx.createLinearGradient(0, 0, 0, ZONE_CANVAS_HEIGHT);
  glow.addColorStop(0, 'rgba(67, 118, 210, 0.08)');
  glow.addColorStop(1, 'rgba(17, 27, 45, 0.02)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, ZONE_CANVAS_WIDTH, ZONE_CANVAS_HEIGHT);

  ctx.fillStyle = 'rgba(23, 33, 50, 0.07)';
  ctx.fillRect(roof.left, roof.top, roof.width, roof.height);
}

function drawZoneGrid(ctx, roof) {
  ctx.save();
  ctx.strokeStyle = 'rgba(141, 166, 203, 0.22)';
  ctx.lineWidth = 1;

  for (let x = roof.left; x <= roof.right; x += roof.width / 10) {
    ctx.beginPath();
    ctx.moveTo(x, roof.top);
    ctx.lineTo(x, roof.bottom);
    ctx.stroke();
  }

  for (let y = roof.top; y <= roof.bottom; y += roof.height / 6) {
    ctx.beginPath();
    ctx.moveTo(roof.left, y);
    ctx.lineTo(roof.right, y);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(32, 44, 65, 0.65)';
  ctx.lineWidth = 2;
  ctx.strokeRect(roof.left, roof.top, roof.width, roof.height);
  ctx.restore();
}

function drawZoneAreas(ctx, roof, labels, fade) {
  const alpha = 0.28 + fade * 0.55;
  const x1 = roof.left + roof.zoneLengthPx;
  const x2 = roof.right - roof.zoneLengthPx;
  const y1 = roof.top + roof.zoneWidthPx;
  const y2 = roof.bottom - roof.zoneWidthPx;

  fillZoneRect(ctx, roof.left, roof.top, roof.zoneLengthPx, roof.zoneWidthPx, `rgba(255, 84, 84, ${alpha})`);
  fillZoneRect(ctx, roof.right - roof.zoneLengthPx, roof.top, roof.zoneLengthPx, roof.zoneWidthPx, `rgba(255, 84, 84, ${alpha})`);
  fillZoneRect(ctx, roof.left, roof.bottom - roof.zoneWidthPx, roof.zoneLengthPx, roof.zoneWidthPx, `rgba(255, 84, 84, ${alpha})`);
  fillZoneRect(ctx, roof.right - roof.zoneLengthPx, roof.bottom - roof.zoneWidthPx, roof.zoneLengthPx, roof.zoneWidthPx, `rgba(255, 84, 84, ${alpha})`);

  fillZoneRect(ctx, x1, roof.top, x2 - x1, roof.zoneWidthPx, `rgba(255, 165, 64, ${alpha * 0.92})`);
  fillZoneRect(ctx, x1, roof.bottom - roof.zoneWidthPx, x2 - x1, roof.zoneWidthPx, `rgba(255, 165, 64, ${alpha * 0.92})`);
  fillZoneRect(ctx, roof.left, y1, roof.zoneLengthPx, y2 - y1, `rgba(255, 165, 64, ${alpha * 0.92})`);
  fillZoneRect(ctx, roof.right - roof.zoneLengthPx, y1, roof.zoneLengthPx, y2 - y1, `rgba(255, 165, 64, ${alpha * 0.92})`);

  const centerColor = labels.center === 'J' ? `rgba(126, 217, 120, ${alpha * 0.74})` : `rgba(105, 196, 255, ${alpha * 0.78})`;
  fillZoneRect(ctx, x1, y1, x2 - x1, y2 - y1, centerColor);

  drawZoneLabel(ctx, labels.corner, roof.left + roof.zoneLengthPx / 2, roof.top + roof.zoneWidthPx / 2, fade);
  drawZoneLabel(ctx, labels.corner, roof.right - roof.zoneLengthPx / 2, roof.top + roof.zoneWidthPx / 2, fade);
  drawZoneLabel(ctx, labels.corner, roof.left + roof.zoneLengthPx / 2, roof.bottom - roof.zoneWidthPx / 2, fade);
  drawZoneLabel(ctx, labels.corner, roof.right - roof.zoneLengthPx / 2, roof.bottom - roof.zoneWidthPx / 2, fade);
  drawZoneLabel(ctx, labels.edge, roof.left + roof.zoneLengthPx / 2, roof.top + roof.height / 2, fade);
  drawZoneLabel(ctx, labels.edge, roof.right - roof.zoneLengthPx / 2, roof.top + roof.height / 2, fade);
  drawZoneLabel(ctx, labels.edge, roof.left + roof.width / 2, roof.top + roof.zoneWidthPx / 2, fade);
  drawZoneLabel(ctx, labels.edge, roof.left + roof.width / 2, roof.bottom - roof.zoneWidthPx / 2, fade);
  drawZoneLabel(ctx, labels.center, roof.left + roof.width / 2, roof.top + roof.height / 2, fade);
}

function drawZoneDimensions(ctx, roof, data) {
  ctx.save();
  ctx.strokeStyle = 'rgba(44, 58, 80, 0.82)';
  ctx.fillStyle = 'rgba(28, 38, 56, 0.9)';
  ctx.lineWidth = 1.4;
  ctx.font = '600 14px "Avenir Next", "Segoe UI", sans-serif';

  const horizontalY = roof.bottom + 36;
  drawDimensionLine(ctx, roof.left, horizontalY, roof.right, horizontalY, `Gebaeudelaenge b = ${formatNumber(data.b)} m`);
  drawDimensionLine(ctx, roof.left, roof.top - 24, roof.left + roof.zoneLengthPx, roof.top - 24, `Randbereich Laenge = ${formatNumber(data.zoneLength)} m`);
  drawVerticalDimension(ctx, roof.left - 26, roof.top, roof.top + roof.zoneWidthPx, `Randbereich Breite = ${formatNumber(data.zoneWidth)} m`);
  ctx.restore();
}

function drawZoneLegend(ctx, roof, labels, fade) {
  const alpha = 0.4 + fade * 0.6;
  const legendX = roof.left;
  const legendY = roof.bottom + 74;
  const items = [
    { color: 'rgba(105, 196, 255, 0.85)', label: labels.center === 'J' ? 'J / Flaeche' : 'H / Flaeche' },
    { color: 'rgba(255, 165, 64, 0.88)', label: `${labels.edge} / Randbereich` },
    { color: 'rgba(255, 84, 84, 0.9)', label: `${labels.corner} / Eckbereich` }
  ];

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = '600 14px "Avenir Next", "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(30, 42, 61, 0.92)';

  items.forEach((item, index) => {
    const y = legendY + index * 26;
    ctx.fillStyle = item.color;
    ctx.fillRect(legendX, y - 12, 18, 18);
    ctx.fillStyle = 'rgba(30, 42, 61, 0.92)';
    ctx.fillText(item.label, legendX + 28, y + 2);
  });

  ctx.restore();
}

function fillZoneRect(ctx, x, y, width, height, color) {
  const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.06)');
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);
}

function drawZoneLabel(ctx, text, x, y, fade) {
  ctx.save();
  ctx.globalAlpha = 0.5 + fade * 0.5;
  ctx.font = '700 24px "SF Pro Display", "Avenir Next", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.shadowBlur = 12;
  ctx.shadowColor = 'rgba(22, 30, 46, 0.28)';
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawDimensionLine(ctx, x1, y, x2, y2, text) {
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x1, y - 8);
  ctx.lineTo(x1, y + 8);
  ctx.moveTo(x2, y2 - 8);
  ctx.lineTo(x2, y2 + 8);
  ctx.stroke();
  ctx.fillText(text, (x1 + x2) / 2 - 68, y - 10);
}

function drawVerticalDimension(ctx, x, y1, y2, text) {
  ctx.beginPath();
  ctx.moveTo(x, y1);
  ctx.lineTo(x, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 8, y1);
  ctx.lineTo(x + 8, y1);
  ctx.moveTo(x - 8, y2);
  ctx.lineTo(x + 8, y2);
  ctx.stroke();
  ctx.save();
  ctx.translate(x - 16, (y1 + y2) / 2 + 44);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function readRoofZoneInputs() {
  const h = Number(document.getElementById('zone-height')?.value ?? 12);
  const b = Number(document.getElementById('zone-length')?.value ?? 20);
  const pitch = Number(document.getElementById('zone-pitch')?.value ?? 15);
  const e = Math.min(2 * h, b);

  return {
    h,
    b,
    pitch,
    e,
    zoneLength: e / 4,
    zoneWidth: e / 10,
    labels: {
      corner: 'F',
      edge: pitch > 30 ? 'F' : 'G',
      center: pitch > 30 ? 'H' : 'J'
    }
  };
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

function teardownZoneVisualization() {
  if (!zoneVisualization) return;
  if (zoneVisualization.animationFrame) cancelAnimationFrame(zoneVisualization.animationFrame);
  zoneVisualization = null;
}
