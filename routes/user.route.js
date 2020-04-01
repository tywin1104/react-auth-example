const express = require('express');
const User = require('../models/User')
const router = express.Router();
const authenticate = require('../helpers/check-auth')


module.exports = router;


//Get Users
router.get('/', authenticate, function (req, res) {
    console.log('GET USERS ', req.query)
    User.find(req.query, '-password', function (err, users) {
        if (err) {
            console.log(err)
            res.status(500).json({
                msg: "Unable to get all users"
            })
        } else {
            res.status(200).json({ users })
        }
    })
})

//Get User by Id
router.get('/:user_id', authenticate, function (req, res) {
    console.log(req.params.user_id);
    console.log("THIS IS USER ID");
    User.findById(req.params.user_id, function (err, user) {
        if (err) {
            console.log(err)
            res.status(500).json({
                msg: "Unable to get user by id"
            })
        } else {
            console.log(user);
            res.status(200).json({ user })
        }
    })
})

//Partial update
router.patch('/:user_id', authenticate, function (req, res) {
    console.log('patching user')
    if ((req.user.role == 'MOD' || req.user.role == 'ADMIN') || req.user._id == req.params.user_id) {
        console.log('authorized to patch user')
        let points = req.body.points;
        update = req.body;
        // if (points) {
        //     let level = 1 + parseInt(points / 50);
        //     update.level = level;
        //     console.log(update.points)

        // }
        // console.log(update)
        console.log(req.body)
        User.findByIdAndUpdate({_id: req.params.user_id}, req.body, function (err, user) {
            console.log(update)
            console.log("UPDATE USER: ", user)

            // for(var prop in update) {
            //     user.prop = update.prop;
            // }

            if (update.password ) {
                user.password = update.password;
            }
            //else if(update.points) {
            //     user.points = update.points;
            // }else if(update.level) {
            //     update.level = update.level;

            // }
            user.save(function (err, user) {
                if (err) {
                    console.log(err)
                    res.status(500).json({
                        msg: "Unable to update user"
                    })
                } else {

                    console.log('works')
                    res.status(200).json({ user })

                }
            })
        })
    }
    else {
        return res.status(401).send()
    }

})
// User.findByIdAndUpdate(req.params.user_id, update, { new: true }, function(err, user) {
//     if (err) {
//         console.log(err)
//         res.status(500).json({
//             msg: "Unable to update user"
//         })
//     } else {
//         res.status(200).json({ user })
//     }
// })
// })

//Add group info to user
router.post('/:user_id/groups', authenticate, function (req, res) {
    if (req.user.role !== 'MOD' && req.user.role !== 'ADMIN') return res.status(401).send();

    const { group } = req.body
    User.findByIdAndUpdate(req.params.user_id, { $push: { groups: group } }, { new: true }, function (err, user) {
        if (err) {
            console.log(err);
            res.status(500).json({
                msg: "unable to add group info to this user"
            })
        } else {
            res.status(200).json(user);
        }
    });
})
