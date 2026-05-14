import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, HelpCircle, User, LogOut, Settings, Layout, BookOpen, MessageSquare, Monitor } from 'lucide-react'

function Header({ user, onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    setShowUserMenu(false)
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <header className="bg-[var(--color-surface)] sticky top-0 z-50 border-b border-[var(--color-border)] h-[var(--header-height)]">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-xl font-medium tracking-tight text-[var(--color-text-primary)] cursor-pointer" onClick={() => navigate('/dashboard')}>
            Run Away
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-text-primary)] transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full h-9 pl-10 pr-12 bg-[var(--color-page-bg)] border border-[var(--color-border)] rounded-md text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-text-muted)] transition-all"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="px-1.5 py-0.5 text-[10px] text-[var(--color-text-muted)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-hover)] rounded-md transition-all relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-accent)] rounded-full border-2 border-[var(--color-surface)]" />
          </button>

          <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-hover)] rounded-md transition-all">
            <HelpCircle className="w-5 h-5" />
          </button>

          <div className="h-4 w-[1px] bg-[var(--color-border)] mx-1" />

          {/* User Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-white text-xs font-medium flex items-center justify-center hover:opacity-90 transition-all"
            >
              {getInitials(user?.user_metadata?.full_name || user?.email)}
            </button>

            {/* User Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[var(--color-surface)] rounded-lg shadow-lg border border-[var(--color-border)] py-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-[var(--color-border)]">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                    {user?.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] truncate">
                    {user?.email}
                  </p>
                </div>
                
                <div className="py-1">
                  <MenuButton icon={<User className="w-4 h-4" />} label="Profile" onClick={() => navigate('/profile')} />
                  <MenuButton icon={<Settings className="w-4 h-4" />} label="Settings" onClick={() => navigate('/settings')} />
                  <MenuButton icon={<Monitor className="w-4 h-4" />} label="Appearance" />
                </div>

                <div className="py-1 border-t border-[var(--color-border)]">
                  <MenuButton icon={<BookOpen className="w-4 h-4" />} label="Documentation" />
                  <MenuButton icon={<MessageSquare className="w-4 h-4" />} label="Community" />
                </div>

                <div className="py-1 border-t border-[var(--color-border)]">
                  <MenuButton 
                    icon={<LogOut className="w-4 h-4" />} 
                    label="Sign Out" 
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

const MenuButton = ({ icon, label, onClick, className }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-hover)] flex items-center gap-2.5 transition-colors ${className}`}
  >
    {icon}
    <span>{label}</span>
  </button>
)

export default Header
