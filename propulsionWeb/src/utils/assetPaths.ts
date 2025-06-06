/**
 * Centralized asset path utilities
 * This allows changing the asset base path in one place
 */

// Asset base path - injected by Vite at build time
const ASSET_BASE_PATH = __ASSET_BASE_PATH__;

/**
 * Get the full path for an asset
 * @param relativePath - Path relative to the asset directory (e.g., 'images/tiles/ship.png')
 * @returns Full asset path
 */
export function getAssetPath(relativePath: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return `${ASSET_BASE_PATH}/${cleanPath}`;
}

/**
 * Get path for image assets
 * @param imagePath - Path relative to images directory (e.g., 'tiles/ship.png')
 * @returns Full image asset path
 */
export function getImagePath(imagePath: string): string {
  return getAssetPath(`images/${imagePath}`);
}

/**
 * Get path for sound assets
 * @param soundPath - Path relative to sounds directory (e.g., 'thrust.wav')
 * @returns Full sound asset path
 */
export function getSoundPath(soundPath: string): string {
  return getAssetPath(`sounds/${soundPath}`);
}

/**
 * Get path for level assets
 * @param levelPath - Path relative to levels directory (e.g., 'level1.json')
 * @returns Full level asset path
 */
export function getLevelPath(levelPath: string): string {
  return getAssetPath(`levels/${levelPath}`);
}
