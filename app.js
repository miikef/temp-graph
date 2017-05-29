var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var when = require('when');
var serveStatic = require('serve-static');
var queries = require('./queries');
var constants = require('./client/constants');
var queryHandler;
var latestTimeStamp = 0;
var newDataTimer = null;

const url = 'mongodb://192.168.1.10:27017/tempstat';
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var serve = serveStatic(__dirname + '/client', {
    fallthrough: false
});

const locations = ['Kallare', 'Trossbotten'];

setup();
app.listen(9595);

function setup() {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log('Connected successfully to mongodb server');
        queryHandler = new queries(db);
        newDataTimer = setTimeout(checkForNewData, 60000);
    });
}

function handler(req, res) {
    serve(req, res, function() {});
}

function checkForNewData(timeStamp, socket) {
    if (timeStamp) {
        if (timeStamp <= latestTimeStamp) {
            return;
        }
        latestTimeStamp = timeStamp;
        emitNewData(socket);
    } else {
        queryHandler.latest().then(
            function(data) {
                if (data.date > latestTimeStamp) {
                    latestTimeStamp = data.date;
                    emitNewData(socket);
                }
            }
        )
    }

}

function emitNewData(socket) {
    if (socket) {
        console.log("Emitting newData to everyone but client that triggered it");
        socket.emit('newData', latestTimeStamp);
    } else {
        console.log("Emitting newData to everyone,");
        io.emit('newData', latestTimeStamp);
    }
    clearTimeout(newDataTimer);
    newDataTimer = setTimeout(checkForNewData, 60000);
}

io.on('connection', function(socket) {
    console.log("Client connected");
    socket.on('getData', getData.bind(this, socket));
    socket.on('getLatest', getLatest.bind(this, socket));
});

function getData(socket, start, end, where, fn) {
    where = _getWhere(where);
    if (!end) {
        end = Math.ceil((new Date().getTime()) / 1000);
    }

    var promises = [];
    where.forEach(function(location) {
        promises.push(queryHandler.doQuery(start, end, location));
    });
    when.all(promises).then(
        function(data) {
            fn({
                data: data,
                start: start,
                end: end,
                location: where
            });
        },
        function(error) {
            console.log(error);
            fn();
        });
}

function getLatest(socket, where, fn) {
    where = _getWhere(where);
    var promises = [];
    where.forEach(function(location) {
        promises.push(queryHandler.latest(location));
    });
    when.all(promises).then(
        function(data, location) {
            // Check if timestamp is newer than what we've seen
            checkForNewData(data[0].date, socket);
            fn({
                rh: data[0].rh,
                temp: data[0].temp,
                date: data[0].date,
            });
        },
        function(error) {
            console.log(error);
            fn();
        });
}

function _getWhere(where) {
    if (!where) {
        where = locations;
    }
    if (!Array.isArray(where)) {
        where = [where];
    }
    return where;
}
