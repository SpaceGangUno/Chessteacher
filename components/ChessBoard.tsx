"use client";

import { useState, useEffect, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { RotateCcw, Info, Lightbulb, CheckCircle2 } from "lucide-react";
import { lessons } from "@/data/lessons";

interface ChessBoardProps {
  lesson: string | null;
  onMoveUpdate: (moves: string[]) => void;
}

export default function ChessBoard({ lesson, onMoveUpdate }: ChessBoardProps) {
  const [game, setGame] = useState(new Chess());
  const [currentPosition, setCurrentPosition] = useState(game.fen());
  const [hint, setHint] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [lessonStep, setLessonStep] = useState(0);

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
    onMoveUpdate([]);
  }, [lesson, currentLesson, onMoveUpdate]);

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
    onMoveUpdate([]);
  };

  const showHint = () => {
    if (currentLesson?.steps && currentLesson.steps[lessonStep]) {
      setHint(currentLesson.steps[lessonStep].hint || "Try to find the best move!");
    } else {
      setHint("Analyze the position carefully and look for tactical opportunities.");
    }
  };

  const onDrop = useCallback((sourceSquare: string, targetSquare: string) => {
    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) return false;

      setGame(gameCopy);
      setCurrentPosition(gameCopy.fen());
      
      const history = gameCopy.history();
      onMoveUpdate(history);

      // Check if this matches the lesson expected move
      if (currentLesson?.steps && currentLesson.steps[lessonStep]) {
        const expectedMove = currentLesson.steps[lessonStep].move;
        if (move.san === expectedMove || `${sourceSquare}${targetSquare}` === expectedMove) {
          setFeedback(`✓ Excellent! ${currentLesson.steps[lessonStep].explanation}`);
          setHint("");
          setTimeout(() => {
            if (lessonStep < currentLesson.steps.length - 1) {
              setLessonStep(lessonStep + 1);
              setFeedback("");
            } else {
              setFeedback("🎉 Lesson completed! Great job!");
            }
          }, 2000);
        } else {
          setFeedback("Not quite. Try again or use the hint button!");
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  }, [game, currentLesson, lessonStep, onMoveUpdate]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Info bar */}
        {currentLesson && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">{currentLesson.title}</h3>
                <p className="text-sm text-blue-100 mt-1">{currentLesson.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Chess board */}
        <div className="p-4 md:p-6">
          <Chessboard
            position={currentPosition}
            onPieceDrop={onDrop}
            customBoardStyle={{
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
            customDarkSquareStyle={{ backgroundColor: '#6366f1' }}
            customLightSquareStyle={{ backgroundColor: '#e0e7ff' }}
          />
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
          <div className="flex gap-3">
            <button
              onClick={resetBoard}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            {currentLesson && (
              <button
                onClick={showHint}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg font-medium"
              >
                <Lightbulb className="w-4 h-4" />
                Hint
              </button>
            )}
          </div>
        </div>
      </div>

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


