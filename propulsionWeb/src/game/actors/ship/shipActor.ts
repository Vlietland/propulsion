import { Camera, Actor, Vector, CollisionType, Engine, ImageSource } from 'excalibur'
import { ShipController } from '@src/game/controller/shipController'
import { BallActor } from '@src/game/actors/ballActor'
import { Physics } from '@src/game/physics/physics'
import { TractorBeam } from '@src/game/actors/ship/tractorBeam'

const SHIP = new ImageSource('/images/tiles/ship.png')
const SHIP_THRUST = new ImageSource('/images/tiles/shipThrust.png')
await SHIP.load()
await SHIP_THRUST.load()

const ROTATION_SPEED = 1
const THRUST_FORCE = 5000
const SHIP_MASS = 50
const GUN_POWER = 300
const TRACTOR_REACH = 150
const FUEL_FULL = 3300
const FUEL_CONSUMPTION = 5

export class ShipActor extends Actor {
    private physics?: Physics
    private camera?: Camera
    private shipController?: ShipController
    private objectAngle = 0
    private objectAngularVelocity = 0
    private objectVelocity = new Vector(0, 0)
    private ballActor?: BallActor
    private tractorBeam?: TractorBeam
    private fuelLevel = FUEL_FULL

    constructor(pos: Vector) {
        super({
            pos: pos,
            width: SHIP.width,
            height: SHIP.height,
            collisionType: CollisionType.Active,
        })
        this.tractorBeam = new TractorBeam(this, TRACTOR_REACH)
        this.pos = pos
        this.rotation = -Math.PI / 2
        this.graphics.use(SHIP.toSprite())
    }

    onPreUpdate(engine: Engine, delta: number) {
        const cycleTime = delta / 350
        let accelerationVector = new Vector(0, 0)
        let forceVector = new Vector(0, 0)

        if (this.physics && this.shipController && this.shipController.isThrusting()) {
            forceVector = this.physics.force(this.rotation, THRUST_FORCE)
        }

        if (this.physics) {
            if (!this.ballActor) {
                const acceleration = this.physics.lineairAcceleration(forceVector, SHIP_MASS)
                const { velocity, displacement } = this.physics.updateLinearMotion(
                    acceleration,
                    this.objectVelocity,
                    cycleTime
                )
                this.objectVelocity = velocity
                this.pos = this.pos.add(displacement)
            } else {
                //connected
                const forceVector = this.physics.force(this.rotation, THRUST_FORCE)
                const acceleration = this.physics.lineairAcceleration(
                    forceVector,
                    SHIP_MASS + this.ballActor.getMass()
                )
                const { velocity, displacement } = this.physics.updateLinearMotion(
                    acceleration,
                    this.objectVelocity,
                    cycleTime
                )
                this.objectVelocity = velocity
                const angularAcceleration = this.physics.angularAcceleration(
                    forceVector,
                    SHIP_MASS,
                    this.ballActor.getMass(),
                    this.pos,
                    this.ballActor?.getPos()
                )
                const { angle, angularVelocity, shipDelta, ballDelta } =
                    this.physics.updateRotationalMotion(
                        angularAcceleration,
                        this.angularVelocity,
                        SHIP_MASS,
                        this.ballActor.getMass(),
                        this.objectAngle,
                        cycleTime,
                        TRACTOR_REACH
                    )
                this.objectAngle = angle
                this.objectAngularVelocity = angularVelocity
                this.pos = this.pos.add(displacement).add(shipDelta)
                this.ballActor.addPos(ballDelta)
            }
        }

        if (this.shipController) {
            const rotationDirection = this.shipController.getRotationDirection()
            this.rotation += rotationDirection * ROTATION_SPEED * cycleTime
        }

        if (this.camera) this.camera.pos = this.pos

        if (this.shipController && this.shipController.isThrusting()) {
            this.graphics.use(SHIP_THRUST.toSprite())
            this.fuelLevel = this.fuelLevel - FUEL_CONSUMPTION
        } else this.graphics.use(SHIP.toSprite())

        if (this.shipController && this.shipController.isUsingTractorBeam()) {
            this.tractorBeam?.attractObjects(this.pos)
        }
    }

    setCamera(camera: Camera) {
        this.camera = camera
    }

    setPhysics(physics: Physics) {
        this.physics = physics
    }

    setshipController(shipController: ShipController) {
        this.shipController = shipController
    }

    setBall(ballActor: BallActor) {
        this.ballActor = ballActor
        this.objectAngle = Math.atan2(
            this.pos.y - ballActor.getPos().y,
            this.pos.x - ballActor.getPos().x
        )
    }

    increaseFuel(fuel: number) {
        this.fuelLevel = this.fuelLevel + fuel
    }

    explode() {
        console.log('Ship exploded!')
        this.kill()
    }
}
