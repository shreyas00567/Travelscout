import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to TravelScout API',
    version: '1.0.0',
    endpoints: {
      featured: '/api/featured',
      destinations: '/api/destinations',
      nearby: '/api/nearby/:lat/:lng'
    }
  });
});

// ==========================================
// API Routes
// ==========================================

/**
 * GET /api/featured
 * Fetch all featured destinations from the database
 */
app.get('/api/featured', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        id,
        name,
        description,
        location,
        image_url,
        rating,
        latitude,
        longitude,
        category,
        created_at
      FROM featured_destinations 
      WHERE is_active = 1
      ORDER BY rating DESC, created_at DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching featured destinations:', error);
    res.status(500).json({
      error: 'Failed to fetch featured destinations',
      message: error.message
    });
  }
});

/**
 * GET /api/destinations/:id
 * Fetch a single destination by ID
 */
app.get('/api/destinations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM featured_destinations WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({
      error: 'Failed to fetch destination',
      message: error.message
    });
  }
});

/**
 * GET /api/destinations
 * Fetch all destinations with optional filtering
 */
app.get('/api/destinations', async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    
    let query = 'SELECT * FROM featured_destinations WHERE is_active = 1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY rating DESC LIMIT ?';
    params.push(parseInt(limit));

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({
      error: 'Failed to fetch destinations',
      message: error.message
    });
  }
});

/**
 * GET /api/nearby/:lat/:lng
 * Fetch nearby destinations based on latitude and longitude
 * Using Haversine formula for distance calculation
 */
app.get('/api/nearby/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const { radius = 50 } = req.query; // radius in kilometers

    const [rows] = await db.query(
      `SELECT 
        *,
        (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians(?)) + sin(radians(?)) * 
        sin(radians(latitude)))) AS distance
      FROM featured_destinations
      WHERE is_active = 1
      HAVING distance < ?
      ORDER BY distance ASC`,
      [lat, lng, lat, radius]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching nearby destinations:', error);
    res.status(500).json({
      error: 'Failed to fetch nearby destinations',
      message: error.message
    });
  }
});

/**
 * GET /api/categories
 * Fetch all unique categories
 */
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT DISTINCT category FROM featured_destinations WHERE is_active = 1 ORDER BY category'
    );
    res.json(rows.map(row => row.category));
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

// ==========================================
// Error Handling Middleware
// ==========================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// ==========================================
// Start Server
// ==========================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║     TravelScout API Server Running        ║
║                                            ║
║  Server: http://localhost:${PORT}             ║
║  Environment: ${process.env.NODE_ENV || 'development'}                   ║
║                                            ║
║  API Endpoints:                            ║
║  - GET  /api/featured                      ║
║  - GET  /api/destinations                  ║
║  - GET  /api/destinations/:id              ║
║  - GET  /api/nearby/:lat/:lng              ║
║  - GET  /api/categories                    ║
╚════════════════════════════════════════════╝
  `);
});

export default app;
