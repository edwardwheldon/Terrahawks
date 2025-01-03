const cells = document.querySelectorAll('.grid div');
const playerZeroid = 'zeroid';
const playerCube = 'cube';
let currentPlayer = playerZeroid;
const gameBoard = Array(9).fill(null);
const container = document.getElementById('container');
const introContainer = document.getElementById('intro-container');
const grid = document.getElementById('grid');
let isUserTurn = true;
const gameStatusElement = document.getElementById('gameStatus');
const restartButton = document.getElementById('restartButton');
const playerContainer = document.getElementById('player-container');

  restartButton.style.display = 'block';
  restartButton.addEventListener('click', restartGame);

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

introLine1 = document.getElementById('intro-line1');
introLine2 = document.getElementById('intro-line2');
introLine3 = document.getElementById('intro-line3');
introLine4 = document.getElementById('intro-line4');

startGame();

function startGame() {
  cells.forEach((cell) => {
    const winnerCellDiv = cell.querySelector('.winner-zeroid-cell, .winner-cube-cell');
        if (winnerCellDiv) {
      winnerCellDiv.remove();
    }
  });
  container.style.display = 'none';
  introContainer.style.display = 'block';

  // Show lines with initial opacity 0
  playerContainer.style.display = 'block';
  introLine1.style.opacity = 0;
  introLine2.style.opacity = 0;
  introLine3.style.opacity = 0;
  introLine4.style.opacity = 0;

  // Animate lines with delays
  setTimeout(() => {
    introLine1.style.opacity = 1;
  }, 0);
  setTimeout(() => {
    introLine2.style.opacity = 1;
  }, 700);
  setTimeout(() => {
    introLine3.style.opacity = 1;
  }, 1400);
  setTimeout(() => {
    introLine4.style.opacity = 1;
  }, 2000);

  grid.style.animation = 'rotateShift 1.5s forwards';

  // Hide intro, show game after final delay
  setTimeout(() => {
    introContainer.style.display = 'none';
    container.style.display = 'flex';
  }, 2500);
}

function animateIcon(icon) {
  icon.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, fill: 'forwards' });
}

function handleCellClick(event) {
  if (!isUserTurn) {
    return;
  }

  const cellIndex = Array.from(cells).indexOf(event.target);
  const playerIconId = `${currentPlayer}${cellIndex}`;

  if (gameBoard[cellIndex] === null) {
    gameBoard[cellIndex] = currentPlayer;

    const playerIcon = document.getElementById(playerIconId);
    playerIcon.style.display = 'block';

    animateIcon(playerIcon);

    currentPlayer = playerCube;
    isUserTurn = false;

    const winner = checkWinner();

    if (winner) {
      handleGameEnd(winner);
      return;
    }

    setTimeout(makeComputerMove, 1000);
  } else {
    console.log('place taken');
  }
}

function handleCellMouseOver(event) {
  const cell = event.target;
  if (!cell.querySelector(`.${playerZeroid}, .${playerCube}`)) {
    cell.classList.add('hover');
  }
}

function handleCellMouseOut(event) {
  const cell = event.target;
  cell.classList.remove('hover');
}

function makeComputerMove() {
  const emptyCells = [];
  for (let i = 0; i < gameBoard.length; i++) {
    if (gameBoard[i] === null) {
      emptyCells.push(i);
    }
  }

  if (emptyCells.length === 0) {
    console.log("It's a draw!");
    return;
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const computerMoveIndex = emptyCells[randomIndex];

  gameBoard[computerMoveIndex] = playerCube;
  const computerIconId = `${currentPlayer}${computerMoveIndex}`;
  const computerIcon = document.getElementById(computerIconId);
  computerIcon.style.display = 'block';

  animateIcon(computerIcon);

  currentPlayer = playerZeroid;
  isUserTurn = true;

  const winner = checkWinner();
  if (winner) {
    handleGameEnd(winner);
  }
}

function checkWinner() {

  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      console.log(condition);
      return gameBoard[a];
    }
  }

  // Check for a draw
  if (!gameBoard.includes(null)) {
    return handleGameEnd('draw');
  }

  return null; // No winner yet
}

function restartGame() {
  // container.style.display = 'none';
  playerContainer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 0, fill: 'forwards' });
  // playerContainer.style.opacity = '1';
  startGame();

  currentPlayer = playerZeroid;
  gameBoard.fill(null);
  isUserTurn = true;

  gameStatusElement.textContent = 'Zeroids vs Cubes';

  cells.forEach((cell) => {
    // const winnerCellDiv = cell.querySelector('.winner-zeroid-cell, .winner-cube-cell');
    //     if (winnerCellDiv) {
    //   winnerCellDiv.remove();
    // }
    // cell.classList.remove('hover');

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

  if (winner === 'zeroid' || winner === 'cube') {
    gameStatusElement.textContent = winner === 'zeroid' ? 'Zeroids Conquer!' : 'Cubes Triumph!';

    // Identify winning cells
    const winningCells = [];
    winConditions.forEach((condition) => {
      const [a, b, c] = condition;
      if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c] && gameBoard[a] === winner) {
        winningCells.push(a, b, c);
      }
    });

    // Create winner cell div and apply class based on winner
    winningCells.forEach((index) => { 
      let winnerCellDiv; 
      winnerCellDiv = document.createElement('div');

      if (winner === 'cube') { 
        const crossSpan = document.createElement('span');
        crossSpan.classList.add('winner-cube-cross'); 
        crossSpan.classList.add('cross'); 
        winnerCellDiv.appendChild(crossSpan); 
      }

      playerContainer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1000, fill: 'forwards' });
      winnerCellDiv.classList.add(winner === 'zeroid' ? 'winner-zeroid-cell' : 'winner-cube-cell');
      setTimeout(() => {
      cells[index].appendChild(winnerCellDiv); 
    }, 1000);
    });
  } else {
    gameStatusElement.textContent = "It's a Draw!";
  }
  cells.forEach((cell) => cell.removeEventListener('click', handleCellClick));
  // restartButton.style.display = 'block';
  // restartButton.addEventListener('click', restartGame);

  setTimeout(() => {

    grid.style.animation = 'rotateShiftReverse 1s forwards';
  }, 1000);

  // playerContainer.style.display = 'none';
}

cells.forEach((cell) => {
  cell.addEventListener('click', handleCellClick);
  cell.addEventListener('mouseover', handleCellMouseOver);
  cell.addEventListener('mouseout', handleCellMouseOut);
});
