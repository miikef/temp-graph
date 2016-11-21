var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var queries = require('./queries');


var url = 'mongodb://localhost:27017/tempstat';
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
connectDB();
app.listen(1338);


// Use connect method to connect to the server
function connectDB() {
	MongoClient.connect(url, function(err, db) {
	    assert.equal(null, err);
	    global.db = db;

	    console.log(db)
	    console.log("Connected successfully to mongodb server");

	});
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
/*
io.on('connection', function(socket) {
    console.log("Connection");
    //connectDB();
    var collection = db.collection('measurements');
    console.log(collection);
    // Find some documents
    var options = {
          "limit": 1,
	  "sort": "date"
    }
    collection.find({location='Kallare'}, options).toArray( function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs)
	socket.emit('current', docs );
    });
*/

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
