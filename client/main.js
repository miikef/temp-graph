let socket = io('http://127.0.0.1:9595');
socket.on('connect', function() {
    console.log("Connected to socket")
    let graphk = new GraphView('kallare', {
        id: 'Kallare',
        name: 'Källare'
    });
    let grapht = new GraphView('trossbotten', {
        id: 'Trossbotten',
        name: 'Trossbotten'
    });
});
