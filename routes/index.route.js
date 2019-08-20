const express = require('express');
const postRoutes = require('./post.route');
const authRoutes = require('./auth.route');
const announcementRoutes = require('./announcement.route')
const userRoutes = require('./user.route');
const groupRoutes = require('./group.route');

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/announcements', announcementRoutes)
router.use('/users', userRoutes);
router.use('/groups', groupRoutes);

module.exports = router;