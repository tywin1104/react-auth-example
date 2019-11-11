const express = require('express');
const Notifications = require('../models/Notifications')
const Post = require('../models/Post')
const router = express.Router();
module.exports = router;

//Get All Notifications
router.get('/:username', function (req, res) {
    Notifications.find({ username: req.params.username }, function (err, notifications) {
        if (err) {
            console.log(err)
            res.status(500).json({
                msg: "Unable to get all notifications"
            })
        } else {
            console.log(Notifications)
            res.status(200).json({ notifications })
        }
    })
})

// GET new Notifications
router.get('/new/:username', async function (req, res) {
    const { username } = req.params;
    await Post.find({ username }, async (err, posts) => {
        console.log(posts)
        if (err) {
            console.log(err)
            res.status(500).json({
                msg: "Unable to get new notifications"
            })
        } else if (posts.length) {
            let FIVE_MIN = 5 * 60 * 1000;
            let postsThatHasNewReplies = posts.filter(post => post.replies.filter(reply => (new Date - new Date(reply.timestamp)) <= FIVE_MIN))
            debugger
            for (let newPost of postsThatHasNewReplies) {
                await saveNotification(newPost, username)
            }
            res.status(200).send({ length: postsThatHasNewReplies.length })
        } else {
            res.status(404).send()
        }
    })
})

const saveNotification = async (newPost, username) => {
    await Notifications.findOne({ username }, async (err, nots) => {
        if (nots == null) {
            let newNot = new Notifications({ username, posts: newPost })
            await newNot.save()
        } else {
            let maxLength = Math.max(...nots.posts.filter(post => post._id.toString() == newPost._id.toString()).map((post) => post.replies.length))
            debugger;
            if (maxLength < newPost.replies.length) {
                await Notifications.findOneAndUpdate({ username }, { $addToSet: { posts: newPost } }, (err, raw) => {
                    console.log(raw)
                })
            }
        }
    })

}
// // Add Lunch Menu
// router.post('/', function(req, res) {
//     const { images } = req.body;
//     const menu = new Notifications({ images })
//     menu.save(function(err) {
//         if (err) {
//             console.log(err);
//             res.status(500).json({
//                 msg: "unable to create lunch menu"
//             })
//         } else {
//             res.status(200).json(menu)
//         }
//     })
// })