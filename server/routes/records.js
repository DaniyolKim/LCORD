let express = require('express')
let router = express.Router()
let Record = require('../models/record')
let Battle = require('../models/battle')

// CREATE Record
router.post('/', function(req, res){
    let body = req.body
    let record  = new Record({
        date: body.date,
        battleId: body.battleId,
        map: body.map,
        battleType: body.battleType,
        winners: body.winners,
        losers: body.losers,
        videoLink: body.videoLink,
        writer: body.writer,
    })

    record.save(function(err){
        if(err) {
            console.error(err);
            return res.status(500).send({error: 'database failure'});
        }

        res.json({result: record._id});
    });
});

// GET ALL Records
router.get('/', function(req, res) {
    Record.find().populate('battleId' , '_id name')
        .populate('winners', '_id userName userId tribe bNetId')
        .populate('losers', '_id userName userId tribe bNetId')
        .populate('map').sort('-date').limit(20)
        .then(records => {
            res.json(records);
        })
        .catch(error => {
            return res.status(500).send({error: 'database failure'});
        })
});

// GET ALL Records by BattleId
router.get('/byBattle/:battleId', function(req, res) {
    Record.find({battleId: req.params.battleId})
      .populate('winners', '_id userName userId tribe bNetId')
      .populate('losers', '_id userName userId tribe bNetId')
      .populate('map').sort('-date')
      .then(records => {
          res.json(records)
      })
      .catch(error => {
          return res.status(500).send({error: 'database failure'})
      })
})

module.exports = router;
