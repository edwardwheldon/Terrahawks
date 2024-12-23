const cells = document.querySelectorAll(".grid div");
const playerZeroid = "zeroid";
const playerCube = "cube";
let currentPlayer = playerZeroid;
const gameBoard = Array(9).fill(null);
const container = document.getElementById("container");
const introContainer = document.getElementById("intro-container");
let isUserTurn = true;

introLine1 = document.getElementById("intro-line1");
introLine2 = document.getElementById("intro-line2");
introLine3 = document.getElementById("intro-line3");
introLine4 = document.getElementById("intro-line4");

function animateLine(line, delay) {
  return new Promise((resolve) => {
    line.style.opacity = 0;
    setTimeout(() => {
      line
        .animate([{ opacity: 0.25 }, { opacity: 1 }], {
          duration: 200,
          fill: "forwards",
        })
        .finished.then(resolve);
    }, delay);
  });
}

animateLine(introLine1, 0)
  .then(() => animateLine(introLine2, 1000))
  .then(() => animateLine(introLine3, 1000))
  .then(() => animateLine(introLine4, 500))
  .then(() => {
    introContainer.style.display = "none";
    container.style.display = "flex";
  });

function handleCellClick(event) {
  if (!isUserTurn) {
    return;
  }

  const cellIndex = Array.from(cells).indexOf(event.target);
  const playerIconId = `${currentPlayer}${cellIndex}`;

  if (gameBoard[cellIndex] === null) {
    gameBoard[cellIndex] = currentPlayer;

    const playerIcon = document.getElementById(playerIconId);

    playerIcon.animate(
      [
        { opacity: 0.25 },
        {
          opacity: 1,
          display: "block",
        },
      ],
      {
        duration: 200,
        fill: "forwards",
      }
    );

    currentPlayer = playerCube;
    isUserTurn = false;

    const winner = checkWinner();

    if (winner) {
      handleGameEnd(winner);
      return;
    }

    setTimeout(makeComputerMove, 2000);
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
  computerIcon.style.display = "block";
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
    }
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
    if (
      gameBoard[a] &&
      gameBoard[a] === gameBoard[b] &&
      gameBoard[a] === gameBoard[c]
    ) {
      return gameBoard[a];
    }
  }

  // Check for a draw
  if (!gameBoard.includes(null)) {
    return handleGameEnd("draw");
  }

  return null; // No winner yet
}

function handleGameEnd(winner) {
  if (winner === "draw") {
    alert("It's a draw!");
  } else {
    alert(`${winner} has won!`);
  }
}

cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
  cell.addEventListener("mouseover", handleCellMouseOver);
  cell.addEventListener("mouseout", handleCellMouseOut);
});
