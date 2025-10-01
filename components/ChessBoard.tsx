"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { RotateCcw, Info, Lightbulb, CheckCircle2, ArrowRight, Cpu, Sparkles, TrendingUp, Undo2 } from "lucide-react";
import { lessons } from "@/data/lessons";
import { getBestMove, getDifficultyDescription, analyzeBestMoves, type MoveAnalysis } from "@/utils/chessAI";

// Debug: Log imports
console.log('Chessboard import:', Chessboard);
console.log('Chess import:', Chess);

interface ChessBoardProps {
  lesson: string | null;
  onMoveUpdate: (moves: string[]) => void;
  onLessonComplete?: () => void;
  onSelectLesson?: (lessonId: string) => void;
}

export default function ChessBoard({ lesson, onMoveUpdate, onLessonComplete, onSelectLesson }: ChessBoardProps) {
  const [game, setGame] = useState(new Chess());
  const [currentPosition, setCurrentPosition] = useState(game.fen());
  const [hint, setHint] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [lessonStep, setLessonStep] = useState(0);
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [bestMoves, setBestMoves] = useState<MoveAnalysis[]>([]);
  const [showBestMoves, setShowBestMoves] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [highlightedSquares, setHighlightedSquares] = useState<{ [key: string]: { backgroundColor: string } }>({});
  const analysisTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showBestMovesRef = useRef(showBestMoves);

  const currentLesson = lesson ? lessons.find(l => l.id === lesson) : null;

  useEffect(() => {
    const newGame = new Chess();
    if (currentLesson?.startPosition) {
      newGame.load(currentLesson.startPosition);
    }
    setGame(newGame);
    setCurrentPosition(newGame.fen());
    setLessonStep(0);
    setHint("");
    setFeedback("");
    setPlayerColor(newGame.turn());
    setIsLessonComplete(false);
    onMoveUpdate([]);
  }, [lesson, currentLesson, onMoveUpdate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'h' && currentLesson && !isLessonComplete) {
        if (currentLesson?.steps && currentLesson.steps[lessonStep]) {
          setHint(currentLesson.steps[lessonStep].hint || "Try to find the best move!");
        }
      } else if (e.key === 'r') {
        const newGame = new Chess();
        if (currentLesson?.startPosition) {
          newGame.load(currentLesson.startPosition);
        }
        setGame(newGame);
        setCurrentPosition(newGame.fen());
        setLessonStep(0);
        setHint("");
        setFeedback("");
        setPlayerColor(newGame.turn());
        setIsLessonComplete(false);
        onMoveUpdate([]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentLesson, isLessonComplete, lessonStep, onMoveUpdate]);

  // Auto-play opponent moves (lessons) or AI moves (free play)
  useEffect(() => {
    // Lesson mode: play predefined opponent moves
    if (currentLesson?.steps && currentLesson.steps[lessonStep]) {
      const currentStep = currentLesson.steps[lessonStep];
      const isPlayerTurn = game.turn() === playerColor;
      
      if (!isPlayerTurn) {
        const timer = setTimeout(() => {
          try {
            const gameCopy = new Chess(game.fen());
            const move = gameCopy.move(currentStep.move);
            
            if (move) {
              setGame(gameCopy);
              setCurrentPosition(gameCopy.fen());
              onMoveUpdate(gameCopy.history());
              
              setTimeout(() => {
                if (lessonStep < currentLesson.steps.length - 1) {
                  setLessonStep(prev => prev + 1);
                }
              }, 500);
            }
          } catch (error) {
            console.error("Error playing opponent move:", error);
          }
        }, 800);
        
        return () => clearTimeout(timer);
      }
    }
    
    // Free play mode: AI makes moves
    if (!currentLesson && game.turn() === 'b' && !game.isGameOver()) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        try {
          const gameCopy = new Chess(game.fen());
          const aiMove = getBestMove(gameCopy, aiDifficulty);
          
          if (aiMove) {
            gameCopy.move(aiMove);
            setGame(gameCopy);
            setCurrentPosition(gameCopy.fen());
            onMoveUpdate(gameCopy.history());
          }
          setIsAiThinking(false);
        } catch (error) {
          console.error("Error making AI move:", error);
          setIsAiThinking(false);
        }
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [lessonStep, game, currentLesson, playerColor, onMoveUpdate, aiDifficulty]);

  const resetBoard = () => {
    const newGame = new Chess();
    if (currentLesson?.startPosition) {
      newGame.load(currentLesson.startPosition);
    }
    setGame(newGame);
    setCurrentPosition(newGame.fen());
    setLessonStep(0);
    setHint("");
    setFeedback("");
    setPlayerColor(newGame.turn());
    setIsLessonComplete(false);
    onMoveUpdate([]);
  };

  const showHint = () => {
    if (currentLesson?.steps && currentLesson.steps[lessonStep]) {
      setHint(currentLesson.steps[lessonStep].hint || "Try to find the best move!");
    } else {
      setHint("Analyze the position carefully and look for tactical opportunities.");
    }
  };

  const getNextLesson = () => {
    if (!currentLesson) return null;
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < lessons.length - 1) {
      return lessons[currentIndex + 1];
    }
    return null;
  };

  useEffect(() => {
    showBestMovesRef.current = showBestMoves;
  }, [showBestMoves]);

  const runBestMoveAnalysis = useCallback((fen: string) => {
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
    }

    const gameForAnalysis = new Chess(fen);

    if (gameForAnalysis.isGameOver()) {
      setIsAnalyzing(false);
      setBestMoves([]);
      setHighlightedSquares({});
      analysisTimeoutRef.current = null;
      return;
    }

    setIsAnalyzing(true);

    analysisTimeoutRef.current = setTimeout(() => {
      if (!showBestMovesRef.current) {
        analysisTimeoutRef.current = null;
        setIsAnalyzing(false);
        return;
      }

      const analysis = analyzeBestMoves(new Chess(fen), 3);
      setBestMoves(analysis);

      if (analysis.length > 0) {
        const highlightColors = [
          'rgba(34, 197, 94, 0.5)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(168, 85, 247, 0.5)',
          'rgba(251, 146, 60, 0.4)',
          'rgba(234, 179, 8, 0.4)',
        ];
        const highlights: { [key: string]: { backgroundColor: string } } = {};
        analysis.forEach((move, index) => {
          const color = highlightColors[index] || highlightColors[highlightColors.length - 1];
          highlights[move.to] = { backgroundColor: color };
        });
        setHighlightedSquares(highlights);
      } else {
        setHighlightedSquares({});
      }

      setIsAnalyzing(false);
      analysisTimeoutRef.current = null;
    }, 300);
  }, []);

  useEffect(() => {
    if (!showBestMoves) {
      return;
    }

    runBestMoveAnalysis(currentPosition);

    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
        analysisTimeoutRef.current = null;
      }
    };
  }, [showBestMoves, currentPosition, runBestMoveAnalysis]);

  useEffect(() => {
    return () => {
      if (analysisTimeoutRef.current) {
        clearTimeout(analysisTimeoutRef.current);
        analysisTimeoutRef.current = null;
      }
    };
  }, []);

  const analyzeMoves = () => {
    if (game.isGameOver()) {
      setFeedback("Game is over!");
      return;
    }

    setShowBestMoves(true);
  };

  const closeBestMoves = () => {
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
      analysisTimeoutRef.current = null;
    }
    setShowBestMoves(false);
    setBestMoves([]);
    setHighlightedSquares({});
    setIsAnalyzing(false);
  };

  const onDrop = useCallback((sourceSquare: string, targetSquare: string) => {
    try {
      // Create a new game instance from current state
      const gameCopy = new Chess(game.fen());
      
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) {
        console.log("Invalid move attempted");
        return false;
      }

      // Update game state
      setGame(gameCopy);
      setCurrentPosition(gameCopy.fen());
      
      const history = gameCopy.history();
      onMoveUpdate(history);

      // Check if this matches the lesson expected move
      if (currentLesson?.steps && currentLesson.steps[lessonStep]) {
        const expectedMove = currentLesson.steps[lessonStep].move;
        console.log("Expected:", expectedMove, "Got:", move.san);
        
        if (move.san === expectedMove || `${sourceSquare}${targetSquare}` === expectedMove) {
          setFeedback(`✓ Excellent! ${currentLesson.steps[lessonStep].explanation}`);
          setHint("");
          setTimeout(() => {
            if (lessonStep < currentLesson.steps.length - 1) {
              setLessonStep(prev => prev + 1);
              setFeedback("");
            } else {
              setFeedback("🎉 Lesson completed! Great job!");
              setIsLessonComplete(true);
              if (onLessonComplete) {
                onLessonComplete();
              }
            }
          }, 2000);
        } else {
          setFeedback("Not quite. Try again or use the hint button!");
        }
      } else {
        // Free play mode when no lesson is selected
        setFeedback("");
        setHint("");
      }

      return true;
    } catch (error) {
      console.error("Error making move:", error);
      return false;
    }
  }, [game, currentLesson, lessonStep, onMoveUpdate]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Info bar */}
        {currentLesson ? (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-lg">{currentLesson.title}</h3>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    Step {lessonStep + 1} of {currentLesson.steps.length}
                  </span>
                </div>
                <p className="text-sm text-blue-100">{currentLesson.description}</p>
                {/* Progress bar */}
                <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-white h-full transition-all duration-500 ease-out"
                    style={{ width: `${((lessonStep + 1) / currentLesson.steps.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
            <div className="flex items-start gap-3">
              <Cpu className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Free Play Mode - vs Computer</h3>
                <p className="text-sm text-green-100 mt-1">Play against AI or select a lesson from the left panel</p>
                
                {/* AI Difficulty Slider */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">AI Difficulty: {aiDifficulty.charAt(0).toUpperCase() + aiDifficulty.slice(1)}</label>
                    {isAiThinking && (
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full animate-pulse">AI thinking...</span>
                    )}
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    value={aiDifficulty === 'easy' ? 0 : aiDifficulty === 'medium' ? 1 : aiDifficulty === 'hard' ? 2 : 3}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setAiDifficulty(value === 0 ? 'easy' : value === 1 ? 'medium' : value === 2 ? 'hard' : 'expert');
                    }}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                  />
                  <p className="text-xs text-green-100">{getDifficultyDescription(aiDifficulty)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chess board */}
        <div className="p-4 md:p-6">
          {(currentLesson || !currentLesson) && (
            <div className="mb-3 flex items-center justify-center gap-2 text-sm">
              <div className={`px-3 py-1 rounded-full ${game.turn() === 'w' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                You (White) ♔
              </div>
              <div className={`px-3 py-1 rounded-full ${game.turn() === 'b' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                {currentLesson ? 'Opponent' : 'AI'} (Black) ♚
              </div>
            </div>
          )}
          <div className="w-full aspect-square max-w-lg mx-auto">
            {console.log('Rendering chessboard with position:', currentPosition)}
            <Chessboard
              position={currentPosition}
              onPieceDrop={onDrop}
              arePiecesDraggable={
                currentLesson 
                  ? game.turn() === playerColor  // In lesson mode, only player's turn
                  : game.turn() === 'w' && !isAiThinking  // In free play, only white's turn when AI isn't thinking
              }
              boardOrientation="white"
              customBoardStyle={{
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                width: '100%',
                height: '100%',
              }}
              customDarkSquareStyle={{ backgroundColor: '#6366f1' }}
              customLightSquareStyle={{ backgroundColor: '#e0e7ff' }}
              customSquareStyles={highlightedSquares}
            />
          </div>
        </div>

        {/* Feedback/Hint section */}
        {(feedback || hint) && (
          <div className="px-4 md:px-6 pb-4">
            {feedback && (
              <div className={`p-4 rounded-lg ${
                feedback.includes('✓') || feedback.includes('🎉')
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                  : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
              } flex items-start gap-2`}>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{feedback}</span>
              </div>
            )}
            {hint && !feedback && (
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-start gap-2">
                <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{hint}</span>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="p-4 md:px-6 md:pb-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex gap-3 mb-3">
            <button
              onClick={resetBoard}
              title="Reset board (Press R)"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
              <kbd className="hidden md:inline-block ml-1 px-1.5 py-0.5 text-xs bg-slate-200 dark:bg-slate-700 rounded">R</kbd>
            </button>
            {currentLesson && !isLessonComplete && (
              <button
                onClick={showHint}
                title="Get a hint (Press H)"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg font-medium"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Hint</span>
                <kbd className="hidden md:inline-block ml-1 px-1.5 py-0.5 text-xs bg-amber-600 rounded">H</kbd>
              </button>
            )}
            {isLessonComplete && getNextLesson() && onSelectLesson && (
              <button
                onClick={() => onSelectLesson(getNextLesson()!.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg font-medium animate-pulse"
              >
                <span>Next Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Best Moves Button */}
          <button
            onClick={showBestMoves ? closeBestMoves : analyzeMoves}
            disabled={isAnalyzing || game.isGameOver()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : showBestMoves ? (
              <>
                <span>Hide Analysis</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                <span>Show Best Moves</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Best Moves Analysis Panel */}
      {showBestMoves && bestMoves.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-slide-up">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Best Moves Analysis</h3>
            </div>
            <p className="text-sm text-purple-100 mt-1">Squares highlighted on board • Top 5 recommendations</p>
          </div>
          
          <div className="p-4 space-y-2">
            {bestMoves.map((move, index) => {
              const colors = [
                { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-300', badge: 'bg-green-500' },
                { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300', badge: 'bg-blue-500' },
                { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-300', badge: 'bg-purple-500' },
                { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300', badge: 'bg-orange-500' },
                { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-700 dark:text-yellow-300', badge: 'bg-yellow-500' },
              ];
              const color = colors[index];
              
              return (
                <div key={index} className={`${color.bg} border ${color.border} rounded-lg p-3`}>
                  <div className="flex items-start gap-3">
                    <div className={`${color.badge} text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-bold text-lg ${color.text}`}>{move.move}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${color.badge} text-white font-medium`}>
                          {move.evaluation}
                        </span>
                      </div>
                      <p className={`text-sm ${color.text}`}>{move.reason}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        From {move.from} to {move.to} • Score: {move.score > 0 ? '+' : ''}{move.score}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800 p-4 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              💡 Squares are highlighted on the board with matching colors
            </p>
          </div>
        </div>
      )}

      {/* Position info */}
      {game.isCheckmate() && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-lg">
          <strong>Checkmate!</strong> Game Over
        </div>
      )}
      {game.isCheck() && !game.isCheckmate() && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 p-4 rounded-lg">
          <strong>Check!</strong>
        </div>
      )}
    </div>
  );
}

