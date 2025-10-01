"use client";

import { useState } from "react";
import ChessBoard from "@/components/ChessBoard";
import LessonPanel from "@/components/LessonPanel";
import Header from "@/components/Header";
import MoveHistory from "@/components/MoveHistory";

export default function Home() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Panel - Lessons */}
          <div className="lg:col-span-3">
            <LessonPanel 
              selectedLesson={selectedLesson}
              onSelectLesson={setSelectedLesson}
            />
          </div>

          {/* Center - Chess Board */}
          <div className="lg:col-span-6 flex items-start justify-center">
            <div className="w-full max-w-2xl">
              <ChessBoard 
                lesson={selectedLesson}
                onMoveUpdate={setMoveHistory}
              />
            </div>
          </div>

          {/* Right Panel - Move History & Analysis */}
          <div className="lg:col-span-3">
            <MoveHistory moves={moveHistory} />
          </div>
        </div>
      </main>
    </div>
  );
}


