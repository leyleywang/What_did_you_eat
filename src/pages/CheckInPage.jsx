import { useState, useEffect } from 'react'
import { getCheckIns, getMeals } from '../data/storage'
import { EmptyMealIcon } from '../components/Icons'

const CheckInPage = () => {
  const [checkIns, setCheckIns] = useState({})
  const [meals, setMeals] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const loadedCheckIns = getCheckIns()
    const loadedMeals = getMeals()
    setCheckIns(loadedCheckIns)
    setMeals(loadedMeals)
  }

  const getMealById = (id) => {
    return meals.find((meal) => meal.id === id)
  }

  const formatDate = (dateStr) => {
    const year = dateStr.substring(0, 4)
    const month = dateStr.substring(4, 6)
    const day = dateStr.substring(6, 8)
    return `${year}年${month}月${day}日`
  }

  const calculateDailyStats = (checkInsForDay) => {
    let totalProtein = 0
    let totalCalories = 0
    let totalCarbs = 0

    checkInsForDay.forEach((checkIn) => {
      const meal = getMealById(checkIn.mealId)
      if (meal) {
        totalProtein += meal.protein
        totalCalories += meal.calories
        totalCarbs += meal.carbs
      }
    })

    return {
      protein: totalProtein,
      calories: totalCalories,
      carbs: totalCarbs
    }
  }

  const sortedDates = Object.keys(checkIns).sort((a, b) => b.localeCompare(a))

  if (sortedDates.length === 0) {
    return (
      <div className="app-container">
        <h2 className="text-xl font-bold p-4">打卡记录</h2>
        <div className="empty-state">
          <EmptyMealIcon />
          <p>暂无打卡记录，去首页随机点餐吧</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <h2 className="text-xl font-bold p-4">打卡记录</h2>
      
      <div className="meal-list">
        {sortedDates.map((date) => {
          const checkInsForDay = checkIns[date]
          const stats = calculateDailyStats(checkInsForDay)

          return (
            <div key={date} className="date-group">
              <div className="date-header">
                {formatDate(date)}
              </div>

              {checkInsForDay.map((checkIn, index) => {
                const meal = getMealById(checkIn.mealId)
                if (!meal) return null

                return (
                  <div key={`${checkIn.timestamp}-${index}`} className="meal-item">
                    <img src={meal.image} alt={meal.name} />
                    <div className="info">
                      <h3>{meal.name}</h3>
                      <p className="ingredients">{meal.ingredients}</p>
                      <div className="nutrition">
                        <span>蛋白质 {meal.protein}g</span>
                        <span>热量 {meal.calories}kcal</span>
                        <span>碳水 {meal.carbs}g</span>
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="date-stats">
                <h4>今日统计</h4>
                <div className="stats-row">
                  <div className="stat-item">
                    <div className="stat-value">{stats.protein}g</div>
                    <div className="stat-label">蛋白质</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{stats.calories}kcal</div>
                    <div className="stat-label">热量</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{stats.carbs}g</div>
                    <div className="stat-label">碳水</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CheckInPage