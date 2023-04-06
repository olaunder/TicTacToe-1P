// Game variables
let board;
let turn;
let winner;
let playerTurn;

// DOM elements
const cells = document.querySelectorAll('.cell');
const result = document.getElementById('result');
const restartBtn = document.getElementById('restart-btn');
const turnDisplay = document.getElementById('turn');

// Add event listeners to cells and restart button
cells.forEach(cell => cell.addEventListener('click', play));
restartBtn.addEventListener('click', restart);

// Initialize game
restart();

// Functions
function restart() {
  board = ['', '', '', '', '', '', '', '', ''];
  turn = 'X';
  winner = null;
  displayBoard();
  result.textContent = '';
  turnDisplay.textContent = 'Your Turn';
  turnDisplay.style.display = 'block'; // show the turn display
  // Add event listeners back to the cells
  cells.forEach(cell => {
    cell.addEventListener('click', play);
  });
  playerTurn = true; // set to player's turn
}

function displayBoard() {
  board.forEach((cell, index) => {
    cells[index].textContent = cell;
  });
}

function play(event) {
  if (!playerTurn) {
    return; // exit if it's not player's turn
  }
  const index = event.target.id.split('-')[1];
  if (board[index] === '' && !winner) {
    board[index] = turn;
    displayBoard();
    checkWin();
    if (!winner) {
      turn = turn === 'X' ? 'O' : 'X';
      turnDisplay.textContent = turn === 'X' ? 'Your Turn' : 'Bot\'s Turn';
      if (turn === 'O') {
        playerTurn = false; // set to bot's turn
        // Delay AI Bot's move by 1 second
        turnDisplay.style.display = 'none'; // hide the turn display
        setTimeout(() => {
          const aiMove = getAIMove();
          board[aiMove] = 'O';
          displayBoard();
          checkWin();
          turn = 'X';
          turnDisplay.style.display = 'block'; // show the turn display
          turnDisplay.textContent = 'Your Turn';
          playerTurn = true; // set to player's turn
        }, 1500);
      }
    }
  }
}

function getAIMove() {
  // Find the closest cell to a winning combination
  const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
  ];
  
  let bestScore = -Infinity;
  let bestMove = null;
  for (let i = 0; i < board.length; i++) {
  if (board[i] === '') {
  for (let j = 0; j < winningCombinations.length; j++) {
  const [a, b, c] = winningCombinations[j];
  if (winningCombinations[j].includes(i)) {
  let score = 1;
  if (board[a] === 'O') score *= 2;
  if (board[b] === 'O') score *= 2;
  if (board[c] === 'O') score *= 2;
  if (board[a] === 'X' || board[b] === 'X' || board[c] === 'X') score *= -1; // Block the player's move
  if (score > bestScore) {
  bestScore = score;
  bestMove = i;
  }
  }
  }
  }
  }
  // If no cell is close to a winning combination, choose a random empty cell
  if (bestMove === null) {
  const emptyCells = [];
  for (let i = 0; i < board.length; i++) {
  if (board[i] === '') {
  emptyCells.push(i);
  }
  }
  bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }
  return bestMove;
  }
  
  function checkWin() {
  const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
  ];
  
  for (let i = 0; i < winningCombinations.length; i++) {
  const [a, b, c] = winningCombinations[i];
  if (board[a] && board[a] === board[b] && board[a] === board[c]) {
  winner = board[a];
  result.textContent = winner === 'X' ? 'You win!' : 'Bot wins!';
  turnDisplay.style.display = 'none'; // hide the turn display
  // Remove event listeners from cells to prevent further clicks
  cells.forEach(cell => {
  cell.removeEventListener('click', play);
  });
  return;
  }
  }
  
  if (!board.includes('')) {
  // Game is a draw
  winner = 'draw';
  result.textContent = 'Draw!';
  turnDisplay.style.display = 'none'; // hide the turn display
  }
  }