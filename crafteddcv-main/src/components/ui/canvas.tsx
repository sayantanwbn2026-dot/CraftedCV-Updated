// Canvas animation for hero section
// @ts-nocheck

function Oscillator(e) {
  this.init(e || {});
}

Oscillator.prototype = {
  init: function (e) {
    this.phase = e.phase || 0;
    this.offset = e.offset || 0;
    this.frequency = e.frequency || 0.001;
    this.amplitude = e.amplitude || 1;
  },
  update: function () {
    this.phase += this.frequency;
    return this.offset + Math.sin(this.phase) * this.amplitude;
  },
};

function Line(e, config, pos) {
  this.init(e || {}, config, pos);
}

Line.prototype = {
  init: function (e, config, pos) {
    this.spring = e.spring + 0.1 * Math.random() - 0.05;
    this.friction = config.friction + 0.01 * Math.random() - 0.005;
    this.nodes = [];
    for (let n = 0; n < config.size; n++) {
      const t = { x: pos.x, y: pos.y, vx: 0, vy: 0 };
      this.nodes.push(t);
    }
  },
  update: function (config, pos) {
    let e = this.spring;
    let t = this.nodes[0];
    t.vx += (pos.x - t.x) * e;
    t.vy += (pos.y - t.y) * e;
    for (let i = 0; i < this.nodes.length; i++) {
      t = this.nodes[i];
      if (i > 0) {
        const n = this.nodes[i - 1];
        t.vx += (n.x - t.x) * e;
        t.vy += (n.y - t.y) * e;
        t.vx += n.vx * config.dampening;
        t.vy += n.vy * config.dampening;
      }
      t.vx *= this.friction;
      t.vy *= this.friction;
      t.x += t.vx;
      t.y += t.vy;
      e *= config.tension;
    }
  },
  draw: function (ctx) {
    let n = this.nodes[0].x;
    let i = this.nodes[0].y;
    ctx.beginPath();
    ctx.moveTo(n, i);
    for (let a = 1; a < this.nodes.length - 2; a++) {
      const e = this.nodes[a];
      const t = this.nodes[a + 1];
      n = 0.5 * (e.x + t.x);
      i = 0.5 * (e.y + t.y);
      ctx.quadraticCurveTo(e.x, e.y, n, i);
    }
    const e = this.nodes[this.nodes.length - 2];
    const t = this.nodes[this.nodes.length - 1];
    ctx.quadraticCurveTo(e.x, e.y, t.x, t.y);
    ctx.stroke();
    ctx.closePath();
  },
};

export const renderCanvas = function (canvasId: string = "canvas") {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const config = {
    friction: 0.5,
    trails: 80,
    size: 50,
    dampening: 0.025,
    tension: 0.99,
  };

  const pos = { x: 0, y: 0 };
  let lines: Line[] = [];
  let running = true;
  let animationId: number;

  const oscillator = new Oscillator({
    phase: Math.random() * 2 * Math.PI,
    amplitude: 85,
    frequency: 0.0015,
    offset: 285,
  });

  function resizeCanvas() {
    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
  }

  function initLines() {
    lines = [];
    for (let e = 0; e < config.trails; e++) {
      lines.push(new Line({ spring: 0.45 + (e / config.trails) * 0.025 }, config, pos));
    }
  }

  function handleMove(e: MouseEvent | TouchEvent) {
    if ('touches' in e) {
      pos.x = e.touches[0].clientX;
      pos.y = e.touches[0].clientY;
    } else {
      const rect = canvas.getBoundingClientRect();
      pos.x = e.clientX - rect.left;
      pos.y = e.clientY - rect.top;
    }
  }

  function render() {
    if (!running) return;

    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = `hsla(${Math.round(oscillator.update())}, 100%, 50%, 0.025)`;
    ctx.lineWidth = 10;

    for (const line of lines) {
      line.update(config, pos);
      line.draw(ctx);
    }

    animationId = window.requestAnimationFrame(render);
  }

  function start(e: MouseEvent | TouchEvent) {
    handleMove(e);
    initLines();
    render();
  }

  // Event listeners
  canvas.addEventListener("mousemove", handleMove);
  canvas.addEventListener("touchmove", handleMove);
  canvas.addEventListener("mouseenter", start);
  canvas.addEventListener("touchstart", start);
  window.addEventListener("resize", resizeCanvas);

  // Initial setup
  resizeCanvas();
  pos.x = canvas.width / 2;
  pos.y = canvas.height / 2;
  initLines();
  render();

  // Return cleanup function
  return () => {
    running = false;
    if (animationId) {
      window.cancelAnimationFrame(animationId);
    }
    canvas.removeEventListener("mousemove", handleMove);
    canvas.removeEventListener("touchmove", handleMove);
    canvas.removeEventListener("mouseenter", start);
    canvas.removeEventListener("touchstart", start);
    window.removeEventListener("resize", resizeCanvas);
  };
};
