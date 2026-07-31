"use client";

import { useEffect, useState } from "react";

const ROWS = 9;
const COLS = 9;
const MINES = 10;

interface Cell {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  count: number;
}

type GameState = "idle" | "playing" | "won" | "lost";

const NUMBER_COLORS = [
  "",
  "#0000ff",
  "#008000",
  "#ff0000",
  "#000080",
  "#800000",
  "#008080",
  "#000000",
  "#808080",
];

function emptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      count: 0,
    }))
  );
}

function neighbors(r: number, c: number): [number, number][] {
  const out: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) out.push([nr, nc]);
    }
  }
  return out;
}

// Mines are placed on the first click so the first cell is always safe.
function placeMines(board: Cell[][], safeR: number, safeC: number) {
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (board[r][c].mine || (r === safeR && c === safeC)) continue;
    board[r][c].mine = true;
    placed++;
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      board[r][c].count = neighbors(r, c).filter(
        ([nr, nc]) => board[nr][nc].mine
      ).length;
    }
  }
}

function floodReveal(board: Cell[][], r: number, c: number) {
  const stack: [number, number][] = [[r, c]];
  while (stack.length) {
    const [cr, cc] = stack.pop()!;
    const cell = board[cr][cc];
    if (cell.revealed || cell.flagged) continue;
    cell.revealed = true;
    if (cell.count === 0 && !cell.mine) {
      neighbors(cr, cc).forEach(([nr, nc]) => {
        if (!board[nr][nc].revealed) stack.push([nr, nc]);
      });
    }
  }
}

export function MinesweeperApp() {
  const [board, setBoard] = useState<Cell[][]>(emptyBoard);
  const [game, setGame] = useState<GameState>("idle");
  const [time, setTime] = useState(0);
  const [flagMode, setFlagMode] = useState(false);

  useEffect(() => {
    if (game !== "playing") return;
    const id = setInterval(() => setTime((t) => Math.min(t + 1, 999)), 1000);
    return () => clearInterval(id);
  }, [game]);

  const flags = board.flat().filter((c) => c.flagged).length;

  const reset = () => {
    setBoard(emptyBoard());
    setGame("idle");
    setTime(0);
  };

  const checkWin = (b: Cell[][]) =>
    b.flat().filter((c) => !c.revealed).length === MINES;

  const reveal = (r: number, c: number) => {
    if (game === "won" || game === "lost") return;
    setBoard((prev) => {
      const b = prev.map((row) => row.map((cell) => ({ ...cell })));
      const cell = b[r][c];
      if (cell.revealed || cell.flagged) return prev;
      if (game === "idle") {
        placeMines(b, r, c);
        setGame("playing");
      }
      if (cell.mine) {
        b.forEach((row) =>
          row.forEach((x) => {
            if (x.mine) x.revealed = true;
          })
        );
        cell.revealed = true;
        setGame("lost");
        return b;
      }
      floodReveal(b, r, c);
      if (checkWin(b)) setGame("won");
      return b;
    });
  };

  const toggleFlag = (r: number, c: number) => {
    if (game === "won" || game === "lost") return;
    setBoard((prev) => {
      const b = prev.map((row) => row.map((cell) => ({ ...cell })));
      const cell = b[r][c];
      if (cell.revealed) return prev;
      cell.flagged = !cell.flagged;
      return b;
    });
  };

  const face =
    game === "lost" ? "😵" : game === "won" ? "😎" : "🙂";

  return (
    <div className="app-body mine-app">
      <div className="mine-panel">
        <div className="mine-led">{String(MINES - flags).padStart(3, "0")}</div>
        <button className="mine-face" onClick={reset} title="New game">
          {face}
        </button>
        <div className="mine-led">{String(time).padStart(3, "0")}</div>
      </div>
      <div
        className="mine-grid"
        onContextMenu={(e) => e.preventDefault()}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            let content = "";
            let style: React.CSSProperties = {};
            if (cell.revealed) {
              if (cell.mine) content = "💣";
              else if (cell.count > 0) {
                content = String(cell.count);
                style = { color: NUMBER_COLORS[cell.count] };
              }
            } else if (cell.flagged) {
              content = "🚩";
            }
            return (
              <button
                key={`${r}-${c}`}
                className={
                  "mine-cell" + (cell.revealed ? " mine-cell-revealed" : "")
                }
                style={style}
                onClick={() =>
                  flagMode ? toggleFlag(r, c) : reveal(r, c)
                }
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFlag(r, c);
                }}
              >
                {content}
              </button>
            );
          })
        )}
      </div>
      <div className="toolbar-row">
        <button
          onClick={() => setFlagMode((f) => !f)}
          className={flagMode ? "mine-flagmode-active" : ""}
        >
          🚩 Flag mode {flagMode ? "ON" : "off"}
        </button>
      </div>
      {game === "won" || game === "lost" ? (
        <p className="hint-text">
          {game === "won" ? "You win! 🎉" : "Boom."}
        </p>
      ) : null}
    </div>
  );
}
