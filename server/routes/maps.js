let express = require('express');
let router = express.Router();
let Map = require('../models/map');

// CREATE Map
router.post('/', function(req, res){
    let body = req.body
    let map  = new Map({
        name: body.name
    })

    map.save(function(err){
        if(err) {
            console.error(err);
            return res.status(500).send({error: 'database failure'});
            return;
        }

        res.json({result: 1});
    });
});

// GET ALL Maps
router.get('/', function(req, res) {
    Map.find()
        .then(maps => {
            res.json(maps);
        })
        .catch(error => {
            return res.status(500).send({error: 'database failure'});
        })
});

module.exports = router;
