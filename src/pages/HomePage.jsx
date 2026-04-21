import { useState, useEffect, useRef, useCallback } from 'react'
import { getMeals, addCheckIn } from '../data/storage'
import { EmptyMealIcon } from '../components/Icons'

const HomePage = () => {
  const [meals, setMeals] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState(null)
  
  const autoPlayRef = useRef(null)
  const marqueeRef = useRef(null)
  const containerRef = useRef(null)
  const startTimeRef = useRef(null)
  const lastUpdateRef = useRef(null)

  useEffect(() => {
    const loadedMeals = getMeals()
    setMeals(loadedMeals)
  }, [])

  useEffect(() => {
    if (meals.length === 0 || isRunning || showResult) return

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % meals.length)
    }, 3000)

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [meals.length, isRunning, showResult])

  const animate = useCallback((timestamp) => {
    if (!isRunning) return
    
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp
      lastUpdateRef.current = timestamp
    }

    const elapsed = timestamp - startTimeRef.current
    const elapsedSinceLastUpdate = timestamp - lastUpdateRef.current

    if (elapsedSinceLastUpdate >= 50) {
      lastUpdateRef.current = timestamp
      setCurrentIndex((prev) => (prev + 1) % meals.length)
    }

    if (elapsed >= 3000) {
      setIsRunning(false)
      const randomIndex = Math.floor(Math.random() * meals.length)
      setCurrentIndex(randomIndex)
      setSelectedMeal(meals[randomIndex])
      setShowResult(true)
      startTimeRef.current = null
      lastUpdateRef.current = null
      return
    }

    marqueeRef.current = requestAnimationFrame(animate)
  }, [isRunning, meals])

  useEffect(() => {
    if (isRunning) {
      marqueeRef.current = requestAnimationFrame(animate)
    }
    return () => {
      if (marqueeRef.current) {
        cancelAnimationFrame(marqueeRef.current)
      }
    }
  }, [isRunning, animate])

  const handleStart = () => {
    if (meals.length === 0) return
    setIsRunning(true)
    startTimeRef.current = null
    lastUpdateRef.current = null
  }

  const handleConfirm = () => {
    if (selectedMeal) {
      addCheckIn(selectedMeal.id)
    }
    setShowResult(false)
    setSelectedMeal(null)
  }

  const handleCancel = () => {
    setShowResult(false)
    setSelectedMeal(null)
  }

  if (meals.length === 0) {
    return (
      <div className="empty-state">
        <EmptyMealIcon />
        <p>暂无餐单，请先添加餐单</p>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="slider-container" ref={containerRef}>
        <div
          className={`slider-track ${isRunning ? 'marquee' : ''}`}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transitionDuration: isRunning ? '0ms' : '300ms'
          }}
        >
          {meals.concat(meals).map((meal, index) => (
            <div key={`${meal.id}-${index}`} className="slide-item">
              <img src={meal.image} alt={meal.name} />
              <h3>{meal.name}</h3>
              <p className="ingredients">{meal.ingredients}</p>
              <div className="nutrition">
                <span>蛋白质 {meal.protein}g</span>
                <span>热量 {meal.calories}kcal</span>
                <span>碳水 {meal.carbs}g</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="start-button"
        onClick={handleStart}
        disabled={isRunning}
      >
        {isRunning ? '正在选择...' : '开始随机'}
      </button>

      {showResult && selectedMeal && (
        <div className="result-modal" onClick={handleCancel}>
          <div className="result-content" onClick={(e) => e.stopPropagation()}>
            <div className="result-header">
              <h2>今天吃这个！</h2>
              <button className="close-btn" onClick={handleCancel}>×</button>
            </div>
            <div className="result-image-wrapper">
              <img src={selectedMeal.image} alt={selectedMeal.name} className="result-image" />
            </div>
            <h3>{selectedMeal.name}</h3>
            <div className="nutrition">
              <span>蛋白质 {selectedMeal.protein}g</span>
              <span>热量 {selectedMeal.calories}kcal</span>
              <span>碳水 {selectedMeal.carbs}g</span>
            </div>
            <div className="actions">
              <button className="cancel-btn" onClick={handleCancel}>
                重新选择
              </button>
              <button className="confirm-btn" onClick={handleConfirm}>
                确认打卡
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage