document.addEventListener("DOMContentLoaded", () => {
  let boxes = document.querySelectorAll(".box");
  let resetBtn = document.querySelector("#reset-btn");
  let newGameBtn = document.querySelector("#new-btn");
  let msgContainer = document.querySelector(".msg-container");
  let msg = document.querySelector("#msg");
  let turnInfo = document.querySelector("#turn-info");

  let startBtn = document.querySelector("#start-btn");
  let startScreen = document.querySelector("#start-screen");
  let gameArea = document.querySelector("#game-area");
  const params = new URLSearchParams(window.location.search);
    const winnerName = params.get('name'); // Get the winner's name from the URL

  let turnO =false;
  let count = 0;

  let playerA = { name: "", symbol: "" };
  let playerB = { name: "", symbol: "" };
  let currentPlayer;

  const winPatterns = [
     [0, 1, 2],
     [0, 3, 6],
     [0, 4, 8],
     [1, 4, 7],
     [2, 5, 8],
     [2, 4, 6],
     [3, 4, 5],
     [6, 7, 8],
  ];

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      const aName = document.getElementById("playerAName").value.trim();
      const bName = document.getElementById("playerBName").value.trim();
      const aSymbol = document.getElementById("playerASymbol").value;

      if (!aName || !bName) {
        alert("Please enter both player names.");
        return;
      }

      playerA.name = aName;
      playerA.symbol = aSymbol;
      playerB.name = bName;
      playerB.symbol = aSymbol === "X" ? "O" : "X";
      currentPlayer = playerA.symbol === "O" ? playerA : playerB;

      startScreen.style.display = "none";
      gameArea.style.display = "block";
      updateTurnInfo();
    });
  }

  const resetGame = () => {
    turnO = true;
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");

    currentPlayer = playerA.symbol === "O" ? playerA : playerB;
    updateTurnInfo();
  };

  boxes.forEach((box) => {
    box.addEventListener("click", () => {
      // Prevent any further clicks if the box is already filled or the game is over
      if (box.innerText !== "" || msgContainer.classList.contains("hide") === false) return;

      box.innerText = currentPlayer.symbol;
      box.classList.add("disabled");
      count++;

      if (checkWinner()) {
        // Winner found, stop the game
      } else if (count === 9) {
        gameDraw(); // If all cells are filled and no winner, it's a draw
      } else {
        switchTurn();
      }
    });
  });

  const switchTurn = () => {
    currentPlayer = currentPlayer === playerA ? playerB : playerA;
    updateTurnInfo();
  };

  const updateTurnInfo = () => {
    turnInfo.innerText = `It's ${currentPlayer.name}'s turn (${currentPlayer.symbol})`;
  };

  const showWinner = (winnerName) => {
    msg.innerText = `🎉 Congratulations, ${winnerName} `; // Show winner's name in the message
    msgContainer.classList.remove("hide");
    turnInfo.style.display = "none";
    disableBoxes(); // Disable further clicks after a winner is declared
  };

  const gameDraw = () => {
    msg.innerText = "It's a draw!";
    msgContainer.classList.remove("hide");
    disableBoxes(); // Disable further clicks after a draw
  };

  const disableBoxes = () => {
    boxes.forEach((box) => box.classList.add("disabled"));
  };

  const enableBoxes = () => {
    boxes.forEach((box) => {
      box.classList.remove("disabled");
      box.innerText = "";
    });
  };

  const checkWinner = () => {
    for (let pattern of winPatterns) {
      let pos1Val = boxes[pattern[0]].innerText;
      let pos2Val = boxes[pattern[1]].innerText;
      let pos3Val = boxes[pattern[2]].innerText;

      if (pos1Val !== "" && pos1Val === pos2Val && pos2Val === pos3Val) {
        // Check for matching symbols (X or O)
        if (pos1Val === "X") {
          showWinner(playerA.name); // Show Player A's name
        } else {
          showWinner(playerB.name); // Show Player B's name
        }
        return true;
      }
    }
    return false; // No winner
  };

  resetBtn.addEventListener("click", resetGame);
  newGameBtn.addEventListener("click", resetGame);
});
