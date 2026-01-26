const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUniversities } = require('../controllers/universityController');

router.get('/', protect, getUniversities);

module.exports = router;