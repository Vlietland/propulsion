import planck from 'planck-js';
import * as ex from 'excalibur';
import { InputService } from '@src/game/controller/keyboard';
import { Ship } from '@src/game/model/ship';
import { WORLD_TO_SCREEN_SCALE } from '@src/game/rendering/integration';

const pl = planck;
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.createElement('canvas');
  canvas.id = 'gameCanvas';
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get 2D rendering context from canvas.');
    return;
  }
  const world = new pl.World(pl.Vec2(0, 0));
  const engine = new ex.Engine({ canvasElement: canvas, width: canvas.width, height: canvas.height });
  const inputService = new InputService(engine);
  const spaceship = new Ship(world, canvas.width / (2 * WORLD_TO_SCREEN_SCALE), canvas.height / (2 * WORLD_TO_SCREEN_SCALE), inputService);
  const asteroid = world.createBody({ type: 'dynamic', position: pl.Vec2(6, 0) });
  asteroid.createFixture(pl.Circle(1), { density: 1 });
  const beam = world.createBody({ type: 'dynamic', position: pl.Vec2(3, 0) });
  beam.createFixture(pl.Box(3, 0.1), { density: 0.1 });
  const wall = world.createBody({ type: 'static', position: pl.Vec2(10, 0) });
  wall.createFixture(pl.Box(1, 5), { density: 0 }).setUserData('wall');
  world.createJoint(pl.RevoluteJoint({ bodyA: spaceship.physicsBody, bodyB: beam, localAnchorA: pl.Vec2(0, 0), localAnchorB: pl.Vec2(-3, 0) }));
  world.createJoint(pl.RevoluteJoint({ bodyA: asteroid, bodyB: beam, localAnchorA: pl.Vec2(0, 0), localAnchorB: pl.Vec2(3, 0) }));

  function renderBody(body: planck.Body, cameraOffset: { x: number; y: number }) {
    if (!ctx) return;
    for (let fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
      const shape = fixture.getShape();
      const pos = body.getPosition();
      const angle = body.getAngle();
      ctx.save();
      ctx.translate((pos.x * WORLD_TO_SCREEN_SCALE) - cameraOffset.x, (pos.y * WORLD_TO_SCREEN_SCALE) - cameraOffset.y);
      ctx.rotate(angle);
      if (shape.getType() === 'circle') {
        const circle = shape as ReturnType<typeof pl.Circle>;
        ctx.beginPath();
        ctx.arc(0, 0, circle.getRadius() * WORLD_TO_SCREEN_SCALE, 0, 2 * Math.PI);
        ctx.fillStyle = 'gray';
        ctx.fill();
      } else if (shape.getType() === 'polygon') {
        const poly = shape as ReturnType<typeof pl.Polygon>;
        const verts = poly.m_vertices;
        ctx.beginPath();
        ctx.moveTo(verts[0].x * WORLD_TO_SCREEN_SCALE, verts[0].y * WORLD_TO_SCREEN_SCALE);
        for (let i = 1; i < verts.length; i++) ctx.lineTo(verts[i].x * WORLD_TO_SCREEN_SCALE, verts[i].y * WORLD_TO_SCREEN_SCALE);
        ctx.closePath();
        ctx.fillStyle = 'blue';
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function update() {
    if (!ctx || !canvas) return;
    world.step(1 / 60);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const spaceshipPos = spaceship.physicsBody.getPosition();
    const cameraOffset = { x: spaceshipPos.x * WORLD_TO_SCREEN_SCALE - canvas.width / 2, y: spaceshipPos.y * WORLD_TO_SCREEN_SCALE - canvas.height / 2 };
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderBody(wall, cameraOffset);
    renderBody(beam, cameraOffset);
    renderBody(asteroid, cameraOffset);
    requestAnimationFrame(update);
  }

  const loader = new ex.Loader([Ship.SHIP_IMAGE]);
  engine.add(spaceship);
  engine.start(loader).then(() => update());
});
