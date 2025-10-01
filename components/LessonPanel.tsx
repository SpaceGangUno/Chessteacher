"use client";

import { BookOpen, Target, Zap, Trophy } from "lucide-react";
import { lessons } from "@/data/lessons";
import clsx from "clsx";

interface LessonPanelProps {
  selectedLesson: string | null;
  onSelectLesson: (lessonId: string) => void;
}

export default function LessonPanel({ selectedLesson, onSelectLesson }: LessonPanelProps) {
  const categoryIcons = {
    opening: BookOpen,
    tactics: Zap,
    endgame: Trophy,
    strategy: Target,
  };

  const categoryColors = {
    opening: "from-blue-500 to-cyan-500",
    tactics: "from-purple-500 to-pink-500",
    endgame: "from-amber-500 to-orange-500",
    strategy: "from-green-500 to-emerald-500",
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-800 animate-slide-up">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Lessons
      </h2>
      
      <div className="space-y-3">
        {lessons.map((lesson) => {
          const Icon = categoryIcons[lesson.category];
          const gradient = categoryColors[lesson.category];
          const isSelected = selectedLesson === lesson.id;

          return (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              className={clsx(
                "w-full text-left p-4 rounded-xl transition-all duration-200",
                isSelected
                  ? "bg-gradient-to-r " + gradient + " text-white shadow-lg scale-105"
                  : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={clsx(
                  "p-2 rounded-lg",
                  isSelected ? "bg-white/20" : "bg-white dark:bg-slate-900"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 truncate">
                    {lesson.title}
                  </h3>
                  <p className={clsx(
                    "text-xs line-clamp-2",
                    isSelected ? "text-white/90" : "text-slate-600 dark:text-slate-400"
                  )}>
                    {lesson.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={clsx(
                      "text-xs px-2 py-0.5 rounded-full",
                      isSelected 
                        ? "bg-white/20 text-white" 
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                    )}>
                      {lesson.difficulty}
                    </span>
                    <span className={clsx(
                      "text-xs",
                      isSelected ? "text-white/80" : "text-slate-500 dark:text-slate-500"
                    )}>
                      {lesson.steps.length} steps
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {!selectedLesson && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            👈 Select a lesson to begin your chess journey!
          </p>
        </div>
      )}
    </div>
  );
}


