let express = require('express')
let router = express.Router()
let Record = require('../models/record')

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

/* Get rankerList by battleId*/
router.get('/rankOfBattle/:battleId', function(req, res) {
    Record.find({battleId: req.params.battleId})
      .populate('winners', '_id userName userId tribe bNetId')
      .populate('losers', '_id userName userId tribe bNetId')
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
    Record.find({winners: req.params.userId}).find({losers: req.params.userId})
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
              //ranker.total.winScore = calWinScore(ranker.total.winCount, ranker.total.loseCount)
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
    let retVal = (winCount * 3) - loseCount
    return isNaN(retVal) ? 0 : retVal
}

function calWinRate (winCount, loseCount) {
    let retVal = (winCount * 100) / (winCount + loseCount)
    return isNaN(retVal) ? 0 : retVal.toFixed(2)
}

module.exports = router;
