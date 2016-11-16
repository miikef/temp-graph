var socket = io('http://192.168.1.10:1337');
socket.on('update', function(data) {
    console.log("update");
});
