const express = require('express');
const Post = require('../models/Post')
const router = express.Router();
module.exports = router;

router.get('/', function(req, res) {
    Post.find({}, function(err, posts) {
      if(err) {
        console.log(err)
        res.status(500).json({
          msg: "unable to get posts"
        })
      }else {
        res.status(200).json(posts)
      }
    })
})

//Create a post
router.post('/', function(req, res) {
    const {content} = req.body;
    const post = new Post({content})
    post.save(function(err) {
      if (err) {
        console.log(err);
        if(err) {
          res.status(500).json({
            msg: "unable to create post"
          })
        }
      } else {
        res.status(200).json(post)
      }
    })
})