let socket = io('http://127.0.0.1:9595');
let graphk = new GraphView('kallare', 'Källare');
let grapht = new GraphView('trossbotten', 'Trossbotten');
const locations = ['Kallare', 'Trossbotten'];
socket.on('connect', function () {
    console.log("Connected to socket")
    var end = Math.ceil((new Date().getTime()) / 1000);
    var start = end - 2*WEEK;
    socket.emit('getData', start, end, locations, function(data) {
        console.log(data[0].length);
        graphk.setGraphData(data[0]);
        grapht.setGraphData(data[1]);
    });
});
