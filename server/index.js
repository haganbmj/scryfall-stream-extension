const express = require('express');

const app = express();
app.use(express.json());

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const rooms = {};

function emitToRoom(room) {
    if (!rooms[room]) {
        rooms[room] = 'https://img.scryfall.com/cards/png/en/tmp/214.png';
    }
    
    io.to(room).emit('url', rooms[room]);
}

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/set', (req, res) => {
    console.log('/set: %O', req.body);
    if (typeof req.body.room === 'string' && typeof req.body.url === 'string') {
        rooms[req.body.room] = req.body.url;
        emitToRoom(req.body.room);
        return res.status(200).json({"message": "ok"});
    }

    return res.status(400).json({"message": "invalid"});
});

io.on('connection', (client) => { 
    client.on('join', (data) => {
        console.log('join: %O', data);
        if (typeof data === 'string') {
            client.join(data);
            emitToRoom(data);
        }
    });
});

server.listen(process.env.PORT || 8080, () => { 
    console.log(`Listening at ${process.env.PORT || 8080}`); 
});