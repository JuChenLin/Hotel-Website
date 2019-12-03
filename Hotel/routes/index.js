var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/Hotel');
var mysql = require('mysql');
var mysql_db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "hotel"
});

var bodyParser = require('body-parser')
var methodOverride = require('method-override');

var passport = require('passport');
var Customer = require('../models/customers');

var formidable = require('formidable');

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
            //add_new_room(req);


        } 
        else {
            res.redirect('/rooms');
        }
    } 
    else {
        res.redirect('/rooms');
    }
});

router.post('/addrooms', function(req, res){
    if(req.user) {
        if (req.user.role) {
            var result = add_new_room(req);
            res.redirect('/rooms');

        } 
        else {
            res.redirect('/rooms');
        }
    } 
    else {
        res.redirect('/rooms');
    }
});

router.get('/upload', function(req, res) {
   res.render('upload', {}); 
});

router.post('/upload', function(req, res){
    var id = 1;
    var dict = {};
    var files = [];
    new formidable.IncomingForm().parse(req)
    .on('field', (name, field) => {
        console.log('Field', name, field)
        dict[name] = field
    })
    .on('fileBegin', (name, file) => {
        file.path = process.cwd() + '/public/room_photo/' + dict.room_name + "-" + id;
        id++;
        files.push(file.name);
        console.log(file.name);
        console.log('Uploaded file', name, file)
    })
    .on('aborted', () => {
        console.error('Request aborted by the user')
    })
    .on('error', (err) => {
        console.error('Error', err)
        throw err
    })
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

    var id = 1;
    var dict = {};
    var files = [];
    new formidable.IncomingForm().parse(req)
    .on('field', (name, field) => {
        console.log('Field', name, field)
        dict[name] = field
    })
    .on('fileBegin', (name, file) => {
        file.path = process.cwd() + '/public/room_photo/' + dict.room_name + "-" + id;
        id++;
        files.push(file.name);
        console.log(file.name);
        console.log('Uploaded file', name, file)
    })
    .on('aborted', () => {
        console.error('Request aborted by the user')
        return false;
    })
    .on('error', (err) => {
        console.error('Error', err)
        throw err
        return false;
    })

    con.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return false;
        }
        console.log('connected as id ' + connection.threadId);
    });

    con.beginTransaction(function(err) {
        if (err) { 
            throw err;
            return false;
        }
        var room_id;
        con.query("INSERT INTO room_type SET ?", {room_feature: dict.room_feature, room_name: dict.room_name}, function (err, result) {
            if (err) {
                throw err;
                con.rollback(function() {
                    throw err;
                    return false;
                });
            }
            room_id = result.insertId;
        });
        var i;
        for (i=0; i < files.length; i++) {
            var photo_id;
            con.query("INSERT INTO photo SET ?", {photo_address: files[i]}, function (err, result) {
                if (err) {
                    throw err;
                    con.rollback(function() {
                        throw err;
                        return false;
                    });
                }
                photo_id = result.insertId;
            });

            con.query("INSERT INTO room_photo SET ?", {room_id: room_id, photo_id: photo_id }, function (err, result) {
                if (err) {
                    throw err;
                    con.rollback(function() {
                        throw err;
                        return false;
                    });
                }            
            });
        }

        con.query("INSERT INTO hotel_room SET ?", {hotel_id: "ho000001", room_id: room_id, total_num: dict.total_num, room_price: dict.room_price }, function (err, result) {
                if (err) {
                    throw err;
                    con.rollback(function() {
                        throw err;
                        return false;
                    });
                }
        });

        con.query("INSERT INTO room_bed SET ?", {room_id: room_id, bed_type: dict.bed_type1, number_of_beds: dict.number_of_beds1 }, function (err, result) {
                if (err) {
                    throw err;
                    con.rollback(function() {
                        throw err;
                        return false;
                    });
                }
        });

        con.query("INSERT INTO room_bed SET ?", {room_id: room_id, bed_type: dict.bed_type2, number_of_beds: dict.number_of_beds2 }, function (err, result) {
                if (err) {
                    throw err;
                    con.rollback(function() {
                        throw err;
                        return false;
                    });
                }
        });

        con.query("INSERT INTO room_bed SET ?", {room_id: room_id, bed_type: dict.bed_type3, number_of_beds: dict.number_of_beds3 }, function (err, result) {
                if (err) {
                    throw err;
                    con.rollback(function() {
                        throw err;
                        return false;
                    });
                }
        });

        con.commit(function(err) {
            if (err) { 
                con.rollback(function() {
                    throw err;
                    return false;
                });
            }
            console.log('Transaction Complete.');
            con.end();
        });
    });
}

function add_photo(value, index, array) {
}
