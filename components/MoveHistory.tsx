"use client";

import { History, Activity } from "lucide-react";

interface MoveHistoryProps {
  moves: string[];
}

export default function MoveHistory({ moves }: MoveHistoryProps) {
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1] || null,
    });
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-800 animate-slide-up">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <History className="w-5 h-5" />
        Move History
      </h2>

      {moves.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
            <Activity className="w-8 h-8 text-slate-400 dark:text-slate-600" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No moves yet. Start playing!
          </p>
        </div>
      ) : (
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {movePairs.map((pair) => (
            <div
              key={pair.number}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-600 w-8">
                {pair.number}.
              </span>
              <div className="flex gap-2 flex-1">
                <span className="flex-1 text-sm font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded text-slate-900 dark:text-white">
                  {pair.white}
                </span>
                {pair.black && (
                  <span className="flex-1 text-sm font-medium bg-slate-800 dark:bg-slate-700 px-3 py-1.5 rounded text-white">
                    {pair.black}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {moves.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Total moves:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{moves.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}


