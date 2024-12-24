const cells = document.querySelectorAll('.grid div');
const container = document.getElementById('container');
const introContainer = document.getElementById('intro-container');
const grid = document.getElementById('grid');
const gameStatusElement = document.getElementById('gameStatus');
const restartButton = document.getElementById('restartButton');
const game = new Game(AiType.RANDOM);

introLine1 = document.getElementById('intro-line1');
introLine2 = document.getElementById('intro-line2');
introLine3 = document.getElementById('intro-line3');
introLine4 = document.getElementById('intro-line4');

function animateLine(line, delay) {
  return new Promise((resolve) => {
    line.style.opacity = 0;
    setTimeout(() => {
      line
        .animate([{ opacity: 0.25 }, { opacity: 1 }], {
          duration: 200,
          fill: 'forwards',
        })
        .finished.then(resolve);
    }, delay);
  });
}

animateLine(introLine1, 0)
  .then(() => animateLine(introLine2, 1000))
  .then(() => animateLine(introLine3, 700))
  .then(() => animateLine(introLine4, 400))
  .then(() => {
    introContainer.style.display = 'none';
    container.style.display = 'flex';
  });

function animateIcon(iconId) {
  const icon = document.getElementById(iconId);
  icon.style.display = 'block';
  if (iconId[0] == 'z') {
    // Zeroid
    icon.animate([{ opacity: 0.25 }, { opacity: 1 }], {
      duration: 200,
      fill: 'forwards',
    });
  } else {
    // Cube
    icon.animate([{ opacity: 1 }, { opacity: 0.25 }], {
      duration: 200,
    });
  }
}

function handleCellClick(event) {
  if (!game.isUserTurn) {
    return;
  }

  const cellIndex = Array.from(cells).indexOf(event.target);
  const playerIconId = `${game.currentPlayer}${cellIndex}`;

  if (!game.makeMove(cellIndex)) {
    return;
  }

  animateIcon(playerIconId);

  checkGameEnd();
}

function makeComputerMove() {
  const currentPlayer = game.currentPlayer;
  const computerMoveIndex = game.makeComputerMove();
  const computerIconId = `${currentPlayer}${computerMoveIndex}`;
  animateIcon(computerIconId);
  checkGameEnd();
}

function checkGameEnd() {
  const gameEndState = game.checkGameEnd();

  if (gameEndState) {
    handleGameEnd(gameEndState);
  } else {
    if (!game.isUserTurn) {
      setTimeout(makeComputerMove, 1000);
    }
  }
}

function handleCellMouseOver(event) {
  const cell = event.target;
  if (!cell.querySelector(`.${PlayerType.ZEROID}, .${PlayerType.CUBE}`)) {
    cell.classList.add('hover');
  }
}

function handleCellMouseOut(event) {
  const cell = event.target;
  cell.classList.remove('hover');
}

function restartGame() {
  container.style.display = 'none';
  introContainer.style.display = 'flex';

  animateLine(introLine1, 0)
    .then(() => animateLine(introLine2, 1000))
    .then(() => animateLine(introLine3, 700))
    .then(() => animateLine(introLine4, 400))
    .then(() => {
      introContainer.style.display = 'none';
      container.style.display = 'flex';
    });

  game.reset();

  gameStatusElement.textContent = 'Zeroids vs Cubes';

  cells.forEach((cell) => {
    cell.classList.remove('hover');
    const cellIndex = Array.from(cells).indexOf(cell);
    const zeroidIconId = `zeroid${cellIndex}`;
    const cubeIconId = `cube${cellIndex}`;
    const zeroidIcon = document.getElementById(zeroidIconId);
    const cubeIcon = document.getElementById(cubeIconId);

    console.log(zeroidIcon);
    console.log(cubeIcon);

    zeroidIcon.style.display = 'none';
    cubeIcon.style.display = 'none';

    cells.forEach((cell) => cell.addEventListener('click', handleCellClick));
  });
}

function handleGameEnd(winner) {
  cells.forEach((cell) => cell.removeEventListener('click', handleCellClick));

  if (winner === 'zeroid') {
    gameStatusElement.textContent = 'Zeroids Conquer!';
  } else if (winner === 'cube') {
    gameStatusElement.textContent = 'Cubes Triumph!';
  } else {
    gameStatusElement.textContent = "It's a Draw!";
  }

  restartButton.style.display = 'block';
  restartButton.addEventListener('click', restartGame);
}

cells.forEach((cell) => {
  cell.addEventListener('click', handleCellClick);
  cell.addEventListener('mouseover', handleCellMouseOver);
  cell.addEventListener('mouseout', handleCellMouseOut);
});
