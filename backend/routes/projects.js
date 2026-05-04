import express from 'express'
import { createClient } from '@supabase/supabase-js'

const router = express.Router()

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Get all projects for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.status(200).json({ projects })

  } catch (error) {
    console.error('Get Projects Error:', error)
    res.status(500).json({
      error: {
        message: 'Failed to fetch projects'
      }
    })
  }
})

// Create a new project
router.post('/', async (req, res) => {
  try {
    const { user_id, name, description } = req.body

    if (!user_id || !name) {
      return res.status(400).json({
        error: {
          message: 'User ID and name are required'
        }
      })
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id,
        name,
        description: description || '',
        code: '',
        status: 'draft'
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json({ project })

  } catch (error) {
    console.error('Create Project Error:', error)
    res.status(500).json({
      error: {
        message: 'Failed to create project'
      }
    })
  }
})

// Update a project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, code, status } = req.body

    const { data: project, error } = await supabase
      .from('projects')
      .update({
        name,
        description,
        code,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    if (!project) {
      return res.status(404).json({
        error: {
          message: 'Project not found'
        }
      })
    }

    res.status(200).json({ project })

  } catch (error) {
    console.error('Update Project Error:', error)
    res.status(500).json({
      error: {
        message: 'Failed to update project'
      }
    })
  }
})

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.status(200).json({ message: 'Project deleted successfully' })

  } catch (error) {
    console.error('Delete Project Error:', error)
    res.status(500).json({
      error: {
        message: 'Failed to delete project'
      }
    })
  }
})

export default router
