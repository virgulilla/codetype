import { gameController } from './game/gameController.js';

document.addEventListener('DOMContentLoaded', () => {  
  const $game = document.querySelector('#game')
  gameController($game)
})