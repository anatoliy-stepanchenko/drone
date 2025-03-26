const canvas = document.getElementById("flightCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");

canvas.width = 600;
canvas.height = 600;
let dronePath = [];
let animationFrame;
let running = false;
let maxSpeed = 0;
let flightTrail = [];
let droneX = canvas.width / 2;
let droneY = canvas.height / 2;
let droneDirection = 0;

const droneImage = new Image();
droneImage.src = "plane.png";

droneImage.onload = () => {
  drawDrone(droneX, droneY, droneDirection);
};

async function loadFlightData() {
  try {
    const response = await fetch("https://drone-data-46yx.onrender.com/items");
    if (!response.ok) throw new Error("Помилка завантаження даних");

    const data = await response.json();
    if (!data.length) throw new Error("Дані порожні");

    let startTime = data[0].timestamp;
    maxSpeed = Math.max(...data.map((point) => parseFloat(point.speed)));

    dronePath = data.map((point) => ({
      time: point.timestamp - startTime,
      speed: parseFloat(point.speed),
      direction: parseFloat(point.direction),
    }));

    console.log("Дані завантажені", dronePath);
  } catch (error) {
    console.error("Помилка:", error.message);
  }
}

function calculateMovement(speed, direction) {
  const radians = (direction - 90) * (Math.PI / 180);
  const speedFactor = (speed / maxSpeed) * 6;

  return {
    dx: Math.cos(radians) * speedFactor,
    dy: Math.sin(radians) * speedFactor,
  };
}

function animateFlight() {
  let index = 0;
  droneX = canvas.width / 2;
  droneY = canvas.height / 2;
  flightTrail = [{ x: droneX, y: droneY }];

  function step() {
    if (index >= dronePath.length) {
      running = false;
      startButton.innerText = "Почати";
      return;
    }

    let { speed, direction } = dronePath[index];
    let { dx, dy } = calculateMovement(speed, direction);

    droneX += dx;
    droneY += dy;
    droneDirection = direction;
    flightTrail.push({ x: droneX, y: droneY });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPath();
    drawDrone(droneX, droneY, droneDirection);

    index++;

    if (running) {
      setTimeout(() => {
        animationFrame = requestAnimationFrame(step);
      }, 200);
    }
  }

  animationFrame = requestAnimationFrame(step);
}

function drawPath() {
  if (flightTrail.length < 2) return;

  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(flightTrail[0].x, flightTrail[0].y);

  for (let i = 1; i < flightTrail.length; i++) {
    ctx.lineTo(flightTrail[i].x, flightTrail[i].y);
  }

  ctx.stroke();
}

function drawDrone(x, y, direction) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((direction * Math.PI) / 180);
  ctx.drawImage(droneImage, -18, -18, 36, 36);
  ctx.restore();
}

startButton.addEventListener("click", () => {
  if (dronePath.length === 0) {
    alert("Дані ще не завантажені!");
    return;
  }

  if (running) {
    running = false;
    startButton.innerText = "Почати";
    cancelAnimationFrame(animationFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDrone(droneX, droneY, droneDirection);
  } else {
    running = true;
    startButton.innerText = "Стоп";
    animateFlight();
  }
});

loadFlightData();
