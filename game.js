const PlayerType = {
  ZEROID: 'zeroid',
  CUBE: 'cube',
};

const AiType = {
  RANDOM: 'random',
  BASIC: 'basic',
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

  copy() {
    const copiedGame = new Game(this.aiType);
    copiedGame.currentPlayer = this.currentPlayer;
    copiedGame.isUserTurn = this.isUserTurn;
    copiedGame.board = [...this.board];
    return copiedGame;
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
  checkGameEnd(board = undefined) {
    if (board === undefined) {
      board = this.board;
    }
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
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    // Check for a draw
    if (!board.includes(null)) {
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
    let computerMoveIndex = 0;

    switch (this.aiType) {
      case AiType.RANDOM:
        computerMoveIndex = this.getComputerMoveRandom();
        break;
      case AiType.BASIC:
        computerMoveIndex = this.getComputerMoveBasic();
        break;
      case AiType.UNBEATABLE:
        computerMoveIndex = this.getComputerMoveUnbeatable();
        break;
    }

    if (!this.makeMove(computerMoveIndex)) {
      throw new Error(`The computer wanted to move to ${computerMoveIndex} but could not`);
    }

    return computerMoveIndex;
  }

  getComputerMoveRandom() {
    const emptyCells = [];
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === null) {
        emptyCells.push(i);
      }
    }

    if (emptyCells.length === 0) {
      throw new Error(`The game is already complete, the computer shouldn't be trying to move`);
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }

  /**
   * This AI is slightly better than random, but only just, it will make a random move,
   * unless the opponent can move on the very next move,
   * still easy to beat if you can make a double win combo, eg you're X on the below board
   * O cannot block both the move at index 3 and 7 at the same time
   * X| |O
   * -----
   *  |O|
   * -----
   * X| |X
   */
  getComputerMoveBasic() {
    const emptyCells = [];
    const opponent = this.currentPlayer === PlayerType.ZEROID ? PlayerType.CUBE : PlayerType.ZEROID;

    for (let i = 0; i < 9; i++) {
      if (this.board[i] === null) {
        // check if can win
        const winCopy = this.copy();
        winCopy.makeMove(i);
        if (winCopy.checkGameEnd() === this.currentPlayer) {
          return i;
        }

        const loseCopy = this.copy();
        loseCopy.currentPlayer = opponent;
        loseCopy.makeMove(i);
        if (loseCopy.checkGameEnd() === opponent) {
          return i;
        }
        emptyCells.push(i);
      }
    }

    if (emptyCells.length === 0) {
      throw new Error(`The game is already complete, the computer shouldn't be trying to move`);
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }

  score(gameEndWinner, player) {
    if (gameEndWinner === null) {
      throw new Error(`Can't get score of a game that's in progress`);
    }
    if (gameEndWinner === 'draw') {
      return 0;
    }
    return player === gameEndWinner ? 1 : -1;
  }

  /**
   *
   * @param {*} game the current game state
   * @param {*} player the player in which we want to win
   * @returns an object with the best move index and the calculated score
   * {
   *  moveIndex, (board Index)
   *  score: (1 = Win, -1 = Lose, 0 = Draw)
   * }
   *
   * For larger games we could also add memoization, and alpha beta pruning,
   * but tic tac toe is so small we can just calculate every single outcome
   * it's a lot but not for a machine, 9 possible moves, followed by 8,7,6 etc
   * this gives 9*8*7*6*5*4*3*2*1 = 362,880, or 9 factorial represented as 9!
   * considering you always go first this can be lowered to 8! or 40,320,
   * and actually even less if you consider games ending without using all moves
   */
  static minMax(game, player) {
    const gameEnded = game.checkGameEnd(game.board);
    if (gameEnded !== null) {
      // we only need the score here but it still needs to be an object
      return { score: game.score(gameEnded, player) };
    }

    // loop through all available squares and calculate the best possible score for each move
    const possibleMoves = [];
    for (let i = 0; i < 9; i++) {
      if (game.board[i] === null) {
        const newGame = game.copy();
        newGame.makeMove(i);
        const move = Game.minMax(newGame, player);
        possibleMoves.push({ moveIndex: i, score: move.score });
      }
    }

    if (possibleMoves.length === 0) {
      throw new Error(`The game is already complete, the computer shouldn't be trying to move`);
    }

    /*
     Sort the moves by score depending on which player we want to win,
     If the current player is the one we want to win, then return the best move
     If the current player is the one we want to lose, then return the worst possible move
    */
    if (game.currentPlayer !== player) {
      // Minimising by sorting worst score to best
      possibleMoves.sort((a, b) => a.score - b.score);
    } else {
      // Maximising by sorting best score to worst
      possibleMoves.sort((a, b) => b.score - a.score);
    }
    // return a random move from all that are the same score as the first in the list
    // this way the AI has a little variation instead of playing the same sequence each time
    const bestScore = possibleMoves[0].score;
    const bestMoves = possibleMoves.filter((move) => move.score === bestScore);
    const randomIndex = Math.floor(Math.random() * bestMoves.length);
    return bestMoves[randomIndex];
  }

  getComputerMoveUnbeatable() {
    const bestMove = Game.minMax(this.copy(), this.currentPlayer);
    return bestMove.moveIndex;
  }
}
