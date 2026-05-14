import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, Star, Layers, Settings, ChevronDown, Plus, Users, Rocket, ChevronLeft, ChevronRight, Layout, Zap } from 'lucide-react'

function Sidebar({ isCollapsed, onToggle }) {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    projects: true
  })
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" />, path: '/dashboard' },
    { id: 'search', label: 'Search', icon: <Search className="w-4 h-4" />, path: '/search' },
    { id: 'resources', label: 'Resources', icon: <Star className="w-4 h-4" />, path: '/resources' },
    { id: 'connectors', label: 'Connectors', icon: <Zap className="w-4 h-4" />, path: '/connectors' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" />, path: '/settings' }
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

  const handleNavigation = (path) => {
    navigate(path)
  }

  const isActive = (path) => location.pathname === path

  return (
    <aside 
      className={`bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-all duration-300 flex flex-col`}
      style={{ width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)' }}
    >
      {/* Workspace Selector */}
      <div className="p-3 border-b border-[var(--color-border)]">
        <button
          onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
          className="w-full flex items-center justify-between p-2 hover:bg-[var(--color-hover)] rounded-md transition-colors group"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--color-accent)] flex items-center justify-center text-white text-[10px] font-bold">
              RW
            </div>
            {!isCollapsed && (
              <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                My Workspace
              </span>
            )}
          </div>
          {!isCollapsed && (
            <ChevronDown className={`w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-transform ${showWorkspaceMenu ? 'rotate-180' : ''}`} />
          )}
        </button>

        {/* Workspace Dropdown */}
        {showWorkspaceMenu && !isCollapsed && (
          <div className="absolute left-3 right-3 mt-1 bg-[var(--color-surface)] rounded-md shadow-lg border border-[var(--color-border)] z-50 py-1">
            <button className="w-full text-left px-3 py-1.5 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-hover)] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>My Workspace</span>
            </button>
            <button className="w-full text-left px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span>Team Workspace</span>
            </button>
            <div className="border-t border-[var(--color-border)] mt-1 pt-1">
              <button className="w-full text-left px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] flex items-center gap-2">
                <Plus className="w-3.5 h-3.5" />
                <span>New Workspace</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto custom-scrollbar">
        <div className="space-y-0.5">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-md transition-colors ${
                isActive(item.path)
                  ? 'bg-[var(--color-hover)] text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)]'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <span className={isActive(item.path) ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}>
                {item.icon}
              </span>
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </div>

        {/* Projects Section */}
        {!isCollapsed && (
          <div className="mt-8 space-y-1">
            <button
              onClick={() => toggleSection('projects')}
              className="w-full flex items-center justify-between px-3 py-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] group"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">Projects</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${expandedSections.projects ? 'rotate-0' : '-rotate-90'}`} />
            </button>

            {expandedSections.projects && (
              <div className="space-y-0.5 mt-1">
                {projectSections.map(section => (
                  <button
                    key={section.id}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-hover)] rounded-md transition-colors"
                  >
                    <span>{section.label}</span>
                    <span className="text-[10px] font-medium text-[var(--color-text-muted)] bg-[var(--color-page-bg)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
                      {section.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Footer Cards */}
      {!isCollapsed && (
        <div className="p-3 space-y-3 border-t border-[var(--color-border)]">
          <div className="p-3 bg-[var(--color-page-bg)] rounded-lg border border-[var(--color-border)] space-y-2">
            <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">Refer & Earn</span>
            </div>
            <p className="text-[10px] text-[var(--color-text-secondary)] leading-relaxed">
              Earn 100 credits for each friend who joins.
            </p>
            <button className="w-full btn-primary text-[10px] py-1.5">
              Invite Friends
            </button>
          </div>

          <div className="p-3 bg-[var(--color-accent)] text-white rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Rocket className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">Go Pro</span>
            </div>
            <p className="text-[10px] text-white/80 leading-relaxed">
              Unlock unlimited projects and AI features.
            </p>
            <button className="w-full bg-white text-black font-bold text-[10px] py-1.5 rounded-md hover:bg-white/90 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <div className="p-3 border-t border-[var(--color-border)]">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-hover)] rounded-md transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
