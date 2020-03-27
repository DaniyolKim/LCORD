let express = require('express')
let router = express.Router()
let Battle = require('../models/battle')

// CREATE Battle
router.post('/', function(req, res) {
    let body = req.body
    let battle  = new Battle({
        name: body.name,
        description: body.description,
        tierMin: body.tierMin,
        tierMax: body.tierMax,
        type: body.type,
        isRound: body.isRound,
        managers: body.managers
    })

    /*if (battle.type == 1 && battle.isRound == true) { //팀 리그, 라운드 방식 선택 시
        battle.roundCount = battle.teamCount - 1
    }*/

    battle.save(function(err){
        if(err) {
            console.error(err)
            return res.status(500).send({error: err})
        }
        
        res.json({result: 1})
    })
})

// GET ALL Battles
router.get('/', function(req, res) {
    Battle.find()
      .populate('managers', '-pwd')
        .then(battles => {
            res.json(battles)
        })
        .catch(error => {
            return res.status(500).send({error: 'database failure'})
        })
})

// GET ALL onProgressing Battles
router.get('/onProgressing/:onProgressing', function(req, res) {
    Battle.find({onProgressing: req.params.onProgressing})
        .then(battles => {
            res.json(battles)
        })
        .catch(error => {
            return res.status(500).send({error: 'database failure'})
        })
})

// GET ALL Battle by type
router.get('/type/:type', function(req, res) {
    Battle.find({type: req.params.type})
        .then(battles => {
            res.json(battles)
        })
        .catch(error => {
            return res.status(500).send({error: 'database failure'})
        })
})

// GET SINGLE Battle
router.get('/name/:name', function(req, res) {
    Battle.findOne({name: req.params.name}).populate('managers', 'userName')
        .then(battle => {
            if(!battle) {
                return res.status(404).json({error: 'battle not found'})
            }
            res.json(battle)
        })
        .catch(error => {
            return res.status(500).json({error: err})
        })
})

// UPDATE THE Battle
router.put('/:_id', function(req, res) {
    Battle.update({ _id: req.params._id }, { $set: req.body }, function(err, output){
        if(err) res.status(500).json({ error: 'database failure' })
        console.log(output)
        if(!output.n) return res.status(404).json({ error: 'battle not found' })
        res.json( { message: 'battle updated' } )
    })
})

// DELETE battle
router.delete('/:_id', function(req, res) {
    Battle.remove({ _id: req.params._id }, function(err, output){
    if(err) return res.status(500).json({ error: "database failure" })

    res.status(204).end()
  })
})

module.exports = router
