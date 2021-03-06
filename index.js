const express = require('express');
const mustacheExpress = require('mustache-express');
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

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', './views');
app.disable('view cache');

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const rooms = {};

function emitToRoom(room) {
    if (!rooms[room]) {
        rooms[room] = 'https://img.scryfall.com/cards/png/front/6/3/63a31de0-d764-4ff6-a85f-027e1e58d86c.png';
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

    // https://c1.scryfall.com/file/scryfall-cards/large/front/7/d/7d6ace1f-c056-494d-a41f-75efa54312a5.jpg?1598135337
    if (!url.match(/^(https?:\/\/(.+?\.)?c1\.scryfall\.com(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/)) {
        return res.status(422).json({"message": "not a scryfall url"});
    }

    rooms[room] = url;
    emitToRoom(room);
    return res.status(200).json({"message": "ok"});
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/room/:id', (req, res) => {
    const { id } = req.params;
    res.render('room', { id });
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