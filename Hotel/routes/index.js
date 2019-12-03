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
var path = require('path');

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

router.get('/rooms', async function(req, res){
    var username = false;
    var userrole = false;
    if (req.user) username = req.user.username;
    if (req.user) userrole = req.user.role;
    //console.log(username);
    var rooms = await list_room();
    res.render('rooms', { username : username, userrole : userrole, rooms: rooms });
});

router.get('/room', function(req, res) {
    var username = false;
    if (req.user) username = req.user.username;
    console.log(username);
    var details = false;
    var beds = false;
    var photos = false;
    res.render('roomDetail', { username : username, details: details, beds: beds, photos: photos });
});

router.get('/room/:roomid', async function(req, res) {
    var username = false;
    if (req.user) username = req.user.username;
    //var details = false;
    var details = await getroomdetailbyid(req.params.roomid);
    var beds = await getbedsbyroomid(req.params.roomid);
    //var beds = false;
    var photos = await getphotosbyroomid(req.params.roomid);
    res.render('roomDetail', { username : username, details: details, photos: photos, beds: beds});
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

/*
router.get('/edit', function(req, res) {
     var username = false;
    if (req.user) username = req.user.username;
    console.log(username);
    res.render('edit', { username : username });
    //res.redirect('/');
*/

router.get('/addrooms', function(req, res){
    if(req.user) {
        if (req.user.role) {
            res.render('newroom', {});
        } 
        else {
            res.redirect('/rooms');
        }
    } 
    else {
        res.redirect('/rooms');
    }
});

var dict;
var files;

router.post('/addrooms', function(req, res){
    if(req.user) {
        if (req.user.role) {
            dict = {};
            files = [];
            add_room_photo(req);
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


function add_room_photo(req){

        new formidable.IncomingForm().parse(req)
            .on('field', (name, field) => {
                console.log('Field', name, field)
                dict[name] = field
            })
            .on('fileBegin', (name, file) => {
                var random_id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
                var new_filename = '/public/room_photo/' + "room-" + random_id + path.extname(file.name);
                file.path = process.cwd() + new_filename;
                files.push(new_filename);
                console.log(new_filename);
                //console.log('Uploaded file', name, file);
            })
            .on('end', () => {
                console.error('Upload end.');
                add_new_room();
                return;
            })
            .on('aborted', () => {
                console.error('Request aborted by the user');
                //return false;
            })
            .on('error', (err) => {
                console.error('Error', err);
                throw err;
                //return false;
            })
}


async function add_new_room() {
    
    console.log(files);
    console.log(dict);
    console.log("con sql");

    mysql_db.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            //return false;
        }
        console.log('connected as id ' + mysql_db.threadId);
    });


    mysql_db.beginTransaction(async function(err) {
        console.log('beginTransaction');
        if (err) { 
            throw err;
            //return false;
        }
        var room_id;
        var i;
        let loop_lock = new Promise((resolve, reject) => { mysql_db.query("INSERT INTO room_type SET ?", 
            {room_feature: dict.room_feature, room_name: dict.room_name}, function (err, result) {
            if (err) {
                throw err;
                mysql_db.rollback(function() {
                    throw err;
                    return;
                });
            }
            room_id = result.insertId;
            console.log("room_id: " + room_id);
            for (i=0; i < files.length; i++) {
                var photo_id;
                mysql_db.query("INSERT INTO photo SET ?", {photo_address: files[i]}, function (err, result) {
                    if (err) {
                        throw err;
                        mysql_db.rollback(function() {
                            throw err;
                            return;
                        });
                    }
                    photo_id = result.insertId;
                    console.log("room_id : " + room_id);
                    console.log("photo_id : " + photo_id);
                    mysql_db.query("INSERT INTO room_photo SET ?", {room_id: room_id, photo_id: photo_id }, 
                        function (err, result) {
                            if (err) {
                                throw err;
                                mysql_db.rollback(function() {
                                    console.log("roll back");
                                    throw err;
                                    return;
                                });
                            }            
                        });
                    });
                }
                resolve();
            });
        });
        let loop_unlook = await loop_lock;
        let lock1 = new Promise((resolve, reject) => { mysql_db.query("INSERT INTO hotel_room SET ?", {hotel_id: "ho000001", 
            room_id: room_id, total_num: dict.total_num, room_price: dict.room_price }, function (err, result) {
                if (err) {
                    throw err;
                    con.rollback(function() {
                        throw err;
                        return;
                    });
                }
                resolve();
            });
        });
        let unlock1 = await lock1;
        let lock2 = new Promise((resolve, reject) => { mysql_db.query("INSERT INTO room_bed SET ?", { 
            room_id: room_id, bed_type: dict.bed_type1, number_of_beds: dict.number_of_beds1 }, function (err, result) {
                if (err) {
                    throw err;
                    con.rollback(function() {
                        throw err;
                        return;
                    });
                }
                resolve();
            });
        });


        if(dict.bed_type2 !== "") { 
            let lock3 = new Promise((resolve, reject) => { mysql_db.query("INSERT INTO room_bed SET ?", {
                room_id: room_id, bed_type: dict.bed_type2, number_of_beds: dict.number_of_beds2 }, function (err, result) {
                    if (err) {
                        throw err;
                        mysql_db.rollback(function() {
                            throw err;
                            return;
                        });
                    }
                    resolve();
                });
            });
            let unlock3 = await lock3;
        }

        if(dict.bed_type3 !== "") {
            let lock4 = new Promise((resolve, reject) => { mysql_db.query("INSERT INTO room_bed SET ?", {
                room_id: room_id, bed_type: dict.bed_type3, number_of_beds: dict.number_of_beds3 }, function (err, result) {
                    if (err) {
                        throw err;
                        mysql_db.rollback(function() {
                            throw err;
                            return;
                        });
                    }
                    resolve();
                });
            });
            let unlock4 = await lock4;
        }

        let unlock2 = await lock2;

        mysql_db.commit(function(err) {
            if (err) { 
                mysql_db.rollback(function() {
                    throw err;
                    return;
                });
            }
            console.log('Transaction Complete.');
            //mysql_db.end();
        });
    });
}

async function list_room() {
    sql = "select  hotel_room.room_id, hotel_room.room_price, room_type.room_name, photo.photo_address,  photo.photo_id from hotel_room left join (room_type) ON ( hotel_room.room_id = room_type.room_id) left join (room_photo) ON (room_photo.room_id = hotel_room.room_id) left join (photo) ON (photo.photo_id = room_photo.photo_id);";

    var arr;

    let lock = new Promise((resolve, reject) => { mysql_db.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            //return false;
        }
        console.log('connected as id ' + mysql_db.threadId);
        mysql_db.query(sql, function (err, result, fields) {
            if (err) {
                throw err;
                mysql_db.rollback(function() {
                    throw err;
                    return;
                });
            }
            var i;
            arr = [];
            var indexs = [];
            for(i = 0; i < result.length; i++) {
                var dict = {};
                dict.room_id = result[i].room_id;
                if(indexs.includes(dict.room_id)) {
                }
                else {
                    dict.room_price = result[i].room_price;
                    dict.room_name = result[i].room_name;
                    dict.photo_address = result[i].photo_address.replace("/public", "");
                    arr.push(dict);
                    indexs.push(dict.room_id);
                }
            }
            resolve();
        });
    });
    });
    let unlock = await lock;
    return arr;
}

async function getroomdetailbyid(id) {
    var sql = "select hotel_room.room_id, hotel_room.rooms_avalability, hotel_room.total_num, hotel_room.room_price, room_type.room_name, room_type.room_feature from hotel_room, room_type where room_type.room_id = hotel_room.room_id and hotel_room.room_id = ?;";
    
    var dic = {};

    let lock = new Promise((resolve, reject) => { mysql_db.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            //return false;
        }
        console.log('connected as id ' + mysql_db.threadId);
        mysql_db.query(sql, [id], function (err, result, fields) {
            if (err) {
                throw err;
                mysql_db.rollback(function() {
                    throw err;
                    return;
                });
            }
            
            console.log(result);

            dic.room_id = result[0].room_id;
            dic.rooms_avalability = result[0].rooms_avalability;
            dic.total_num = result[0].total_num;
            dic.room_price = result[0].room_price;
            dic.room_name = result[0].room_name;
            dic.room_feature = result[0].room_feature;
            resolve();
        });
    });
    });
    let unlock = await lock;
    console.log(dic);
    return dic;
}

async function getbedsbyroomid(id){
    var sql = "select bed.bed_type, bed.capacity, room_bed.room_id, room_bed.number_of_beds  from bed, room_bed where bed.bed_type = room_bed.bed_type and room_bed.room_id = ?;";

    var arr;

    let lock = new Promise((resolve, reject) => { mysql_db.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            //return false;
        }
        console.log('connected as id ' + mysql_db.threadId);

        mysql_db.query(sql, [id], function (err, result, fields) {
            if (err) {
                throw err;
                mysql_db.rollback(function() {
                    throw err;
                    return;
                });
            }
            var i;
            arr = [];
            for(i = 0; i < result.length; i++) {
                var dict = {};
                dict.room_id = result[i].room_id;
                dict.bed_type = result[i].bed_type;
                dict.capacity = result[i].capacity;
                dict.number_of_beds = result[i].number_of_beds;
                arr.push(dict);
            }
            resolve();
            console.log(arr);
        });
    });
    });
    let unlock = await lock;
    return arr;

}

async function getphotosbyroomid(id) {
    var sql = "select photo.photo_id, photo.photo_address  from photo, room_photo where room_photo.photo_id = photo.photo_id and room_photo.room_id = ?;";
    var arr;

    let lock = new Promise((resolve, reject) => { mysql_db.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            //return false;
        }
        console.log('connected as id ' + mysql_db.threadId);
        mysql_db.query(sql, [id],function (err, result, fields) {
            if (err) {
                throw err;
                mysql_db.rollback(function() {
                    throw err;
                    return;
                });
            }
            var i;
            arr = [];
            for(i = 0; i < result.length; i++) {
                var dict = {};
                dict.photo_id = result[i].photo_id;
                dict.photo_address = result[i].photo_address.replace("/public", "");
                arr.push(dict);
            }
            resolve();
            console.log(arr);
        });
    });
    });
    let unlock = await lock;
    return arr;
}
module.exports = router;
