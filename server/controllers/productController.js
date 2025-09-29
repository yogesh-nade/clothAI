const Product = require('../models/product');
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Helper function: Download AI-generated image and save product to database
async function saveAIProduct({ title, description, price, category, imageUrl }) {
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
  
  // Generate unique filename and download image
  const filename = `${Date.now()}_${Math.floor(Math.random()*10000)}.png`;
  const filePath = path.join(uploadsDir, filename);
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(buffer));

  // Save product details to MongoDB
  const product = new Product({
    title,
    description,
    price,
    category,
    image: `/uploads/${filename}` // Store relative path for serving
  });
  await product.save();
  return product;
}

// Get all custom clothing products from database
async function getCustomClothing(req, res) {
  try {
    const products = await Product.find({ category: 'mens-shirts' });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Step 1: Start AI image generation using Freepik API
async function startAIImageTask(req, res) {
  try {
    const { prompt } = req.body;
    
    // Initiate image generation with Freepik AI
    const startRes = await fetch('https://api.freepik.com/v1/ai/mystic', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-freepik-api-key': process.env.FREEPIK_API_KEY // Use environment variable for security
      },
      body: JSON.stringify({
        prompt,
        aspect_ratio: 'widescreen_16_9'
      })
    });
    
    const startData = await startRes.json();
    if (!startData.data || !startData.data.task_id) {
      return res.status(500).json({ success: false, message: startData.message || 'Failed to start image generation.' });
    }
    
    // Return task ID for polling completion status
    res.json({ success: true, taskId: startData.data.task_id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Step 2: Poll for image completion and save product if ready
async function completeAIImageTask(req, res) {
  try {
    const { taskId, title, description, price } = req.body;
    
    // Check image generation status
    const statusRes = await fetch(`https://api.freepik.com/v1/ai/mystic/${taskId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'x-freepik-api-key': process.env.FREEPIK_API_KEY // Use environment variable for security
      }
    });
    
    const statusData = await statusRes.json();
    
    // If image generation completed successfully
    if (statusData.data?.status === 'COMPLETED' && statusData.data?.generated?.length > 0) {
      const imageUrl = statusData.data.generated[0];
      
      // Download image and save product to database
      const product = await saveAIProduct({
        title,
        description,
        price,
        category: 'mens-shirts',
        imageUrl
      });
      return res.json({ success: true, product });
    }
    
    // Handle failed generation
    if (statusData.data?.status === 'FAILED') {
      return res.status(500).json({ success: false, message: 'Image generation failed.' });
    }
    
    // Still processing - client should retry later
    return res.status(202).json({ success: false, message: 'Image is still being generated. Please try again later.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { saveAIProduct, getCustomClothing, startAIImageTask, completeAIImageTask };
