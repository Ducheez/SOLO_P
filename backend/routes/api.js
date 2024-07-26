// backend/routes/api.js

const express = require('express');
const contentGenerator = require('../controllers/contentGenerator');
const contentModerator = require('../controllers/contentModerator');

const router = express.Router();

router.post('/generate', contentGenerator.generateContent);
router.post('/moderate', contentModerator.moderateContent);

module.exports = router;