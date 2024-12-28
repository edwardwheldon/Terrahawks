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

introLine1 = document.getElementById('intro-line1');
introLine2 = document.getElementById('intro-line2');
introLine3 = document.getElementById('intro-line3');
introLine4 = document.getElementById('intro-line4');

startGame();

function startGame() {
  // Show lines with initial opacity 0
  introLine1.style.opacity = 0;
  introLine2.style.opacity = 0;
  introLine3.style.opacity = 0;
  introLine4.style.opacity = 0;

  // Animate lines with delays
  setTimeout(() => { introLine1.style.opacity = 1; }, 0);
  setTimeout(() => { introLine2.style.opacity = 1; }, 700);
  setTimeout(() => { introLine3.style.opacity = 1; }, 1400);
  setTimeout(() => { introLine4.style.opacity = 1; }, 2000);

  // Hide intro, show game after final delay
  setTimeout(() => {
    introContainer.style.display = "none";
    container.style.display = "flex";
  }, 2500); // Adjust this delay as needed
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
    playerIcon.animate(
      [
        { opacity: 0.25 },
        {
          opacity: 1,
        },
      ],
      {
        duration: 200,
        fill: 'forwards',
      },
    );

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
  computerIcon.animate(
    [
      {
        opacity: 1,
      },
      {
        opacity: 0.25,
      },
    ],
    {
      duration: 200,
    },
  );
  currentPlayer = playerZeroid;
  isUserTurn = true;

  const winner = checkWinner();
  if (winner) {
    handleGameEnd(winner);
  }
}

function checkWinner() {
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

  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
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
  container.style.display = 'none';
  introContainer.style.display = 'flex';

  startGame();

  currentPlayer = playerZeroid;
  gameBoard.fill(null);
  isUserTurn = true;

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
