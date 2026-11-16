import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();
const API_BASE = 'http://localhost:5000/api';

const DEFAULT_PROJECTS = [
  {
    id: 'sample_game_1',
    title: 'Space Star Catcher',
    type: 'game',
    authorName: 'SparkyCoder',
    authorId: 'user_demo_kid',
    description: 'Catch the twinkling stars falling from galaxy space before time runs out!',
    thumbnail: '🚀',
    isPublic: true,
    data: {
      sprites: [
        { id: 's1', name: 'Rocket', emoji: '🚀', x: 220, y: 320, size: 55, speed: 8 },
        { id: 's2', name: 'Star', emoji: '⭐', x: 200, y: 60, size: 40, speed: 4 }
      ],
      background: 'galaxy',
      score: 0,
      code: [
        { id: 'b1', type: 'when_flag_clicked', label: 'When 🟢 clicked' },
        { id: 'b2', type: 'forever', label: 'Forever', children: [
          { id: 'b3', type: 'move_steps', label: 'Move 10 steps', val: 10 },
          { id: 'b4', type: 'bounce_on_edge', label: 'If on edge, bounce' }
        ]}
      ]
    }
  },
  {
    id: 'sample_game_2',
    title: 'Super Maze Runner',
    type: 'game',
    authorName: 'SparkyCoder',
    authorId: 'user_demo_kid',
    description: 'Use arrow keys to escape the colourful maze and reach the golden cheese!',
    thumbnail: '🧀',
    isPublic: true,
    data: {
      sprites: [
        { id: 's1', name: 'Mouse', emoji: '🐭', x: 50, y: 60, size: 45, speed: 6 },
        { id: 's2', name: 'Cheese', emoji: '🧀', x: 400, y: 320, size: 45, speed: 0 }
      ],
      background: 'grid',
      score: 0,
      code: []
    }
  },
  {
    id: 'sample_anim_1',
    title: 'Dancing Dino Birthday Party',
    type: 'animation',
    authorName: 'SparkyCoder',
    authorId: 'user_demo_kid',
    description: 'A cheerful dinosaur dancing under confetti and singing happy birthday tunes!',
    thumbnail: '🦖',
    isPublic: true,
    data: {
      sprites: [
        { id: 's1', name: 'Dino', emoji: '🦖', x: 200, y: 220, size: 65, dialogue: "Let's party and code!" },
        { id: 's2', name: 'Cake', emoji: '🎂', x: 330, y: 250, size: 50, dialogue: "Make a wish!" }
      ],
      background: 'party'
    }
  },
  {
    id: 'sample_story_1',
    title: 'The Brave Robot and Magic Tree',
    type: 'story',
    authorName: 'SparkyCoder',
    authorId: 'user_demo_kid',
    description: 'An interactive tale of Robbie the Robot learning to make friendly code.',
    thumbnail: '🤖',
    isPublic: true,
    data: {
      scenes: [
        {
          id: 'sc_1',
          name: 'The Enchanted Woods',
          background: 'forest',
          character: '🤖',
          dialogue: 'Greetings! I am looking for the Tree of Ethical AI Knowledge.',
          action: 'glow'
        },
        {
          id: 'sc_2',
          name: 'At The Magic Tree',
          background: 'tree',
          character: '🌳',
          dialogue: 'Welcome little robot! To grow smart, promise to make apps that help people!',
          action: 'bounce'
        }
      ]
    }
  }
];

export const ProjectProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('sparkcode_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return DEFAULT_PROJECTS; }
    }
    return DEFAULT_PROJECTS;
  });

  useEffect(() => {
    localStorage.setItem('sparkcode_projects', JSON.stringify(projects));
  }, [projects]);

  // Sync from backend if accessible
  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then(res => res.json())
      .then(data => {
        if (data.projects && data.projects.length > 0) {
          // Merge
          const existingIds = new Set(projects.map(p => p.id));
          const newOnes = data.projects.filter(p => !existingIds.has(p.id));
          if (newOnes.length > 0) {
            setProjects(prev => [...prev, ...newOnes]);
          }
        }
      })
      .catch(() => {
        // Safe silent fallback to local storage
      });
  }, []);

  const saveProject = async (projectData) => {
    const isEditing = Boolean(projectData.id && projects.some(p => p.id === projectData.id));
    const projectToSave = {
      ...projectData,
      id: projectData.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      authorName: user ? user.username : 'Guest Creator',
      authorId: user ? user.id : 'guest',
      updatedAt: new Date().toISOString(),
      createdAt: projectData.createdAt || new Date().toISOString()
    };

    // Try backend sync
    if (token) {
      try {
        const url = isEditing ? `${API_BASE}/projects/${projectToSave.id}` : `${API_BASE}/projects`;
        const method = isEditing ? 'PUT' : 'POST';
        await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(projectToSave)
        });
      } catch (e) {
        console.warn('Backend sync deferred, saved locally');
      }
    }

    setProjects(prev => {
      if (isEditing) {
        return prev.map(p => p.id === projectToSave.id ? projectToSave : p);
      }
      return [projectToSave, ...prev];
    });

    return projectToSave;
  };

  const deleteProject = async (id) => {
    if (token) {
      try {
        await fetch(`${API_BASE}/projects/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (e) {
        console.warn('Backend delete sync deferred');
      }
    }
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const getProject = (id) => {
    return projects.find(p => p.id === id);
  };

  return (
    <ProjectContext.Provider value={{ projects, saveProject, deleteProject, getProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);

