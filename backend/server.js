const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static('public'));

// Sample podcast data - in production this would come from a database or file system
const podcasts = [
  {
    id: 'brest-maritime',
    title: 'Histoires Maritimes de Brest',
    description: 'Plongez dans l\'histoire navale de Brest, de ses arsenaux à ses légendes de marins. Un voyage sonore à travers les siècles d\'aventures bretonnes.',
    audio_url: '/audio/brest-maritime.mp3',
    thumbnail_url: '/images/brest-maritime.jpg',
    latitude: 48.3904,
    longitude: -4.4861,
    category: 'Histoire',
    duration: 1800,
    creator_name: 'Marie Le Goff',
    upload_date: '2024-01-15T10:00:00Z'
  },
  {
    id: 'carnac-mystery',
    title: 'Les Mystères de Carnac',
    description: 'Explorez les énigmes des alignements mégalithiques de Carnac. Entre archéologie et légendes, découvrez les secrets de ces pierres millénaires.',
    audio_url: '/audio/carnac-mystery.mp3',
    thumbnail_url: '/images/carnac-mystery.jpg',
    latitude: 47.5747,
    longitude: -3.0780,
    category: 'Histoire',
    duration: 2100,
    creator_name: 'Yann Morvan',
    upload_date: '2024-01-20T14:30:00Z'
  },
  {
    id: 'mont-saint-michel',
    title: 'Le Mont-Saint-Michel et ses Marées',
    description: 'Découvrez la magie du Mont-Saint-Michel, ses marées spectaculaires et l\'histoire de cette merveille architecturale entre Bretagne et Normandie.',
    audio_url: '/audio/mont-saint-michel.mp3',
    thumbnail_url: '/images/mont-saint-michel.jpg',
    latitude: 48.6361,
    longitude: -1.5115,
    category: 'Nature',
    duration: 1950,
    creator_name: 'Sophie Dubois',
    upload_date: '2024-02-01T09:15:00Z'
  },
  {
    id: 'rennes-culture',
    title: 'Rennes, Capitale Culturelle',
    description: 'Explorez la scène culturelle dynamique de Rennes, de ses festivals à ses artistes locaux. Portrait d\'une ville qui bouge et innove.',
    audio_url: '/audio/rennes-culture.mp3',
    thumbnail_url: '/images/rennes-culture.jpg',
    latitude: 48.1173,
    longitude: -1.6778,
    category: 'Culture',
    duration: 1650,
    creator_name: 'Thomas Le Bihan',
    upload_date: '2024-02-10T16:45:00Z'
  },
  {
    id: 'finistere-nature',
    title: 'Nature Sauvage du Finistère',
    description: 'Immersion dans les paysages préservés du Finistère, entre landes, falaises et forêts. Rencontres avec la faune et la flore exceptionnelles de ce bout du monde.',
    audio_url: '/audio/finistere-nature.mp3',
    thumbnail_url: '/images/finistere-nature.jpg',
    latitude: 48.2020,
    longitude: -4.2000,
    category: 'Nature',
    duration: 2250,
    creator_name: 'Nolwenn Kergoat',
    upload_date: '2024-02-15T11:20:00Z'
  }
];

const categories = [
  { id: 'histoire', name: 'Histoire', color: '#8B4513' },
  { id: 'nature', name: 'Nature', color: '#228B22' },
  { id: 'culture', name: 'Culture', color: '#4169E1' },
  { id: 'interviews', name: 'Interviews', color: '#DC143C' },
  { id: 'musique', name: 'Musique', color: '#FF8C00' }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Aquarelles API is running',
    timestamp: new Date().toISOString()
  });
});

// Get all podcasts
app.get('/api/podcasts', (req, res) => {
  try {
    const { category, limit } = req.query;
    
    let filteredPodcasts = podcasts;
    
    // Filter by category if specified
    if (category) {
      filteredPodcasts = podcasts.filter(
        podcast => podcast.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Limit results if specified
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredPodcasts = filteredPodcasts.slice(0, limitNum);
      }
    }
    
    res.json({
      success: true,
      data: filteredPodcasts,
      count: filteredPodcasts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching podcasts',
      error: error.message
    });
  }
});

// Get podcast by ID
app.get('/api/podcasts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const podcast = podcasts.find(p => p.id === id);
    
    if (!podcast) {
      return res.status(404).json({
        success: false,
        message: 'Podcast not found'
      });
    }
    
    res.json({
      success: true,
      data: podcast
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching podcast',
      error: error.message
    });
  }
});

// Get all categories
app.get('/api/categories', (req, res) => {
  try {
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// Search podcasts
app.get('/api/search', (req, res) => {
  try {
    const { q, category } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const searchTerm = q.toLowerCase();
    let results = podcasts.filter(podcast => 
      podcast.title.toLowerCase().includes(searchTerm) ||
      podcast.description.toLowerCase().includes(searchTerm) ||
      podcast.creator_name.toLowerCase().includes(searchTerm)
    );
    
    // Filter by category if specified
    if (category) {
      results = results.filter(
        podcast => podcast.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    res.json({
      success: true,
      data: results,
      count: results.length,
      query: q
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching podcasts',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎧 Aquarelles API server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌊 Ready to serve Brittany's podcast stories!`);
});