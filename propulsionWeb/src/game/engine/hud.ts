import { System, SystemType, World, Scene, ScreenElement, Engine } from 'excalibur'
import { ShipActor } from '@src/game/actors/ship/shipActor'

export class HUD extends ScreenElement {
    private ship?: ShipActor
    private hudElement: HTMLElement
    private fuelBarElement: HTMLElement
    private statusElement: HTMLElement
    
    constructor() {
        super();
        const container = document.getElementById('game-container');
        this.hudElement = document.createElement('div');
        this.hudElement.className = 'game-hud';
        if (container) {
            container.appendChild(this.hudElement);
        } else {
            document.body.appendChild(this.hudElement);
        }

        this.fuelBarElement = document.createElement('div');
        this.fuelBarElement.className = 'fuel-bar';
        const fuelBarContainer = document.createElement('div');
        fuelBarContainer.className = 'fuel-bar-container';
        fuelBarContainer.appendChild(this.fuelBarElement);

        const fuelLabel = document.createElement('div');
        fuelLabel.className = 'fuel-label';
        fuelLabel.textContent = 'FUEL';

        this.statusElement = document.createElement('div');
        this.statusElement.className = 'status-element';

        this.hudElement.appendChild(fuelLabel);
        this.hudElement.appendChild(fuelBarContainer);
        this.hudElement.appendChild(this.statusElement);
    }
    
    setShip(ship: ShipActor): void { this.ship = ship }
    initialize(world: World, scene: Scene<unknown>): void {}
    
    update(engine: Engine<any>, elapsed: number): void {
        if (!this.ship) {
            console.warn('HUD update called without a ship assigned.');
            return;
        }
        const fuelLevel = this.ship.getFuelLevel();
        const maxFuel = this.ship.getMaxFuel();
        const fuelPercentage = Math.max(0, Math.min(100, (fuelLevel / maxFuel) * 100));
        this.fuelBarElement.style.width = fuelPercentage + '%';

        if (fuelPercentage < 20) {
            this.fuelBarElement.classList.add('critical');
        } else if (fuelPercentage < 40) {
            this.fuelBarElement.classList.remove('critical');
            this.fuelBarElement.classList.add('warning');
        } else {
            this.fuelBarElement.classList.remove('critical', 'warning');
        }

        if (this.ship.isBallConnected()) {
            this.statusElement.textContent = 'TOWING ACTIVE';
            this.statusElement.classList.add('towing');
        } else {
            this.statusElement.textContent = 'READY';
            this.statusElement.classList.remove('towing');
        }
    }

    dispose(): void {
        if (this.hudElement && this.hudElement.parentNode) this.hudElement.parentNode.removeChild(this.hudElement)
    }
}
