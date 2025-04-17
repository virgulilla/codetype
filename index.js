import { gameController } from './game/gameController.js';
import { configGame } from './config/configGame.js';
import { saveConfig, loadConfig } from './utils/configStorage.js'

document.addEventListener('DOMContentLoaded', () => {  
  const $game = document.querySelector('#game')
  const $nav = document.querySelector('nav')


  const game = gameController($game)
  const config = loadConfig()

  configGame($nav)

  $nav.addEventListener('optionSelected', (event) => {
    const { category, value } = event.detail
    config[category] = value
    saveConfig(config)
    game.updateConfig(config)
    game.init(config)
  })

})