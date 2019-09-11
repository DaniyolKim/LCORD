var express = require('express');
var router = express.Router();
var User = require('../models/user');

let jwt = require('jsonwebtoken')
let secretObj = require('../config/jwt')

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
    let token = req.cookies.userToken

    let decoded = jwt.verify(token, secretObj.secret)
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
        res.status(401).end();
    }
});

// CREATE USER
router.post('/', function(req, res){
    let body = req.body
    var user = new User({
        userId: body.userId,
        pwd: '1234',
        userName: body.userName,
        bNetId: body.bNetId,
        tribe: body.tribe,
        created_date: Date.now(),
    })

  user.optionalInfo = (body.optionalInfo != undefined) ? body.optionalInfo : { apm: 0, grade: '', comment: '' }

  user.save(function(err){
    if(err){
      console.error(err);
      res.json({result: 0});
      return;
    }

    res.json({result: 1});

  });
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
