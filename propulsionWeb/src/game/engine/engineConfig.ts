import { DisplayMode, EngineOptions, Color } from 'excalibur'

export const ENGINE_CONFIG: EngineOptions = {
  width: 800,
  height: 600,
  displayMode: DisplayMode.Fixed,
  backgroundColor: Color.Black,
  canvasElementId: 'game',
  antialiasing: false,
  pixelArt: true,
}
