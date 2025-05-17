import * as ex from 'excalibur';
import planck from 'planck-js';

// Conversion factor between Planck.js world coordinates and Excalibur screen coordinates
export const WORLD_TO_SCREEN_SCALE = 50;

const pl = planck;

class PhysicsActor extends ex.Actor {
  private physicsBody: planck.Body; // Renamed to avoid conflict with Excalibur's body property

  constructor(physicsBody: planck.Body, sprite: ex.Sprite) {
    super();
    this.physicsBody = physicsBody;
    this.graphics.use(sprite);
  }

  onPreUpdate() {
    // Synchronize Excalibur actor with Planck.js body
    const pos = this.physicsBody.getPosition();
    this.pos.x = pos.x * WORLD_TO_SCREEN_SCALE; // Convert world coordinates to screen coordinates
    this.pos.y = pos.y * WORLD_TO_SCREEN_SCALE; // Convert world coordinates to screen coordinates
    this.rotation = this.physicsBody.getAngle();
  }

  getBody(): planck.Body {
    return this.physicsBody;
  }
}

const engine = new ex.Engine();
const world = new pl.World(pl.Vec2(0, 0));

// Create a Planck.js body
const physicsBody = world.createBody({ type: 'dynamic', position: pl.Vec2(5, 5) });
physicsBody.createFixture(pl.Box(1, 1), { density: 1 });

// Create an Excalibur sprite
const sprite = new ex.Sprite({ image: new ex.ImageSource('/images/box.png') });

// Create a PhysicsActor
const actor = new PhysicsActor(physicsBody, sprite);
engine.add(actor);

// Game loop
engine.on('postupdate', () => {
  world.step(1 / 60); // Step Planck.js physics
});

engine.start();