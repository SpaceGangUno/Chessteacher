"use client";

import { Crown, Sparkles, X, BookOpen, Target, Trophy, Lightbulb } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-lg shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                  Chess Teacher
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">Master the game, one move at a time</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Interactive Learning</span>
              <span className="sm:hidden">Guide</span>
            </button>
          </div>
        </div>
      </header>

      {/* Interactive Learning Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Welcome to Interactive Learning!</h2>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-slate-700 dark:text-slate-300">
                  🎯 Chess Teacher provides an interactive, step-by-step approach to mastering chess. 
                  Learn through hands-on practice with instant feedback!
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  How to Use
                </h3>
                
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Select a Lesson</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Choose from the lesson panel on the left. Start with beginner lessons if you're new!</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Make Your Move</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Drag and drop chess pieces on the board to make moves</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Get Instant Feedback</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Receive immediate feedback on your moves with detailed explanations</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Use Hints When Stuck</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Click the "Hint" button for guidance on the best move</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  Lesson Categories
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-lg">
                    <p className="font-semibold">📘 Openings</p>
                    <p className="text-sm text-blue-100 mt-1">Learn opening principles and popular openings</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg">
                    <p className="font-semibold">⚡ Tactics</p>
                    <p className="text-sm text-purple-100 mt-1">Master tactical patterns and combinations</p>
                  </div>
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-lg">
                    <p className="font-semibold">🏆 Endgames</p>
                    <p className="text-sm text-amber-100 mt-1">Perfect essential endgame techniques</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-lg">
                    <p className="font-semibold">🎯 Strategy</p>
                    <p className="text-sm text-green-100 mt-1">Understand strategic concepts</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex gap-3 items-start">
                  <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 dark:text-amber-200">Pro Tip!</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Start with "Scholar's Mate" to learn the fastest checkmate pattern, then progress through tactics and strategy lessons.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg"
                >
                  Start Learning!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


