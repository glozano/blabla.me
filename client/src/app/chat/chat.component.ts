import { Component, OnInit, OnChanges, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatList, MatListItem } from '@angular/material';
import {trigger, state, style, animate, transition} from '@angular/animations';
import { Action } from './shared/model/action';
import { Event } from './shared/model/event';
import { Message } from './shared/model/message';
import { User } from './shared/model/user';
import { SocketService } from './shared/services/socket.service';
import axios from 'restyped-axios'
import { GiphyAPI } from 'restyped-giphy-api'

const client = axios.create<GiphyAPI>({baseURL: 'http://api.giphy.com/v1'});
const spinner = 'assets/spinner.gif';

@Component({
  selector: 'tcc-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [
      trigger('btnState', [
          state('inactive', style({
              opacity: 0
          })),
          state('active',   style({
              opacity: 1
          })),
          transition('inactive => active', animate('500ms ease-in')),
          transition('active => inactive', animate('80ms ease-out'))
      ])
  ]
})
export class ChatComponent implements OnInit, AfterViewInit {
  action = Action;
  user: User;
  searchTimer: any;
  messages: Message[] = [];
  messageContent: string;
  btnState = 'inactive';
  ioConnection: any;
  currentGifs: any[] = [];
  chatHeight: number;

  // getting a reference to the overall list, which is the parent container of the list items
  @ViewChild(MatList, { read: ElementRef }) matList: ElementRef;

  // getting a reference to the items/messages within the list
  @ViewChildren(MatListItem, { read: ElementRef }) matListItems: QueryList<MatListItem>;

  @ViewChild('chatContainer') chatContainer: ElementRef;
  @ViewChild('chatFooter') chatFooter: ElementRef;

  constructor(private socketService: SocketService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
      this.ioConnection = this.socketService.onMessage()
          .subscribe((message: Message) => {
              this.messages.push(message);
          });
      this.user = JSON.parse(window.localStorage.getItem('user'));
      setTimeout(() => {
          this.showButton();
      }, 1000);
  }

  errorHandler(event) {
      console.debug(event);
      event.target.src = "assets/spinner.gif";
  }

  ngAfterViewInit(): void {
    // subscribing to any changes in the list of items / messages
    this.matListItems.changes.subscribe(elements => {
      this.scrollToBottom();
    });
  }

  // auto-scroll fix: inspired by this stack overflow post
  // https://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style
  private scrollToBottom(): void {
    try {
      this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

    public hideButton(): void {
      this.btnState = 'inactive';
  }

    public showButton(): void {
        this.btnState = 'active';
    }

  private adjustHeights(): void {
      if(this.chatFooter.nativeElement.offsetHeight < 100){
        this.chatHeight = this.chatFooter.nativeElement.offsetTop - 200;
      }else{
        this.chatHeight = this.chatFooter.nativeElement.offsetTop - 100;
      }
  };

  public sendMessage(message: any): void {
    this.user = JSON.parse(window.localStorage.getItem('user'));

    if (!message) {
      return;
    }

    this.socketService.send({
      from: this.user,
      content: message
    });
    this.messageContent = null;
    this.currentGifs = [];
    this.showButton();
    setTimeout((): void => {this.adjustHeights()}, 500);
  }

  public searchGiphy(message: string): void {
      client.request({
          url: '/gifs/search',
          params: {
              api_key: '9dHK7nkPwZxfNdkiLFUt9MidUP7jxidQ',
              q: message,
              limit: 15
          }
      }).then((res) => {
        this.currentGifs = [];
        for (const gif of res.data.data){
            this.currentGifs.push(gif);
        };
        setTimeout((): void => {this.adjustHeights()}, 500);
      })
  }

  public initSearch(message: string): void {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => { this.searchGiphy(message); }, 200)
  }

  public resetCounter(): void {
      clearTimeout(this.searchTimer);
  }

  public cleanGifs(): void {
      this.currentGifs = [];
      this.showButton();
  }
}
