let express = require('express')
let router = express.Router()
let Record = require('../models/record')

let User = require('../models/user');
let EloRating = require('elo-rating')

// CREATE Record
router.post('/', function(req, res) {
    let body = req.body
    let record = new Record({
        date: body.date,
        battleId: body.battleId,
        map: body.map,
        battleType: body.battleType,
        winners: body.winners,
        losers: body.losers,
        videoLink: body.videoLink,
        writer: body.writer,
    })

    record.save(function (err) {
        if(err) {
            console.error(err);
            return res.status(500).send({error: 'database failure'});
            return;
        }

        Record.populate(record, [{path:'winners', select: 'eloScore'}, {path:'losers', select: 'eloScore'}],
            async function (err, _record) {

            let winner = _record.winners[0]
            let loser = _record.losers[0]

            console.log(winner._doc.eloScore +', '+ loser._doc.eloScore)
            let resultELO = await EloRating.calculate(winner._doc.eloScore, loser._doc.eloScore)

            console.log('win ' + resultELO.playerRating + ', lose ' + resultELO.opponentRating)
            await winner.updateOne({eloScore: resultELO.playerRating})
            await loser.updateOne({eloScore: resultELO.opponentRating})
        })

        res.json({result: 1});
    })
})

// GET ALL Records
router.get('/', function(req, res) {
    Record.find()
        .populate('battleId', '_id name managers')
        .populate('writer', '_id userName userId tribe bNetId')
        .populate('winners', '_id userName userId tribe bNetId')
        .populate('losers', '_id userName userId tribe bNetId')
        .populate('map').sort('-_id').limit(50)
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
      .populate('battleId' , '_id name managers')
      .populate('writer', '_id userName userId tribe bNetId')
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

/* Get rankerList by battleId*/
router.get('/rankOfBattle/:battleId', function(req, res) {
    Record.find({battleId: req.params.battleId})
      .populate('battleId' , '_id name managers')
      .populate('winners', '_id userName userId tribe bNetId eloScore')
      .populate('losers', '_id userName userId tribe bNetId eloScore')
      .then(records => {
          let rankerList = []

          records.forEach(record => {
              let winner = record.winners[0]
              let winnerTribe = winner.tribe

              let loser = record.losers[0]
              let loserTribe = loser.tribe

              let wIndex = rankerList.findIndex(x => x.user.userId == winner.userId)
              let wRanker = findRanker(wIndex, winner, rankerList)
              countWin(wRanker, loserTribe)

              let lIndex = rankerList.findIndex(x => x.user.userId == loser.userId)
              let lRanker = findRanker(lIndex, loser, rankerList)
              countLose(lRanker, winnerTribe)
          })

          rankerList.forEach(ranker => {
              ranker.total.winScore = calWinScore(ranker.total.winCount, ranker.total.loseCount)
              ranker.total.winRate = calWinRate(ranker.total.winCount, ranker.total.loseCount)
              ranker.vsTerran.winRate = calWinRate(ranker.vsTerran.winCount, ranker.vsTerran.loseCount)
              ranker.vsProtoss.winRate = calWinRate(ranker.vsProtoss.winCount, ranker.vsProtoss.loseCount)
              ranker.vsZerg.winRate = calWinRate(ranker.vsZerg.winCount, ranker.vsZerg.loseCount)
          })

          res.json(rankerList)
      })
      .catch(error => {
          return res.status(500).send({error: 'database failure'})
      })
})

/* Get winRate of user*/
router.get('/userWinRate/:userId', function(req, res) {
  let userId = req.params.userId
  Record.find({ $or: [ {winners: userId}, {losers: userId} ] })
    .populate('battleId' , '_id name managers')
    .populate('writer', '_id userName userId tribe bNetId')
    .populate('winners', '_id userName userId tribe bNetId')
    .populate('losers', '_id userName userId tribe bNetId')
    .populate('map').sort('-date')
    .then(records => {
      let vsRate = { summary: [],
        total: { loseCount: 0, winCount: 0, winRate: 0 },
        vsTerran: { loseCount: 0, winCount: 0, winRate: 0 },
        vsProtoss: { loseCount: 0, winCount: 0, winRate: 0 },
        vsZerg: { loseCount: 0, winCount: 0, winRate: 0 },
      }
      records.forEach(record => {
        let winner = record.winners[0]
        let winnerTribe = winner.tribe

        let loser = record.losers[0]
        let loserTribe = loser.tribe

        if (userId == winner._id) {
          countWin(vsRate, loserTribe)
        } else {
          countLose(vsRate, winnerTribe)
        }
      })

      vsRate.total.winRate = calWinRate(vsRate.total.winCount, vsRate.total.loseCount)
      vsRate.vsTerran.winRate = calWinRate(vsRate.vsTerran.winCount, vsRate.vsTerran.loseCount)
      vsRate.vsProtoss.winRate = calWinRate(vsRate.vsProtoss.winCount, vsRate.vsProtoss.loseCount)
      vsRate.vsZerg.winRate = calWinRate(vsRate.vsZerg.winCount, vsRate.vsZerg.loseCount)

      let respObj = { recordList: records,
        summary: [vsRate.vsTerran.winRate, vsRate.vsZerg.winRate, vsRate.vsProtoss.winRate]
      }
      res.json(respObj)
    })
    .catch(error => {
        return res.status(500).send({error: 'database failure'})
    })
})

/* GET Records by userId*/
router.get('/byUser/:userId', function(req, res) {
  let userId = req.params.userId
  Record.find({ $or: [ {winners: userId}, {losers: userId} ] })
    .populate('battleId' , '_id name managers')
    .populate('writer', '_id userName userId tribe bNetId')
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

// set elo score of all record
router.post('/calELO/:index', function(req, res){
    let index = req.params.index
    Record.find()
        .populate('winners', '_id eloScore')
        .populate('losers', '_id eloScore')
        .sort('date')
        .then(async records => {
            let record = records[index]
            let winner = record.winners[0]
            let loser = record.losers[0]

            console.log(winner.eloScore +', '+ loser.eloScore)
            let resultELO = await EloRating.calculate(winner.eloScore, loser.eloScore)

            console.log('index ' + index + ' : win ' + resultELO.playerRating + ', lose ' + resultELO.opponentRating)
            await winner.updateOne({eloScore: resultELO.playerRating})
            await loser.updateOne({eloScore: resultELO.opponentRating})

            await res.json('calELO success');
        })
        .catch(error => {
            return res.status(500).send({error: 'database failure'});
        })
});

// DELETE RECORD
router.delete('/:_id', function(req, res){
  Record.remove({ _id: req.params._id }, function(err, output){
    if(err) return res.status(500).json({ error: "database failure" });

    res.status(204).end();
  })
});

// UPDATE THE RECORD
router.put('/:_id', function(req, res){
  Record.update({ _id: req.params._id }, { $set: req.body }, function(err, output){
    if(err) res.status(500).json({ error: 'database failure' });
    console.log(output);
    if(!output.n) return res.status(404).json({ error: 'record not found' });
    res.json( { message: 'record updated' } );
  })
});

/*local functions*/
function findRanker(index, target, rankerList) {
    let newObj = {}
    if (index == -1) {
        newObj = { user: target,
            total: { loseCount: 0, winCount: 0, winRate: 0, winScore: 0 },
            vsTerran: { loseCount: 0, winCount: 0, winRate: 0 },
            vsProtoss: { loseCount: 0, winCount: 0, winRate: 0 },
            vsZerg: { loseCount: 0, winCount: 0, winRate: 0 }, }
        rankerList.push(newObj)
    } else {
        newObj =  rankerList[index]
    }
    return newObj
}

function countWin(ranker, loserTribe) {
    ranker.total.winCount += 1

    if (loserTribe == 'terran') {
        ranker.vsTerran.winCount += 1
    } else if (loserTribe == 'protoss') {
        ranker.vsProtoss.winCount += 1
    } else if (loserTribe == 'zerg') {
        ranker.vsZerg.winCount += 1
    }
}

function countLose(ranker, winTribe) {
    ranker.total.loseCount += 1

    if (winTribe == 'terran') {
        ranker.vsTerran.loseCount += 1
    } else if (winTribe == 'protoss') {
        ranker.vsProtoss.loseCount += 1
    } else if (winTribe == 'zerg') {
        ranker.vsZerg.loseCount += 1
    }
}

function calWinScore (winCount, loseCount) {
    let retVal = (winCount * 2) - loseCount
    return isNaN(retVal) ? 0 : retVal
}

function calWinRate (winCount, loseCount) {
    let retVal = (winCount * 100) / (winCount + loseCount)
    return isNaN(retVal) ? 0 : retVal.toFixed(2)
}

module.exports = router;
