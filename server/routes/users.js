let express = require('express');
let router = express.Router();
let User = require('../models/user');

let jwt = require('jsonwebtoken')
let secretObj = require('../config/jwt')

// CREATE USER
router.post('/', function(req, res){
    let body = req.body
    let user = new User({
        userId: body.userId,
        userName: body.userName,
        bNetId: body.bNetId,
        tribe: body.tribe,
        created_date: Date.now(),
    })

    user.encryptPwd(body.pwd)
    user.optionalInfo = (body.optionalInfo != undefined) ? body.optionalInfo : { apm: 0, grade: '', comment: '' }

    user.save(function(err){
        if(err) {
            console.error(err);
            return res.status(500).send({error: 'database failure'});
            return;
        }

        res.json({result: 1});
    });
});

// GET ALL USERS
router.get('/', function(req, res) {
    User.find()
        .then(users => {
            res.json(users);
        })
        .catch(error => {
            return res.status(500).send({error: 'database failure'});
        })
});

// GET SINGLE USER
router.get('/:userId', function(req, res){
    let tokenInfo = req.headers.authorization
    let decoded = jwt.verify(tokenInfo, secretObj.secret)
    if (decoded) {
        User.findOne({userId: req.params.userId})
            .then(user => {
                if(!user) {
                    return res.status(404).json({error: 'user not found'})
                }
                delete user._doc.pwd //비번은 제거하고 전달
                res.json(user);
            })
            .catch(error => {
                return res.status(500).json({error: err});
            })
    } else {
        return res.status(400).json({error: 'wrong password'});
    }
});

// UPDATE THE USER
router.put('/:_id', function(req, res){
  User.update({ _id: req.params._id }, { $set: req.body }, function(err, output){
    if(err) res.status(500).json({ error: 'database failure' });
    console.log(output);
    if(!output.n) return res.status(404).json({ error: 'user not found' });
    res.json( { message: 'user updated' } );
  })
});

// DELETE USER
router.delete('/:_id', function(req, res){
  User.remove({ _id: req.params._id }, function(err, output){
    if(err) return res.status(500).json({ error: "database failure" });

    res.status(204).end();
  })
});

module.exports = router;
