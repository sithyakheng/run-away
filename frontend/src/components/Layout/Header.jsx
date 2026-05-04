import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
    <header className="gradient-header sticky top-0 z-50 border-b border-transparent" 
            style={{ 
              height: 'var(--header-height)', 
              borderBottom: '1px solid transparent',
              borderBottomImage: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent)',
              borderBottomImageSlice: 1
            }}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold gradient-text cursor-pointer hover-scale" onClick={() => navigate('/dashboard')}>
            Run Away
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, templates..."
              className="w-full px-4 py-2 pl-10 pr-12 bg-surface/80 border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary-accent focus:shadow-lg focus:shadow-primary-accent/20 transition-all-200"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="px-2 py-1 text-xs text-text-tertiary bg-surface border border-border rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-text-secondary hover:text-text-primary transition-all-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center pulse">
                3
              </span>
            </button>

            {/* Notifications Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-card-bg rounded-lg shadow-xl border border-border transition-all-300">
                <div className="p-4 border-b border-border flex justify-between items-center">
                  <h3 className="font-semibold text-text-primary">Notifications</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-text-tertiary hover:text-text-primary"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-border hover:bg-surface/50 cursor-pointer transition-all-200">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary-accent rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">New project invitation</p>
                        <p className="text-xs text-text-tertiary">John invited you to collaborate</p>
                        <p className="text-xs text-text-tertiary mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-b border-border hover:bg-surface/50 cursor-pointer transition-all-200">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">Project completed</p>
                        <p className="text-xs text-text-tertiary">Your website is ready to review</p>
                        <p className="text-xs text-text-tertiary mt-1">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-surface/50 cursor-pointer transition-all-200">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">Storage limit</p>
                        <p className="text-xs text-text-tertiary">You're using 80% of your storage</p>
                        <p className="text-xs text-text-tertiary mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-border">
                  <button className="w-full text-center text-sm text-primary-accent hover:underline">
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help */}
          <button className="p-2 text-text-secondary hover:text-text-primary transition-all-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* User Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-accent to-secondary-accent flex items-center justify-center text-white font-semibold hover-scale cursor-pointer"
            >
              {getInitials(user?.user_metadata?.full_name || user?.email)}
            </button>

            {/* User Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-card-bg rounded-lg shadow-xl border border-border transition-all-300">
                <div className="p-2">
                  <button
                    onClick={() => { setShowUserMenu(false); navigate('/profile'); }}
                    className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface/50 rounded transition-all-200 flex items-center gap-3"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </button>
                  <button
                    onClick={() => { setShowUserMenu(false); navigate('/settings'); }}
                    className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface/50 rounded transition-all-200 flex items-center gap-3"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface/50 rounded transition-all-200 flex items-center gap-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    Appearance
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface/50 rounded transition-all-200 flex items-center gap-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Support
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface/50 rounded transition-all-200 flex items-center gap-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Documentation
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface/50 rounded transition-all-200 flex items-center gap-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                    Community
                  </button>
                </div>
                <div className="border-t border-border p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-error hover:bg-surface/50 rounded transition-all-200 flex items-center gap-3"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
