import { Input, Engine } from 'excalibur';

export class InputService {
    private engine: Engine;

    constructor(engine: Engine) {
        this.engine = engine;
    }

    getRotationDirection(): number {
        const keyboard = this.engine.input.keyboard;

        if (keyboard.isHeld(Input.Keys.Z)) {
            return -1;
        } else if (keyboard.isHeld(Input.Keys.X)) {
            return 1;
        }

        return 0;
    }

    isThrusting(): boolean {
        const keyboard = this.engine.input.keyboard;
        return keyboard.isHeld(Input.Keys.Space);
    }

    isShooting(): boolean {
        const keyboard = this.engine.input.keyboard;
        return keyboard.isHeld(Input.Keys.Enter);
    }

    isUsingTractorBeam(): boolean {
        const keyboard = this.engine.input.keyboard;
        return keyboard.isHeld(Input.Keys.ShiftLeft) || keyboard.isHeld(Input.Keys.ShiftRight);
    }
}
