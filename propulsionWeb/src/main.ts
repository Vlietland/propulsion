import * as ex from 'excalibur';
import { Ship, SHIP_IMAGE } from './game/player/ship';
import { InputService } from './game/input/inputService';
import { GameCanvas } from './ui/gameCanvas';

// Initialize the game canvas
const gameCanvas = new GameCanvas();
const game = gameCanvas.createEngine(); // Create the engine using GameCanvas

// Set global gravity
ex.Physics.acc = new ex.Vector(0, 800); // Gravity pulling down

// Initialize InputService
const inputService = new InputService(game); // Ensure this is correctly instantiated

// Create and add the ship
const ship = new Ship(400, 300, inputService); // Pass the inputService to the Ship
game.add(ship);

// Create a loader and add the ship image
const loader = new ex.Loader([SHIP_IMAGE]);

// Automatically click the "Play Game" button using MutationObserver
const observer = new MutationObserver(() => {
    const playButton = document.querySelector('#excalibur-play') as HTMLButtonElement; // Updated selector
    if (playButton) {
        playButton.click();
        console.log('Play Game button clicked automatically.');
        observer.disconnect(); // Stop observing once the button is clicked
    }
});

observer.observe(document.body, { childList: true, subtree: true });

// Start the game with the loader
game.start(loader).then(() => {
    console.log('All assets successfully loaded.');
    console.log('Game started!');
}).catch((error) => {
    console.error('Error starting the game:', error);
});