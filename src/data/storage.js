export const getMeals = () => {
  const meals = localStorage.getItem('meals')
  return meals ? JSON.parse(meals) : getDefaultMeals()
}

export const saveMeals = (meals) => {
  localStorage.setItem('meals', JSON.stringify(meals))
}

export const addMeal = (meal) => {
  const meals = getMeals()
  const newMeal = {
    ...meal,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  meals.push(newMeal)
  saveMeals(meals)
  return newMeal
}

export const deleteMeal = (mealId) => {
  const meals = getMeals()
  const updatedMeals = meals.filter((meal) => meal.id !== mealId)
  saveMeals(updatedMeals)
  return updatedMeals
}

export const getCheckIns = () => {
  const checkIns = localStorage.getItem('checkIns')
  return checkIns ? JSON.parse(checkIns) : {}
}

export const saveCheckIns = (checkIns) => {
  localStorage.setItem('checkIns', JSON.stringify(checkIns))
}

export const addCheckIn = (mealId, date = null) => {
  const checkIns = getCheckIns()
  const today = date || new Date().toISOString().split('T')[0].replace(/-/g, '')
  
  if (!checkIns[today]) {
    checkIns[today] = []
  }
  
  checkIns[today].push({
    mealId,
    timestamp: new Date().toISOString()
  })
  
  saveCheckIns(checkIns)
  return checkIns
}

export const getUserProfile = () => {
  const profile = localStorage.getItem('userProfile')
  return profile ? JSON.parse(profile) : {
    username: '健身达人',
    avatar: null
  }
}

export const saveUserProfile = (profile) => {
  localStorage.setItem('userProfile', JSON.stringify(profile))
}

function getDefaultMeals() {
  return [
    {
      id: '1',
      name: '鸡胸肉蔬菜沙拉',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=healthy%20chicken%20breast%20salad%20with%20fresh%20vegetables%20tomato%20cucumber%20lettuce%20broccoli%20in%20white%20bowl%20clean%20food%20photography&image_size=square',
      ingredients: '鸡胸肉, 生菜, 番茄, 黄瓜, 西兰花, 橄榄油',
      protein: 35,
      calories: 320,
      carbs: 15
    },
    {
      id: '2',
      name: '三文鱼糙米饭',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=grilled%20salmon%20fillet%20with%20brown%20rice%20and%20steamed%20asparagus%20healthy%20fitness%20meal%20food%20photography&image_size=square',
      ingredients: '三文鱼, 糙米饭, 芦笋, 柠檬, 海盐',
      protein: 40,
      calories: 450,
      carbs: 30
    },
    {
      id: '3',
      name: '牛肉西兰花',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=lean%20beef%20stir%20fry%20with%20broccoli%20and%20sweet%20potato%20healthy%20protein%20meal%20fitness%20food%20photography&image_size=square',
      ingredients: '瘦牛肉, 西兰花, 红薯, 大蒜, 生抽',
      protein: 38,
      calories: 380,
      carbs: 25
    },
    {
      id: '4',
      name: '虾仁燕麦粥',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=shrimp%20oatmeal%20porridge%20with%20spinach%20and%20egg%20healthy%20breakfast%20bowl%20fitness%20food%20photography&image_size=square',
      ingredients: '虾仁, 燕麦, 菠菜, 鸡蛋, 葱花',
      protein: 28,
      calories: 280,
      carbs: 20
    },
    {
      id: '5',
      name: '金枪鱼全麦三明治',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tuna%20whole%20grain%20sandwich%20with%20lettuce%20tomato%20and%20avocado%20healthy%20lunch%20fitness%20food%20photography&image_size=square',
      ingredients: '金枪鱼, 全麦面包, 生菜, 番茄, 牛油果',
      protein: 32,
      calories: 400,
      carbs: 35
    },
    {
      id: '6',
      name: '豆腐蔬菜煲',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tofu%20vegetable%20soup%20with%20mushrooms%20bok%20choy%20and%20carrots%20healthy%20asian%20fitness%20meal%20food%20photography&image_size=square',
      ingredients: '豆腐, 香菇, 白菜, 胡萝卜, 金针菇',
      protein: 22,
      calories: 180,
      carbs: 12
    }
  ]
}