import planck from 'planck-js';
import * as ex from 'excalibur'; // Import Excalibur
import { InputService } from '@src/game/input/inputService'; // Updated to use @src
import { Ship } from '@src/game/player/ship';

const pl = planck;
const SCALE = 50;

window.addEventListener('DOMContentLoaded', () => { // Use DOMContentLoaded instead of load
  // Dynamically create the canvas element
  const canvas = document.createElement('canvas');
  canvas.id = 'gameCanvas';
  document.body.appendChild(canvas);

  // Dynamically set canvas dimensions
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get 2D rendering context from canvas.');
    return;
  }

  const world = new pl.World(pl.Vec2(0, 0));

  // Initialize Excalibur engine
  const engine = new ex.Engine({
    canvasElement: canvas,
    width: canvas.width,
    height: canvas.height,
  });

  // Pass the engine to InputService
  const inputService = new InputService(engine);

  // Use the Ship class
  const spaceship = new Ship(world, 0, 0, inputService);

  const asteroid = world.createBody({ type: 'dynamic', position: pl.Vec2(6, 0) });
  asteroid.createFixture(pl.Circle(1), { density: 1 });

  const beam = world.createBody({ type: 'dynamic', position: pl.Vec2(3, 0) });
  beam.createFixture(pl.Box(3, 0.1), { density: 0.1 });

  const wall = world.createBody({ type: 'static', position: pl.Vec2(10, 0) });
  wall.createFixture(pl.Box(1, 5), { density: 0 }).setUserData('wall'); // Mark as wall

  world.createJoint(pl.RevoluteJoint({
    bodyA: spaceship.body,
    bodyB: beam,
    localAnchorA: pl.Vec2(0, 0),
    localAnchorB: pl.Vec2(-3, 0)
  }));

  world.createJoint(pl.RevoluteJoint({
    bodyA: asteroid,
    bodyB: beam,
    localAnchorA: pl.Vec2(0, 0),
    localAnchorB: pl.Vec2(3, 0)
  }));

  function renderBody(body: planck.Body, cameraOffset: { x: number; y: number }) {
    if (!ctx) return; // Ensure ctx is not null

    for (let fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
      const shape = fixture.getShape();
      const pos = body.getPosition();
      const angle = body.getAngle();

      ctx.save();
      ctx.translate((pos.x * SCALE) - cameraOffset.x, (pos.y * SCALE) - cameraOffset.y);
      ctx.rotate(angle);

      if (shape.getType() === 'circle') {
        const circle = shape as ReturnType<typeof pl.Circle>;
        ctx.beginPath();
        ctx.arc(0, 0, circle.getRadius() * SCALE, 0, 2 * Math.PI);
        ctx.fillStyle = 'gray';
        ctx.fill();
      } else if (shape.getType() === 'polygon') {
        const poly = shape as ReturnType<typeof pl.Polygon>;
        const verts = poly.m_vertices; // Use m_vertices instead of getVertices
        ctx.beginPath();
        ctx.moveTo(verts[0].x * SCALE, verts[0].y * SCALE);
        for (let i = 1; i < verts.length; i++) {
          ctx.lineTo(verts[i].x * SCALE, verts[i].y * SCALE);
        }
        ctx.closePath();
        ctx.fillStyle = 'blue';
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function update() {
    if ((!ctx) || (!canvas)) return; // Ensure ctx is not null

    world.step(1 / 60);

    // Handle input for thrust and rotation
    if (spaceship.inputService.isThrusting()) {
      const angle = spaceship.body.getAngle();
      const force = pl.Vec2(Math.cos(angle) * 10, Math.sin(angle) * 10);
      spaceship.body.applyForceToCenter(force);
    }
    if (spaceship.inputService.getRotationDirection() < 0) {
      spaceship.body.applyAngularImpulse(-0.1); // Rotate left
    } else if (spaceship.inputService.getRotationDirection() > 0) {
      spaceship.body.applyAngularImpulse(0.1); // Rotate right
    }

    // Calculate camera offset based on spaceship position
    const spaceshipPos = spaceship.body.getPosition();
    const cameraOffset = {
      x: spaceshipPos.x * SCALE - canvas.width / 2,
      y: spaceshipPos.y * SCALE - canvas.height / 2,
    };

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderBody(spaceship.body, cameraOffset);
    renderBody(wall, cameraOffset); // Render the wall
    renderBody(beam, cameraOffset);
    renderBody(asteroid, cameraOffset);
    requestAnimationFrame(update);
  }

  engine.start(); // Start the Excalibur engine
  update();
});
