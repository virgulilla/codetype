export const gameView = {
    renderSnippet($container, words) {
      const html = []
  
      for (const word of words) {
        if (typeof word === 'object') {
          if (word.type === 'newline') {
            html.push('<br>')
          }
          if (word.type === 'whitespace') {
            html.push('<span class="space">&nbsp;</span>')
          }
        } else {
          const letters = word.split('')
          html.push(
            `<word>${letters.map(letter => `<letter>${letter}</letter>`).join('')}</word>`
          )
        }
      }
  
      $container.innerHTML = html.join('')
  
      const $firstWord = $container.querySelector('word')
      $firstWord?.classList.add('active')
      $firstWord?.querySelector('letter')?.classList.add('active')
    },
  
    showGame($game) {
      $game.style.display = 'flex'
    },
  
    hideGame($game) {
      $game.style.display = 'none'
    },
  
    showResults($results, wpm, accuracy) {
      $results.style.display = 'flex'
      $results.querySelector('#results-wpm').textContent = wpm
      $results.querySelector('#results-accuracy').textContent = `${accuracy.toFixed(2)}%`
    },
  
    hideResults($results) {
      $results.style.display = 'none'
    },
  
    updateTime($time, time) {
      $time.textContent = time
    }
  }
  