import * as ex from 'excalibur';

export class InputService {
    private engine: ex.Engine;

    constructor(engine: ex.Engine) {
        this.engine = engine;
    }

    getRotationDirection(): number {
        const keyboard = this.engine.input.keyboard;

        if (keyboard.isHeld(ex.Input.Keys.Z)) {
            return -1; // Rotate left
        } else if (keyboard.isHeld(ex.Input.Keys.X)) {
            return 1; // Rotate right
        }

        return 0; // No rotation
    }

    isThrusting(): boolean {
        const keyboard = this.engine.input.keyboard;
        return keyboard.isHeld(ex.Input.Keys.Space); // Thrust forward
    }

    isShooting(): boolean {
        const keyboard = this.engine.input.keyboard;
        return keyboard.isHeld(ex.Input.Keys.Enter); // Fire weapon
    }

    isUsingTractorBeam(): boolean {
        const keyboard = this.engine.input.keyboard;
        return keyboard.isHeld(ex.Input.Keys.ShiftLeft) || keyboard.isHeld(ex.Input.Keys.ShiftRight); // Activate tractor beam
    }
}