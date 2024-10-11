const state = {
  // view: {
  //   squares: document.querySelectorAll('.square'),
  //   enemy: document.querySelector('.enemy'),
  //   timeLeft: document.querySelector('#time-left'),
  //   score: document.querySelector('#score')
  // },
  values: {
    clock: 1000,
    gameLevel: {
      easy: 1800,
      normal: 1000,
      hard: 600
    },
    level: null,
    hitPosition: 0,
    result: 0,
    currentTime: 60
  },
  actions: {
    timerId: null,
    enemyTimerId: null,
  }
}

function levelSelect() {
  let selectedLevel = document.getElementById('difficulty') // Remova o #
  let levelValue = selectedLevel.value
  state.values.level = state.values.gameLevel[levelValue] // Use o valor para definir o tempo correto
}
console.log(state.values.level)
console.log('TESTE')
