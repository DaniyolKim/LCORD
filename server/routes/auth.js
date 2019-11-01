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
            if (user.comparePwd(body.pwd)) {
                //res.cookie('user', token)
                res.json({_id: user._id, token: token, userId: user.userId, userName: user.userName, tribe: user.tribe})
            } else {
                return res.status(400).json({error: 'wrong password'});
            }
        })
        .catch(error => {
            return res.status(500).json({error: error});
        })
});

module.exports = router;
