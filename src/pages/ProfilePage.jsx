import { useState, useEffect, useRef } from 'react'
import { getUserProfile, saveUserProfile } from '../data/storage'

const ProfilePage = () => {
  const [profile, setProfile] = useState({ username: '健身达人', avatar: null })
  const [showEditModal, setShowEditModal] = useState(false)
  const [editUsername, setEditUsername] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    const savedProfile = getUserProfile()
    setProfile(savedProfile)
  }, [])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result
        const updatedProfile = { ...profile, avatar: result }
        setProfile(updatedProfile)
        saveUserProfile(updatedProfile)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditClick = () => {
    setEditUsername(profile.username)
    setShowEditModal(true)
  }

  const handleSaveUsername = () => {
    if (editUsername.trim()) {
      const updatedProfile = { ...profile, username: editUsername.trim() }
      setProfile(updatedProfile)
      saveUserProfile(updatedProfile)
    }
    setShowEditModal(false)
  }

  return (
    <div className="app-container">
      <h2 className="text-xl font-bold p-4">我的</h2>
      
      <div className="profile-page">
        <div className="profile-header">
          <div className="avatar-wrapper">
            <img
              className="avatar"
              src={
                profile.avatar ||
                'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar%20silhouette%20profile%20picture%20simple%20minimal%20icon&image_size=square'
              }
              alt="头像"
              onClick={handleAvatarClick}
              style={{ cursor: 'pointer' }}
            />
            <div className="avatar-edit" onClick={handleAvatarClick}>
              ✎
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
          </div>
          <div className="profile-info">
            <h2>{profile.username}</h2>
            <button onClick={handleEditClick}>修改用户名</button>
          </div>
        </div>

        <div className="menu-item">
          <span className="label">版本信息</span>
          <span className="value">
            v1.0.0
            <span className="arrow">›</span>
          </span>
        </div>

        <div className="menu-item">
          <span className="label">关于我们</span>
          <span className="value">
            健身餐助手
            <span className="arrow">›</span>
          </span>
        </div>
      </div>

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>修改用户名</h2>
              <button onClick={() => setShowEditModal(false)}>×</button>
            </div>

            <div className="form-group">
              <label>用户名</label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="请输入新用户名"
                autoFocus
              />
            </div>

            <button className="submit-btn" onClick={handleSaveUsername}>
              保存
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage