const PlayerType = {
  ZEROID: 'zeroid',
  CUBE: 'cube',
};

const AiType = {
  RANDOM: 'random',
  UNBEATABLE: 'unbeatable',
};

class Game {
  currentPlayer = PlayerType.ZEROID;
  isUserTurn = true;
  board = Array(9).fill(null);
  aiType;

  constructor(aiType) {
    this.aiType = aiType;
  }

  reset() {
    this.isUserTurn = true;
    this.board = Array(9).fill(null);
  }

  switchPlayer() {
    if (this.currentPlayer === PlayerType.CUBE) {
      this.currentPlayer = PlayerType.ZEROID;
    } else {
      this.currentPlayer = PlayerType.CUBE;
    }
    this.isUserTurn = !this.isUserTurn;
  }

  /**
   *
   * @returns PlayerType if there is a win, 'draw', or null if the game is still in progress
   */
  checkGameEnd() {
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

    // Check for a win
    for (const condition of winConditions) {
      const [a, b, c] = condition;
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return this.board[a];
      }
    }

    // Check for a draw
    if (!this.board.includes(null)) {
      return 'draw';
    }

    // Game still in progress
    return null;
  }

  /**
   *
   * @param {*} index the index of the cell you want the players piece to go
   * @returns true if move is possible, false if invalid
   */
  makeMove(index) {
    if (this.board[index] !== null) {
      console.log('place taken');
      return false;
    }

    this.board[index] = this.currentPlayer;
    this.switchPlayer();
    return true;
  }

  /**
   *
   * @returns board index of place played if move is possible
   * @throws error if it is not possible to make a move
   */
  makeComputerMove() {
    switch (this.aiType) {
      case AiType.RANDOM:
        return this.makeComputerMoveRandom();
      case AiType.UNBEATABLE:
        return this.makeComputerMoveUnbeatable();
    }
  }

  makeComputerMoveRandom() {
    const emptyCells = [];
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i] === null) {
        emptyCells.push(i);
      }
    }

    if (emptyCells.length === 0) {
      throw new Error(`The game is already complete, the computer shouldn't be trying to move`);
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const computerMoveIndex = emptyCells[randomIndex];

    if (!this.makeMove(computerMoveIndex)) {
      throw new Error(`The computer wanted to move to ${computerMoveIndex} but could not`);
    }

    return computerMoveIndex;
  }

  makeComputerMoveUnbeatable() {
    // TODO
    return this.makeComputerMoveRandom();
  }
}
