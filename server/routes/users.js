var express = require('express');
var router = express.Router();
var User = require('../models/user');

// GET ALL USERS
router.get('/', function(req, res) {
  User.find(function(err, users){
    if(err) return res.status(500).send({error: 'database failure'});
    res.json(users);
  })
});

// GET SINGLE USER
router.get('/:_id', function(req, res){
  User.findOne({_id: req.params._id}, function(err, user){
    if(err) return res.status(500).json({error: err});
    if(!user) return res.status(404).json({error: 'user not found'});
    res.json(user);
  })
});

// CREATE USER
router.post('/', function(req, res){
  var user = new User();
  user.userId = req.body.userId;
  user.userName = req.body.userName;
  user.bNetId = req.body.bNetId;
  user.tribe = req.body.tribe;
  user.created_date = Date.now()
  user.optionalInfo = (req.body.optionalInfo != undefined) ? req.body.optionalInfo : { apm: 0, grade: '', comment: '' }

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

// DELETE BOOK
router.delete('/:_id', function(req, res){
  User.remove({ _id: req.params._id }, function(err, output){
    if(err) return res.status(500).json({ error: "database failure" });

    res.status(204).end();
  })
});

module.exports = router;
