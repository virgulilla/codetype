import { loadConfig } from '../utils/configStorage.js'

export const configGame = ($nav) => {
    const $optionValues = $nav.querySelector('#option-values')
    const currentConfig = loadConfig()
  
    const optionsMap = {
      'option-language': ['JavaScript', 'Python', 'Go'],
      'option-time': ['15', '30', '60', '120'],
      'option-length': ['Short', 'Medium', 'Long']
    }
  
    const renderOptions = (options, category) => {
        const currentValue = currentConfig[category]
        $optionValues.innerHTML = options.map(opt => {
            const isActive = opt === currentValue
            return `
              <button class="${isActive ? 'text-yellow-400 font-semibold' : 'hover:text-white'}" data-value="${opt}">
                ${opt}
              </button>
            `
          }).join('')
  
      $optionValues.querySelectorAll('button').forEach($btn => {
        $btn.addEventListener('click', () => {
          const value = $btn.dataset.value
          const $previous = $optionValues.querySelector('.text-yellow-400')
          if ($previous) {
            $previous.classList.remove('text-yellow-400', 'font-semibold')
            $previous.classList.add('hover:text-white')
          }

          $btn.classList.remove('hover:text-white')
          $btn.classList.add('text-yellow-400', 'font-semibold')


          $nav.dispatchEvent(new CustomEvent('optionSelected', {
            detail: { category, value },
            bubbles: true
          }))
        })
      })
    }
  
    $nav.querySelectorAll('button[id^="option-"]').forEach($btn => {
      const category = $btn.id.replace('option-', '')
  
      $btn.addEventListener('click', () => {
        renderOptions(optionsMap[$btn.id], category)
      })
    })
  }
  