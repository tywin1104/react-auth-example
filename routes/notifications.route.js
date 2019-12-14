const express = require('express');
const Notifications = require('../models/Notifications')
const Post = require('../models/Post')
const authenticate = require('../helpers/check-auth');
const router = express.Router();
module.exports = router;

//Get All Notifications
router.get('/:username', authenticate, function (req, res) {
    Notifications.find({ username: req.user.username }, function (err, notifications) {
        if (err) {
            console.log(err)
            res.status(500).json({
                msg: "Unable to get all notifications"
            })
        } else {
            res.status(200).json({ notifications })
        }
    })
})

// GET new Notifications
router.get('/new/:username', authenticate, async function (req, res) {
    const username = req.user.username

    await Post.find({ username }, async (err, posts) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                msg: "Unable to get new notifications"
            })
        } else if (posts.length) {
            let ONE_mIN = 60 * 1000;
            let length = 0;
            let postsThatHasNewReplies = posts.filter(post => post.replies.map(reply => (new Date - new Date(reply.timestamp)) <= ONE_mIN && reply.new ? length++ : null))
            debugger
            for (let newPost of postsThatHasNewReplies) {
                await saveNotification(newPost, username)
            }
            res.status(200).send({ length })
        } else {
            console.log('----------------', req.user)
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


// edit reply to be old
// set the "new" attribute to false for the given reply _id 
router.put('/reply/:username/:id', authenticate,async function (req, res) {
    console.log('edit reply')
    const { id } = req.params;
    const username = req.user.username
    await Post.findOne({ username, 'replies': { $elemMatch: { _id: id, new: true } } }, async (err, post) => {
        if (err || post == null) {
            console.log(err)
            res.status(404).json()
        } else {
            let replies = post.replies.map(x => {
                if(x._id.toString() == id.toString() ){ x.new = false }
                return x
            })
            post.replies = replies

            try {
                let result = await Post.findByIdAndUpdate(post._id, post)
                res.status(200).send(result)
            }
            catch (err) {
                console.log(err)
            }
        }
    })
})
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
