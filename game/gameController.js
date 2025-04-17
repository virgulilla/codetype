import {
    INITIAL_TIME,
    getRandomSnippet,
    normalizeSnippetToWords
  } from './gameModel.js'
  
  import { gameView } from './gameView.js'
  
  export const gameController = ($game) => {
    let words = []
    let playing = false
    let currentTime = INITIAL_TIME
    let config = {
        language: 'JavaScript',
        time: 120,
        length: 'Medium'
      }
  
    const $time = $game.querySelector('time')
    const $paragraph = $game.querySelector('#text-area')
    const $input = $game.querySelector('input')
    const $results = document.querySelector('#results')
    const $button = document.querySelector('#reload-button')

    async function init(newConfig = {}) {
        config = { ...config, ...newConfig }
        await initGame(config)
    }
    
    function updateConfig(newOptions) {
        config = { ...config, ...newOptions }        
    }
  
    initGame(config)
  
    document.addEventListener('keydown', () => {
      $input.focus()
      if (!playing) {
        playing = true
        const intervalId = setInterval(() => {
          currentTime--
          gameView.updateTime($time, currentTime)
  
          if (currentTime === 0) {
            clearInterval(intervalId)
            gameOver()
          }
        }, 1000)
      }
    })
  
    $input.addEventListener('keydown', onKeyDown)
    $input.addEventListener('keyup', onKeyUp)
    $button.addEventListener('click', initGame)
  
    function getNextWord($currentWord) {
      const $next = $currentWord.nextElementSibling
      if ($next && ($next.tagName === 'BR' || $next.tagName === 'SPAN')) {
        return getNextWord($next)
      }
      return $next
    }

    function getPrevWord($currentWord) {
        const $prevWord = $currentWord.previousElementSibling
        if ($prevWord && ($prevWord .tagName === 'BR' || $prevWord .tagName === 'SPAN')) {
            return getPrevWord($prevWord)
        }
        return $prevWord 
      }
  
    function onKeyDown(event) {
      const $currentWord = $paragraph.querySelector('word.active')
      const $currentLetter = $currentWord.querySelector('letter.active')
      const $nextWord = getNextWord($currentWord)
      const { key } = event
  
      if (key === ' ') {
        event.preventDefault()
  
        const $nextLetter = $nextWord?.querySelector('letter')
  
        $currentWord.classList.remove('active', 'marked')
        $currentLetter.classList.remove('active')
  
        $nextWord?.classList.add('active')
        $nextLetter?.classList.add('active')
  
        $input.value = ''
  
        const hasMissedLetters = $currentWord.querySelectorAll('letter:not(.correct)').length > 0
        const classToAdd = hasMissedLetters ? 'marked' : 'correct'
        $currentWord.classList.add(classToAdd)
  
        return
      }
  
      if (key === 'Backspace') {
        const $prevWord = getPrevWord($currentWord)
        const $prevLetter = $currentLetter.previousElementSibling
  
        if (!$prevWord && !$prevLetter) {
          event.preventDefault()
          return
        }
  
        const $wordMarked = $paragraph.querySelector('word.marked')
        if ($wordMarked && !$prevLetter) {
          event.preventDefault()
          $prevWord.classList.remove('marked')
          $prevWord.classList.add('active')
  
          const $letterToGo = $prevWord.querySelector('letter:last-child')
  
          $currentLetter.classList.remove('active')
          $letterToGo.classList.add('active')
  
          $input.value = [...$prevWord.querySelectorAll('letter.correct, letter.incorrect')]
            .map($el => $el.classList.contains('correct') ? $el.innerText : '*')
            .join('')
        }
      }
    }
  
    function onKeyUp() {
      const $currentWord = $paragraph.querySelector('word.active')
      const $currentLetter = $currentWord.querySelector('letter.active')
      const $nextWord = getNextWord($currentWord)
  
      const currentWord = $currentWord.innerText.trim()
      $input.maxLength = currentWord.length
  
      const $allLetters = $currentWord.querySelectorAll('letter')
      $allLetters.forEach($l => $l.classList.remove('correct', 'incorrect'))
  
      $input.value.split('').forEach((char, index) => {
        const $letter = $allLetters[index]
        const expected = currentWord[index]
        const isCorrect = char === expected
        $letter.classList.add(isCorrect ? 'correct' : 'incorrect')
      })
  
      $currentLetter.classList.remove('active', 'is-last')
      const inputLength = $input.value.length
      const $nextActiveLetter = $allLetters[inputLength]
      if ($nextActiveLetter) {
        $nextActiveLetter.classList.add('active')
      } else {
        $currentLetter.classList.add('active', 'is-last')
        if ($nextWord === null) gameOver()
      }
    }
  
    function gameOver() {
      gameView.hideGame($game)
      const correctWords = $paragraph.querySelectorAll('word.correct').length
      const correctLetter = $paragraph.querySelectorAll('letter.correct').length
      const incorrectLetter = $paragraph.querySelectorAll('letter.incorrect').length
  
      const totalLetters = correctLetter + incorrectLetter
      const accuracy = totalLetters > 0 ? (correctLetter / totalLetters) * 100 : 0
      const wpm = correctWords * 60 / INITIAL_TIME
  
      gameView.showResults($results, wpm, accuracy)
    }
  
    async function initGame(config = {}) {
        try {
          gameView.showGame($game)
          gameView.hideResults($results)
          $input.value = ''
      
          currentTime = config.time ? Number(config.time) : INITIAL_TIME
          gameView.updateTime($time, currentTime)
      
          const snippet = await getRandomSnippet(config) 
          words = normalizeSnippetToWords(snippet)
      
          gameView.renderSnippet($paragraph, words)
        } catch (error) {
          console.error('Error initializing game:', error.message)
        }
      }

    return { init, updateConfig }
  }
  