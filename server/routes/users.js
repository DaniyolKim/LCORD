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
        nickName: body.nickName,
        afreecaId: body.afreecaId,
        tier: body.tier,
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

router.post('/list', function(req, res){
  let userList = req.body
  let users = []
  for (let i = 0; i < userList.length; i++) {
    let body = userList[i]
    let user = new User({
      userId: body.userId,
      userName: body.userName,
      bNetId: body.bNetId,
      nickName: body.nickName,
      afreecaId: body.afreecaId,
      tier: body.tier,
      tribe: body.tribe,
      created_date: Date.now(),
    })

    user.encryptPwd(body.pwd)
    user.optionalInfo = (body.optionalInfo != undefined) ? body.optionalInfo : { apm: 0, grade: '', comment: '' }

    users.push(user)
  }

  for (let i = 0; i< users.length; i++) {
    users[i].save()
  }
});

// GET ALL USERS
router.get('/', function(req, res) {
    User.find().select('-pwd').sort('userName')
        .then(users => {
            res.json(users);
        })
        .catch(error => {
            return res.status(500).send({error: 'database failure'});
        })
});

//check duplicated user id
router.post('/checkId', function(req, res){
    User.findOne({userId: req.body.userId})
        .then(user => {
            if(!user) {
                return res.json({result: 'Available userId'});
            } else {
                return res.status(404).json({error: 'Already exist userId'})
            }
        })
        .catch(error => {
            return res.status(500).json({error: err});
        })
});

// GET SINGLE USER
router.get('/:userId', function(req, res){
    let tokenInfo = req.headers.authorization
    let decoded = jwt.verify(tokenInfo, secretObj.secret)
    if (decoded) {
        User.findOne({userId: req.params.userId}).select('-pwd')
            .then(user => {
                if(!user) {
                    return res.status(404).json({error: 'user not found'})
                }
                //delete user._doc.pwd //비번은 제거하고 전달
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
