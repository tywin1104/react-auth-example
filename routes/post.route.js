const express = require('express');
const Post = require('../models/Post')
const router = express.Router();
module.exports = router;
const authenticate = require('../helpers/check-auth')

//Get all posts
router.get('/',  authenticate, function (req, res) {
  Post.find({}).sort('-timestamp').exec(function (err, posts) {
    if (err) {
      console.log(err)
      res.status(500).json({
        msg: "unable to get posts"
      })
    } else {
      res.status(200).json({ posts })
    }
  })
})

//Get specific post
router.get('/:post_id', authenticate, function (req, res) {
  Post.findById(req.params.post_id, function (err, post) {
    if (err) {
      console.log(err)
      res.status(500).json({
        msg: "unable to get specified post"
      })
    } else {
      res.status(200).json({ post })
    }
  })
})


//Create a post
router.post('/', authenticate, function (req, res) {
  const { username, title, content,tag } = req.body;
  const post = new Post({ title, username, content,tag })
  post.save(function (err) {
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
router.patch('/:post_id', authenticate, function (req, res) {
  if (req.user.role !== 'MOD' || req.user.role !== 'ADMIN') return res.status(401).send();

  Post.findOneAndUpdate(req.params.post_id, req.body, { new: true }, function (err, post) {
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
// router.delete('/:post_id', authenticate, function (req, res, next) {
//   if (req.user.role !== 'MOD' || req.user.role !== 'ADMIN') return res.status(401).send();
//   //if (req.user.role !== 'MOD' || req.user.role !== 'ADMIN') return res.status(401).send();
//   Post.findByIdAndRemove(req.params.post_id, req.body, function (err, post) {
//     if (err) {
//       console.log(err);
//       res.status(500).json({
//         msg: "unable to delete post"
//       })
//     } else {
//       res.status(200).json(post);
//     }
//   });
// });
//Delete a post by id
router.delete('/:post_id', authenticate, function (req, res, next) {
  //if (req.user.role !== 'MOD' || req.user.role !== 'ADMIN') {
  if (req.user.role !== 'MOD' && req.user.role !== 'ADMIN') return res.status(401).send();

  Post.findByIdAndRemove(req.params.post_id, req.body, function (err, post) {
    if (err) {
      console.log('remove post error ', err);
      res.status(500).json({
        msg: "unable to delete post"
      })
    } else {
      console.log('post should be removed')
      res.status(200).json(post);
    }
  })
//}else{
  //return res.status(401).send()
//}
});


//Add reply to a post by ID
router.post('/:post_id/replies',authenticate, function (req, res) {
  const { replies } = req.body
  replies.map(x => { x.new = true; return x })
  console.log('replies :', replies)
  Post.findByIdAndUpdate(req.params.post_id, { $push: { replies } }, { new: true }, function (err, post) {
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
router.delete('/:post_id/replies/:reply_id',authenticate, function (req, res) {
  const {username} = req.user

  Post.findByIdAndUpdate({_id: req.params.post_id,username}, { $pull: { replies: { _id: req.params.reply_id } } }, { new: true }, function (err, post) {
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
