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
mysql_db.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        //return false;
    }
    console.log('connected as id ' + mysql_db.threadId);
});
var util = require('util');

var bodyParser = require('body-parser')
var methodOverride = require('method-override');

var passport = require('passport');
var Customer = require('../models/customers');

var formidable = require('formidable');
var path = require('path');

const month_int = {
    "January" : 0, 
    "February" : 1, 
    "March" : 2, 
    "April" : 3, 
    "May" : 4, 
    "June" : 5,
    "July" : 6, 
    "August" : 7, 
    "September" : 8, 
    "October" : 9, 
    "November" : 10, 
    "December" : 11
};



router.use(bodyParser.urlencoded({ extended: false }));
router.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in url - encoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

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

router.get('/result', async function(req, res) {
    var username = false;
    var userrole = false;
    if (req.user) username = req.user.username;
    if (req.user) userrole = req.user.role;
    var checkin_date;
    var checkout_date;
    var adults;
    var children;
    var queryProvided = false;
    if (Object.keys(req.query).length != 0) {
        queryProvided = true;
        checkin_date = req.query.checkin_date;
        checkout_date = req.query.checkout_date;
        adults = req.query.adults;
        children = req.query.children

    }
    res.render('result', { username : username, 
                        userrole : userrole, 
                        queryProvided : queryProvided,
                        checkin_date : checkin_date,
                        checkout_date : checkout_date,
                        adults : adults,
                        children :  children});
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
    if (req.user) name = req.user.name;
    res.render('reservation', {username: username});
});

router.post('/reservation', function(req, res){
    var username = req.body.username;
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
    var userrole = false;
    if (req.user) username = req.user.username;
    if (req.user) userrole = req.user.role;
    //var details = false;
    var details = await getroomdetailbyid(req.params.roomid);
    var beds = await getbedsbyroomid(req.params.roomid);
    //var beds = false;
    var photos = await getphotosbyroomid(req.params.roomid);
    res.render('roomDetail', { username : username, userrole: userrole, details: details, photos: photos, beds: beds});
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

router.get('/edit/:roomid', async function(req, res) {
    var username = false;
    //if(req.user) {
    //    if (req.user.role) {
            var details = await getroomdetailbyid(req.params.roomid);
            var beds = await getbedsbyroomid(req.params.roomid);
            //var beds = false;
            var photos = await getphotosbyroomid(req.params.roomid);
            res.render('edit', { username : username, details: details, beds: beds, photos: photos});
    //    } 
    //    else {
    //        res.redirect('/room/'+req.params.roomid);
    //    }
    //} 
    //else {
    //    res.redirect('/room/'+req.params.roomid);
    //}    //console.log(username);
});

router.post('/edit', async function(req, res) {
    //console.log(req.params.room_id);
    var photos = await editroom(req);
    //console.log(req.originalUrl);
    //res.redirect('/room/'+req.body.room_id);
    res.redirect('/rooms');
    /*
    if(req.user) {
        if (req.user.role) {
            var photos = await editroom(req);
            res.redirect('/room/'+req.body.roomid);
        } 
        else {
            res.redirect('/room/'+req.body.roomid);
        }
    } 
    else {
        res.redirect('/room/'+req.body.roomid);
        }
    */
});

router.post('/delete', async function(req, res) {
    console.log(req.body.room_id);
    var result = await deleteroombyid(req.body.room_id);
    //console.log(req.originalUrl);
    //res.redirect('/room/'+req.body.room_id);
    res.redirect('/rooms');
    /*
    if(req.user) {
        if (req.user.role) {
            var photos = await editroom(req);
            res.redirect('/room/'+req.body.roomid);
        } 
        else {
            res.redirect('/room/'+req.body.roomid);
        }
    } 
    else {
        res.redirect('/room/'+req.body.roomid);
        }
    */
});

router.post('/enable', async function(req, res) {
    console.log(req.body.room_id);
    var result = await enableroombyid(req.body.room_id);
    res.redirect('/rooms');
    /*
    if(req.user) {
        if (req.user.role) {
            var photos = await editroom(req);
            res.redirect('/room/'+req.body.roomid);
        } 
        else {
            res.redirect('/room/'+req.body.roomid);
        }
    } 
    else {
        res.redirect('/room/'+req.body.roomid);
        }
    */
});


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

router.post('/rooms', async function(req, res){
    // yuantai fu
    var cid = req.body.checkin_date;
    var cod = req.body.checkout_date;
    var adults = req.body.adults;
    var children = req.body.children;
    var in_split = cid.split(' ');
    in_split[1] = in_split[1].substring(0, in_split[1].length - 1);
    var out_split = cod.split(' ');
    out_split[1] = out_split[1].substring(0, out_split[1].length - 1);
    var checkin_date = new Date(parseInt(in_split[2]), month_int[in_split[1]], parseInt(in_split[0]));
    var checkout_date = new Date(parseInt(out_split[2]), month_int[out_split[1]], parseInt(out_split[0]));

    // console.log(checkin_date);
    // console.log(checkout_date);
    // console.log(adults);
    // console.log(children);
    // var checkin_date = new Date(2019, 9, 10);
    // var checkout_date = new Date(2019, 9, 14);
    // var adults = req.body.adults;
    // var children = req.body.children;
    var result = await search_available_rooms(checkin_date, checkout_date, adults, children);
    // console.log(util.inspect(result, false, null, true ));
    res.json(result);
});

router.get('/member', function(req, res){
    var username = false;
    if (req.user) username = req.user.username;
    console.log(username);
    res.render('member', { username : username });
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
            //console.log("room_id: " + room_id);
            for (i=0; i < files.length; i++) {
                var photo_id;
                mysql_db.query("INSERT INTO photo SET ?", {photo_address: files[i].replace("/public", "")}, function (err, result) {
                    if (err) {
                        throw err;
                        mysql_db.rollback(function() {
                            throw err;
                            return;
                        });
                    }
                    photo_id = result.insertId;
                    //console.log("room_id : " + room_id);
                    //console.log("photo_id : " + photo_id);
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


        if((dict.bed_type2 !== "") && (dict.number_of_beds2 !== "")) { 
            let lock3 = new Promise((resolve, reject) => { 
                mysql_db.query("INSERT INTO room_bed SET ?", {
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

        if((dict.bed_type3 !== "") && (dict.number_of_beds3 !== "")) { 
            let lock4 = new Promise((resolve, reject) => { 
                mysql_db.query("INSERT INTO room_bed SET ?", {
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

    /*
    sql = "select * from (select room_id as id, total_num as num, room_price as price from hotel_room as hr where rooms_availability = true ) as t1 left join (select * from room_type) as t2 on t1.id = t2.room_id left JOIN (select room_id, MIN(photo_id) from room_photo group by room_id) as t3 on t1.id = t3.room_id";
    */

    sql = "select hotel_room.rooms_availability, hotel_room.room_id, hotel_room.room_price, room_type.room_name, photo.photo_address,  photo.photo_id from hotel_room left join (room_type) ON ( hotel_room.room_id = room_type.room_id) left join (room_photo) ON (room_photo.room_id = hotel_room.room_id) left join (photo) ON (photo.photo_id = room_photo.photo_id);";

    var arr;
    
    let lock = new Promise((resolve, reject) => { mysql_db.query(sql, function (err, result, fields) {
            if (err) {
                throw err;
                mysql_db.rollback(function() {
                    throw err;
                    return;
                });
            }
            //console.log(result);
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
                    dict.photo_address = result[i].photo_address;
                    dict.rooms_availability = result[i].rooms_availability;
                    arr.push(dict);
                    indexs.push(dict.room_id);
                }
            }
            console.log(arr);
            resolve();
        });
    });
    let unlock = await lock;
    return arr;
}

async function getroomdetailbyid(id) {
    var sql = "select hotel_room.room_id, hotel_room.rooms_availability, hotel_room.total_num, hotel_room.room_price, room_type.room_name, room_type.room_feature from hotel_room, room_type where room_type.room_id = hotel_room.room_id and hotel_room.room_id = ?;";
    
    var dic = {};

    let lock = new Promise((resolve, reject) => { 
    
        mysql_db.query(sql, [id], function (err, result, fields) {
            if (err) {
                throw err;
                mysql_db.rollback(function() {
                    throw err;
                    return;
                });
            }
            
            //console.log(result);

            dic.room_id = result[0].room_id;
            dic.rooms_availability = result[0].rooms_availability;
            dic.total_num = result[0].total_num;
            dic.room_price = result[0].room_price;
            dic.room_name = result[0].room_name;
            dic.room_feature = result[0].room_feature;
            resolve();
        });
    });
    let unlock = await lock;
    //console.log(dic);
    return dic;
}

async function getbedsbyroomid(id){
    var sql = "select bed.bed_type, bed.capacity, room_bed.room_id, room_bed.number_of_beds  from bed, room_bed where bed.bed_type = room_bed.bed_type and room_bed.room_id = ?;";

    var arr;

    let lock = new Promise((resolve, reject) => { 
        
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
            //console.log(arr);
        });
    });
    let unlock = await lock;
    return arr;

}

async function getphotosbyroomid(id) {
    var sql = "select photo.photo_id, photo.photo_address  from photo, room_photo where room_photo.photo_id = photo.photo_id and room_photo.room_id = ?;";
    var arr;

    let lock = new Promise((resolve, reject) => { 
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
                dict.photo_address = result[i].photo_address;//.replace("/public", "");
                arr.push(dict);
            }
            resolve();
            //console.log(arr);
        });
    });
    let unlock = await lock;
    return arr;
}


async function editroom(req) {

    mysql_db.beginTransaction(async function(err) {
        console.log('beginTransaction');
        if (err) { 
            throw err;
            //return false;
        }
        var i;
        let loop_lock = new Promise((resolve, reject) => { 
            mysql_db.query("UPDATE room_type SET ? WHERE ?"
            , [{room_feature: req.body.room_feature, room_name: req.body.room_name}, {room_id: req.body.room_id}],
            function (err, result) {
                if (err) {
                    throw err;
                    mysql_db.rollback(function() {
                        throw err;
                        return;
                    });
                }
                resolve()
            });
        });
        let loop_unlook = await loop_lock;
        let lock1 = new Promise((resolve, reject) => {
            mysql_db.query("UPDATE hotel_room SET ? WHERE ?", [{ total_num: req.body.total_num, 
                room_price: req.body.room_price }, {room_id: req.body.room_id}], function (err, result) {
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

        let rm_lock = new Promise((resolve, reject) => { 
            mysql_db.query("DELETE FROM room_bed WHERE ?",  {room_id: req.body.room_id}, 
            function (err, result) {
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
        let unlock_rm = await rm_lock;

        let lock2 = new Promise((resolve, reject) => { 
            var sql = "REPLACE room_bed SET ?";
            mysql_db.query(sql, { 
            bed_type: req.body.bed_type1, number_of_beds: req.body.number_of_beds1, room_id: req.body.room_id}, 
            function (err, result) {
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

        if((req.body.bed_type2 !== "")  && (req.body.number_of_beds2 !== "" )){ 
            let lock3 = new Promise((resolve, reject) => { 
                var sql = "REPLACE room_bed SET ?";
                mysql_db.query(sql,
                { bed_type: req.body.bed_type2, number_of_beds: req.body.number_of_beds2 , room_id: req.body.room_id },
                function (err, result) {
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

        if((req.body.bed_type3 !== "")  && (req.body.number_of_beds3 !== "" )){ 
            let lock4 = new Promise((resolve, reject) => { 
                var sql = "REPLACE room_bed SET ?";
                mysql_db.query(sql, 
                { bed_type: req.body.bed_type3, number_of_beds: req.body.number_of_beds3, room_id: req.body.room_id },
                function (err, result) {
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

function deleteroombyid(roomid) {
    mysql_db.beginTransaction(async function(err) {
        console.log('beginTransaction');
        if (err) { 
            throw err;
            //return false;
        }
        var i;
        let lock = new Promise((resolve, reject) => { 
            mysql_db.query("UPDATE hotel_room SET ? WHERE ?"
            , [{rooms_availability: false}, {room_id: roomid}],
            function (err, result) {
                if (err) {
                    throw err;
                    mysql_db.rollback(function() {
                        throw err;
                        return;
                    });
                }
                mysql_db.commit(function(err) {
                    if (err) { 
                        mysql_db.rollback(function() {
                            throw err;
                            return;
                        });
                    }
                    console.log('Transaction Complete.');
                    //mysql_db.end();
                    resolve();
                });
            });
        });
        let unlock = await lock;
    });
}

function enableroombyid(roomid) {
    mysql_db.beginTransaction(async function(err) {
        console.log('beginTransaction');
        if (err) { 
            throw err;
            //return false;
        }
        var i;
        let loop_lock = new Promise((resolve, reject) => { 
            mysql_db.query("UPDATE hotel_room SET ? WHERE ?"
            , [{rooms_availability: true}, {room_id: roomid}],
            function (err, result) {
                if (err) {
                    throw err;
                    mysql_db.rollback(function() {
                        throw err;
                        return;
                    });
                }
                mysql_db.commit(function(err) {
                    if (err) { 
                        mysql_db.rollback(function() {
                            throw err;
                            return;
                        });
                    }
                    console.log('Transaction Complete.');
                    //mysql_db.end();
                    resolve();
                });
            });
        });
        let unlock = await lock;
    });
}




async function search_available_rooms(checkin_date, checkout_date, adults, children){
    var rooms;
    var sql_room = "select room_id as id, total_num as num, room_price as price " + 
            "from hotel_room as hr " + 
            "where rooms_availability = true ";
    let lock1 = new Promise((resolve, reject) => { 
        mysql_db.query(sql_room, function (err, result) {
            if (err) throw err;
            rooms = result;
            resolve();
        });             
    });
    let unlock1 = await lock1;
    // console.log(util.inspect(rooms, false, null, true));

    var not_aval_rooms_with_date;
    var checkin_str = checkin_date.getFullYear() + '-' + (checkin_date.getMonth() + 1) + '-' + checkin_date.getDate();
    var checkout_str = checkout_date.getFullYear() + '-' + (checkout_date.getMonth() + 1) + '-' + checkout_date.getDate();
    var sql_notaval = "select rn.room_id as id, rn.not_available_num as num, not_available_date as date " + 
            "from room_not_available_date as rn " + 
            'where not_available_date >= "' + checkin_str +
            '" and not_available_date < "' + checkout_str + '"';
    let lock2 = new Promise((resolve, reject) => { 
        mysql_db.query(sql_notaval, function (err, result) {
            if (err) throw err;
            not_aval_rooms_with_date = result;
            // console.log(util.inspect(not_aval_rooms_with_date, false, null, true ));
            resolve();
        });             
    });
    let unlock2 = await lock2;
    // console.log(util.inspect(not_aval_rooms_with_date, false, null, true ));

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
    

    var reservations;
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
    let lock3 = new Promise((resolve, reject) => { 
        collection.find( query , function(err, result){
            if (err) throw err;
            reservations = result;
            resolve();
        });
    });
    let unlock3 = await lock3;
    
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
    console.log(dic);

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
    // console.log(dic);
    // console.log(aval_rooms);

    var room_with_detail;
    var sql_all_room_type = "select room_id as id, room_feature as feature, room_name as name from room_type";
    var sql_room_photo = 'select room_id as id, MIN(photo_id) as pid from room_photo group by id';
    var sql_room_detail = "select t1.id, t1.num, t1.price, t2.feature, t2.name, t3.pid from (" +  
                sql_room + ') as t1 ' + 
                ' left join (' + 
                sql_all_room_type + ') as t2 on t1.id = t2.id' + 
                " left join (" + 
                sql_room_photo +') as t3 on t1.id = t3.id';
    var sql_photo = 'select photo_id as pid, photo_address as pAddress from photo ';
    var sql_final = 'select r.id, r.num, r.price, r.feature, r.name, p.paddress from (' + 
                    sql_room_detail + ') as r ' + 
                    " left join (" + 
                    sql_photo + ') as p on r.pid = p.pid';
    // console.log(sql_final);

    let lock4 = new Promise((resolve, reject) => { 
        mysql_db.query(sql_final, function (err, result) {
            if (err) throw err;
            room_with_detail = result;
            resolve();
        });
    });
    let unlock4 = await lock4;
    
    // create json file
    var objs = {};
    for (var i = 0; i < room_with_detail.length; i++) {
        var e = {};
        var room = room_with_detail[i];
        // console.log(room);
        for (var d in room) {
            // console.log('    ' + d);
            e[d] = room_with_detail[i][d];
        }
        objs[room['id']] = e;
    }
    // console.log(aval_rooms);
    // console.log(room_with_detail);
    // console.log("OBJS: \n");
    // console.log(objs);
    // console.log(aval_rooms);


    var room_info = {
        'aval_room' : aval_rooms, 
        'room_with_detail' : objs
    };
    // console.log(room_info);
    return room_info;
}

module.exports = router;
