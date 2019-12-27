let express = require('express')
let router = express.Router()
let Ability = require('../models/ability')
let User = require('../models/user');

// CREATE Ability
router.post('/', function(req, res) {
    let body = req.body
    let ability  = new Ability({
        targetUser: body.targetUser,
        writer: body.writer,
        build: body.build,
        control: body.control,
        judgement: body.judgement,
        manageResource: body.manageResource,
        manageMulti: body.manageMulti,
        totalScore: body.totalScore
    })

    User.findOne({_id: body.targetUser}).select('-pwd')
      .then(user => {
          if (user.abilityScore == 0.0) {
              user.abilityScore = Number(body.totalScore)
          } else {
              let oldScore = user.abilityScore
              user.abilityScore = ((oldScore + Number(body.totalScore)) / 2).toFixed(2)
          }
          user.save()
      })

    ability.save(function(err){
        if(err) {
            console.error(err)
            return res.status(500).send({error: err})
        }
        
        res.json({result: 1})
    })
})

// GET Ability of targetUser
router.get('/userId/:userId', function(req, res) {
    Ability.find({targetUser: req.params.userId})
      .populate('targetUser', '_id userName userId tribe bNetId')
      .populate('writer', '_id userName userId tribe bNetId')
        .then(abilities => {
            let retAbility = {}
            let keys = ['build', 'control', 'judgement', 'manageResource', 'manageMulti', 'totalScore']
            abilities.forEach((ability, index) => {
                if (index == 0) {
                    retAbility = ability
                } else {
                    for (let i = 0; i < keys.length; i++) {
                        let keyName = keys[i]
                        retAbility[keyName] += ability[keyName]
                    }
                }
            })

            for (let i = 0; i < keys.length; i++) {
                let keyName = keys[i]
                retAbility[keyName] /= abilities.length
                retAbility[keyName] = retAbility[keyName].toFixed(2)
            }

            res.json(retAbility)
        })
        .catch(error => {
            return res.status(500).send({error: 'database failure'})
        })
})

// UPDATE THE Ability
router.put('/:_id', function(req, res){
    Ability.updateOne({ _id: req.params._id }, { $set: req.body }, function(err, output){
        if(err) res.status(500).json({ error: 'database failure' });
        console.log(output);
        if(!output.n) return res.status(404).json({ error: 'ability not found' });
        res.json( { message: 'abilities updated' } );
    })
});

// DELETE ability
router.delete('/:_id', function(req, res) {
    Ability.remove({ _id: req.params._id }, function(err, output){
    if(err) return res.status(500).json({ error: "database failure" })

    res.status(204).end()
  })
})

module.exports = router
