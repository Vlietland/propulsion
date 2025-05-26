// Import the main stylesheet to ensure all styles are bundled and applied.
import '@src/styles/main.scss';

import { EngineBootstrap } from '@src/game/engine/engineBootstrap'

const game = new EngineBootstrap()
game.start()
