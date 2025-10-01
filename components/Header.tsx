"use client";

import { Crown, Sparkles } from "lucide-react";

export default function Header() {
  return (
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
          
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Learning</span>
          </div>
        </div>
      </div>
    </header>
  );
}


