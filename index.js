const http = require('http');
const { EventEmitter } = require('events');
const logger = require('./logger');

class AppServer extends EventEmitter {
    constructor() {
        super();
        this.server = null;
    }

    start(port) {
        this.server = http.createServer((req, res) => {
            // Задание 1.2: генерация события при запросе
            this.emit('request:received', {
                url: req.url,
                method: req.method
            });

            // Задание 1.4: ответ на все запросы
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('Hello from Event-Driven Server!');
        });

        this.server.listen(port, () => {
            this.emit('server:started', port);
        });
    }

    stop() {
        if (this.server) {
            this.server.close(() => {
                this.emit('server:stopped');
            });
        }
    }
}

const app = new AppServer();

// Задание 1.3: Регистрация обработчиков
app.on('server:started', (port) => {
    console.log(`🚀 Сервер запущен на порту ${port}`);
});

app.on('request:received', (request) => {
    console.log(`📨 Получен запрос: ${request.method} ${request.url}`);
});

app.on('server:stopped', () => {
    console.log('🛑 Сервер остановлен');
});

// Задание 2: Подключение логгера
logger.setupLogger(app);

// Запуск
app.start(3000);