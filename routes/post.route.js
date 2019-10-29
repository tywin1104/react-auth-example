const express = require('express');
const Post = require('../models/Post')
const router = express.Router();
module.exports = router;

//Get all posts
router.get('/', function(req, res) {
    Post.find({}).sort('-timestamp').exec(function(err, posts) {
      if(err) {
        console.log(err)
        res.status(500).json({
          msg: "unable to get posts"
        })
      }else {
        res.status(200).json({posts})
      }
    })
})

//Get specific post
router.get('/:post_id', function(req, res) {
  Post.findById(req.params.post_id, function(err, post) {
    if(err) {
      console.log(err)
      res.status(500).json({
        msg: "unable to get specified post"
      })
    }else {
      res.status(200).json({post})
    }
  })
})


//Create a post
router.post('/', function(req, res) {
    const {username, title, content} = req.body;
    const post = new Post({title, username, content})
    post.save(function(err) {
      if (err) {
        console.log(err);
        res.status(500).json({
          msg: "unable to create post"
        })
      } else {
        res.status(200).json(post)
      }
    })
})

//Patch (partial update) a post by id
router.patch('/:post_id', function(req, res) {
  Post.findByIdAndUpdate(req.params.post_id, req.body, {new: true}, function (err, post) {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "unable to update post"
      })
    } else {
      res.status(200).json(post);
    }
  });
})

//Delete a post by id
router.delete('/:post_id', function(req, res, next) {
  Post.findByIdAndRemove(req.params.post_id, req.body, function (err, post) {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "unable to delete post"
      })
    } else {
      res.status(200).json(post);
    }
  });
});


//Add reply to a post by ID
router.post('/:post_id/replies', function(req, res) {
  const {replies} = req.body
  Post.findByIdAndUpdate(req.params.post_id, {$push: {replies}}, {new: true}, function (err, post) {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "unable to append replies to the post"
      })
    } else {
      res.status(200).json(post);
    }
  });
})

//Delete a reply by id
router.delete('/:post_id/replies/:reply_id', function(req, res) {
  Post.findByIdAndUpdate(req.params.post_id, {$pull: {replies: {_id: req.params.reply_id}}}, {new: true}, function (err, post) {
    if (err) {
      console.log(err);
      res.status(500).json({
        msg: "unable to remove replies"
      })
    } else {
      res.status(200).json(post);
    }
  });
});
