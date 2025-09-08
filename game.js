import { useState, useEffect } from "react";

const initialBoard = Array(9).fill(null);

export const TicTacToe = () => {
  const [board, setBoard] = useState(initialBoard);
  const [isXTurn, setIsXTurn] = useState(true);
  const [mode, setMode] = useState("human");
  const [winner, setWinner] = useState(null);
  const [gameCounter, setGameCounter] = useState(1); // Tracks which game

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = (newBoard) => {
    for (let [a, b, c] of lines) {
      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        return newBoard[a];
      }
    }
    return newBoard.includes(null) ? null : "Draw";
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXTurn ? "X" : "O";
    setBoard(newBoard);
    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
    } else {
      setIsXTurn(!isXTurn);

      if (mode === "computer" && !isXTurn) {
        setTimeout(() => {
          computerMove(newBoard);
        }, 300);
      }
    }
  };

  const computerMove = (currentBoard) => {
    const emptyIndexes = currentBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);

    let move;

    // Game 1 and 2: Never lose
    if (gameCounter % 3 !== 0) {
      // Try to win or block
      move = findBestMove(currentBoard);
    } else {
      // Game 3: Random move (can lose)
      move = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    }

    const newBoard = [...currentBoard];
    newBoard[move] = "O";
    setBoard(newBoard);
    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
    } else {
      setIsXTurn(true);
    }
  };

  // Basic AI: Win if possible, else block
  const findBestMove = (board) => {
    // Check if can win
    for (let idx of board.keys()) {
      if (!board[idx]) {
        board[idx] = "O";
        if (checkWinner(board) === "O") {
          board[idx] = null;
          return idx;
        }
        board[idx] = null;
      }
    }

    // Check if need to block X
    for (let idx of board.keys()) {
      if (!board[idx]) {
        board[idx] = "X";
        if (checkWinner(board) === "X") {
          board[idx] = null;
          return idx;
        }
        board[idx] = null;
      }
    }

    // Else pick center if empty
    if (!board[4]) return 4;

    // Else random
    const emptyIndexes = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);
    return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setIsXTurn(true);
    setWinner(null);
    setGameCounter(gameCounter + 1); // Increment game counter
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-3xl font-bold mb-6">Tic Tac Toe</h2>

      {/* Mode Selection */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => {
            resetGame();
            setMode("human");
          }}
          className={`px-4 py-2 rounded-md ${
            mode === "human" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Human vs Human
        </button>
        <button
          onClick={() => {
            resetGame();
            setMode("computer");
          }}
          className={`px-4 py-2 rounded-md ${
            mode === "computer" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Human vs Computer
        </button>
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, idx) => (
          <div
            key={idx}
            onClick={() => handleClick(idx)}
            className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-2xl font-bold border border-gray-500 cursor-pointer hover:bg-gray-200"
          >
            {cell}
          </div>
        ))}
      </div>

      {/* Winner */}
      {winner && (
        <div className="mt-6 text-xl font-semibold">
          {winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}
        </div>
      )}

      <button
        onClick={resetGame}
        className="mt-6 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Reset Game
      </button>
    </div>
  );
};
