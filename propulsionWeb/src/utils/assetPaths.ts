const ASSET_BASE_PATH = __ASSET_BASE_PATH__

export function getAssetPath(relativePath: string): string {
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath
  return `${ASSET_BASE_PATH}/${cleanPath}`
}

export function getImagePath(imagePath: string): string {
  return getAssetPath(`images/${imagePath}`)
}

export function getSoundPath(soundPath: string): string {
  return getAssetPath(`sounds/${soundPath}`)
}

export function getLevelPath(levelPath: string): string {
  return getAssetPath(`levels/${levelPath}`)
}
