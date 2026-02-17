const book = document.getElementById("book");
const coverBtn = document.getElementById("coverBtn");

const canvas = document.getElementById("pad");
const ctx = canvas.getContext("2d");

const penBtn = document.getElementById("penBtn");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");

let drawing = false;
let mode = "pen"; // "pen" | "eraser"

// open/close
coverBtn.addEventListener("click", () => {
  book.classList.toggle("is-open");
});

// canvas helpers: map pointer coords to canvas coords
function getPos(e){
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);
  return {x,y};
}

function start(e){
  drawing = true;
  const {x,y} = getPos(e);
  ctx.beginPath();
  ctx.moveTo(x,y);
}

function move(e){
  if(!drawing) return;
  const {x,y} = getPos(e);

  if(mode === "pen"){
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "rgba(0,0,0,.85)";
    ctx.lineWidth = 2.2;
  }else{
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 18;
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.lineTo(x,y);
  ctx.stroke();
}

function end(){
  drawing = false;
  ctx.closePath();
}

// pointer events
canvas.addEventListener("pointerdown", (e) => {
  canvas.setPointerCapture(e.pointerId);
  start(e);
});
canvas.addEventListener("pointermove", move);
canvas.addEventListener("pointerup", end);
canvas.addEventListener("pointercancel", end);

// tools
penBtn.addEventListener("click", () => mode = "pen");
eraserBtn.addEventListener("click", () => mode = "eraser");
clearBtn.addEventListener("click", () => {
  ctx.clearRect(0,0,canvas.width,canvas.height);
});

// make drawing crisp on resize (optional simple approach)
function fitCanvasToDevicePixelRatio(){
  const ratio = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  const cssW = canvas.clientWidth;
  const cssH = canvas.clientHeight;
  canvas.width = Math.floor(cssW * ratio);
  canvas.height = Math.floor(cssH * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}
window.addEventListener("resize", () => {
  // NOTE: this clears the canvas on resize. If you want to preserve, tell me and I’ll add snapshot restore.
  fitCanvasToDevicePixelRatio();
});
fitCanvasToDevicePixelRatio();
