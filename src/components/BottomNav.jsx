import { useLocation, useNavigate } from 'react-router-dom'
import { HomeIcon, MenuIcon, CheckInIcon, ProfileIcon } from './Icons'

const BottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { path: '/', label: '首页', icon: HomeIcon },
    { path: '/menu', label: '餐单', icon: MenuIcon },
    { path: '/checkin', label: '打卡', icon: CheckInIcon },
    { path: '/profile', label: '我的', icon: ProfileIcon }
  ]

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.path
        return (
          <button
            key={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <Icon active={isActive} />
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNav