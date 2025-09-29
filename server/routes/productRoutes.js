const express = require('express');
const router = express.Router();
const { getCustomClothing, startAIImageTask, completeAIImageTask } = require('../controllers/productController');

// Product routes for AI-generated custom clothing
router.get('/clothing', getCustomClothing);           // Get all custom clothing products
router.post('/start-image', startAIImageTask);       // Step 1: Start AI image generation
router.post('/complete-image', completeAIImageTask); // Step 2: Complete AI image generation and save product

module.exports = router;
