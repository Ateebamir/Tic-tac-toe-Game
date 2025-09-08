// Elements
const startCard = document.getElementById("start-card");
const gameCard = document.getElementById("game-card");
const startBtn = document.getElementById("startBtn");
const demoBtn = document.getElementById("demoBtn");
const homeBtn = document.getElementById("homeBtn");
const resetBtn = document.getElementById("resetBtn");

const aNameInput = document.getElementById("aName");
const aSymSelect = document.getElementById("aSym");
const opponentType = document.getElementById("opponentType");
const bNameLabel = document.getElementById("bNameLabel");
const bNameInput = document.getElementById("bName");

const labelA = document.getElementById("labelA");
const labelB = document.getElementById("labelB");
const scoreAEl = document.getElementById("scoreA");
const scoreBEl = document.getElementById("scoreB");
const turnInfo = document.getElementById("turnInfo");
const board = document.getElementById("board");
const cells = Array.from(document.querySelectorAll(".cell"));

const message = document.getElementById("message");
const messageText = document.getElementById("messageText");
const playAgain = document.getElementById("playAgain");
const newMatch = document.getElementById("newMatch");

// Game State
let playerA, playerB, symbolA, symbolB, vsComputer;
let boardState = Array(9).fill("");
let turn = "A";
let scoreA = 0;
let scoreB = 0;

// Show/hide opponent input
opponentType.addEventListener("change", () => {
  if(opponentType.value === "computer"){
    bNameLabel.style.display = "none";
    bNameInput.value = "Computer";
  } else {
    bNameLabel.style.display = "block";
    bNameInput.value = "";
  }
});

// Start Game
startBtn.addEventListener("click", () => {
  playerA = aNameInput.value || "Player A";
  symbolA = aSymSelect.value;
  symbolB = symbolA === "X" ? "O" : "X";

  if(opponentType.value === "computer"){
    playerB = "Computer";
    vsComputer = true;
  } else {
    playerB = bNameInput.value || "Player B";
    vsComputer = false;
  }

  labelA.textContent = `${playerA} (${symbolA})`;
  labelB.textContent = `${playerB} (${symbolB})`;

  startCard.classList.add("hidden");
  gameCard.classList.remove("hidden");

  resetBoard();
});

// Reset Board
function resetBoard(){
  boardState.fill("");
  cells.forEach(cell => cell.textContent = "");
  turn = "A";
  updateTurnInfo();
}

// Update Turn
function updateTurnInfo(){
  turnInfo.textContent = turn === "A" ? `${playerA}'s turn` : `${playerB}'s turn`;
}

// Check Winner
function checkWinner(){
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for(const combo of winCombos){
    const [a,b,c] = combo;
    if(boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]){
      return boardState[a];
    }
  }
  return boardState.includes("") ? null : "Draw";
}

// Make Move
cells.forEach(cell => {
  cell.addEventListener("click", () => {
    const i = parseInt(cell.dataset.i);
    if(boardState[i] || (vsComputer && turn==="B")) return;

    boardState[i] = turn==="A" ? symbolA : symbolB;
    cell.textContent = boardState[i];

    const winner = checkWinner();
    if(winner){
      if(winner==="Draw"){
        messageText.textContent = "It's a Draw!";
      } else {
        const winnerName = winner === symbolA ? playerA : playerB;
        messageText.textContent = `${winnerName} Wins! 🎉`;
        if(winner===symbolA) scoreA++; else scoreB++;
        scoreAEl.textContent = scoreA;
        scoreBEl.textContent = scoreB;
      }
      message.classList.remove("hidden");
      return;
    }

    // Switch turn
    turn = turn === "A" ? "B" : "A";
    updateTurnInfo();

    // Computer move
    if(vsComputer && turn==="B"){
      setTimeout(() => {
        computerMove();
        turn = "A";
        updateTurnInfo();
      }, 500);
    }
  });
});

// Simple AI
function computerMove(){
  const empty = boardState.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  const move = empty[Math.floor(Math.random()*empty.length)];
  boardState[move] = symbolB;
  cells[move].textContent = symbolB;

  const winner = checkWinner();
  if(winner){
    if(winner==="Draw"){
      messageText.textContent = "It's a Draw!";
    } else {
      const winnerName = winner === symbolA ? playerA : playerB;
      messageText.textContent = `${winnerName} Wins! 🎉`;
      if(winner===symbolA) scoreA++; else scoreB++;
      scoreAEl.textContent = scoreA;
      scoreBEl.textContent = scoreB;
    }
    message.classList.remove("hidden");
  }
}

// Control Buttons
resetBtn.addEventListener("click", resetBoard);
homeBtn.addEventListener("click", ()=>{
  gameCard.classList.add("hidden");
  startCard.classList.remove("hidden");
  boardState.fill("");
  cells.forEach(cell=>cell.textContent="");
  scoreA=0; scoreB=0;
  scoreAEl.textContent=scoreA; scoreBEl.textContent=scoreB;
  message.classList.add("hidden");
});
playAgain.addEventListener("click", ()=>{
  message.classList.add("hidden");
  resetBoard();
});
newMatch.addEventListener("click", ()=>{
  gameCard.classList.add("hidden");
  startCard.classList.remove("hidden");
  message.classList.add("hidden");
});
demoBtn.addEventListener("click", ()=>{
  aNameInput.value="DemoA";
  aSymSelect.value="X";
  opponentType.value="computer";
  bNameInput.value="Computer";
  startBtn.click();
});
