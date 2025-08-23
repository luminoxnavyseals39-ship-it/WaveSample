let t = 0;
let numSources = 5;
let sources = [];
let phases = [];
let phaseSliders = [];

function setup() {
  //createCanvas(800, 400);
  createCanvas(windowWidth/2, windowHeight/2);
  noStroke();
  initializeSources();

  // 波源数スライダー
  const numSlider = document.getElementById("numSlider");
  const numLabel = document.getElementById("numLabel");
  numSlider.addEventListener("input", () => {
    numSources = int(numSlider.value);
    numLabel.textContent = numSources;
    initializeSources();
  });
}

function draw() {
  background(255);
  loadPixels();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let combined = 0;
      let p = createVector(x, y);

      for (let i = 0; i < numSources; i++) {
        let d = p.dist(sources[i]);
        let phaseDeg = float(phaseSliders[i].value);
        let phaseRad = radians(phaseDeg);
        combined += sin(d * 0.05 - t + phaseRad);
      }

      let r = int(map(abs(combined), 0, numSources, 0, 255));
      let b = int(map(combined, -numSources, numSources, 0, 255));
      let index = (x + y * width) * 4;
      pixels[index] = r;
      pixels[index + 1] = 0;
      pixels[index + 2] = b;
      pixels[index + 3] = 255;
    }
  }
  updatePixels();

  // 波源の描画
  fill(0, 100, 255);
  for (let i = 0; i < numSources; i++) {
    let s = sources[i];
    ellipse(s.x, s.y, 20, 20);
    fill(0);
    text(`Source ${i + 1}`, s.x - 20, s.y - 15);
    fill(0, 100, 255);
  }

  t += 0.05;
  frameRate(15);
}

function initializeSources() {
  sources = [];
  phases = [];
  phaseSliders = [];

  const phaseControls = document.getElementById("phaseControls");
  phaseControls.innerHTML = "";

  for (let i = 0; i < numSources; i++) {
    let y = map(i, 0, max(1, numSources - 1), 100, height - 100);
    sources.push(createVector(50, y));
    let defaultPhase = 180.0 * i / numSources;
    phases.push(defaultPhase);

    let label = document.createElement("label");
    label.textContent = `位相(deg) ${i + 1}: `;
    let slider = document.createElement("input");
    slider.type = "range";
    slider.min = "0";
    slider.max = "360";
    slider.value = defaultPhase;
    slider.style.marginBottom = "5px";

    phaseControls.appendChild(label);
    phaseControls.appendChild(slider);
    phaseControls.appendChild(document.createElement("br"));

    phaseSliders.push(slider);
  }
}
