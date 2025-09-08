// game.js — single-page logic for index.html (start + game)
document.addEventListener('DOMContentLoaded', () => {
  // DOM: start
  const startCard = document.getElementById('start-card');
  const startBtn = document.getElementById('startBtn');
  const demoBtn = document.getElementById('demoBtn');
  const aNameIn = document.getElementById('aName');
  const bNameIn = document.getElementById('bName');
  const aSymIn = document.getElementById('aSym');

  // DOM: game
  const gameCard = document.getElementById('game-card');
  const labelA = document.getElementById('labelA');
  const labelB = document.getElementById('labelB');
  const scoreAEl = document.getElementById('scoreA');
  const scoreBEl = document.getElementById('scoreB');
  const turnInfo = document.getElementById('turnInfo');
  const boardEl = document.getElementById('board');
  const cells = Array.from(document.querySelectorAll('.cell'));
  const resetBtn = document.getElementById('resetBtn');
  const homeBtn = document.getElementById('homeBtn');
  const message = document.getElementById('message');
  const messageText = document.getElementById('messageText');
  const playAgain = document.getElementById('playAgain');
  const newMatch = document.getElementById('newMatch');

  // state
  let playerA = { name: 'Player A', symbol: 'X', score: 0 };
  let playerB = { name: 'Player B', symbol: 'O', score: 0 };
  let current = playerA;
  let board = Array(9).fill(null);
  let gameOver = false;

  const patterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  // audio (small WebAudio tones)
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;
  function ensureAudio(){ if (!audioCtx && AudioCtx) audioCtx = new AudioCtx(); }
  function tone(type='click'){
    if (!AudioCtx) return;
    ensureAudio();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    if (type === 'click'){ o.type='square'; o.frequency.value=380; g.gain.value=0.02; }
    if (type === 'win'){ o.type='triangle'; o.frequency.value=880; g.gain.value=0.04; }
    if (type === 'draw'){ o.type='sine'; o.frequency.value=220; g.gain.value=0.03; }
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.18);
    setTimeout(()=> o.stop(), 200);
  }

  // UI helpers
  function showStart(){ startCard.classList.remove('hidden'); gameCard.classList.add('hidden'); }
  function showGame(){ startCard.classList.add('hidden'); gameCard.classList.remove('hidden'); }

  function refreshLabels(){
    labelA.textContent = `${playerA.name} (${playerA.symbol})`;
    labelB.textContent = `${playerB.name} (${playerB.symbol})`;
    scoreAEl.textContent = playerA.score;
    scoreBEl.textContent = playerB.score;
  }
  function refreshTurn(){ turnInfo.textContent = `${current.name}'s turn (${current.symbol})`; }

  function resetBoard(){
    board.fill(null);
    cells.forEach(c => { c.textContent = ''; c.classList.remove('X','O','disabled'); });
    gameOver = false;
    message.classList.add('hidden');
    message.classList.remove('msg-win','msg-draw');
  }

  function checkWinner(){
    for (let p of patterns){
      const [a,b,c] = p;
      if (board[a] && board[a] === board[b] && board[b] === board[c]) return { symbol: board[a], pattern: p };
    }
    return null;
  }

  function handleWin(symbol, pattern){
    gameOver = true;
    pattern.forEach(i => cells[i].classList.add('disabled'));
    const winner = symbol === playerA.symbol ? playerA : playerB;
    winner.score += 1;
    refreshLabels();
    messageText.textContent = `🏆 ${winner.name} wins! ${playerA.score} - ${playerB.score}`;
    message.classList.remove('hidden');
    message.classList.add('msg-win');
    tone('win');
    // small confetti
    if (typeof confetti === 'function') confetti({ particleCount: 40, spread: 55, origin: { y: 0.6 }});
  }

  function handleDraw(){
    gameOver = true;
    messageText.textContent = "It's a draw! 🤝";
    message.classList.remove('hidden');
    message.classList.add('msg-draw');
    tone('draw');
  }

  function cellClick(i){
    if (gameOver) return;
    if (board[i]) return;
    board[i] = current.symbol;
    const el = cells[i];
    el.textContent = current.symbol;
    el.classList.add(current.symbol);
    el.classList.add('disabled');
    tone('click');

    const res = checkWinner();
    if (res){ handleWin(res.symbol, res.pattern); return; }
    if (board.every(Boolean)){ handleDraw(); return; }

    current = (current === playerA) ? playerB : playerA;
    refreshTurn();
  }

  // events
  cells.forEach((c, idx) => {
    c.addEventListener('click', () => cellClick(idx));
    c.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && !gameOver) { e.preventDefault(); cellClick(idx); }});
  });

  startBtn.addEventListener('click', () => {
    // read inputs
    playerA.name = aNameIn.value.trim() || 'Player A';
    playerB.name = bNameIn.value.trim() || 'Player B';
    playerA.symbol = (aSymIn.value || 'X').toUpperCase();
    playerB.symbol = playerA.symbol === 'X' ? 'O' : 'X';
    playerA.score = 0; playerB.score = 0;
    current = playerA.symbol === 'X' ? playerA : playerB;

    refreshLabels();
    refreshTurn();
    resetBoard();
    showGame();
    tone('click');
  });

  demoBtn.addEventListener('click', () => {
    aNameIn.value = 'You'; bNameIn.value = 'Friend'; aSymIn.value = 'X';
    startBtn.click();
    // simulate two quick moves
    setTimeout(()=> cells[0].click(), 250);
    setTimeout(()=> cells[4].click(), 500);
  });

  resetBtn.addEventListener('click', () => {
    resetBoard();
    current = playerA.symbol === 'X' ? playerA : playerB;
    refreshTurn();
    tone('click');
  });

  homeBtn.addEventListener('click', () => {
    // go back to start (keep last names)
    showStart();
    tone('click');
  });

  playAgain.addEventListener('click', () => {
    resetBoard();
    current = playerA.symbol === 'X' ? playerA : playerB;
    refreshTurn();
    tone('click');
  });

  newMatch.addEventListener('click', () => {
    // new match: back to start and clear scores
    playerA.score = 0; playerB.score = 0;
    refreshLabels();
    showStart();
    tone('click');
  });

  // init UI
  refreshLabels();
  refreshTurn();
  resetBoard();
  showStart();
});
