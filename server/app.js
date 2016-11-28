var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var queries = require('./queries');
var queryHandler;

var url = 'mongodb://192.168.1.10:27017/tempstat';
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
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

function _test() {
    // queryHandler.doQuery(1479758700,1479845100,'Kallare');
    //queryHandler._test(1479758700,1479845100,'Kallare');
}

function handler(req, res) {
    fs.readFile(__dirname + '/index.html',
        function(err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

io.on('connection', function(socket) {
    var now = Math.ceil((new Date().getTime())/1000);
    var start = now - 60*60*24*7;
    queryHandler.doQuery(start, now,'Kallare',function(err,data){
        if ( err ) {
            console.log( "Error in query: " + err );
            return;
        }
        socket.emit('data', data );
    });
});


function getCurrent( db ) {

}

io.on('current', function(data) {
    var options = {
        "limit": 1,
	"sort": "date"
    }

    collection.find({location:'Kallare'}, options).toArray( function(err, docs) {
        assert.equal(err, null);
	    docs.length
	    collection.find({location:'Kallare'}, options).toArray( function(err, docs) {
        	assert.equal(err, null);
	    	socket.emit('current', docs );
     	});
    });
});

//});
