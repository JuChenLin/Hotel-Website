var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/Hotel');
var mysql = require('mysql');
var mysql_db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root"
});

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
    var userrole = false;
    if (req.user) username = req.user.username;
    if (req.user) userrole = req.user.role;
    console.log(username);
    res.render('rooms', { username : username, userrole : userrole });
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
        search_available_rooms(req);
    }
    else{
        var collection = db.get('tmp_reservation');
        collection.insert({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            checkin_date: req.body.checkin_date,
            chekcout_date: req.body.chekcout_date,
            adults: req.body.adults,
            children: req.body.children,
            message: req.body.message
        }, function(err, video) {
            if (err) throw err;
            res.redirect('/reservation');
        });

    }
});

router.get('/addrooms', function(req, res){
    if(req.user) {
        if (req.user.role) {
            add_new_room(req);


        } 
        else {
            res.redirect('/rooms');
        }
    } 
    else {
        res.redirect('/rooms');
    }
});

router.get('/new', function(req, res) {
    res.render('newroom', { });
    //res.redirect('/');
});

module.exports = router;

function search_available_rooms(req){
    con.connect(function(err) {
        if (err) throw err;
        sql = "";
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
    }); 
}

function add_new_room(req){
    con.connect(function(err) {
        if (err) throw err;
        con.query("INSERT INTO room_type SET ?", {room_feature: req.body.room_feature, room_name: req.body.room_name}, function (err, result) {
            if (err) throw err;
        });
        con.query("")
    }); 
}
