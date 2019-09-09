/*
var express = require('express');
var router = express.Router();

/!* GET users listing. *!/
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
*/
module.exports = function(app, User)
{
  // GET ALL BOOKS
  app.get('/users', function(req,res){
    User.find(function(err, users){
      if(err) return res.status(500).send({error: 'database failure'});
      res.json(users);
    })
  });

  // GET SINGLE BOOK
  app.get('/users/:user_id', function(req, res){
    User.findOne({_id: req.params.userId}, function(err, book){
      if(err) return res.status(500).json({error: err});
      if(!book) return res.status(404).json({error: 'user not found'});
      res.json(book);
    })
  });

  /*// GET BOOK BY AUTHOR
  app.get('/api/users/author/:author', function(req, res){
    User.find({author: req.params.author}, {_id: 0, title: 1, published_date: 1},  function(err, users){
      if(err) return res.status(500).json({error: err});
      if(users.length === 0) return res.status(404).json({error: 'book not found'});
      res.json(users);
    })
  });*/

  // CREATE USER
  app.post('/users', function(req, res){
    var user = new User();
    user.userId = req.body.userId;
    user.userName = req.body.userName;
    user.bNetId = req.body.bNetId;
    user.tribe = req.body.tribe;
    user.created_date = new Date(req.body.created_date);

    user.save(function(err){
      if(err){
        console.error(err);
        res.json({result: 0});
        return;
      }

      res.json({result: 1});

    });
  });

  // UPDATE THE USER
  app.put('/users/:user_id', function(req, res){
    User.update({ _id: req.params.userId }, { $set: req.body }, function(err, output){
      if(err) res.status(500).json({ error: 'database failure' });
      console.log(output);
      if(!output.n) return res.status(404).json({ error: 'user not found' });
      res.json( { message: 'book updated' } );
    })
    /* [ ANOTHER WAY TO UPDATE THE BOOK ]
            User.findById(req.params.user_id, function(err, book){
            if(err) return res.status(500).json({ error: 'database failure' });
            if(!book) return res.status(404).json({ error: 'book not found' });

            if(req.body.title) book.title = req.body.title;
            if(req.body.author) book.author = req.body.author;
            if(req.body.published_date) book.published_date = req.body.published_date;

            book.save(function(err){
                if(err) res.status(500).json({error: 'failed to update'});
                res.json({message: 'book updated'});
            });

        });
    */
  });

  // DELETE BOOK
  app.delete('/users/:user_id', function(req, res){
    User.remove({ _id: req.params.userId }, function(err, output){
      if(err) return res.status(500).json({ error: "database failure" });

      /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
      if(!output.result.n) return res.status(404).json({ error: "book not found" });
      res.json({ message: "book deleted" });
      */

      res.status(204).end();
    })
  });

}
