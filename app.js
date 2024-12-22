const cells = document.querySelectorAll(".grid div");
const playerZeroid = "zeroid";
const playerCube = "cube";
let currentPlayer = playerZeroid;
const gameBoard = Array(9).fill(null);

function handleCellClick(event) {
  const cellIndex = Array.from(cells).indexOf(event.target);
  const playerIconId = `${currentPlayer}${cellIndex}`;

  if (gameBoard[cellIndex] === null) {

    gameBoard[cellIndex] = currentPlayer;
    // ... Place player's piece visually ...
    const playerIcon = document.getElementById(playerIconId);
    playerIcon.style.display = "block";
    // currentPlayer = currentPlayer === playerZeroid ? playerCube : playerZeroid;
    currentPlayer = playerCube;
    setTimeout(makeComputerMove, 1000);
    // makeComputerMove();
  } else {
    console.log("place taken");
  }
}

function handleCellMouseOver(event) {
  const cell = event.target;
  if (!cell.querySelector(`.${playerZeroid}, .${playerCube}`)) {
    cell.classList.add("hover");
  }
}

function handleCellMouseOut(event) {
  const cell = event.target;
  cell.classList.remove("hover");
}

function makeComputerMove() {
  // Find all empty cells based on the game board

  const emptyCells = [];
  for (let i = 0; i < gameBoard.length; i++) {
    if (gameBoard[i] === null) {
      emptyCells.push(i);
    }
  }

  // If there are no empty cells, the game is a draw (optional)
  if (emptyCells.length === 0) {
    console.log("It's a draw!");
    return;
  }

  // Select a random empty cell
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const computerMoveIndex = emptyCells[randomIndex];

  // Update the game board and place the computer's piece visually
  gameBoard[computerMoveIndex] = playerCube;
  const computerIconId = `${currentPlayer}${computerMoveIndex}`;
  const computerIcon = document.getElementById(computerIconId);
  computerIcon.style.display = "block";
  currentPlayer = playerZeroid;
}

cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
  cell.addEventListener("mouseover", handleCellMouseOver);
  cell.addEventListener("mouseout", handleCellMouseOut);
});

// CheckWinner function (if you haven't implemented it yet)
function checkWinner() {
  // ... your checkWinner logic here ...
}
