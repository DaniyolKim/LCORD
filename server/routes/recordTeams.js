let express = require('express')
let router = express.Router()
let RecordTeam = require('../models/recordTeam')
let Record = require('../models/record')

// CREATE Record
router.post('/', function(req, res) {
    //let body = req.body
    let recordTeam = new RecordTeam(req.body)

    recordTeam.save(function (err) {
        if(err) {
            console.error(err);
            return res.status(500).send({error: 'database failure'});
            return;
        }

        res.json({result: recordTeam._id});
    })
})

// GET RecordTeam byBattle
router.get('/byBattle/:battleId', function(req, res) {
    RecordTeam.find({battle: req.params.battleId})
        .populate('battle', '_id name managers')
        .populate('recordList')
        .populate('mvp', '_id userName userId tribe bNetId')
        .then(records => {
            res.json(records);
        })
        .catch(error => {
            return res.status(500).send({error: 'database failure'});
        })
});

// UPDATE THE RecordTeam
router.put('/:_id', function(req, res) {
    RecordTeam.update({ _id: req.params._id }, { $set: req.body }, function(err, output){
    if(err) res.status(500).json({ error: 'database failure' });
    console.log(output);
    if(!output.n) return res.status(404).json({ error: 'RecordTeam not found' });
    res.json( { message: 'RecordTeam updated' } );
  })
});

// DELETE RecordTeam
router.delete('/:_id', async function(req, res) {
    await RecordTeam.findOne({_id: req.params._id})
        .populate('recordList', '_id')
        .then(async recordTeam => {
            let delList = recordTeam.recordList
            await Record.deleteMany({ _id: delList})
                .then(result => {
                    console.log(result)
                })
                .catch(err => {
                    console.error(err)
                })
        })

    await RecordTeam.deleteOne({ _id: req.params._id }, function(err, output) {
        if(err) return res.status(500).json({ error: "database failure" });

        res.status(204).end();
    })
});

module.exports = router;
