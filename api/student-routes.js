// Student Resources API Routes
// Add these routes to your server.js

const express = require('express');
const path = require('path');
const { studentMaterials } = require('./data/materials');
const { successStories } = require('./data/stories');

const router = express.Router();

// Get all student resources
router.get('/student-resources', (req, res) => {
  try {
    res.json(studentMaterials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Get student resources by category
router.get('/student-resources/:category', (req, res) => {
  try {
    const category = req.params.category;
    if (category === 'all') {
      return res.json(studentMaterials);
    }
    const filtered = studentMaterials.filter(m => m.category === category);
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Get all success stories
router.get('/success-stories', (req, res) => {
  try {
    res.json(successStories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// Get single success story
router.get('/success-stories/:id', (req, res) => {
  try {
    const story = successStories.find(s => s.id === parseInt(req.params.id));
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch story' });
  }
});

// Download file endpoint
router.get('/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../public/downloads/resources', filename);
    
    // Security check to prevent directory traversal
    const normalizedPath = path.normalize(filepath);
    const basePath = path.normalize(path.join(__dirname, '../public/downloads/resources'));
    
    if (!normalizedPath.startsWith(basePath)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    res.download(filepath, (err) => {
      if (err) {
        if (!res.headersSent) {
          res.status(404).json({ error: 'File not found' });
        }
      }
    });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Download failed' });
    }
  }
});

module.exports = router;
