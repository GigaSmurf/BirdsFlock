const canvas = document.getElementById('boidsCanvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);

document.addEventListener('DOMContentLoaded', function () {

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;



    const boids = [];
    const numBoids = 100;
    const visualRange = 100;

    // Parameters for flocking behavior
    const separationDistance = 25;
    const maxVelocity = 3;
    const alignmentStrength = 0.05;
    const cohesionStrength = 0.005;
    const separationStrength = 0.05;

    function initBoids() {
        for (let i = 0; i < numBoids; i++) {
            boids.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1,
                angle: 0
            });
        }
    }

    function drawBoid(boid) {
        const angle = Math.atan2(boid.vy, boid.vx);
        ctx.save();
        ctx.translate(boid.x, boid.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(-10, -5);
        ctx.lineTo(0, 0);
        ctx.lineTo(-10, 5);
        ctx.closePath();
        ctx.fillStyle = '#0F0';
        ctx.fill();
        ctx.restore();
    }

    function distance(boid1, boid2) {
        return Math.hypot(boid1.x - boid2.x, boid1.y - boid2.y);
    }

    function limitVelocity(boid) {
        const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
        if (speed > maxVelocity) {
            boid.vx = (boid.vx / speed) * maxVelocity;
            boid.vy = (boid.vy / speed) * maxVelocity;
        }
    }

    function flock(boid) {
        let avgVx = 0;
        let avgVy = 0;
        let avgX = 0;
        let avgY = 0;
        let count = 0;
        for (let otherBoid of boids) {
            if (otherBoid != boid && distance(boid, otherBoid) < visualRange) {
                if (distance(boid, otherBoid) < separationDistance) {
                    boid.vx += (boid.x - otherBoid.x) * separationStrength;
                    boid.vy += (boid.y - otherBoid.y) * separationStrength;
                }
                avgVx += otherBoid.vx;
                avgVy += otherBoid.vy;
                avgX += otherBoid.x;
                avgY += otherBoid.y;
                count++;
            }
        }
        // checks other boids within visual range, moves this boid towards average
        if (count > 0) {
            avgVx /= count;
            avgVy /= count;
            avgX /= count;
            avgY /= count;

            boid.vx += (avgVx - boid.vx) * alignmentStrength + (avgX - boid.x) * cohesionStrength;
            boid.vy += (avgVy - boid.vy) * alignmentStrength + (avgY - boid.y) * cohesionStrength;
            limitVelocity(boid);
        }
    }

    function updateBoid(boid) {
        flock(boid);
        boid.x += boid.vx;
        boid.y += boid.vy;
        wrapAround(boid);
    }

    function wrapAround(boid) {
        if (boid.x < 0) boid.x = canvas.width;
        else if (boid.x > canvas.width) boid.x = 0;
        if (boid.y < 0) boid.y = canvas.height;
        else if (boid.y > canvas.height) boid.y = 0;
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        boids.forEach(boid => {
            updateBoid(boid);
            drawBoid(boid);
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
    });

    initBoids();
    animate();
});