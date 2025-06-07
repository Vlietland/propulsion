# Propulsion Web Game

This project is a modern web-based remake of the classic space physics game Thrust, originally created in 1986 for the BBC Micro. The game features gravity-based gameplay, tractor beam mechanics, and challenging cargo collection missions through underground cave systems.

The original Thrust was a groundbreaking game that introduced realistic physics simulation and momentum-based spacecraft control. This remake preserves the core gameplay mechanics while bringing the experience to modern web browsers with enhanced graphics, sound, and cross-platform compatibility.

The development journey spans nearly four decades - from the original 1986 BBC Micro assembly code, through my 1997 C++ DOS implementation, to this contemporary TypeScript web version. Each iteration has maintained the essential physics and gameplay that made Thrust compelling while adapting to new technological capabilities.

## Usage

The game is hosted on GitHub Pages and can be accessed [here](https://vlietland.github.io/propulsion/) It can be played freely in any modern web browser.

### Game Controls
- **Z and X** - Rotate your ship left/right
- **Shift** - Activate thrust engines  
- **Spacebar** - Engage tractor beam
- **ESC** - Pause game / Return to menu

### Gameplay Objectives
Navigate your ship through gravitational cave systems to:
- Collect valuable cargo pods using your tractor beam
- Avoid crashing into cave walls or enemy defenses
- Manage fuel consumption strategically
- Escape through the cave entrance before time runs out

The physics simulation includes realistic momentum, gravity effects, and tractor beam mechanics that require skill and precision to master.

## Documentation

For details on the architecture of the modern Propulsion web application, see the [propulsion documentation](./propulsionWeb/docs/propulsion).

For more information about the original Thrust game and its historical significance, see the [thrust documentation](./propulsionWeb/docs/thrust).

For technical analysis of the 1997 C++ implementation, see the [legacy code documentation](./propulsionWeb/docs/legacyCode).

## Screenshots

Modern Propulsion (2025):
<img src="./propulsionWeb/docs/images/propulsion-gameplay.png" alt="Modern Propulsion gameplay">
<img src="./propulsionWeb/docs/images/propulsion-menu.png" alt="Modern Propulsion menu">

Original Thrust (1986):
<img src="./propulsionWeb/docs/images/thrust-original.png" alt="Original Thrust on BBC Micro">

Legacy C++ Version (1997):
<img src="./legacyCode/docs/images/propulsion1997-gameplay1.png" alt="1997 DOS version">

## Development

### Technologies Used
- **TypeScript** - Type-safe JavaScript development
- **Excalibur.js** - 2D game engine with physics
- **Vite** - Modern build tool and dev server
- **Web Audio API** - Spatial sound effects
- **Canvas/WebGL** - Hardware-accelerated graphics

### Getting Started

Prerequisites:
- Node.js (version 16 or higher)
- npm or yarn package manager

Installation:
```bash
git clone https://github.com/yourusername/propulsion.git
cd propulsion/propulsionWeb
npm install
npm run dev
```

Open your browser to `http://localhost:5173`

### Building for Production
```bash
npm run build
./publish.sh
```

## Project Evolution

| Year | Platform | Technology | Key Features |
|------|----------|------------|--------------|
| 1986 | BBC Micro | 6502 Assembly | Original physics, tractor beam |
| 1997 | DOS/Windows | C++ | Object-oriented design, enhanced graphics |
| 2024 | Web | TypeScript | Cross-platform, modern tooling |

This project demonstrates how classic game concepts can be preserved and enhanced across different technological eras while maintaining their essential gameplay characteristics.

## License

This project is licensed under the GNU General Public License Version 3. See the [LICENSE](./LICENSE) file for details.

Copyright (C) 2025 Propulsion Game Project