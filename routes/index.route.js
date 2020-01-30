const express = require('express');
const postRoutes = require('./post.route');
const authRoutes = require('./auth.route');
const announcementRoutes = require('./announcement.route')
const stewardsAnnouncements = require('./stewardsAnnouncements.route')
const userRoutes = require('./user.route');
const groupRoutes = require('./group.route');
const electionRoutes = require('./election.route')
const notificationsRoutes = require('./notifications.route')
const lunchMenuRoutes = require('./lunchMenu.route')

const router = express.Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
    res.send('OK')
);

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/announcements', announcementRoutes)
router.use('/stewards', stewardsAnnouncements)
router.use('/users', userRoutes);
router.use('/groups', groupRoutes);
router.use('/elections', electionRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/lunchMenus', lunchMenuRoutes);



module.exports = router;
