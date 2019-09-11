let express = require('express')
let router = express.Router()
let User = require('../models/user')

let jwt = require('jsonwebtoken')
let secretObj = require('../config/jwt')


router.post('/', function(req, res) {
    let body = req.body
    let token = jwt.sign({ userId: body.userId }, secretObj.secret, { expiresIn: '1d' })

    User.findOne({ userId: body.userId })
        .then(user => {
            if (user.pwd === body.pwd) {
                res.cookie('user', token)
                res.json({token: token})
            }
        })
        .catch(error => {
            res.status(401).end();
        })
});

module.exports = router;
