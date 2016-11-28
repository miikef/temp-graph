console.log("Opening socket");
var socket = io('http://127.0.0.1:9595');
socket.on('data', function(data) {
    console.log(data);
});
