import { Chess } from 'chess.js';

// Piece values for evaluation
const pieceValues: { [key: string]: number } = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Position bonuses for piece placement
const pawnTable = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5,  5, 10, 25, 25, 10,  5,  5,
  0,  0,  0, 20, 20,  0,  0,  0,
  5, -5,-10,  0,  0,-10, -5,  5,
  5, 10, 10,-20,-20, 10, 10,  5,
  0,  0,  0,  0,  0,  0,  0,  0
];

const knightTable = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

const bishopTable = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];

const rookTable = [
  0,  0,  0,  0,  0,  0,  0,  0,
  5, 10, 10, 10, 10, 10, 10,  5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  0,  0,  0,  5,  5,  0,  0,  0
];

const queenTable = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
  -5,  0,  5,  5,  5,  5,  0, -5,
  0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

const kingTable = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
  20, 20,  0,  0,  0,  0, 20, 20,
  20, 30, 10,  0,  0, 10, 30, 20
];

const pieceSquareTables: { [key: string]: number[] } = {
  p: pawnTable,
  n: knightTable,
  b: bishopTable,
  r: rookTable,
  q: queenTable,
  k: kingTable,
};

// Evaluate board position
function evaluateBoard(game: Chess): number {
  let totalEvaluation = 0;
  const board = game.board();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const square = board[i][j];
      if (square) {
        const pieceValue = pieceValues[square.type];
        const pieceSquareValue = pieceSquareTables[square.type]?.[i * 8 + j] || 0;
        
        if (square.color === 'w') {
          totalEvaluation += pieceValue + pieceSquareValue;
        } else {
          totalEvaluation -= pieceValue + pieceSquareValue;
        }
      }
    }
  }

  return totalEvaluation;
}

// Minimax algorithm with alpha-beta pruning
function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean
): number {
  if (depth === 0) {
    return evaluateBoard(game);
  }

  const moves = game.moves();

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) {
        break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) {
        break;
      }
    }
    return minEval;
  }
}

// Get best move for the computer
export function getBestMove(game: Chess, difficulty: 'easy' | 'medium' | 'hard' | 'expert'): string | null {
  const moves = game.moves();
  
  if (moves.length === 0) return null;

  // Easy: Random move
  if (difficulty === 'easy') {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // Medium: Random with occasional good moves (50% random, 50% best)
  if (difficulty === 'medium' && Math.random() < 0.5) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // Hard and Expert: Use minimax
  const depth = difficulty === 'expert' ? 4 : difficulty === 'hard' ? 3 : 2;
  const isMaximizing = game.turn() === 'w';

  let bestMove = moves[0];
  let bestValue = isMaximizing ? -Infinity : Infinity;

  for (const move of moves) {
    game.move(move);
    const boardValue = minimax(game, depth - 1, -Infinity, Infinity, !isMaximizing);
    game.undo();

    if (isMaximizing) {
      if (boardValue > bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
    } else {
      if (boardValue < bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
    }
  }

  return bestMove;
}

// Get difficulty description
export function getDifficultyDescription(difficulty: 'easy' | 'medium' | 'hard' | 'expert'): string {
  const descriptions = {
    easy: 'Random moves - Great for beginners',
    medium: 'Makes some mistakes - Good for learning',
    hard: 'Strong player - Challenging',
    expert: 'Very strong - Expert level'
  };
  return descriptions[difficulty];
}

// Move analysis interface
export interface MoveAnalysis {
  move: string;
  from: string;
  to: string;
  score: number;
  evaluation: string;
  reason: string;
}

// Analyze and get best moves
export function analyzeBestMoves(game: Chess, depth: number = 3): MoveAnalysis[] {
  const moves = game.moves({ verbose: true });
  
  if (moves.length === 0) return [];

  const isMaximizing = game.turn() === 'w';
  const moveAnalyses: MoveAnalysis[] = [];

  for (const move of moves) {
    game.move(move.san);
    const score = minimax(game, depth - 1, -Infinity, Infinity, !isMaximizing);
    game.undo();

    // Generate reason for the move
    let reason = '';
    let evaluation = '';
    
    const absScore = Math.abs(score);
    
    if (absScore > 900) {
      evaluation = 'Excellent';
      reason = move.captured ? `Wins ${getPieceName(move.captured)}` : 'Strong attacking move';
    } else if (absScore > 500) {
      evaluation = 'Very Good';
      reason = move.captured ? `Captures ${getPieceName(move.captured)}` : 'Improves position significantly';
    } else if (absScore > 200) {
      evaluation = 'Good';
      reason = 'Solid positional move';
    } else if (absScore > 0) {
      evaluation = 'Decent';
      reason = 'Maintains balance';
    } else {
      evaluation = 'Neutral';
      reason = 'Safe option';
    }

    // Add context for special moves
    if (move.flags.includes('k') || move.flags.includes('q')) {
      reason = 'Castling - improves king safety';
      evaluation = 'Good';
    } else if (move.flags.includes('e')) {
      reason = 'En passant capture';
      evaluation = 'Good';
    } else if (move.flags.includes('p')) {
      reason = 'Pawn promotion to Queen';
      evaluation = 'Excellent';
    }

    // Add attacking context
    const gameCopy = new Chess(game.fen());
    gameCopy.move(move.san);
    if (gameCopy.isCheck()) {
      reason = 'Puts opponent in check!';
      evaluation = 'Very Good';
    }
    if (gameCopy.isCheckmate()) {
      reason = 'Checkmate!';
      evaluation = 'Winning';
    }

    moveAnalyses.push({
      move: move.san,
      from: move.from,
      to: move.to,
      score: score,
      evaluation: evaluation,
      reason: reason,
    });
  }

  // Sort by score (descending for white, ascending for black)
  moveAnalyses.sort((a, b) => isMaximizing ? b.score - a.score : a.score - b.score);

  // Return top 5 moves
  return moveAnalyses.slice(0, 5);
}

// Helper to get piece name
function getPieceName(pieceType: string): string {
  const names: { [key: string]: string } = {
    p: 'Pawn',
    n: 'Knight',
    b: 'Bishop',
    r: 'Rook',
    q: 'Queen',
    k: 'King',
  };
  return names[pieceType] || 'piece';
}

