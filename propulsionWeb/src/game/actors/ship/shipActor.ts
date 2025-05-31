import { TiledObject } from '@excalibur-tiled/index'
import { Camera, Vector, CollisionType, Engine, ImageSource, Color, Graphic, Circle, CollisionStartEvent } from 'excalibur'
import { Kinematics } from '@src/game/actors/ship/kinematics'
import { ShipController } from '@src/game/controller/shipController'
import { BallActor } from '@src/game/actors/ballActor'
import { Physics } from '@src/game/physics/physics'
import { TractorBeam } from '@src/game/actors/ship/tractorBeam'
import { BaseActor } from '@src/game/actors/baseActor';
import { BulletActor } from '@src/game/actors/bulletActor';
import { Hyperspace } from '@src/game/physics/hyperspace'
import { HyperspaceView } from '@src/game/ui/hyperspaceView'

const SHIP = new ImageSource('/images/tiles/ship.png')
const SHIP_THRUST = new ImageSource('/images/tiles/shipThrust.png')
await SHIP.load()
await SHIP_THRUST.load()

const ROTATION_SPEED = 1
const THRUST_FORCE = 5000
const FUEL_FULL = 3300
const FUEL_CONSUMPTION = 5
const GUN_COOLDOWN = 100
const GUN_POSITION_OFFSET = 50

export class ShipActor extends BaseActor {
    private physics?: Physics
    private camera?: Camera
    private kinematics?: Kinematics
    private shipController?: ShipController
    private ballActor?: BallActor
    private tractorBeam?: TractorBeam
    private fuelLevel = FUEL_FULL
    private mass = 100
    private lastShotTime: number = 0   
    private hyperspace?: Hyperspace
    private onShipLostCallback?: () => void
    private onMissionFinishedCallback?: () => void    

    constructor(object: TiledObject) {
        if (!object || object.x === undefined || object.y === undefined) return
        super(object, SHIP, CollisionType.Active)
        this.tractorBeam = new TractorBeam(this)
        this.pos = super.pos
        this.rotation = (object.rotation ?? 0) - Math.PI / 2
        if (object && object.properties) {
            if (object.properties instanceof Map) {
                this.mass = Number(object.properties.get('mass') || 100)
            }
        }
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

        if (this.shipController.isShooting()) { this.fire(engine) }
        if (this.camera) this.camera.pos = this.pos        
    }

    private fire(engine: Engine): void {
        const currentTime = engine.clock.now()
        if (currentTime - this.lastShotTime < GUN_COOLDOWN) return
        this.lastShotTime = currentTime

        const direction = Vector.fromAngle(this.rotation)
        const shipFrontOffset = GUN_POSITION_OFFSET
        const bulletStartPosition = this.pos.add(direction.scale(shipFrontOffset))
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

    public setCamera(camera: Camera) {this.camera = camera }
    public setshipController(shipController: ShipController) {this.shipController = shipController }
    public setShipLostCallback(cb: () => void) {this.onShipLostCallback = cb;}
    public setMissionFinishedCallback(cb: () => void) {this.onMissionFinishedCallback = cb;}    
    public setHyperspace(hyperspace: Hyperspace) { this.hyperspace = hyperspace }
    public getTractorBeam() : TractorBeam | undefined{ return this.tractorBeam }
    public getMass() : number { return this.mass }
    public getBall() {return this.ballActor }
    public isBallConnected(): boolean { return this.ballActor !== undefined && this.ballActor !== null; }
    public getFuelLevel(): number { return this.fuelLevel }
    public getMaxFuel(): number { return FUEL_FULL }
    public increaseFuel(fuel: number) { this.fuelLevel = this.fuelLevel + fuel }    

    private handleCollision (evt: CollisionStartEvent) : void { 
        const collidingActor = evt.other?.owner;
        if (collidingActor instanceof BulletActor) {
            const bullet = collidingActor as BulletActor;
            if (bullet.getFirer() === this) return
            if (this.shipController?.isUsingTractorBeam()) return
        }
        if (this.hyperspace?.checkHyperspaceReached(this)) {  
            HyperspaceView.spawn(this.scene, this.pos, this.rotation ?? 0);        
            if (this.onMissionFinishedCallback) this.onMissionFinishedCallback()
        }
        else this.explode()
    }

    protected explode(): void {
        super.explode()
        if (this.onShipLostCallback) this.onShipLostCallback()
    }    
}
