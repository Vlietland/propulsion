
import * as ex from 'excalibur';
import planck from 'planck-js';

const pl = planck;
const SCALE = 50;

class PhysicsActor extends ex.Actor {
  private body: planck.Body;

  constructor(body: planck.Body, sprite: ex.Sprite) {
    super();
    this.body = body;
    this.graphics.use(sprite);
  }

  onPreUpdate() {
    // Synchronize Excalibur actor with Planck.js body
    const pos = this.body.getPosition();
    this.pos.x = pos.x * SCALE;
    this.pos.y = pos.y * SCALE;
    this.rotation = this.body.getAngle();
  }
}

const engine = new ex.Engine();
const world = new pl.World(pl.Vec2(0, 0));

// Create a Planck.js body
const body = world.createBody({ type: 'dynamic', position: pl.Vec2(5, 5) });
body.createFixture(pl.Box(1, 1), { density: 1 });

// Create an Excalibur sprite
const sprite = new ex.Sprite({ image: new ex.ImageSource('/images/box.png') });

// Create a PhysicsActor
const actor = new PhysicsActor(body, sprite);
engine.add(actor);

// Game loop
engine.on('postupdate', () => {
  world.step(1 / 60); // Step Planck.js physics
});

engine.start();