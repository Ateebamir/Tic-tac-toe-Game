// game.js

const startCard = document.getElementById("start-card");
const gameCard = document.getElementById("game-card");
const aNameInput = document.getElementById("aName");
const bNameInput = document.getElementById("bName");
const aSymSelect = document.getElementById("aSym");
const startBtn = document.getElementById("startBtn");
const demoBtn = document.getElementById("demoBtn");

const boardEl = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const turnInfo = document.getElementById("turnInfo");
const message = document.getElementById("message");
const messageText = document.getElementById("messageText");
const playAgain = document.getElementById("playAgain");
const newMatch = document.getElementById("newMatch");
const resetBtn = document.getElementById("resetBtn");
const homeBtn = document.getElementById("homeBtn");

const scoreA = document.getElementById("scoreA");
const scoreB = document.getElementById("scoreB");
const labelA = document.getElementById("labelA");
const labelB = document.getElementById("labelB");

let gameState = Array(9).fill(null);
let currentPlayer = "X";
let playerA = "Player A";
let playerB = "Player B";
let symbolA = "X";
let symbolB = "O";
let winner = null;
let scores = { A: 0, B: 0 };
let gameCounter = 1; // Tracks which game (for AI behavior)
let vsComputer = false;

// Winning lines
const lines = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

// Start game
startBtn.addEventListener("click", () => {
  playerA = aNameInput.value || "Player A";
  playerB = bNameInput.value || "Player B";
  symbolA = aSymSelect.value;
  symbolB = symbolA === "X" ? "O" : "X";

  labelA.textContent = `${playerA} (${symbolA})`;
  labelB.textContent = `${playerB} (${symbolB})`;

  vsComputer = playerB.toLowerCase().includes("computer") || demoBtn === true;

  startCard.classList.add("hidden");
  gameCard.classList.remove("hidden");

  resetBoard();
});

// Demo button for Human vs Computer
demoBtn.addEventListener("click", () => {
  aNameInput.value = "Human";
  bNameInput.value = "Computer";
  startBtn.click();
});

// Cell click
cells.forEach(cell => {
  cell.addEventListener("click", () => {
    const idx = parseInt(cell.dataset.i);
    if (!gameState[idx] && !winner && (!vsComputer || currentPlayer === symbolA)) {
      makeMove(idx, currentPlayer);
      if (vsComputer && !winner) {
        setTimeout(computerMove, 300);
      }
    }
  });
});

// Make a move
function makeMove(idx, player) {
  gameState[idx] = player;
  cells[idx].textContent = player;
  checkWinner();
  if (!winner) {
    currentPlayer = currentPlayer === symbolA ? symbolB : symbolA;
    updateTurnInfo();
  }
}

// Update turn info
function updateTurnInfo() {
  turnInfo.textContent = currentPlayer === symbolA ? `${playerA}'s Turn` : `${playerB}'s Turn`;
}

// Reset board
function resetBoard() {
  gameState.fill(null);
  winner = null;
  currentPlayer = symbolA;
  cells.forEach(cell => cell.textContent = "");
  message.classList.add("hidden");
  updateTurnInfo();
}

// Computer move logic
function computerMove() {
  const emptyIdx = gameState.map((v,i) => v===null?i:null).filter(v=>v!==null);
  if (emptyIdx.length === 0) return;

  let move;
  // 1st & 2nd game: never lose
  if (gameCounter % 3 !== 0) {
    move = bestMove(gameState, symbolB, symbolA); // AI block/win
  } else {
    // 3rd game: random (can lose)
    move = emptyIdx[Math.floor(Math.random()*emptyIdx.length)];
  }

  makeMove(move, symbolB);
}

// AI: tries to win, else block
function bestMove(board, ai, human) {
  // Win if possible
  for (let i=0;i<board.length;i++){
    if (!board[i]){
      board[i]=ai;
      if (checkLines(board)===ai){ board[i]=null; return i; }
      board[i]=null;
    }
  }
  // Block human win
  for (let i=0;i<board.length;i++){
    if (!board[i]){
      board[i]=human;
      if (checkLines(board)===human){ board[i]=null; return i; }
      board[i]=null;
    }
  }
  // Else pick center
  if (!board[4]) return 4;
  // Else random
  const empty = board.map((v,i)=>v===null?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

// Check winner
function checkWinner() {
  for (let [a,b,c] of lines){
    if (gameState[a] && gameState[a]===gameState[b] && gameState[a]===gameState[c]){
      winner = gameState[a];
      showWinner(winner);
      return;
    }
  }
  if (!gameState.includes(null)){
    winner = "Draw";
    showWinner(winner);
  }
}

// Show winner message
function showWinner(win) {
  message.classList.remove("hidden");
  if (win==="Draw") messageText.textContent="It's a Draw!";
  else {
    messageText.textContent = win===symbolA ? `${playerA} Wins!` : `${playerB} Wins!`;
    if (win===symbolA) scores.A++; else scores.B++;
  }
  scoreA.textContent = scores.A;
  scoreB.textContent = scores.B;
  gameCounter++;
}

// Controls
resetBtn.addEventListener("click", resetBoard);
homeBtn.addEventListener("click", () => {
  gameCard.classList.add("hidden");
  startCard.classList.remove("hidden");
});
playAgain.addEventListener("click", resetBoard);
newMatch.addEventListener("click", () => {
  scores = { A:0, B:0 };
  scoreA.textContent = 0;
  scoreB.textContent = 0;
  resetBoard();
  gameCard.classList.add("hidden");
  startCard.classList.remove("hidden");
});
