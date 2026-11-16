import { projectsDb } from '../models/db.js';

export const getProjects = (req, res) => {
  try {
    const { type, publicOnly } = req.query;
    let list = projectsDb.read();

    if (publicOnly === 'true') {
      list = list.filter(p => p.isPublic);
    } else if (req.user) {
      list = list.filter(p => p.isPublic || p.authorId === req.user.id);
    }

    if (type) {
      list = list.filter(p => p.type === type);
    }

    res.json({ projects: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const getMyProjects = (req, res) => {
  try {
    const list = projectsDb.findAll({ authorId: req.user.id });
    res.json({ projects: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user projects' });
  }
};

export const getProjectById = (req, res) => {
  try {
    const project = projectsDb.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching project' });
  }
};

export const createProject = (req, res) => {
  try {
    const { title, type = 'game', description, thumbnail, data, isPublic = true } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const newProject = projectsDb.create({
      title,
      type,
      description: description || 'Created with SparkCode Studio!',
      thumbnail: thumbnail || (type === 'game' ? '🎮' : type === 'animation' ? '🎬' : '📖'),
      authorId: req.user.id,
      authorName: req.user.username,
      isPublic: isPublic !== undefined ? isPublic : true,
      data: data || {}
    });

    res.status(201).json({ project: newProject, message: 'Project saved successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const updateProject = (req, res) => {
  try {
    const project = projectsDb.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not permitted to update this project' });
    }

    const updated = projectsDb.update(req.params.id, req.body);
    res.json({ project: updated, message: 'Project updated!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = (req, res) => {
  try {
    const project = projectsDb.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not permitted to delete this project' });
    }

    projectsDb.delete(req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

