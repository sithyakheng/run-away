import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function Sidebar({ isCollapsed, onToggle }) {
  const [activeItem, setActiveItem] = useState('home')
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    projects: true
  })
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠', path: '/dashboard' },
    { id: 'search', label: 'Search', icon: '🔍', path: '/search' },
    { id: 'resources', label: 'Resources', icon: '⭐', path: '/resources' },
    { id: 'connectors', label: 'Connectors', icon: '🔌', path: '/connectors' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' }
  ]

  const projectSections = [
    { id: 'all', label: 'All Projects', count: 12 },
    { id: 'starred', label: 'Starred', count: 3 },
    { id: 'created', label: 'Created by me', count: 8 },
    { id: 'shared', label: 'Shared with me', count: 4 }
  ]

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleNavigation = (path, itemId) => {
    navigate(path)
    setActiveItem(itemId)
  }

  return (
    <aside 
      className={`gradient-header border-r border-border transition-all-300 flex flex-col`}
      style={{ 
        width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        borderRight: '1px solid transparent',
        borderRightImage: 'linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
        borderRightImageSlice: 1
      }}
    >
      {/* Workspace Selector */}
      <div className="p-4 border-b border-border">
        <button
          onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
          className="w-full flex items-center justify-between p-2 bg-surface/50 rounded-lg hover:bg-surface/70 transition-all-200"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-accent to-secondary-accent"></div>
            {!isCollapsed && <span className="text-sm font-medium text-text-primary">My Workspace</span>}
          </div>
          {!isCollapsed && (
            <svg 
              className={`w-4 h-4 text-text-tertiary transition-transform-200 ${showWorkspaceMenu ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>

        {/* Workspace Dropdown */}
        {showWorkspaceMenu && !isCollapsed && (
          <div className="absolute left-4 mt-2 w-60 bg-card-bg rounded-lg shadow-xl border border-border z-50 transition-all-300">
            <div className="p-2">
              <button className="w-full text-left px-3 py-2 rounded hover:bg-surface/50 transition-all-200 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm text-text-primary">My Workspace</span>
                <svg className="w-4 h-4 text-success ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button className="w-full text-left px-3 py-2 rounded hover:bg-surface/50 transition-all-200 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                <span className="text-sm text-text-primary">Team Workspace</span>
              </button>
            </div>
            <div className="border-t border-border p-2">
              <button className="w-full text-left px-3 py-2 rounded hover:bg-surface/50 transition-all-200 flex items-center gap-2 text-primary-accent">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm font-medium">Add Workspace</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path, item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all-200 ${
                activeItem === item.id 
                  ? 'bg-surface/70 border-l-2 border-primary-accent text-text-primary' 
                  : 'text-text-secondary hover:bg-surface/50 hover:text-text-primary'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <span className="text-lg">{item.icon}</span>
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </div>

        {/* Projects Section */}
        <div className="mt-8">
          <button
            onClick={() => toggleSection('projects')}
            className="w-full flex items-center justify-between px-3 py-2 text-text-tertiary hover:text-text-primary transition-all-200"
          >
            <span className="text-xs font-semibold uppercase tracking-wider">Projects</span>
            {!isCollapsed && (
              <svg 
                className={`w-4 h-4 transition-transform-200 ${expandedSections.projects ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>

          {expandedSections.projects && !isCollapsed && (
            <div className="mt-2 space-y-1">
              {projectSections.map(section => (
                <button
                  key={section.id}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface/50 rounded transition-all-200"
                >
                  <span>{section.label}</span>
                  <span className="text-xs text-text-tertiary bg-surface/50 px-2 py-1 rounded">
                    {section.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Footer Cards */}
      <div className="p-4 space-y-3">
        {/* Referral Card */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">👥</span>
            <h4 className="text-sm font-semibold text-text-primary">Share Run Away</h4>
          </div>
          <p className="text-xs text-text-tertiary mb-3">Earn 100 credits for each paid referral</p>
          <button className="w-full btn-primary text-sm py-2">
            Invite Friends
          </button>
        </div>

        {/* Upgrade Card */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🚀</span>
            <h4 className="text-sm font-semibold text-text-primary">Upgrade Plan</h4>
          </div>
          <p className="text-xs text-text-tertiary mb-3">Unlock more features and credits</p>
          <button className="w-full gradient-bg text-white text-sm py-2 rounded-lg font-semibold hover-scale cursor-pointer border-none">
            Upgrade Now
          </button>
        </div>
      </div>

      {/* Toggle Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 text-text-tertiary hover:text-text-primary hover:bg-surface/50 rounded transition-all-200"
        >
          <svg 
            className={`w-5 h-5 transition-transform-200 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
