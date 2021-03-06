import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';

import { Message } from './model';

export class ChatServer {
    public static readonly PORT:number = 4080;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;
    private online: number;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            this.online = 0;
            console.log('Running server on port %s', this.port);
        });
        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            this.online++;
            console.log('emit online %s',this.online);
            this.io.emit('online', this.online);

            socket.on('message', (m: Message) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });

            // socket.on('online', () => {
            //     this.io.emit('online', this.online);
            // });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
                this.online--;
                console.log('emit online %s',this.online);
                this.io.emit('online', this.online);
            });
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}
