import { Engine, Keys } from 'excalibur'; // Import only Engine and Keys

export class InputService {
    private engine: Engine;

    constructor(engine: Engine) {
        this.engine = engine;
    }

    getRotationDirection(): number {
        const keyboard = this.engine.input.keyboard;

        if (keyboard.isHeld(Keys.Z)) {
            return -1;
        } else if (keyboard.isHeld(Keys.X)) {
            return 1;
        }

        return 0;
    }

    isThrusting(): boolean {
        const keyboard = this.engine.input.keyboard;
        return keyboard.isHeld(Keys.ShiftLeft) || keyboard.isHeld(Keys.ShiftRight);
    }

    isShooting(): boolean {
        const keyboard = this.engine.input.keyboard;
        return keyboard.isHeld(Keys.Enter);
    }

    isUsingTractorBeam(): boolean {
        const keyboard = this.engine.input.keyboard;
        return keyboard.isHeld(Keys.Space);
    }
}
