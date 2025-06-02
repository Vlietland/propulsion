import { Sound, Loader } from 'excalibur'

export class SoundManager {
    private static instance: SoundManager | null = null
    private sounds: Map<string, Sound> = new Map()
    private thrustPlaying = false
    
    public static readonly SOUND_PATHS = {
        TRACTOR_BEAM: '/sounds/tractorBeam.wav',
        SHIP_EXPLOSION: '/sounds/shipExplosion.wav',
        ACTOR_EXPLOSION: '/sounds/actorExplosion.wav',
        BULLET_HIT: '/sounds/bulletHit.wav',
        TURRET_GUN: '/sounds/turretGun.wav',
        SHIP_GUN: '/sounds/shipGun.wav',
        THRUST: '/sounds/thrust.wav'
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
        
    public static play(soundKey: string, volume: number = 1.0, loop: boolean = false): void {
        const instance = this.getInstance()
        const sound = instance.sounds.get(soundKey)
        if (sound) {
            sound.volume = Math.max(0, Math.min(1, volume))
            sound.loop = loop
            sound.play()
        } else {
            console.warn(`Sound '${soundKey}' not found or not loaded`)
        }
    }
    
    public static playTractorBeam(volume: number = 0.7): void {
        this.play('TRACTOR_BEAM', volume)
    }
    
    public static playShipExplosion(volume: number = 1.0): void {
        this.play('SHIP_EXPLOSION', volume)
    }
    
    public static playActorExplosion(volume: number = 0.8): void {
        this.play('ACTOR_EXPLOSION', volume)
    }
    
    public static playBulletHit(volume: number = 0.6): void {
        this.play('BULLET_HIT', volume)
    }
    
    public static playTurretGun(volume: number = 0.7): void {
        this.play('TURRET_GUN', volume)
    }
    
    public static playShipGun(volume: number = 0.8): void {
        this.play('SHIP_GUN', volume)
    }
    
    public static playThrust(volume: number = 0.5): void {
        const instance = this.getInstance()
        if (instance.thrustPlaying) return
        const sound = instance.sounds.get('THRUST')
        if (sound) {
            sound.volume = Math.max(0, Math.min(1, volume))
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
        if (!SoundManager.instance) {
            throw new Error('SoundManager not initialized. Call SoundManager.initialize() first.')
        }
        return SoundManager.instance
    }
}
