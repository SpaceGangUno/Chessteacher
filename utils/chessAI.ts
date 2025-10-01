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
    // Check for tactical patterns with detailed analysis
    else {
      const forkResult = isForkMove(game, move);
      if (forkResult.isFork) {
        evaluation = 'Excellent';
        technique = 'Fork';
        reason = forkResult.details;
      } else {
        const pinResult = isPinMove(game, move);
        if (pinResult.isPin) {
          evaluation = 'Very Good';
          technique = 'Pin';
          reason = pinResult.details;
        } else {
          const skewerResult = isSkewerMove(game, move);
          if (skewerResult.isSkewer) {
            evaluation = 'Very Good';
            technique = 'Skewer';
            reason = skewerResult.details;
          } else {
            const discoveredResult = isDiscoveredAttack(game, move);
            if (discoveredResult.isDiscovered) {
              evaluation = 'Very Good';
              technique = 'Discovered Attack';
              reason = discoveredResult.details;
            } else {
              const deflectionResult = isDeflectionMove(game, move);
              if (deflectionResult.isDeflection) {
                evaluation = 'Good';
                technique = 'Deflection';
                reason = deflectionResult.details;
              } else {
                const decoyResult = isDecoyMove(game, move);
                if (decoyResult.isDecoy) {
                  evaluation = 'Good';
                  technique = 'Decoy';
                  reason = decoyResult.details;
                }
              }
            }
          }
        }
      }
    }
    
    // If no tactical pattern was found, check for positional moves
    if (!technique) {
      if (isCenterControlMove(game, move)) {
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

// Enhanced technique detection with detailed piece information
function isForkMove(game: Chess, move: any): { isFork: boolean; attackedPieces: string[]; details: string } {
  const gameCopy = new Chess(game.fen());
  gameCopy.move(move.san);
  
  const attackedPieces = [];
  const board = gameCopy.board();
  const pieceName = getPieceName(move.piece);
  
  // Check which pieces are attacked by the moved piece specifically
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const square = board[i][j];
      if (square && square.color !== gameCopy.turn()) {
        const squareName = String.fromCharCode(97 + j) + (8 - i);
        // Check if this specific piece is attacked by the moved piece
        if (gameCopy.isAttacked(squareName, gameCopy.turn())) {
          // Verify the attack comes from the piece we just moved
          const attackers = gameCopy.moves({ square: squareName, verbose: true })
            .filter(m => m.from === move.to);
          if (attackers.length > 0) {
            attackedPieces.push(`${getPieceName(square.type)} on ${squareName}`);
          }
        }
      }
    }
  }
  
  let details = '';
  if (attackedPieces.length >= 2) {
    details = `The ${pieceName} on ${move.to} attacks ${attackedPieces.join(' and ')}. `;
    details += `The opponent cannot defend both pieces simultaneously. `;
    
    if (attackedPieces.some(p => p.includes('King'))) {
      details += `Since the king is attacked, it must move, allowing you to capture the other piece.`;
    } else {
      // Sort by piece value for better explanation
      const sortedPieces = attackedPieces.sort((a, b) => {
        const aType = a.split(' ')[0].toLowerCase();
        const bType = b.split(' ')[0].toLowerCase();
        return (pieceValues[bType] || 0) - (pieceValues[aType] || 0);
      });
      details += `The opponent will likely save the ${sortedPieces[0]}, allowing you to capture the ${sortedPieces[1]}.`;
    }
  }
  
  return {
    isFork: attackedPieces.length >= 2,
    attackedPieces,
    details
  };
}

function isPinMove(game: Chess, move: any): { isPin: boolean; pinnedPiece: string; details: string } {
  const gameCopy = new Chess(game.fen());
  gameCopy.move(move.san);
  
  const board = gameCopy.board();
  let pinnedPiece = '';
  let details = '';
  
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const square = board[i][j];
      if (square && square.color !== gameCopy.turn()) {
        const squareName = String.fromCharCode(97 + j) + (8 - i);
        const moves = gameCopy.moves({ square: squareName, verbose: true });
        
        // Check if piece has very limited moves (indicating a pin)
        if (moves.length <= 2) {
          pinnedPiece = `${getPieceName(square.type)} on ${squareName}`;
          const pieceName = getPieceName(move.piece);
          
          // Find what piece is behind the pinned piece
          const direction = getDirection(move.from, move.to);
          const behindPiece = findPieceBehind(gameCopy, squareName, direction, gameCopy.turn());
          
          if (behindPiece) {
            details = `The ${pieceName} on ${move.to} pins the ${pinnedPiece}. `;
            details += `This piece cannot move without exposing the ${behindPiece} behind it. `;
            details += `The pinned piece is essentially immobilized and vulnerable to further attacks.`;
          } else {
            details = `The ${pieceName} on ${move.to} pins the ${pinnedPiece}. `;
            details += `This piece cannot move without exposing a more valuable piece behind it. `;
            details += `The pinned piece is essentially immobilized and vulnerable to further attacks.`;
          }
          break;
        }
      }
    }
  }
  
  return {
    isPin: pinnedPiece !== '',
    pinnedPiece,
    details
  };
}

// Helper function to get direction between two squares
function getDirection(from: string, to: string): string {
  const fromFile = from.charCodeAt(0) - 97;
  const fromRank = parseInt(from[1]) - 1;
  const toFile = to.charCodeAt(0) - 97;
  const toRank = parseInt(to[1]) - 1;
  
  const fileDiff = toFile - fromFile;
  const rankDiff = toRank - fromRank;
  
  if (fileDiff === 0) {
    return rankDiff > 0 ? 'up' : 'down';
  } else if (rankDiff === 0) {
    return fileDiff > 0 ? 'right' : 'left';
  } else if (Math.abs(fileDiff) === Math.abs(rankDiff)) {
    if (fileDiff > 0 && rankDiff > 0) return 'up-right';
    if (fileDiff > 0 && rankDiff < 0) return 'down-right';
    if (fileDiff < 0 && rankDiff > 0) return 'up-left';
    if (fileDiff < 0 && rankDiff < 0) return 'down-left';
  }
  
  return '';
}

// Helper function to find piece behind a pinned piece
function findPieceBehind(game: Chess, pinnedSquare: string, direction: string, attackerColor: 'w' | 'b'): string {
  const board = game.board();
  const file = pinnedSquare.charCodeAt(0) - 97;
  const rank = parseInt(pinnedSquare[1]) - 1;
  
  let stepFile = 0;
  let stepRank = 0;
  
  switch (direction) {
    case 'up': stepRank = 1; break;
    case 'down': stepRank = -1; break;
    case 'right': stepFile = 1; break;
    case 'left': stepFile = -1; break;
    case 'up-right': stepFile = 1; stepRank = 1; break;
    case 'up-left': stepFile = -1; stepRank = 1; break;
    case 'down-right': stepFile = 1; stepRank = -1; break;
    case 'down-left': stepFile = -1; stepRank = -1; break;
    default: return '';
  }
  
  // Look in the opposite direction from the attacker
  let checkFile = file - stepFile;
  let checkRank = rank - stepRank;
  
  while (checkFile >= 0 && checkFile < 8 && checkRank >= 0 && checkRank < 8) {
    const square = board[7 - checkRank][checkFile];
    if (square) {
      if (square.color !== attackerColor) {
        return `${getPieceName(square.type)} on ${String.fromCharCode(97 + checkFile)}${checkRank + 1}`;
      }
      break; // Found a piece, stop looking
    }
    checkFile -= stepFile;
    checkRank -= stepRank;
  }
  
  return '';
}

function isSkewerMove(game: Chess, move: any): { isSkewer: boolean; skeweredPieces: string[]; details: string } {
  const forkResult = isForkMove(game, move);
  return {
    isSkewer: forkResult.isFork,
    skeweredPieces: forkResult.attackedPieces,
    details: forkResult.details.replace('attacks', 'skewers').replace('fork', 'skewer')
  };
}

function isDiscoveredAttack(game: Chess, move: any): { isDiscovered: boolean; discoveredAttacks: string[]; details: string } {
  const gameCopy = new Chess(game.fen());
  const beforeMoves = gameCopy.moves({ verbose: true });
  gameCopy.move(move.san);
  const afterMoves = gameCopy.moves({ verbose: true });
  
  const discoveredAttacks = [];
  const pieceName = getPieceName(move.piece);
  
  // Find new attacks that appeared after the move
  for (const afterMove of afterMoves) {
    const wasAttackingBefore = beforeMoves.some(beforeMove => 
      beforeMove.from === afterMove.from && beforeMove.to === afterMove.to
    );
    
    if (!wasAttackingBefore && afterMove.from !== move.from) {
      const targetSquare = gameCopy.board()[8 - parseInt(afterMove.to[1])][afterMove.to.charCodeAt(0) - 97];
      if (targetSquare) {
        discoveredAttacks.push(`${getPieceName(targetSquare.type)} on ${afterMove.to}`);
      }
    }
  }
  
  let details = '';
  if (discoveredAttacks.length > 0) {
    details = `Moving the ${pieceName} from ${move.from} to ${move.to} reveals a discovered attack. `;
    details += `The piece that was behind it now attacks ${discoveredAttacks.join(' and ')}. `;
    details += `This creates a double threat - the moved piece has its own threat, while revealing another attack.`;
  }
  
  return {
    isDiscovered: discoveredAttacks.length > 0,
    discoveredAttacks,
    details
  };
}

function isDeflectionMove(game: Chess, move: any): { isDeflection: boolean; deflectedPiece: string; details: string } {
  const gameCopy = new Chess(game.fen());
  gameCopy.move(move.san);
  
  let deflectedPiece = '';
  let details = '';
  
  if (gameCopy.isCheck()) {
    deflectedPiece = 'King';
    const pieceName = getPieceName(move.piece);
    details = `The ${pieceName} move to ${move.to} puts the king in check, forcing it to move. `;
    details += `This deflection removes the king from defending other pieces, creating tactical opportunities.`;
  } else if (move.captured) {
    const pieceName = getPieceName(move.piece);
    const capturedPiece = getPieceName(move.captured);
    details = `The ${pieceName} captures the ${capturedPiece} on ${move.to}, forcing the opponent to recapture. `;
    details += `This deflection removes a defending piece, potentially exposing other targets.`;
  }
  
  return {
    isDeflection: deflectedPiece !== '',
    deflectedPiece,
    details
  };
}

function isDecoyMove(game: Chess, move: any): { isDecoy: boolean; decoyedPiece: string; details: string } {
  let decoyedPiece = '';
  let details = '';
  
  if (move.captured && pieceValues[move.captured] > pieceValues[move.piece]) {
    const pieceName = getPieceName(move.piece);
    const capturedPiece = getPieceName(move.captured);
    decoyedPiece = capturedPiece;
    details = `The ${pieceName} sacrifices itself to capture the more valuable ${capturedPiece} on ${move.to}. `;
    details += `This decoy move lures the opponent into a material disadvantage or tactical trap.`;
  }
  
  return {
    isDecoy: decoyedPiece !== '',
    decoyedPiece,
    details
  };
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

