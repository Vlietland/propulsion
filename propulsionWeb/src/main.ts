import * as ex from 'excalibur';
import { Ship, SHIP_IMAGE } from '@src/game/player/ship';
import { InputService } from '@src/game/input/inputService';
import { GameCanvas } from '@src/ui/gameCanvas';
import { ENERGY_BALL_IMAGE } from '@src/game/player/energyBall';

const gameCanvas = new GameCanvas();
const game = gameCanvas.createEngine();

ex.Physics.acc = new ex.Vector(0, 50); // Gravity pulling down

const inputService = new InputService(game);
             
const ship = new Ship(400, 300, inputService);
game.add(ship);

const loader = new ex.Loader([SHIP_IMAGE, ENERGY_BALL_IMAGE]);

const observer = new MutationObserver(() => {
    const playButton = document.querySelector('#excalibur-play') as HTMLButtonElement;
    if (playButton) {
        playButton.click();
        observer.disconnect();
    }
});

observer.observe(document.body, { childList: true, subtree: true });

game.start(loader).then(() => {
    console.log('All assets successfully loaded.');
    console.log('Game started!');
}).catch((error) => {
    console.error('Error starting the game:', error);
});