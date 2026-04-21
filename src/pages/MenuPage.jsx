import { useState, useEffect, useRef } from 'react'
import { getMeals, addMeal, deleteMeal } from '../data/storage'
import { PlusIcon, UploadIcon, EmptyMealIcon } from '../components/Icons'

const MenuPage = () => {
  const [meals, setMeals] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [mealToDelete, setMealToDelete] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    ingredients: '',
    protein: '',
    calories: '',
    carbs: ''
  })
  const [previewImage, setPreviewImage] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadMeals()
  }, [])

  const loadMeals = () => {
    const loadedMeals = getMeals()
    setMeals(loadedMeals)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result
        setPreviewImage(result)
        setFormData((prev) => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.ingredients) {
      alert('请填写餐单名称和食材')
      return
    }

    const newMeal = {
      name: formData.name,
      image: formData.image || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=healthy%20fitness%20meal%20bowl%20with%20vegetables%20and%20protein%20clean%20food%20photography&image_size=square',
      ingredients: formData.ingredients,
      protein: parseFloat(formData.protein) || 0,
      calories: parseFloat(formData.calories) || 0,
      carbs: parseFloat(formData.carbs) || 0
    }

    addMeal(newMeal)
    loadMeals()
    setShowModal(false)
    setFormData({
      name: '',
      image: '',
      ingredients: '',
      protein: '',
      calories: '',
      carbs: ''
    })
    setPreviewImage('')
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormData({
      name: '',
      image: '',
      ingredients: '',
      protein: '',
      calories: '',
      carbs: ''
    })
    setPreviewImage('')
  }

  const handleDeleteClick = (meal, e) => {
    e.stopPropagation()
    setMealToDelete(meal)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (mealToDelete) {
      deleteMeal(mealToDelete.id)
      loadMeals()
    }
    setShowDeleteConfirm(false)
    setMealToDelete(null)
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
    setMealToDelete(null)
  }

  return (
    <div className="app-container">
      <h2 className="text-xl font-bold p-4">餐单管理</h2>
      
      {meals.length === 0 ? (
        <div className="empty-state">
          <EmptyMealIcon />
          <p>暂无餐单，点击下方按钮添加</p>
        </div>
      ) : (
        <div className="meal-list">
          {meals.map((meal) => (
            <div key={meal.id} className="meal-item">
              <button
                className="delete-btn"
                onClick={(e) => handleDeleteClick(meal, e)}
              >
                ×
              </button>
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
          ))}
        </div>
      )}

      <button className="add-button" onClick={() => setShowModal(true)}>
        <PlusIcon />
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>添加餐单</h2>
              <button onClick={handleCloseModal}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>餐单图片</label>
                <div className="image-upload" onClick={handleImageClick}>
                  {previewImage ? (
                    <img src={previewImage} alt="预览" className="preview" />
                  ) : (
                    <div className="placeholder">
                      <UploadIcon />
                      <span>点击上传图片</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>餐单名称</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="请输入餐单名称"
                />
              </div>

              <div className="form-group">
                <label>食材（用逗号分隔）</label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  placeholder="例如：鸡胸肉, 生菜, 番茄, 黄瓜"
                />
              </div>

              <div className="nutrition-row">
                <div className="form-group">
                  <label>蛋白质 (g)</label>
                  <input
                    type="number"
                    name="protein"
                    value={formData.protein}
                    onChange={handleInputChange}
                    placeholder="35"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>热量 (kcal)</label>
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleInputChange}
                    placeholder="320"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>碳水 (g)</label>
                  <input
                    type="number"
                    name="carbs"
                    value={formData.carbs}
                    onChange={handleInputChange}
                    placeholder="15"
                    min="0"
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn">
                保存餐单
              </button>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && mealToDelete && (
        <div className="result-modal delete-confirm-modal" onClick={handleCancelDelete}>
          <div className="result-content" onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>确定要删除「{mealToDelete.name}」吗？此操作不可撤销。</p>
            <div className="actions">
              <button className="delete-cancel-btn" onClick={handleCancelDelete}>
                取消
              </button>
              <button className="delete-confirm-btn" onClick={handleConfirmDelete}>
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MenuPage