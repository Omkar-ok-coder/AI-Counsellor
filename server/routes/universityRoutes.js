const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Authentication check
const universityController = require('../controllers/universityController');

// ✅ THIS was missing! It connects the URL to your function.
router.get('/recommendations', protect, universityController.getRecommendations);

// Other routes
router.post('/shortlist', protect, universityController.updateShortlistStatus);

// If you have a separate lock function, add it here. 
// If updateShortlistStatus handles locking (which your code implies), you don't need a separate lock route.
router.put('/lock', protect, universityController.updateShortlistStatus); 

module.exports = router;