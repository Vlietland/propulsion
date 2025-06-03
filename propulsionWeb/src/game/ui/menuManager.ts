import { Engine } from 'excalibur'
import { MainMenu, MainMenuOptions } from '@src/menu/mainMenu'

export class MenuManager {
    private engine: Engine
    private mainMenu: MainMenu | null = null
    private currentMenu: 'main' | 'game' = 'main'
    private mainMenuSceneName = 'main-menu-scene'
    private isMainMenuCreated = false

    constructor(engine: Engine) {
        this.engine = engine
    }

    public showMainMenu(options: MainMenuOptions): void {
        console.log('MenuManager: showMainMenu called')
        
        this.currentMenu = 'main'
        
        // Create the main menu scene only once
        if (!this.isMainMenuCreated) {
            console.log('MenuManager: Creating main menu for the first time')
            this.mainMenu = new MainMenu(options)
            this.engine.add(this.mainMenuSceneName, this.mainMenu.getScene())
            this.isMainMenuCreated = true
        }
        
        console.log('MenuManager: Going to scene', this.mainMenuSceneName)
        this.engine.goToScene(this.mainMenuSceneName)
        
        if (this.mainMenu) {
            console.log('MenuManager: Setting menu active')
            this.mainMenu.setActive(true)
        }
        
        console.log('MenuManager: showMainMenu completed')
    }

    public hideMainMenu(): void {
        if (this.mainMenu) {
            this.mainMenu.setActive(false)
        }
    }

    public getCurrentMenu(): 'main' | 'game' {
        return this.currentMenu
    }

    public setCurrentMenu(menu: 'main' | 'game'): void {
        this.currentMenu = menu
    }

    public dispose(): void {
        this.hideMainMenu()
        if (this.mainMenu) {
            this.mainMenu.dispose()
            this.mainMenu = null
        }
        if (this.isMainMenuCreated) {
            this.engine.remove(this.mainMenuSceneName)
            this.isMainMenuCreated = false
        }
    }
}
