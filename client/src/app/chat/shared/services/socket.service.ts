import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Message } from '../model/message';
import { Event } from '../model/event';
import { Action } from '../model/action';
import {User} from "../model/user";

import * as socketIo from 'socket.io-client';

// const SERVER_URL = 'http://localhost:4080';
const SERVER_URL = 'http://gastonlozano.com:4080';

@Injectable()
export class SocketService {
    private socket;
    protected users: any;

    public initSocket(): void {
        this.socket = socketIo(SERVER_URL);
    }

    public send(message: Message): void {
        this.socket.emit('message', message);
    }

    public onMessage(): Observable<Message> {
        return new Observable<Message>(observer => {
            this.socket.on('message', (data: Message) => observer.next(data));
        });
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }

    public onlinePing(): void {
        this.socket.emit('online');
    }

    public onOnlineUpdate(): Observable<any> {
        return new Observable<any>(observer => {
            this.socket.on('online', (data: any) => observer.next(data));
        });
    }

    public localNotification(user: User,params: any, action: Action): void {
        let message: Message;

        if (action === Action.JOINED) {
            message = {
                from: user,
                action: action
            }
        } else if (action === Action.RENAME) {
            message = {
                action: action,
                content: {
                    username: user.name,
                    previousUsername: params.previousUsername
                }
            };
        }

        this.send(message);
    }
}
