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

  ability.save(function(err) {
    if(err) {
      console.error(err)
      return res.status(500).send({error: err})
    }

    Ability.find({targetUser: body.targetUser})
      .then(abilities => {
        let totSum = 0
        let count = abilities.length
        abilities.forEach((abilityItem, index) => {
          totSum += abilityItem.totalScore
        })

        User.findOne({_id: body.targetUser}).select('-pwd')
          .then(user => {
            user.abilityScore = (totSum / count).toFixed(2)
            user.save()
          })
      })

    res.json({result: 1})
  })
})

// GET Ability of targetUser
router.get('/userId/:userId', function(req, res) {
    Ability.find({targetUser: req.params.userId})
      .populate('targetUser', '_id userName userId tribe bNetId')
      .populate('writer', '_id userName userId tribe bNetId')
        .then(abilities => {
          let summary = {}
          let keys = ['build', 'control', 'judgement', 'manageResource', 'manageMulti', 'totalScore']
          let retAbility = { abilityList: abilities, totalScore: '', summary: [] }

          abilities.forEach((ability, index) => {
            if (index == 0) {
              summary = JSON.parse(JSON.stringify(ability))
            } else {
              for (let i = 0; i < keys.length; i++) {
                let keyName = keys[i]
                summary[keyName] += ability[keyName]
              }
            }
          })

          for (let i = 0; i < keys.length; i++) {
              let keyName = keys[i]
              summary[keyName] /= abilities.length
              summary[keyName] = summary[keyName].toFixed(2)
          }

          retAbility.totalScore = summary.totalScore
          retAbility.summary = [summary.build, summary.control, summary.judgement, summary.manageResource, summary.manageMulti]

          /*let retAbility = { abilityList: abilities, totalScore: summary.totalScore,
            summary: [summary.build, summary.control, summary.judgement, summary.manageResource, summary.manageMulti], }*/
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
router.delete('/:_id/:score/:targetUserId/:abilityCount', function(req, res) {
    let score = parseFloat(req.params.score)
    let abilityCount = parseFloat(req.params.abilityCount)

    User.findOne({_id: req.params.targetUserId}).select('-pwd')
        .then(user => {
            let oldScore = user.abilityScore
            user.abilityScore = (((abilityCount * oldScore ) - score)/(abilityCount-1)).toFixed(2)

            user.save()
        })

    Ability.remove({ _id: req.params._id }, function(err, output){
    if(err) return res.status(500).json({ error: "database failure" })

    res.status(204).end()
  })
})

module.exports = router
