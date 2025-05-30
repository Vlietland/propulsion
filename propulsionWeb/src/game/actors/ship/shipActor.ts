import { TiledObject } from '@excalibur-tiled/index'
import { ParticleEmitter, Camera, Actor, Vector, CollisionType, Engine, ImageSource, Color, Graphic, Circle, CollisionStartEvent } from 'excalibur'
import { Kinematics } from '@src/game/actors/ship/kinematics'
import { ShipController } from '@src/game/controller/shipController'
import { BallActor } from '@src/game/actors/ballActor'
import { Physics } from '@src/game/physics/physics'
import { TractorBeam } from '@src/game/actors/ship/tractorBeam'
import { CollisionPoints } from '@src/game/physics/collisionPoints'
import { BaseActor } from '@src/game/actors/baseActor';
import { BulletActor } from '@src/game/actors/bulletActor';

const SHIP = new ImageSource('/images/tiles/ship.png')
const SHIP_THRUST = new ImageSource('/images/tiles/shipThrust.png')
await SHIP.load()
await SHIP_THRUST.load()

const ROTATION_SPEED = 1
const THRUST_FORCE = 5000
const FUEL_FULL = 3300
const FUEL_CONSUMPTION = 10
const GUN_COOLDOWN = 100

export class ShipActor extends BaseActor {
    private physics?: Physics
    private camera?: Camera
    private kinematics?: Kinematics
    private shipController?: ShipController
    private ballActor?: BallActor
    private tractorBeam?: TractorBeam
    private fuelLevel = FUEL_FULL
    private shipMass = 100
    private lastShotTime: number = 0    
    private onShipDestroyedCallback?: () => void

    constructor(object: TiledObject, shipMass: number) {
        if (!object || object.x === undefined || object.y === undefined) return
        super(object, SHIP, CollisionType.Active)
        this.tractorBeam = new TractorBeam(this)
        this.pos = super.pos
        this.shipMass = shipMass
        this.rotation = (object.rotation ?? 0) - Math.PI / 2
    }

    onInitialize(engine: Engine): void {
        this.on('postcollision', (evt) => this.handleCollision(evt as CollisionStartEvent))
    }

    onPreUpdate(engine: Engine, delta: number) {
        if (!this.shipController || !this.physics || !this.kinematics) return
        const cycleTime = delta / 350
        let forceVector = new Vector(0, 0)

        if (this.shipController.isThrusting() && this.fuelLevel > 0) {
            forceVector = this.physics.force(this.rotation, THRUST_FORCE)            
            this.fuelLevel = this.fuelLevel - FUEL_CONSUMPTION
            this.graphics.use(SHIP_THRUST.toSprite())
        } else this.graphics.use(SHIP.toSprite())

        if (!this.isBallConnected()) {
            const displacement = this.kinematics.updateShipKinematics(forceVector, cycleTime)
            this.pos = this.pos.add(displacement)
        } else { //connected
            const {displacement, shipDelta, ballDelta} = this.kinematics.updateObjectKinematics(this.pos, forceVector, cycleTime) 
            this.pos = this.pos.add(displacement).add(shipDelta);
            this.ballActor?.addPos(displacement.clone().add(ballDelta));
        }

        const rotationDirection = this.shipController.getRotationDirection()
        this.rotation += rotationDirection * ROTATION_SPEED * cycleTime

        if (this.shipController.isUsingTractorBeam()) {
            this.tractorBeam?.attractObjects(this.pos)
            this.fuelLevel = this.fuelLevel - 2*FUEL_CONSUMPTION            
        }

        if (this.shipController.isShooting()) {
            this.fire(engine);
        }

        if (this.camera) this.camera.pos = this.pos        
    }

    private fire(engine: Engine): void {
        const currentTime = engine.clock.now()
        if (currentTime - this.lastShotTime < GUN_COOLDOWN) return
        this.lastShotTime = currentTime

        const direction = Vector.fromAngle(this.rotation)
        const shipFrontOffset = this.height / 2 + 5
        const bulletStartPosition = this.pos.add(direction.scale(shipFrontOffset))

        console.log(`[ShipActor.fire] Firing! Rotation: ${this.rotation} (deg: ${this.rotation * 180 / Math.PI})`);
        console.log(`[ShipActor.fire] Direction: x=${direction.x.toFixed(2)}, y=${direction.y.toFixed(2)}`);
        console.log(`[ShipActor.fire] Ship Height: ${this.height}, FrontOffset: ${shipFrontOffset}`);
        console.log(`[ShipActor.fire] Bullet Start Pos: x=${bulletStartPosition.x.toFixed(2)}, y=${bulletStartPosition.y.toFixed(2)}`);
        console.log(`[ShipActor.fire] Ship Pos: x=${this.pos.x.toFixed(2)}, y=${this.pos.y.toFixed(2)}`);

        const bullet = new BulletActor(bulletStartPosition, direction, this)
        engine.currentScene.add(bullet)
    }

    setPhysics(physics: Physics) {
        if (!this.tractorBeam) return
        this.physics = physics
        this.kinematics = new Kinematics(this, this.physics)        
    }

    attachBall(ballActor: BallActor) {
        const objectAngle = Math.atan2(
            this.pos.y - ballActor.getPos().y,
            this.pos.x - ballActor.getPos().x
        )
        this.kinematics?.setObjectAngle(objectAngle)
        this.kinematics?.setTowLength(this.pos.distance(ballActor.pos))
        this.kinematics?.resetObjectVelocity()
        this.ballActor = ballActor        
    }

    setCamera(camera: Camera) {this.camera = camera }
    setshipController(shipController: ShipController) {this.shipController = shipController }
    public setOnShipDestroyedCallback(cb: () => void) {this.onShipDestroyedCallback = cb;}
    getTractorBeam() : TractorBeam | undefined{ return this.tractorBeam }
    getMass() : number { return this.shipMass }
    getBall() {return this.ballActor }
    public isBallConnected(): boolean { return this.ballActor !== undefined && this.ballActor !== null; }
    getFuelLevel(): number { return this.fuelLevel }
    getMaxFuel(): number { return FUEL_FULL }
    increaseFuel(fuel: number) { this.fuelLevel = this.fuelLevel + fuel }    

    private handleCollision (evt: CollisionStartEvent) : void { 
        const collidingActor = evt.other?.owner;
        if (collidingActor instanceof BulletActor) {
            const bullet = collidingActor as BulletActor;
            if (bullet.getFirer() === this) return
            if (this.shipController?.isUsingTractorBeam()) return
        }
        this.explode();
    }

    protected explode(): void {
        super.explode()
        if (this.onShipDestroyedCallback) this.onShipDestroyedCallback()
    }    
}
