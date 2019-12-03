var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/Hotel');

var bodyParser = require('body-parser')
var methodOverride = require('method-override');

var passport = require('passport');
var Customer = require('../models/customers');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in url - encoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

/*
router.get('/', function(req, res) {
    res.redirect('/videos');
});

router.get('/videos', function(req, res) {
    var collection = db.get('videos');
    var title = req.query.title;
    var genre = req.query.genre;
    var promise = collection.distinct('genre');
    var username = false;
    if (req.user) username = req.user.username;
    console.log(username);
    promise.then(function(genres){
        if ((title)  && (genre)) {
            collection.find({title: {'$regex': title, '$options': 'i'}, genre: genre}, function(err, videos){
                if (err) throw err;
  	            //res.json(videos);
                //console.log(username);
  	            res.render('index', {title: 'Vidzy', videos: videos, genres: genres, username: username });
  	            //res.render('index', {title: 'Vidzy', videos: videos, genres: genres, username: username });
            });

        }
        else if(title) {
            collection.find({title: {'$regex': title, '$options': 'i'}}, function(err, videos){
                if (err) throw err;
  	            //res.json(videos);
  	            res.render('index', {title: 'Vidzy', videos: videos, genres: genres, username: username});
            });
        }
        else if(genre) {
            collection.find({genre: genre}, function(err, videos){
                if (err) throw err;
  	            //res.json(videos);
  	            res.render('index', {title: 'Vidzy', videos: videos, genres: genres, username: username});
            });

        }
        else {
            collection.find({}, function(err, videos){
                if (err) throw err;
  	            //res.json(videos);
  	            res.render('index', {title: 'Vidzy', videos: videos, genres: genres, username: username});
            });
        }
    });
});


router.get('/videos/new', function(req, res) {
    if (req.user) {
        if (req.user.role == true)
            res.render('new');
    }
    res.render('noprivilege');
});

router.get('/videos/:id', function(req, res) {
    var collection = db.get('videos');
    collection.findOne({ _id: req.params.id}, function(err, video){
        if (err) throw err;
      	//res.json(video);
      	res.render('show', {video: video})
    });
});

router.post('/videos', function(req, res) {
    if (req.user) {
        if (req.user.role == true) {
	        var collection = db.get('videos');
	        collection.insert({
		        title: req.body.title,
		        genre: req.body.genre,
		        image: req.body.image,
		        description: req.body.description
	        }, function(err, video) {
		        if (err) throw err;
		        res.redirect('/videos');
	        });
        }
        else {
            res.render('noprivilege');
        }
    }
    else {
        res.render('noprivilege');
    }
});

router.get('/videos/:id/edit', function(req, res) {
    if (req.user) {
        if (req.user.role == true) {
            var collection = db.get('videos');
            collection.findOne({ _id: req.params.id}, function(err, video){
                if (err) throw err;
                res.render('edit', {video: video})
            });
        }
        else {
            res.render('noprivilege');
        }
    }
    else {
        res.render('noprivilege');
    }
});

router.put('/videos/:id', function(req, res) {
    if (req.user) {
        if (req.user.role == true) {
            var collection = db.get('videos');
            collection.findOneAndUpdate({ _id: req.params.id}, {
                $set: { 
                    title: req.body.title,
                    genre: req.body.genre,
                    image: req.body.image,
                    description: req.body.description,
                }
            }).then((updateDoc) => {});
            res.redirect('/videos');
        }
        else {
            res.render('noprivilege');
        }
    }
    else {
        res.render('noprivilege');
    }
});

// delete route -for now
router.delete('/videos/:id', function(req, res) {
    if (req.user) {
        if (req.user.role == true) {
            var collection = db.get('videos');
            collection.remove({ _id: req.params.id }, function(err, video){
                if (err) throw err;
                res.redirect('/');
            });
        }
        else {
            res.render('noprivilege');
        }
    }
    else {
        res.render('noprivilege');
    }
});
*/

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
 
router.get('/', function(req, res) {
    res.redirect('/index');
});

router.get('/index', function(req, res){
    var username = false;
    if (req.user) username = req.user.username;
    console.log(username);
    res.render('index', { username : username });
});

router.get('/register', function(req, res) {
       res.render('register', { });
});

router.post('/register', function(req, res) {
    Customer.register(new Customer({ fname: req.body.fname, lname: req.body.lname, gender: req.body.gender,
        username : req.body.username, email: req.body.email, role : false }), 
        req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { });
    //res.redirect('/');
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/reservation', function(req, res){
    var username = false;
    if (req.user) username = req.user.username;
    res.render('reservation', {username: username});
});

router.get('/rooms', function(req, res){
    var username = false;
    if (req.user) username = req.user.username;
    console.log(username);
    res.render('rooms', { username : username });
});

router.get('/about', function(req, res){
    var username = false;
    if (req.user) username = req.user.username;
    console.log(username);
    res.render('about', { username : username });
});

router.get('/contact', function(req, res){
    var username = false;
    if (req.user) username = req.user.username;
    console.log(username);
    res.render('contact', { username : username });
});

router.post('/reservation', function(req, res){
   
    if(req.user) {
    }
    else{
        var collection = db.get('tmp_reservation');
        collection.insert({
            name: req.body.title,
            email: req.body.genre,
            checkin_date: req.body.image,
            chekcout_date: req.body.description
        }, function(err, video) {
            if (err) throw err;
            res.redirect('/videos');
        });

    }
});

module.exports = router;
