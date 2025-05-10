import * as ex from 'excalibur';

// Maak een nieuw spel
const game = new ex.Engine({
    width: 800,
    height: 600,
    displayMode: ex.DisplayMode.FitScreen,
    backgroundColor: ex.Color.Black,
});

// Voeg een simpele actor toe
const player = new ex.Actor({
    x: 400,
    y: 300,
    width: 50,
    height: 50,
    color: ex.Color.Red,
});

// Voeg de actor toe aan het spel
game.add(player);

// Start het spel
game.start().then(() => {
    console.log('Game started!');
});