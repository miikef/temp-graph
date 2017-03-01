var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var when = require('when');
var serveStatic = require('serve-static');
var queries = require('./queries');
var constants = require('./client/constants');
var queryHandler;

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
        console.log("Connected successfully to mongodb server");
        queryHandler = new queries(db);
    });
}

function handler(req, res) {
    serve(req, res, function() {});
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

    console.log('getData(' + 'start=' + start + ', end=' + end);
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
    console.log("getLatest");
    where = _getWhere(where);
    var promises = [];
    where.forEach(function(location) {
        promises.push(queryHandler.latest(location));
    });
    when.all(promises).then(
        function(data, location) {
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
