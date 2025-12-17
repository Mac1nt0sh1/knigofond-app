"use client"

import { useState, useEffect } from "react"
import { Target, Trophy, TrendingUp, Edit2, Check, X } from "lucide-react"

interface GoalData {
  goal: number
  year: number
  completed: number
  percentage: number
}

export function ReadingGoal() {
  const [goalData, setGoalData] = useState<GoalData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [newGoal, setNewGoal] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const fetchGoal = async () => {
    try {
      const response = await fetch("/api/goals")
      if (response.ok) {
        const data = await response.json()
        setGoalData(data)
        setNewGoal(data.goal.toString())
      }
    } catch (error) {
      console.error("Error fetching goal:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGoal()
  }, [])

  const handleSaveGoal = async () => {
    const target = parseInt(newGoal)
    if (isNaN(target) || target < 1 || target > 365) {
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target })
      })

      if (response.ok) {
        await fetchGoal()
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error saving goal:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white animate-pulse">
        <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
        <div className="h-4 bg-white/20 rounded w-24"></div>
      </div>
    )
  }

  const percentage = goalData?.percentage || 0
  const completed = goalData?.completed || 0
  const goal = goalData?.goal || 0
  const remaining = Math.max(0, goal - completed)

  // Рассчитываем темп
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const daysPassed = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
  const expectedBooks = goal > 0 ? Math.round((daysPassed / 365) * goal) : 0
  const isAhead = completed >= expectedBooks

  return (
    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          <h3 className="font-semibold">Цель на {goalData?.year}</h3>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            title="Изменить цель"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/80 mb-1">
              Сколько книг хотите прочитать?
            </label>
            <input
              type="number"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              min="1"
              max="365"
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Например: 24"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveGoal}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {isSaving ? "Сохранение..." : "Сохранить"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setNewGoal(goal.toString())
              }}
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : goal > 0 ? (
        <>
          {/* Прогресс */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/80">Прогресс</span>
              <span className="font-bold">{completed} / {goal}</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, percentage)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1 text-white/60">
              <span>{percentage}% выполнено</span>
              <span>Осталось: {remaining}</span>
            </div>
          </div>

          {/* Статус */}
          <div className={`flex items-center gap-2 p-3 rounded-xl ${
            percentage >= 100 
              ? "bg-yellow-400/20" 
              : isAhead 
                ? "bg-green-400/20" 
                : "bg-orange-400/20"
          }`}>
            {percentage >= 100 ? (
              <>
                <Trophy className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">🎉 Цель достигнута!</span>
              </>
            ) : isAhead ? (
              <>
                <TrendingUp className="w-5 h-5 text-green-300" />
                <span className="text-sm">Вы опережаете график на {completed - expectedBooks} {getBookWord(completed - expectedBooks)}!</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 text-orange-300 rotate-180" />
                <span className="text-sm">Отстаёте на {expectedBooks - completed} {getBookWord(expectedBooks - completed)}</span>
              </>
            )}
          </div>

          {/* Подсказка */}
          {percentage < 100 && (
            <p className="text-xs text-white/60 mt-3">
              📖 Читайте ~{Math.ceil(remaining / Math.max(1, 365 - daysPassed) * 30)} {getBookWord(Math.ceil(remaining / Math.max(1, 365 - daysPassed) * 30))} в месяц для достижения цели
            </p>
          )}
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-white/80 mb-3">Установите цель чтения на год</p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-white/90 transition-colors"
          >
            Установить цель
          </button>
        </div>
      )}
    </div>
  )
}

function getBookWord(n: number): string {
  const lastTwo = Math.abs(n) % 100
  const lastOne = lastTwo % 10

  if (lastTwo >= 11 && lastTwo <= 14) return "книг"
  if (lastOne === 1) return "книгу"
  if (lastOne >= 2 && lastOne <= 4) return "книги"
  return "книг"
}

