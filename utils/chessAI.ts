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
  technique: string;
}

// Analyze and get best moves with enhanced explanations
export function analyzeBestMoves(game: Chess, depth: number = 3): MoveAnalysis[] {
  const moves = game.moves({ verbose: true });
  
  if (moves.length === 0) return [];

  const isMaximizing = game.turn() === 'w';
  const moveAnalyses: MoveAnalysis[] = [];

  for (const move of moves) {
    game.move(move.san);
    const score = minimax(game, depth - 1, -Infinity, Infinity, !isMaximizing);
    game.undo();

    // Generate enhanced reason and technique name for the move
    let reason = '';
    let evaluation = '';
    let technique = '';
    
    const absScore = Math.abs(score);
    
    // Check for specific chess techniques
    const gameCopy = new Chess(game.fen());
    gameCopy.move(move.san);
    
    // Check for checkmate
    if (gameCopy.isCheckmate()) {
      evaluation = 'Winning';
      technique = 'Checkmate';
      reason = `Delivers checkmate! The king has no legal moves and cannot escape.`;
    }
    // Check for check
    else if (gameCopy.isCheck()) {
      evaluation = 'Excellent';
      technique = 'Check';
      reason = `Puts the opponent in check, forcing them to respond.`;
    }
    // Check for captures
    else if (move.captured) {
      const pieceValue = pieceValues[move.captured];
      if (pieceValue >= 500) {
        evaluation = 'Excellent';
        technique = 'Material Gain';
        reason = `Captures ${getPieceName(move.captured)} (${pieceValue} points) - significant material advantage.`;
      } else if (pieceValue >= 300) {
        evaluation = 'Very Good';
        technique = 'Minor Piece Capture';
        reason = `Captures ${getPieceName(move.captured)} - good material gain.`;
      } else {
        evaluation = 'Good';
        technique = 'Pawn Capture';
        reason = `Captures ${getPieceName(move.captured)} - maintains material balance.`;
      }
    }
    // Check for castling
    else if (move.flags.includes('k') || move.flags.includes('q')) {
      evaluation = 'Good';
      technique = 'Castling';
      reason = `Castling improves king safety and connects the rooks - fundamental opening principle.`;
    }
    // Check for en passant
    else if (move.flags.includes('e')) {
      evaluation = 'Good';
      technique = 'En Passant';
      reason = `En passant capture - a special pawn move that must be played immediately.`;
    }
    // Check for promotion
    else if (move.flags.includes('p')) {
      evaluation = 'Excellent';
      technique = 'Pawn Promotion';
      reason = `Promotes pawn to Queen - massive material gain and positional advantage.`;
    }
    // Check for tactical patterns
    else if (isForkMove(game, move)) {
      evaluation = 'Excellent';
      technique = 'Fork';
      reason = `Creates a fork - attacking multiple pieces simultaneously. The opponent cannot defend both.`;
    }
    else if (isPinMove(game, move)) {
      evaluation = 'Very Good';
      technique = 'Pin';
      reason = `Creates a pin - immobilizing an opponent's piece that cannot move without exposing a more valuable piece.`;
    }
    else if (isSkewerMove(game, move)) {
      evaluation = 'Very Good';
      technique = 'Skewer';
      reason = `Creates a skewer - attacking a valuable piece that must move, exposing a less valuable piece behind it.`;
    }
    else if (isDiscoveredAttack(game, move)) {
      evaluation = 'Very Good';
      technique = 'Discovered Attack';
      reason = `Creates a discovered attack - moving one piece reveals an attack from another piece.`;
    }
    else if (isDeflectionMove(game, move)) {
      evaluation = 'Good';
      technique = 'Deflection';
      reason = `Deflects an opponent's piece from defending a key square or piece.`;
    }
    else if (isDecoyMove(game, move)) {
      evaluation = 'Good';
      technique = 'Decoy';
      reason = `Decoys an opponent's piece to an unfavorable square.`;
    }
    // Positional moves
    else if (isCenterControlMove(game, move)) {
      evaluation = 'Good';
      technique = 'Center Control';
      reason = `Controls central squares - fundamental principle for piece activity and space.`;
    }
    else if (isDevelopmentMove(game, move)) {
      evaluation = 'Good';
      technique = 'Piece Development';
      reason = `Develops a piece toward the center - improves piece activity and follows opening principles.`;
    }
    else if (isKingSafetyMove(game, move)) {
      evaluation = 'Good';
      technique = 'King Safety';
      reason = `Improves king safety - essential for avoiding tactical threats.`;
    }
    else if (isPawnStructureMove(game, move)) {
      evaluation = 'Decent';
      technique = 'Pawn Structure';
      reason = `Improves pawn structure - creates long-term positional advantages.`;
    }
    else {
      // Generic evaluation based on score
      if (absScore > 900) {
        evaluation = 'Excellent';
        reason = 'Strong attacking move with significant positional advantages.';
      } else if (absScore > 500) {
        evaluation = 'Very Good';
        reason = 'Good positional move that improves the position.';
      } else if (absScore > 200) {
        evaluation = 'Good';
        reason = 'Solid move that maintains or slightly improves the position.';
      } else if (absScore > 0) {
        evaluation = 'Decent';
        reason = 'Safe move that maintains balance.';
      } else {
        evaluation = 'Neutral';
        reason = 'Standard move with no significant advantage or disadvantage.';
      }
    }

    moveAnalyses.push({
      move: move.san,
      from: move.from,
      to: move.to,
      score: score,
      evaluation: evaluation,
      reason: reason,
      technique: technique,
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

// Technique detection functions
function isForkMove(game: Chess, move: any): boolean {
  const gameCopy = new Chess(game.fen());
  gameCopy.move(move.san);
  
  // Check if the moved piece attacks multiple enemy pieces
  const attacks = [];
  const board = gameCopy.board();
  
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const square = board[i][j];
      if (square && square.color !== gameCopy.turn()) {
        const squareName = String.fromCharCode(97 + j) + (8 - i);
        if (gameCopy.isAttacked(squareName, gameCopy.turn())) {
          attacks.push(square);
        }
      }
    }
  }
  
  return attacks.length >= 2;
}

function isPinMove(game: Chess, move: any): boolean {
  const gameCopy = new Chess(game.fen());
  gameCopy.move(move.san);
  
  // Check if any enemy piece is pinned
  const board = gameCopy.board();
  
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const square = board[i][j];
      if (square && square.color !== gameCopy.turn()) {
        const squareName = String.fromCharCode(97 + j) + (8 - i);
        const moves = gameCopy.moves({ square: squareName, verbose: true });
        
        // If piece has limited moves, it might be pinned
        if (moves.length < 3) {
          return true;
        }
      }
    }
  }
  
  return false;
}

function isSkewerMove(game: Chess, move: any): boolean {
  // Similar to pin but attacking a more valuable piece first
  return isPinMove(game, move);
}

function isDiscoveredAttack(game: Chess, move: any): boolean {
  const gameCopy = new Chess(game.fen());
  const beforeMoves = gameCopy.moves({ verbose: true });
  gameCopy.move(move.san);
  const afterMoves = gameCopy.moves({ verbose: true });
  
  // Check if new attacks appeared after the move
  return afterMoves.some(move => 
    !beforeMoves.some(beforeMove => 
      beforeMove.from === move.from && beforeMove.to === move.to
    )
  );
}

function isDeflectionMove(game: Chess, move: any): boolean {
  // Check if move forces opponent to abandon defense
  const gameCopy = new Chess(game.fen());
  gameCopy.move(move.san);
  
  // This is a simplified check - in practice, deflection detection is complex
  return gameCopy.isCheck() || move.captured;
}

function isDecoyMove(game: Chess, move: any): boolean {
  // Check if move lures opponent piece to unfavorable square
  return move.captured && pieceValues[move.captured] > pieceValues[move.piece];
}

function isCenterControlMove(game: Chess, move: any): boolean {
  const centerSquares = ['d4', 'd5', 'e4', 'e5'];
  return centerSquares.includes(move.to);
}

function isDevelopmentMove(game: Chess, move: any): boolean {
  // Check if piece is moving from back rank toward center
  const fromRank = parseInt(move.from[1]);
  const toRank = parseInt(move.to[1]);
  
  return fromRank === 1 && toRank > 1 && ['n', 'b', 'q'].includes(move.piece);
}

function isKingSafetyMove(game: Chess, move: any): boolean {
  return move.flags.includes('k') || move.flags.includes('q') || 
         (move.piece === 'k' && Math.abs(parseInt(move.from[1]) - parseInt(move.to[1])) <= 1);
}

function isPawnStructureMove(game: Chess, move: any): boolean {
  return move.piece === 'p' && !move.captured;
}

