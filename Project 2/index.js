/* ======================================================
    GALAXY ANIMATED BACKGROUND
====================================================== */
const galaxy = document.getElementById("galaxy");
const gtx = galaxy.getContext("2d");
galaxy.width = innerWidth;
galaxy.height = innerHeight;

const stars = [];
for (let i = 0; i < 300; i++) {
    stars.push({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        z: Math.random() * 2 + 0.5,
        s: Math.random() * 2
    });
}

function drawGalaxy() {
    gtx.clearRect(0,0,innerWidth,innerHeight);
    stars.forEach(st => {
        st.x -= st.z;
        if (st.x < 0) st.x = innerWidth;
        gtx.fillStyle = "rgba(0,160,255,0.6)";
        gtx.fillRect(st.x, st.y, st.s, st.s);
    });
    requestAnimationFrame(drawGalaxy);
}
drawGalaxy();

/* ======================================================
    3D ORBIT SYSTEM
====================================================== */
const container = document.getElementById("container");

let numBalls = 5;
let baseRadius = 180;
let speedMult = 0.03;
let trailIntensity = 50;

const balls = [];
let angles = [];
let speeds = [];
let depths = [];

// create balls
function generateBalls() {
    container.innerHTML = "";
    balls.length = 0;
    angles.length = 0;
    speeds.length = 0;
    depths.length = 0;

    for (let i = 0; i < numBalls; i++) {
        const b = document.createElement("div");
        b.classList.add("ball");
        container.appendChild(b);
        balls.push(b);

        angles.push(Math.random() * Math.PI * 2);
        speeds.push(0.01 + Math.random() * 0.02);
        depths.push(Math.random() * 200 - 100); // Z depth
    }
}
generateBalls();

/* ======================================================
    INTERACTIVE PHYSICS
====================================================== */
let mouseX = innerWidth / 2;
let mouseY = innerHeight / 2;
let mouseDown = false;

window.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

window.addEventListener("mousedown", () => {
    mouseDown = true;
});

window.addEventListener("mouseup", () => {
    mouseDown = false;
});

// click = explosion push
window.addEventListener("click", () => {
    depths = depths.map(z => z + (Math.random() * 300 - 150));
});

/* ======================================================
    TRAIL
====================================================== */
function createTrail(x, y, color) {
    if (trailIntensity <= 0) return;

    const dot = document.createElement("div");
    dot.classList.add("trail");
    dot.style.left = x + "px";
    dot.style.top = y + "px";
    dot.style.background = color;
    dot.style.opacity = trailIntensity / 100;

    container.appendChild(dot);

    setTimeout(() => dot.style.opacity = 0, 50);
    setTimeout(() => dot.remove(), 700);
}

/* ======================================================
    ANIMATION LOOP
====================================================== */
function animate() {
    const rect = container.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    for (let i = 0; i < balls.length; i++) {
        angles[i] += speeds[i] * (speedMult * 3);

        // spiral + 3D depth wobble
        const radius = baseRadius + Math.sin(angles[i] * 3) * 30;
        depths[i] += Math.sin(angles[i] * 0.05);

        let x = cx + Math.cos(angles[i]) * radius;
        let y = cy + Math.sin(angles[i]) * radius;
        let z = depths[i];

        // interactive gravity pull
        if (mouseDown) {
            x += (mouseX - x) * 0.04;
            y += (mouseY - y) * 0.04;
        }

        // 3D perspective scaling
        const scale = 1 + z / 300;
        balls[i].style.transform = `translate3d(${x - 15}px, ${y - 15}px, ${z}px) scale(${scale})`;

        // color shift
        const hue = (angles[i] * 80) % 360;
        const color = `hsl(${hue}, 100%, 60%)`;
        balls[i].style.background = color;
        balls[i].style.boxShadow = `0 0 25px ${color}`;

        createTrail(x, y, color);
    }

    requestAnimationFrame(animate);
}
animate();

/* ======================================================
    CONTROL PANEL
====================================================== */
document.getElementById("speedControl").oninput = e => speedMult = e.target.value / 100;
document.getElementById("radiusControl").oninput = e => baseRadius = +e.target.value;
document.getElementById("countControl").oninput = e => { 
    numBalls = +e.target.value; 
    generateBalls();
};
document.getElementById("trailControl").oninput = e => trailIntensity = +e.target.value;