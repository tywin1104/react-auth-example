const express = require('express');
const LunchMenu = require('../models/LunchMenu')
const router = express.Router();
const authenticate = require('../helpers/check-auth')

module.exports = router;


//Get All Menus
router.get('/', function(req, res) {
    LunchMenu.find(req.query, function(err, menus) {
        if (err) {
            console.log(err)
            res.status(500).json({
                msg: "Unable to get all menus"
            })
        } else {
            res.status(200).json({ menus })
        }
    })
})


// Add Lunch Menu
router.post('/', authenticate,function(req, res) {
    if (req.user.role !== 'MOD' || req.user.role !== 'ADMIN') return res.status(401).send();

    const { images } = req.body;
    const menu = new LunchMenu({ images })
    menu.save(function(err) {
        if (err) {
            console.log(err);
            res.status(500).json({
                msg: "unable to create lunch menu"
            })
        } else {
            res.status(200).json(menu)
        }
    })
})
