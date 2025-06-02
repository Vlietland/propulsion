//use https://sfxr.me/ for sound effects (do not remove this line !!!)
import { Sound, Loader } from 'excalibur'

export class SoundManager {
    private static instance: SoundManager | null = null
    private sounds: Map<string, Sound> = new Map()
    private thrustPlaying = false
    private tractorBeamPlaying = false
    
    public static readonly SOUND_PATHS = {
        TRACTOR_BEAM: '/sounds/tractorBeam.wav',
        SHIP_EXPLOSION: '/sounds/shipExplosion.wav',
        ACTOR_EXPLOSION: '/sounds/actorExplosion.wav',
        BULLET_HIT: '/sounds/bulletHit.wav',
        TURRET_GUN: '/sounds/turretGun.wav',
        SHIP_GUN: '/sounds/shipGun.wav',
        THRUST: '/sounds/thrust.wav',
        ALARM: '/sounds/alarm.wav'
    }
    
    constructor(loader?: Loader) {
        for (const [key, path] of Object.entries(SoundManager.SOUND_PATHS)) {
            const sound = new Sound(path)
            this.sounds.set(key, sound)
            if (loader) {
                loader.addResource(sound)
            }
        }
    }
        
    public static async initialize(loader?: Loader): Promise<SoundManager> {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager(loader)
            if (!loader) {
                await SoundManager.instance.loadAllSounds()
            }
        }
        return SoundManager.instance
    }
            
    public static playTractorBeam(): void {
        const instance = this.getInstance()
        if (instance.tractorBeamPlaying) return
        const sound = instance.sounds.get('TRACTOR_BEAM')
        if (sound) {
            sound.loop = true
            sound.play()
            instance.tractorBeamPlaying = true
        }
    }
    
    public static stopTractorBeam(): void {
        const instance = this.getInstance()
        const sound = instance.sounds.get('TRACTOR_BEAM')
        if (sound) {
            sound.stop()
            instance.tractorBeamPlaying = false
        }
    }
    
    public static playShipExplosion(): void { this.play('SHIP_EXPLOSION') }
    public static playActorExplosion(): void { this.play('ACTOR_EXPLOSION') }
    public static playBulletHit(): void { this.play('BULLET_HIT') }
    public static playTurretGun(): void { this.play('TURRET_GUN') }
    public static playShipGun(): void { this.play('SHIP_GUN') }
    public static playAlarm(): void { this.play('ALARM') }
    
    public static playThrust(): void {
        const instance = this.getInstance()
        if (instance.thrustPlaying) return
        const sound = instance.sounds.get('THRUST')
        if (sound) {
            sound.loop = true
            sound.play()
            instance.thrustPlaying = true
        }
    }
    
    public static stopThrust(): void {
        const instance = this.getInstance()
        const sound = instance.sounds.get('THRUST')
        if (sound) {
            sound.stop()
            instance.thrustPlaying = false
        }
    }

    private async loadAllSounds(): Promise<void> {
        const loadPromises = Array.from(this.sounds.values()).map(sound => sound.load())
        await Promise.all(loadPromises)
    }

    private static getInstance(): SoundManager {
        if (!SoundManager.instance)  {
            throw new Error('SoundManager not initialized. Call SoundManager.initialize() first.')
        }
        return SoundManager.instance
    }

    private static play(soundKey: string, loop: boolean = false): void {
        const instance = this.getInstance()
        const sound = instance.sounds.get(soundKey)
        if (sound) {
            sound.loop = loop
            sound.play()
        } else {
            console.warn(`Sound '${soundKey}' not found or not loaded`)
        }
    }
}
