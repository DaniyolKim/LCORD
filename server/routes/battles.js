let express = require('express')
let router = express.Router()
let Battle = require('../models/battle')

// CREATE League
router.post('/', function(req, res) {
    let body = req.body
    let battle  = new Battle({
        name: body.name,
        description: body.desc,
        tierMin: body.tierMin,
        tierMax: body.tierMax,
        teamCount: body.teamCount,
        type: body.type,
        isRound: body.isRound,
        managers: body.managers
    })

    if (battle.type == 1 && battle.isRound == true) { //팀 리그, 라운드 방식 선택 시
        battle.roundCount = battle.teamCount - 1
    }

    battle.save(function(err){
        if(err) {
            console.error(err)
            return res.status(500).send({error: err})
        }
        
        res.json({result: 1})
    })
})

// GET ALL League
router.get('/', function(req, res) {
    Battle.find()
        .then(leagues => {
            res.json(leagues)
        })
        .catch(error => {
            return res.status(500).send({error: 'database failure'})
        })
})

// GET ALL League by onProgressing
router.get('/onProgressing/:onProgressing', function(req, res) {
    Battle.find({onProgressing: req.params.onProgressing})
        .then(leagues => {
            res.json(leagues)
        })
        .catch(error => {
            return res.status(500).send({error: 'database failure'})
        })
})

// GET ALL League by type
router.get('/type/:type', function(req, res) {
    Battle.find({type: req.params.type})
        .then(leagues => {
            res.json(leagues)
        })
        .catch(error => {
            return res.status(500).send({error: 'database failure'})
        })
})

// GET SINGLE League
router.get('/name/:name', function(req, res) {
    Battle.findOne({name: req.params.name}).populate('managers', 'userName')
        .then(league => {
            if(!league) {
                return res.status(404).json({error: 'league not found'})
            }
            res.json(league)
        })
        .catch(error => {
            return res.status(500).json({error: err})
        })
})

// UPDATE THE League
router.put('/:name', function(req, res) {
    Battle.update({ name: req.params.name }, { $set: req.body }, function(err, output){
    if(err) res.status(500).json({ error: 'database failure' })
    console.log(output)
    if(!output.n) return res.status(404).json({ error: 'league not found' })
    res.json( { message: 'league updated' } )
  })
})

// DELETE League
router.delete('/:name', function(req, res) {
    Battle.remove({ name: req.params.name }, function(err, output){
    if(err) return res.status(500).json({ error: "database failure" })

    res.status(204).end()
  })
})

module.exports = router
