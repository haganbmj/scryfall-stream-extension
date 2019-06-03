const express = require('express');
const morgan = require('morgan');
const winston = require('winston');

const log = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    console: {
        handleExceptions: true,
        colorize: true
    },
    transports: [new winston.transports.Console()],
    exitOnError: false
});

const app = express();
app.use(express.json());
app.use(morgan('combined'));

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const rooms = {};

function emitToRoom(room) {
    if (!rooms[room]) {
        rooms[room] = 'https://img.scryfall.com/cards/png/en/tmp/214.png';
    }

    log.debug('Emitting. %j', { room: room, url: rooms[room] });
    
    io.to(room).emit('url', rooms[room]);
}

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/set', (req, res) => {
    const { room, url } = req.body;

    if (typeof room !== 'string' || typeof url !== 'string') {
        return res.status(400).json({"message": "invalid"});
    }

    if (!url.match(/^(https?:\/\/(.+?\.)?img\.scryfall\.com(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/)) {
        return res.status(422).json({"message": "not a scryfall url"});
    }

    rooms[room] = url;
    emitToRoom(room);
    return res.status(200).json({"message": "ok"});
});

io.on('connection', (client) => { 
    client.on('join', (data) => {
        log.info('join: %j', data);
        if (typeof data === 'string') {
            client.join(data);
            emitToRoom(data);
        }
    });
});

server.listen(process.env.PORT || 8080, () => { 
    log.info(`Listening at ${process.env.PORT || 8080}`); 
});