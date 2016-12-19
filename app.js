var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var when = require('when');
var serveStatic = require('serve-static');
var queries = require('./queries');
var queryHandler;

var url = 'mongodb://192.168.1.10:27017/tempstat';
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var serve = serveStatic( __dirname + '/client', {
    fallthrough: false
});

setup();
app.listen(9595);

function setup() {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to mongodb server");
        queryHandler = new queries(db);


        //_test();
    });
}
/*
function _test() {
    // queryHandler.doQuery(1479758700,1479845100,'Kallare');
    //queryHandler._test(1479758700,1479845100,'Kallare');
}
*/

function handler(req, res) {
    serve(req, res, function(){});
}


io.on('connection', function(socket) {
    var now = Math.ceil((new Date().getTime()) / 1000);
    var start = now - 60 * 60 * 24 * 7;
    var promises = [];

    promises.push(queryHandler.doQuery(start, now, 'Kallare'));
    promises.push(queryHandler.doQuery(start, now, 'Trossbotten'));
    when.all(promises).then(
        function(data) {
            socket.emit('data', data);
        },
        function(error) {
            console.log(error);
        });
});

/*
function getCurrent( db ) {

}

io.on('current', function(data) {
    var options = {
        "limit": 1,
	"sort": "date"
    }

    collection.find({location:'Kallare'}, options).toArray( function(err, docsk) {
        assert.equal(err, null);
	    collection.find({location:'Trossbotten'}, options).toArray( function(err, docst) {
        	assert.equal(err, null);
	        socket.emit('current', [docsk,docst] );
     	});
    });
});

//});
*/
