/**
 * DEMO
 */
import {
  Button,
  Knob,
  Label,
  Led,
  Scope,
  Switch,
  WaveForm
} from "svg-audio-controls/src/index";

import "./sass/index.scss";

import { SVG } from "@svgdotjs/svg.js";

// SVG app
const App = SVG()
  .addTo(document.querySelector(".container"))
  .size("100%", "100%");

const led1 = new Led(App, {
  offsetLeft: 244,
  offsetTop: 130,
  radius: 20,
  strokeWidth: 2
});

led1.append();
led1.onValueChange = ({ detail }) =>
  console.log("LED 1 value changed: ", detail.value, led1);

const b1 = new Button(App, {
  backgroundColor: "#ccc",
  fillColor: "#fff",
  activeColor: "#0c0",
  offsetLeft: 300,
  offsetTop: 250,
  padding: 20,
  radius: 100,
  strokeColor: "#111",
  strokeWidth: 10
});
b1.append();
b1.onValueChange = ({ detail }) => {
  console.log("B1 value changed: ", detail.value);
};

// console.log("B1", b1);
const colors = ["#ff0", "#f70", "#f00", "#0c0", "#00f"];
let idx = 0;
const b2 = new Button(App, {
  offsetLeft: 440,
  offsetTop: 290,
  temporary: true
});
b2.append();
b2.onValueChange = ({ detail }) => {
  console.log("B2 value changed: ", detail.value);

  if (idx === colors.length - 1) {
    idx = 0;
  } else {
    idx += 1;
  }

  led1.highlightColor = colors[idx];
};
// console.log("B2", b2);

const lbl1 = new Label(App, {
  defaultText: "0.00",
  fontColor: "#f70",
  fontFamily: "Roboto",
  fontSize: 22,
  offsetLeft: 320,
  offsetTop: 60
});

lbl1.append();

// console.log("LBL1", lbl1);

const k1 = new Knob(App, {
  backgroundColor: "#ccc",
  fillColor: "#fff",
  needleColor: "#f00",
  offsetLeft: 300,
  offsetTop: 100,
  padding: 20,
  radius: 100,
  strokeColor: "#111",
  strokeWidth: 10
});

k1.append();
k1.onValueChange = ({ detail } = {}) => {
  // console.log("K1 > value changed: ", detail.value);
  lbl1.value = detail.value.toFixed(2);
};

// console.log("KNOB 1: ", k1);

const k2 = new Knob(App, {
  fillColor: "#eee",
  offsetLeft: 440,
  offsetTop: 150,
  strokeColor: "#fc0"
});

k2.append();
k2.onValueChange = ({ detail } = {}) =>
  console.log("K2 > value changed: ", detail.value);

const sw1 = new Switch(App, {
  backgroundColor: "#ff0",
  isHorizontal: true,
  offsetLeft: 120,
  offsetTop: 80,
  padding: 5,
  size: 36,
  steps: 3,
  strokeColor: "#f00",
  switchColor: "blue"
});

sw1.append();
sw1.onValueChange = ({ detail } = {}) =>
  console.log("SW1 value changed: ", detail.value);

// console.log("SWITCH 1: ", sw1);

const sw2 = new Switch(App, {
  offsetLeft: 250,
  offsetTop: 80
});
sw2.append();
sw2.onValueChange = ({ detail } = {}) => {
  led1.toggle();
  console.log("SW2 value changed: ", detail.value);
};

// SCOPE
const AudioContext = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioContext();

const osc = ctx.createOscillator();
osc.type = "sine";
osc.frequency.setValueAtTime(440, ctx.currentTime);
osc.start();

// change osc value
k1.onValueChange = ({ detail }) => {
  osc.frequency.setValueAtTime((detail.value / 360) * 1000, ctx.currentTime);
  console.log("OSC FREQUENCY: ", osc.frequency.value);
};

// console.log("OSC >>", osc);

const analyser = ctx.createAnalyser();
analyser.fftSize = 1024;
const bufferLength = analyser.frequencyBinCount;
let dataArray = new Uint8Array(bufferLength);
const interval = (1 / 44100) * 512 * 1000;
osc.connect(analyser);

// console.log("BUFFER LENGTH", bufferLength);

const sc = new Scope(App, {
  backgroundColor: "#ddd",
  divisions: 6,
  gridColor: "#f70",
  offsetLeft: 550,
  offsetTop: 290,
  signalColor: "#BC6C1C",
  signalWidth: 4,
  width: 400
});
sc.append();

// console.log("SCOPE >>>", sc);

setInterval(() => {
  analyser.getByteTimeDomainData(dataArray);
  let points = [];
  for (let i = 0; i < 512; i++) {
    points[i] = [i, dataArray[i]];
  }
  sc.draw(points);
}, Math.pow(interval, 2));

// WAVEFORM
// const url = "/sounds/500419__dj-somar__intro-microbrute-3.wav";
const url = "/sounds/499763__phonosupf__shakuhachi-attack-9.wav";
const WaveDisplay = new WaveForm(App, {
  backgroundColor: "#111",
  hasShadow: true,
  height: 250,
  offsetLeft: 550,
  offsetTop: 20,
  shadowColor: "#f00",
  shadowOpacity: 0.2,
  waveFormColor: "#f70",
  width: 700
});

WaveDisplay.append();

// console.log("DISPLAY", WaveDisplay);

const displayWaveForm = async (url, display) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioContext();

  try {
    const ajax = await fetch(url);
    const buffer = await ajax.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(buffer);
    const audioData = audioBuffer.getChannelData(0);

    display.audioData = audioData;
    // console.log("AUDIO DATA >>>", display.audioData);
  } catch (e) {
    console.error("ERROR", e.message);
  }
};

displayWaveForm(url, WaveDisplay);
