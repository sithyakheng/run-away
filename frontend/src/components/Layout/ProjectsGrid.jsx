import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ProjectsGrid({ projects, onCreateProject, onProjectAction }) {
  const [hoveredCard, setHoveredCard] = useState(null)
  const [showContextMenu, setShowContextMenu] = useState(null)
  const navigate = useNavigate()

  const handleCardClick = (projectId) => {
    navigate(`/builder/${projectId}`)
  }

  const handleContextMenu = (e, projectId) => {
    e.stopPropagation()
    setShowContextMenu(showContextMenu === projectId ? null : projectId)
  }

  const handleAction = (action, projectId, e) => {
    e.stopPropagation()
    onProjectAction(action, projectId)
    setShowContextMenu(null)
  }

  const getProjectThumbnail = (project) => {
    // Generate a placeholder thumbnail based on project name
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500']
    const colorIndex = project.name.length % colors.length
    return colors[colorIndex]
  }

  return (
    <section className="px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-3xl font-bold text-text-primary">Recent Projects</h3>
        <button 
          onClick={onCreateProject}
          className="btn-primary"
        >
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-32 h-32 mx-auto mb-6 bg-surface rounded-full flex items-center justify-center">
            <span className="text-4xl">🚀</span>
          </div>
          <h4 className="text-2xl font-bold text-text-primary mb-4">No projects yet</h4>
          <p className="text-text-secondary mb-6">Create your first project by describing your idea above</p>
          <button onClick={onCreateProject} className="btn-primary">
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="card hover-lift cursor-pointer relative overflow-hidden"
              style={{ width: '320px', height: '280px' }}
              onMouseEnter={() => setHoveredCard(project.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleCardClick(project.id)}
            >
              {/* Project Thumbnail */}
              <div 
                className={`h-48 ${getProjectThumbnail(project)} relative flex items-center justify-center`}
                style={{ height: '200px' }}
              >
                <div className="text-white text-6xl opacity-50">
                  {project.name.charAt(0).toUpperCase()}
                </div>
                
                {/* Hover Overlay */}
                {hoveredCard === project.id && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center transition-all-200">
                    <div className="flex flex-col gap-3">
                      <button className="btn-primary px-6 py-3 text-sm">
                        Open Project
                      </button>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => handleAction('duplicate', project.id, e)}
                          className="btn-secondary px-4 py-2 text-sm"
                        >
                          Duplicate
                        </button>
                        <button 
                          onClick={(e) => handleAction('delete', project.id, e)}
                          className="px-4 py-2 bg-error text-white rounded-lg text-sm hover:bg-red-600 transition-all-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="p-4">
                <h4 className="font-semibold text-text-primary text-base mb-2">
                  {project.name}
                </h4>
                <p className="text-text-tertiary text-sm mb-3 line-clamp-2">
                  {project.description || 'No description provided'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-tertiary">
                    Edited {new Date(project.updated_at || project.created_at).toLocaleDateString()}
                  </span>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handleAction('favorite', project.id, e)}
                      className="text-text-tertiary hover:text-yellow-500 transition-all-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => handleAction('share', project.id, e)}
                      className="text-text-tertiary hover:text-primary-accent transition-all-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a3 3 0 10-4.732 2.684m4.732-2.684a3 3 0 00-4.732-2.684M3 12a3 3 0 104.732 2.684M3 12a3 3 0 014.732-2.684" />
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => handleContextMenu(e, project.id)}
                      className="text-text-tertiary hover:text-text-primary transition-all-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Context Menu */}
              {showContextMenu === project.id && (
                <div className="absolute top-2 right-2 w-48 bg-card-bg rounded-lg shadow-xl border border-border z-10">
                  <button 
                    onClick={(e) => handleAction('rename', project.id, e)}
                    className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface/50 transition-all-200"
                  >
                    Rename
                  </button>
                  <button 
                    onClick={(e) => handleAction('move', project.id, e)}
                    className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface/50 transition-all-200"
                  >
                    Move to Folder
                  </button>
                  <button 
                    onClick={(e) => handleAction('share', project.id, e)}
                    className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface/50 transition-all-200"
                  >
                    Share
                  </button>
                  <button 
                    onClick={(e) => handleAction('archive', project.id, e)}
                    className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface/50 transition-all-200"
                  >
                    Archive
                  </button>
                  <div className="border-t border-border">
                    <button 
                      onClick={(e) => handleAction('delete', project.id, e)}
                      className="w-full text-left px-4 py-2 text-sm text-error hover:bg-surface/50 transition-all-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* View All Link */}
      {projects.length > 0 && (
        <div className="text-right">
          <button className="text-primary-accent hover:underline text-sm font-medium">
            View All Projects →
          </button>
        </div>
      )}
    </section>
  )
}

export default ProjectsGrid
