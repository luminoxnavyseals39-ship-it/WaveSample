let t = 0;
let numSources = 5;
let sources = [];
let phases = [];

function setup() {
  createCanvas(windowWidth*0.5, windowHeight * 0.5);
  noStroke();
  initializeSources();

  document.getElementById("numSources").addEventListener("input", (e) => {
    numSources = parseInt(e.target.value);
    document.getElementById("numLabel").textContent = numSources;
    initializeSources();
  });
}

function draw() {
  background(255);
  loadPixels();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let combined = 0;
      for (let i = 0; i < numSources; i++) {
        let d = dist(x, y, sources[i].x, sources[i].y);
        combined += sin(d * 0.05 - t + radians(phases[i]));
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

function initializeSources() {
  sources = [];
  phases = [];

  let phaseContainer = document.getElementById("phaseControls");
  phaseContainer.innerHTML = "";

  for (let i = 0; i < numSources; i++) {
    let margin = 100;
    let y = map(i, 0, Math.max(1, numSources - 1), margin, height - margin);
    sources.push(createVector(50, y));
    let defaultPhase = (180.0 * i) / numSources;
    phases.push(defaultPhase);

    let label = document.createElement("label");
    label.textContent = `Phase ${i + 1}: `;
    let slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "360";
    slider.value = defaultPhase;
    slider.oninput = (e) => {
      phases[i] = parseFloat(e.target.value);
    };

    phaseContainer.appendChild(label);
    phaseContainer.appendChild(slider);
    phaseContainer.appendChild(document.createElement("br"));
  }
}

function windowResized() {
  resizeCanvas(windowWidth * 0.5, windowHeight * 0.5);
  initializeSources(); // 再配置
}
