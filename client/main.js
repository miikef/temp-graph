console.log("Opening socket");
var socket = io('http://127.0.0.1:9595');
var viewk = new TempRhGraph("#kallare .graph");
var viewt = new TempRhGraph("#trossbotten .graph");
socket.on('data', function(data) {
    viewk.draw(data[0]);
    viewt.draw(data[1]);
});
