let socket = io('http://127.0.0.1:9595');
let graphk = new GraphContainer('kallare', 'Källare');
let grapht = new GraphContainer('trossbotten', 'Trossbotten');
socket.on('connect', function () {
    console.log("Connected to socket")
    socket.emit('getData');
});
socket.on('data', function(data) {
    graphk.setGraphData(data[0]);
    grapht.setGraphData(data[1]);
});
