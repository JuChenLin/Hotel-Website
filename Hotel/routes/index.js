var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/hotel');
const util = require('util');

var bodyParser = require('body-parser')
var methodOverride = require('method-override');

var passport = require('passport');
var Customer = require('../models/customers');

var mysql = require('mysql').createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: 8889,
    database: "hotel"
});

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



router.post('/rooms', function(req, res){

    // var checkin_date = req.body.checkin_date;
    // var checkout_date = req.body.checkout_date;
    // var adults = req.body.adults;
    // var children = req.body.children;


    var checkin_date = new Date(2019, 9, 10);
    var checkout_date = new Date(2019, 9, 14);
    console.log('+++++++' + checkin_date);
    
    var adults = req.body.adults;
    var children = req.body.children;

    
    // mysql.connect(function(err) {
    //     if (err) throw err;
    //     console.log("Connected!");

        // var rooms;
        // var sql_room = "select room_id as id, total_num as num, room_price as price " + 
        //         "from hotel_room as hr " + 
        //         "where rooms_availability = true ";
        // mysql.query(sql_room, function (err, result) {
        //     if (err) throw err;
        //     rooms = result
        //     console.log(util.inspect(rooms, false, null, true));
        //     var not_aval_rooms_with_date;
        //     var checkin_str = checkin_date.getFullYear() + '-' + (checkin_date.getMonth() + 1) + '-' + checkin_date.getDate();
        //     var checkout_str = checkout_date.getFullYear() + '-' + (checkout_date.getMonth() + 1) + '-' + checkout_date.getDate();
        //     var sql_notaval = "select rn.room_id as id, rn.not_available_num as num, not_available_date as date " + 
        //             "from room_not_available_date as rn " + 
        //             'where not_available_date >= "' + checkin_str +
        //             '" and not_available_date < "' + checkout_str + '"';
        //     mysql.query(sql_notaval, function (err, result) {
        //         if (err) throw err;
        //         not_aval_rooms_with_date = result;
        //         console.log(util.inspect(not_aval_rooms_with_date, false, null, true ));
        //         var dic = {};
        //         for (var i = 0; i < rooms.length; i++) {
        //             var cur = new Date(checkin_date); 
        //             dic[rooms[i]["id"]] = {};
        //             while (cur < checkout_date.getTime()) {
        //                 var tmp = {
        //                     "id" : rooms[i]['id'],
        //                     "total_num" : rooms[i]['num'],
        //                     "notaval_num" : 0,
        //                 };
        //                 // var time = cur.getTime();
        //                 dic[rooms[i]["id"]][cur] = tmp;
        //                 // console.log(cur);
        //                 cur.setDate(cur.getDate() + 1);
        //             };
        //         }
        //         // console.log(dic);

        //         var entries = not_aval_rooms_with_date.slice();
        //         while (entries.length > 0) {
        //             var e = entries.shift();
        //             // var time = e['date'].getTime();
        //             dic[e['id']][e['date']]['notaval_num'] += e['num'];
        //             // console.log(dic[e['id']]);
        //         }
        //         // console.log(dic);
        //         var collection = db.get('reservations');
        //         var query = { 
        //             $or : [{
        //                 $and : [ {checkin_date : {$gte : new Date(checkin_date)}}, {checkin_date : {$lt : new Date(checkout_date)}}]
        //             },{
        //                 $and : [ {checkout_date : {$gt : new Date(checkin_date)}}, {checkout_date : {$lte : new Date(checkout_date)}}]
        //             },{
        //                 $and : [ {checkin_date : {$lt : new Date(checkin_date)}}, {checkout_date : {$gte: new Date(checkout_date)}}]}
        //             ] 
        //         };  

                

        //         collection.find( query , function(err, reservations){
        //             if (err) throw err;
        //             //res.json(videos);
        //             // console.log(reservations);
        //             while (reservations.length > 0) {
        //                 var r = reservations.shift();
        //                 var cur = r['checkin_date'];
        //                 if (cur < checkin_date) {
        //                     cur = checkin_date;
        //                 }
        //                 var stop = r['checkout_date'];
        //                 if (stop > checkout_date) {
        //                     stop = checkout_date
        //                 }
        //                 // console.log(r);
        //                 // console.log(cur);
        //                 // console.log(dic[r['room_id']]);
                        
        //                 while (cur < stop) {
        //                     dic[r['room_id']][cur]['notaval_num'] += 1;
        //                     cur.setDate(cur.getDate() + 1);
        //                 }
        //                 // console.log(cur);
        //                 // console.log(dic[r['room_id']]);
        //             }

        //             var aval_rooms = []


        //             for (var e in dic) {
        //                 var cur = new Date(checkin_date);
        //                 var isAval = true;
        //                 var id;
        //                 while (cur < checkout_date) {
        //                     if (dic[e][cur]['total_num'] - dic[e][cur]['notaval_num'] < 1) {
        //                         isAval = false;
        //                         break;
        //                     }
        //                     cur.setDate(cur.getDate() + 1);
        //                 }
        //                 if (isAval) {
        //                     aval_rooms.push(e);
        //                 }
        //             }
        //             console.log(dic);
        //             console.log(aval_rooms);

        //             var rooms;
        //             var sql_all_room_type = "select * from room_type";
        //             var sql_room_detail = "select * from (" +  sql_room + ') as t1 ' 
        //                     + 'left join (' + sql_all_room_type + ') as t2 on t1.id = t2.room_id';
        //             console.log(sql_room_detail);
        //             var sql_room_photo = 'select room_id, MIN(photo_id) from room_photo group by room_id';
        //             var sql_final = sql_room_detail + " left join (" + sql_room_photo + ')'
        //             mysql.query(sql_room_detail, function (err, result) {
        //                 if (err) throw err;
        //                 console.log(result)

        //                 res.json({'boo' : 'foo'});
        //                 // res.render('search', { username : username });

        //                 // // res.render('search', { username : username });   
        //             });
        //         });
        //     });
        // });
    // });
    
});



// async function find_rooms(req) {

//     l
//     var checkin_date = new Date(2019, 10, 10);
//     var checkout_date = new Date(2019, 10, 14);
//     var adults = req.body.adults;
//     var children = req.body.children;


//     mysql.connect(function(err) {
//         if (err) throw err;
//         console.log("Connected!");

//         var rooms;
//         var sql = "select room_id, total_num " + 
//                 "from hotel_room as hr " + 
//                 "where rooms_availability = true ";
//         mysql.query(sql, function (err, result) {
//             if (err) throw err;
//             rooms = result
//             console.log(util.inspect(rooms, false, null, true /* enable colors */));
            
//         });

//         console.log(util.inspect(rooms, false, null, true /* enable colors */));
        
//         var not_avlb_rooms_with_date;
//         var checkin_str = checkin_date.getFullYear() + '-' + checkin_date.getMonth() + '-' + checkin_date.getDate();
//         var checkout_str = checkout_date.getFullYear() + '-' + checkout_date.getMonth() + '-' + checkout_date.getDate();
//         var sql = "select rn.room_id, rn.not_available_num " + 
//                 "from room_not_available_date as rn " + 
//                 "where not_available_date >= " + checkin_str +
//                 " and not_available_date < " + checkout_str;
//         var cur = checkin_date;
//         // console.log(checkin_str)
//         // console.log(checkout_str)

//         mysql.query(sql, function (err, result) {
//             if (err) throw err;
//             not_avlb_rooms_with_date = result
//             console.log(util.inspect(not_avlb_rooms_with_date, false, null, true /* enable colors */));
            
//         });




        

//     });
// }

var checkin_date = new Date(2019, 9, 10);
    var checkout_date = new Date(2019, 9, 14);
    console.log('+++++++' + checkin_date);
    
    var adults = req.body.adults;
    var children = req.body.children;



function search_available_rooms(checkin_date, checkout_date, adults, children) {
    var rooms;
        var sql_room = "select room_id as id, total_num as num, room_price as price " + 
                "from hotel_room as hr " + 
                "where rooms_availability = true ";
        mysql.query(sql_room, function (err, result) {
        if (err) throw err;
        rooms = result
        console.log(util.inspect(rooms, false, null, true));
        var not_aval_rooms_with_date;
        var checkin_str = checkin_date.getFullYear() + '-' + (checkin_date.getMonth() + 1) + '-' + checkin_date.getDate();
        var checkout_str = checkout_date.getFullYear() + '-' + (checkout_date.getMonth() + 1) + '-' + checkout_date.getDate();
        var sql_notaval = "select rn.room_id as id, rn.not_available_num as num, not_available_date as date " + 
                "from room_not_available_date as rn " + 
                'where not_available_date >= "' + checkin_str +
                '" and not_available_date < "' + checkout_str + '"';
        mysql.query(sql_notaval, function (err, result) {
            if (err) throw err;
            not_aval_rooms_with_date = result;
            console.log(util.inspect(not_aval_rooms_with_date, false, null, true ));
            var dic = {};
            for (var i = 0; i < rooms.length; i++) {
                var cur = new Date(checkin_date); 
                dic[rooms[i]["id"]] = {};
                while (cur < checkout_date.getTime()) {
                    var tmp = {
                        "id" : rooms[i]['id'],
                        "total_num" : rooms[i]['num'],
                        "notaval_num" : 0,
                    };
                    // var time = cur.getTime();
                    dic[rooms[i]["id"]][cur] = tmp;
                    // console.log(cur);
                    cur.setDate(cur.getDate() + 1);
                };
            }
            // console.log(dic);

            var entries = not_aval_rooms_with_date.slice();
            while (entries.length > 0) {
                var e = entries.shift();
                // var time = e['date'].getTime();
                dic[e['id']][e['date']]['notaval_num'] += e['num'];
                // console.log(dic[e['id']]);
            }
            // console.log(dic);
            var collection = db.get('reservations');
            var query = { 
                $or : [{
                    $and : [ {checkin_date : {$gte : new Date(checkin_date)}}, {checkin_date : {$lt : new Date(checkout_date)}}]
                },{
                    $and : [ {checkout_date : {$gt : new Date(checkin_date)}}, {checkout_date : {$lte : new Date(checkout_date)}}]
                },{
                    $and : [ {checkin_date : {$lt : new Date(checkin_date)}}, {checkout_date : {$gte: new Date(checkout_date)}}]}
                ] 
            };  

            

            collection.find( query , function(err, reservations){
                if (err) throw err;
                //res.json(videos);
                // console.log(reservations);
                while (reservations.length > 0) {
                    var r = reservations.shift();
                    var cur = r['checkin_date'];
                    if (cur < checkin_date) {
                        cur = checkin_date;
                    }
                    var stop = r['checkout_date'];
                    if (stop > checkout_date) {
                        stop = checkout_date
                    }
                    // console.log(r);
                    // console.log(cur);
                    // console.log(dic[r['room_id']]);
                    
                    while (cur < stop) {
                        dic[r['room_id']][cur]['notaval_num'] += 1;
                        cur.setDate(cur.getDate() + 1);
                    }
                    // console.log(cur);
                    // console.log(dic[r['room_id']]);
                }

                var aval_rooms = []


                for (var e in dic) {
                    var cur = new Date(checkin_date);
                    var isAval = true;
                    var id;
                    while (cur < checkout_date) {
                        if (dic[e][cur]['total_num'] - dic[e][cur]['notaval_num'] < 1) {
                            isAval = false;
                            break;
                        }
                        cur.setDate(cur.getDate() + 1);
                    }
                    if (isAval) {
                        aval_rooms.push(e);
                    }
                }
                console.log(dic);
                console.log(aval_rooms);

                var rooms;
                var sql_all_room_type = "select * from room_type";
                var sql_room_detail = "select * from (" +  sql_room + ') as t1 ' 
                        + 'left join (' + sql_all_room_type + ') as t2 on t1.id = t2.room_id';
                console.log(sql_room_detail);
                var sql_room_photo = 'select room_id, MIN(photo_id) from room_photo group by room_id';
                var sql_final = sql_room_detail + " left join (" + sql_room_photo + ')'
                mysql.query(sql_room_detail, function (err, result) {
                    if (err) throw err;
                    console.log(result)

                    res.json({'boo' : 'foo'});
                    // res.render('search', { username : username });

                    // // res.render('search', { username : username });   
                });
            });
        });
    });
}

module.exports = router;