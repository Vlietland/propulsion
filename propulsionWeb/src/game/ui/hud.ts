import { System, SystemType, World, Scene, ScreenElement, Engine } from 'excalibur'
import { ShipActor } from '@src/game/actors/ship/shipActor'

export class HUD extends ScreenElement {
    private ship?: ShipActor
    private hudElement: HTMLElement
    private fuelBarElement: HTMLElement
    private statusElement: HTMLElement
    private livesElement: HTMLElement
    
    constructor() {
        super();
        const container = document.getElementById('game-container');
        this.hudElement = document.createElement('div');
        this.hudElement.className = 'game-hud';
        (container || document.body).appendChild(this.hudElement);

        this.fuelBarElement = document.createElement('div');
        this.fuelBarElement.className = 'fuel-bar';
        const fuelBarContainer = document.createElement('div');
        fuelBarContainer.className = 'fuel-bar-container';
        fuelBarContainer.appendChild(this.fuelBarElement);

        this.hudElement.appendChild(this.createLabel('FUEL'));
        this.hudElement.appendChild(fuelBarContainer);
        this.statusElement = this.createLabel('TRACTOR READY');
        this.hudElement.appendChild(this.statusElement);
        this.livesElement = this.createLabel('LIVES: 3');
        this.hudElement.appendChild(this.livesElement);
    }

    private createLabel(text: string): HTMLElement {
        const label = document.createElement('div');
        label.className = 'label-text';
        label.textContent = text;
        return label;
    }
    
    setShip(ship: ShipActor): void { this.ship = ship }
    initialize(world: World, scene: Scene<unknown>): void {}
    
    update(engine: Engine<any>, elapsed: number): void {
        if (!this.ship) return;
        const fuelPercentage = Math.max(0, Math.min(100, (this.ship.getFuelLevel() / this.ship.getMaxFuel()) * 100));
        this.fuelBarElement.style.width = fuelPercentage + '%';
        this.fuelBarElement.className = 'fuel-bar';
        if (fuelPercentage < 20) {
            this.fuelBarElement.classList.add('critical');
        } else if (fuelPercentage < 40) {
            this.fuelBarElement.classList.add('warning');
        }

        this.statusElement.textContent = this.ship.isBallConnected() ? 'TOWING ACTIVE' : 'TRACTOR READY';
    }

    updateLives(lives: number): void {
        this.livesElement.textContent = `LIVES: ${lives}`;
    }

    dispose(): void {
        this.hudElement.remove();
        this.ship = undefined; // Clear ship reference to prevent memory leaks
    }
}
