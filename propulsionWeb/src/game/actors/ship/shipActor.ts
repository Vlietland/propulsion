import { TiledObject } from '@excalibur-tiled/index'
import { Camera, Actor, Vector, CollisionType, Engine, ImageSource, Color } from 'excalibur'
import { Kinematics } from '@src/game/actors/ship/kinematics'
import { ShipController } from '@src/game/controller/shipController'
import { BallActor } from '@src/game/actors/ballActor'
import { Physics } from '@src/game/physics/physics'
import { TractorBeam } from '@src/game/actors/ship/tractorBeam'
import { CollisionPoints } from '@src/game/physics/collision/collisionPoints'
import { BaseActor } from '@src/game/actors/baseActor';

const SHIP = new ImageSource('/images/tiles/ship.png')
const SHIP_THRUST = new ImageSource('/images/tiles/shipThrust.png')
await SHIP.load()
await SHIP_THRUST.load()

const ROTATION_SPEED = 1
const THRUST_FORCE = 5000
const GUN_POWER = 300
const FUEL_FULL = 3300
const FUEL_CONSUMPTION = 10

export class ShipActor extends BaseActor {
    private physics?: Physics
    private camera?: Camera
    private kinematics?: Kinematics
    private shipController?: ShipController
    private ballActor?: BallActor
    private tractorBeam?: TractorBeam
    private fuelLevel = FUEL_FULL
    private shipMass = 100

    constructor(object: TiledObject, shipMass: number) {
        if (!object || object.x === undefined || object.y === undefined) return
        super(object, SHIP, CollisionType.Active)
        this.tractorBeam = new TractorBeam(this)
        this.pos = super.pos
        this.shipMass = shipMass
        this.rotation = (object.rotation ?? 0) - Math.PI / 2
    }

    onInitialize(engine: Engine): void {
        this.on('postcollision', (evt) => { this.explode()})
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
            //this.pos = this.pos.add(shipDelta);
            //this.ballActor?.addPos(ballDelta.clone());
            this.pos = this.pos.add(displacement).add(shipDelta);
            this.ballActor?.addPos(displacement.clone().add(ballDelta));
        }

        const rotationDirection = this.shipController.getRotationDirection()
        this.rotation += rotationDirection * ROTATION_SPEED * cycleTime

        if (this.shipController.isUsingTractorBeam()) {
            this.tractorBeam?.attractObjects(this.pos)
        }

        if (this.camera) this.camera.pos = this.pos        
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
    getTractorBeam() : TractorBeam | undefined{ return this.tractorBeam }
    getMass() : number { return this.shipMass }
    getBall() {return this.ballActor }
    isBallConnected(): boolean { return this.ballActor !== undefined && this.ballActor !== null; }
    getFuelLevel(): number { return this.fuelLevel }
    getMaxFuel(): number { return FUEL_FULL }
    increaseFuel(fuel: number) { this.fuelLevel = this.fuelLevel + fuel }

    explode() {
        console.log('💥 Ship exploded!')
        this.kill()
    }
}
