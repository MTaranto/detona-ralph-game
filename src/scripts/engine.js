// Constants
const GAME_LEVELS = {
  easy: 1500,
  normal: 1000,
  hard: 600
};

const INITIAL_STATE = {
  lives: 3,
  result: 0,
  currentTime: 60,
  hitPosition: 0,
  level: null
};

// Game state
const state = {
  audio: {
    backgroundMusic: new Audio('./src/sounds/background.m4a')
  },
  view: {
    squares: document.querySelectorAll('.square'),
    enemy: document.querySelector('.enemy'),
    timeLeft: document.querySelector('#time-left'),
    score: document.querySelector('#score'),
    lives: document.querySelector('#lives')
  },
  values: { ...INITIAL_STATE },
  actions: {
    timerId: null,
    enemyTimerId: null,
  }
};

// Audio functions
const audio = {
  startBackgroundMusic: () => {
    state.audio.backgroundMusic.loop = true;
    state.audio.backgroundMusic.volume = 0.5;
    state.audio.backgroundMusic.play();
  },
  stopBackgroundMusic: () => {
    state.audio.backgroundMusic.pause();
    state.audio.backgroundMusic.currentTime = 0;
  },
  playSound: (audioName) => {
    const audio = new Audio(`./src/sounds/${audioName}.m4a`);
    audio.volume = 0.3;
    audio.play();
  }
};

// Game logic functions
const game = {
  levelSelect: () => {
    audio.startBackgroundMusic();
    document.getElementById('select-level').style.display = 'flex';
    const selectedLevel = document.getElementById('difficulty');
    const levelValue = selectedLevel.value;
    state.values.level = GAME_LEVELS[levelValue];
    document.getElementById('level').textContent = selectedLevel.value;
    document.getElementById('lives').textContent = `x${state.values.lives}`;
    document.getElementById('startButton').disabled = false;
  },
  countDown: () => {
    state.actions.timerId = setInterval(() => {
      if (state.values.currentTime <= 0) {
        game.stop();
        audio.stopBackgroundMusic();
        document.getElementById('final-score').style.display = 'block';
        document.getElementById('points').textContent = `You win! Your final score was ${state.values.result} points!`;
        audio.playSound('win');
      } else {
        state.values.currentTime--;
        state.view.timeLeft.textContent = state.values.currentTime;
      }
    }, 1000);
  },
  randomSquare: () => {
    state.view.squares.forEach(square => square.classList.remove('enemy'));
    const randomSquare = state.view.squares[Math.floor(Math.random() * 9)];
    randomSquare.classList.add('enemy');
    state.values.hitPosition = randomSquare.id;
    audio.playSound('pluck');
  },
  moveEnemy: () => {
    if (state.actions.timerId >= 0) {
      state.actions.enemyTimerId = setInterval(game.randomSquare, state.values.level);
    } else {
      game.stop();
    }
  },
  squareClickHandler: (e) => {
    if (e.target.id === state.values.hitPosition) {
      state.values.result++;
      state.view.score.textContent = state.values.result;
      state.values.hitPosition = null;
      audio.playSound('hit');
    } else {
      state.values.lives--;
      state.view.lives.textContent = `x${state.values.lives}`;
      audio.playSound('error');
      if (state.values.lives <= 0) {
        audio.stopBackgroundMusic();
        audio.playSound('gameover');
        game.stop();
        document.getElementById('restart').style.display = 'block';
        game.removeListenerHitBox();
      }
    }
  },
  addListenerHitBox: () => {
    state.view.squares.forEach(square => {
      square.removeEventListener('mousedown', game.squareClickHandler);
      square.addEventListener('mousedown', game.squareClickHandler);
    });
  },
  removeListenerHitBox: () => {
    state.view.squares.forEach(square => {
      square.removeEventListener('mousedown', game.squareClickHandler);
    });
  },
  stop: () => {
    clearInterval(state.actions.timerId);
    clearInterval(state.actions.enemyTimerId);
  },
  initialize: () => {
    if (!state.values.level) {
      alert("Por favor, selecione um nível antes de iniciar o jogo!");
      return;
    }
    document.getElementById('select-level').style.display = 'none';
    game.removeListenerHitBox();
    game.addListenerHitBox();
    game.moveEnemy();
    game.countDown();
  },
  restart: () => {
    document.getElementById('restart').style.display = 'none';
    document.getElementById('select-level').style.display = 'flex';
    document.getElementById('final-score').style.display = 'none';

    Object.assign(state.values, INITIAL_STATE);

    state.view.lives.textContent = `x${state.values.lives}`;
    state.view.score.textContent = state.values.result;
    state.view.timeLeft.textContent = state.values.currentTime;

    game.removeListenerHitBox();
    game.stop();

    const difficultySelect = document.getElementById('difficulty');
    difficultySelect.selectedIndex = 0;
    document.getElementById('level').textContent = '';
    document.getElementById('startButton').disabled = true;

    setupEventListeners();
  },
  finish: () => {
    document.getElementById('restart').style.display = 'none';
    document.getElementById('final-score').style.display = 'none';
    document.getElementById('thanks').style.display = 'block';
    game.removeListenerHitBox();
  }
};

// Event listeners setup
function setupEventListeners() {
  document.getElementById('difficulty').addEventListener('change', game.levelSelect);
  document.getElementById('startButton').addEventListener('click', game.initialize);
  document.getElementById('restartButton').addEventListener('click', game.restart);
  document.getElementById('finishButton').addEventListener('click', game.finish);
  document.getElementById('playAgainButton').addEventListener('click', game.restart);
  document.getElementById('endButton').addEventListener('click', game.finish);
}

// Initialize the game
setupEventListeners();