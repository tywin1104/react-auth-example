const express = require('express');
const postRoutes = require('./post.route');
const authRoutes = require('./auth.route');

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);

module.exports = router;