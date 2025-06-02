import { Sound } from 'excalibur'

export class SoundManager {
    private static instance: SoundManager | null = null
    private sounds: Map<string, Sound> = new Map()
    private thrustPlaying = false
    private thrustAudioContext?: AudioContext
    private thrustOscillators: OscillatorNode[] = []
    private thrustGainNode?: GainNode
    
    public static readonly SOUND_PATHS = {
        TRACTOR_BEAM: '/sounds/tractorBeam.wav',
        SHIP_EXPLOSION: '/sounds/shipExplosion.wav',
        ACTOR_EXPLOSION: '/sounds/actorExplosion.wav',
        BULLET_HIT: '/sounds/bulletHit.wav',
        TURRET_GUN: '/sounds/turretGun.wav',
        SHIP_GUN: '/sounds/shipGun.wav'
    }
    
    constructor() {
        for (const [key, path] of Object.entries(SoundManager.SOUND_PATHS)) {
            const sound = new Sound(path)
            this.sounds.set(key, sound)
        }
    }
        
    public static async initialize(): Promise<SoundManager> {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager()
            await SoundManager.instance.loadAllSounds()
        }
        return SoundManager.instance
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
        
        if (!instance.thrustAudioContext || instance.thrustOscillators.length === 0) {
            instance.createJetEngineSound()
        }
        
        if (instance.thrustAudioContext?.state === 'suspended') {
            instance.thrustAudioContext.resume()
        }
        
        instance.thrustOscillators.forEach((osc) => {
            try {
                osc.start()
            } catch (e) {
            }
        })
        
        if (instance.thrustGainNode && instance.thrustAudioContext) {
            instance.thrustGainNode.gain.cancelScheduledValues(instance.thrustAudioContext.currentTime)
            instance.thrustGainNode.gain.setValueAtTime(0, instance.thrustAudioContext.currentTime)
            instance.thrustGainNode.gain.linearRampToValueAtTime(volume * 0.8, instance.thrustAudioContext.currentTime + 0.1)
        }
        
        instance.thrustPlaying = true
    }
    
    public static stopThrust(): void {
        const instance = this.getInstance()
        if (!instance.thrustPlaying || !instance.thrustGainNode || !instance.thrustAudioContext) return
        
        instance.thrustGainNode.gain.cancelScheduledValues(instance.thrustAudioContext.currentTime)
        instance.thrustGainNode.gain.setValueAtTime(instance.thrustGainNode.gain.value, instance.thrustAudioContext.currentTime)
        instance.thrustGainNode.gain.linearRampToValueAtTime(0, instance.thrustAudioContext.currentTime + 0.2)
        
        setTimeout(() => {
            instance.thrustOscillators.forEach((osc) => {
                try { 
                    osc.stop()
                } catch (e) {
                }
            })
            instance.thrustOscillators = []
            instance.thrustPlaying = false
            
            if (instance.thrustAudioContext) {
                instance.thrustAudioContext.close()
                instance.thrustAudioContext = undefined
                instance.thrustGainNode = undefined
            }
        }, 250)
    }

    private createJetEngineSound(): void {
        this.thrustAudioContext = new AudioContext()
        this.thrustGainNode = this.thrustAudioContext.createGain()
        this.thrustGainNode.connect(this.thrustAudioContext.destination)
        this.thrustGainNode.gain.value = 0
        
        this.thrustOscillators = []
        
        const baseFreq = 120
        const frequencies = [baseFreq, baseFreq * 1.5, baseFreq * 2.3, baseFreq * 3.1]
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.thrustAudioContext!.createOscillator()
            const gainNode = this.thrustAudioContext!.createGain()
            
            oscillator.type = index < 2 ? 'sawtooth' : 'square'
            oscillator.frequency.value = freq
            gainNode.gain.value = 0.1 / (index + 1)
            
            oscillator.connect(gainNode)
            gainNode.connect(this.thrustGainNode!)
            
            this.thrustOscillators.push(oscillator)
        })
        
        const noiseBuffer = this.thrustAudioContext.createBuffer(1, this.thrustAudioContext.sampleRate * 2, this.thrustAudioContext.sampleRate)
        const noiseData = noiseBuffer.getChannelData(0)
        for (let i = 0; i < noiseData.length; i++) {
            noiseData[i] = Math.random() * 2 - 1
        }
        
        const noiseSource = this.thrustAudioContext.createBufferSource()
        const noiseGain = this.thrustAudioContext.createGain()
        const noiseFilter = this.thrustAudioContext.createBiquadFilter()
        
        noiseSource.buffer = noiseBuffer
        noiseSource.loop = true
        noiseFilter.type = 'lowpass'
        noiseFilter.frequency.value = 800
        noiseGain.gain.value = 0.15
        
        noiseSource.connect(noiseFilter)
        noiseFilter.connect(noiseGain)
        noiseGain.connect(this.thrustGainNode!)
        
        this.thrustOscillators.push(noiseSource as any)
    }

    private static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            throw new Error('SoundManager not initialized. Call SoundManager.initialize() first.')
        }
        return SoundManager.instance
    }

    private async loadAllSounds(): Promise<void> {
        const loadPromises = Array.from(this.sounds.values()).map(sound => sound.load())
        await Promise.all(loadPromises)
    }

    private static play(soundKey: string, volume: number = 1.0, loop: boolean = false): void {
        const instance = this.getInstance()
        const sound = instance.sounds.get(soundKey)
        if (sound) {
            sound.volume = Math.max(0, Math.min(1, volume))
            sound.loop = loop
            sound.play()
        }
    }
}
