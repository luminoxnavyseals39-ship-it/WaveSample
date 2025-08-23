let numSources = 5;
let sources = [];
let phases = [];
let draggingIndex = -1;
let waveFrequency = 0.05;
let t = 0;
let canvas;

function setup() {
  const guiHeight = document.getElementById('controls').offsetHeight;
  canvas = createCanvas(windowWidth * 0.5, (windowHeight - guiHeight)*0.5);
  canvas.position(0, guiHeight);
  canvas.style('z-index', '-1');
  noStroke();

  setupGUI();
  initializeSources();
}

function draw() {
  background(255);

  waveFrequency = parseFloat(document.getElementById('waveFrequency').value);
  numSources = parseInt(document.getElementById('numSources').value);

  if (sources.length !== numSources) {
    initializeSources();
  }

  for (let i = 0; i < numSources; i++) {
    let phaseDeg = parseFloat(document.getElementById('phase' + i).value);
    phases[i] = radians(phaseDeg);
  }

  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let p = createVector(x, y);
      let combined = 0;

      for (let i = 0; i < numSources; i++) {
        let d = p5.Vector.dist(p, sources[i]);
        combined += sin(d * waveFrequency - t + phases[i]);
      }

      let r = map(abs(combined), 0, numSources, 0, 255);
      let b = map(combined, -numSources, numSources, 0, 255);
      let index = (x + y * width) * 4;
      pixels[index] = r;
      pixels[index + 1] = 0;
      pixels[index + 2] = b;
      pixels[index + 3] = 255;
    }
  }
  updatePixels();

  fill(255, 0, 0);
  for (let i = 0; i < numSources; i++) {
    let s = sources[i];
    ellipse(s.x, s.y, 20, 20);
    fill(255);
    text("Source " + (i + 1), s.x - 20, s.y - 15);
    fill(255, 0, 0);
  }

  t += 0.05;
  frameRate(15);
}

function mousePressed() {
  for (let i = 0; i < sources.length; i++) {
    let d = dist(mouseX, mouseY, sources[i].x, sources[i].y);
    if (d < 20) {
      draggingIndex = i;
      break;
    }
  }
}

function mouseDragged() {
  if (draggingIndex !== -1) {
    sources[draggingIndex].set(mouseX, mouseY);
  }
}

function mouseReleased() {
  draggingIndex = -1;
}

function setupGUI() {
  const numSlider = document.getElementById('numSources');
  numSlider.addEventListener('input', initializeSources);

  const phaseContainer = document.getElementById('phaseSliders');
  phaseContainer.innerHTML = '';
  for (let i = 0; i < numSources; i++) {
    const label = document.createElement('label');
    label.innerText = 'Phase ' + (i + 1);
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 360;
    slider.value = 180 * i / numSources;
    slider.id = 'phase' + i;
    slider.style.width = '100px';
    phaseContainer.appendChild(label);
    phaseContainer.appendChild(slider);
  }
}

function initializeSources() {
  sources = [];
  phases = [];

  const phaseContainer = document.getElementById('phaseSliders');
  phaseContainer.innerHTML = '';
  for (let i = 0; i < numSources; i++) {
    let margin = 100;
    let y = map(i, 0, max(1, numSources - 1), margin, height - margin);
    sources.push(createVector(50, y));
    phases.push(PI * i / numSources);

    const label = document.createElement('label');
    label.innerText = 'Phase ' + (i + 1);
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 360;
    slider.value = degrees(phases[i]);
    slider.id = 'phase' + i;
    slider.style.width = '100px';
    phaseContainer.appendChild(label);
    phaseContainer.appendChild(slider);
  }
}

function windowResized() {
  const guiHeight = document.getElementById('controls').offsetHeight;
  resizeCanvas(windowWidth, windowHeight - guiHeight);
  canvas.position(0, guiHeight);
  initializeSources();
}
