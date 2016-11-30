console.log("Opening socket");
var socket = io('http://127.0.0.1:9595');
var viewk = new View("#kallare");
var viewt = new View("#trossbotten");
socket.on('data', function(data) {
    console.log(data);
    viewk.draw(data[0]);
    viewt.draw(data[1]);
});
