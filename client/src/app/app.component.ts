import { Component, OnInit } from '@angular/core';
import {SocketService} from './chat/shared/services/socket.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {User} from './chat/shared/model/user';
import {DialogUserComponent} from './dialog-user/dialog-user.component';
import {DialogInfoComponent} from './dialog-info/dialog-info.component';
import {DialogUsersComponent} from './dialog-users/dialog-users.component';
import {DialogUserType} from './dialog-user/dialog-user-type';
import {Action} from './chat/shared/model/action';
import {Event} from './chat/shared/model/event';

@Component({
  selector: 'tcc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  online: any;
  user: User;
  userDialogRef: MatDialogRef<DialogUserComponent> | null;
  usersDialogRef: MatDialogRef<DialogUsersComponent> | null;
  infoDialogRef: MatDialogRef<DialogInfoComponent> | null;
  defaultDialogUserParams: any = {
      disableClose: true,
      data: {
          title: 'Bienvenido, ',
          dialogType: DialogUserType.NEW
      }
  };
  constructor(private socketService: SocketService,
              public dialog: MatDialog) {

  }
  ngOnInit(): void {
      this.initModel();
      this.initIoConnection();
      if (this.user.name == null) {
          // Using timeout due to https://github.com/angular/angular/issues/14748
          setTimeout(() => {
              this.openUserPopup(this.defaultDialogUserParams);
          }, 0);
      } else {
          this.sendNotification(null, Action.JOINED);
      }
  }

  private sendNotification(params, action){
      return this.socketService.localNotification(this.user, params, action);
  }

  private initModel(): void {
      this.user = window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')) : { id: this.getRandomId() };
  }

  private getRandomId(): number {
      return Math.floor(Math.random() * (1000000)) + 1;
  }

  public onClickUserInfo() {
      this.openUserPopup({
          data: {
              username: this.user.name,
              title: '¿Quieres cambiar?',
              dialogType: DialogUserType.EDIT
          }
      });
  }

  private openUserPopup(params): void {
      this.userDialogRef = this.dialog.open(DialogUserComponent, params);
      this.userDialogRef.afterClosed().subscribe(paramsDialog => {
          if (!paramsDialog) {
              return;
          }

          this.user.name = paramsDialog.username;
          window.localStorage.setItem('user', JSON.stringify(this.user));
          if (paramsDialog.dialogType === DialogUserType.NEW) {
              this.initIoConnection();
              this.sendNotification(paramsDialog, Action.JOINED);
          } else if (paramsDialog.dialogType === DialogUserType.EDIT) {
              this.sendNotification(paramsDialog, Action.RENAME);
          }
      });
  }


  private initIoConnection(): void {
      this.socketService.initSocket();

      this.socketService.onEvent(Event.CONNECT)
          .subscribe(() => {
              console.log('connected');
          });

      this.socketService.onEvent(Event.DISCONNECT)
          .subscribe(() => {
              console.log('disconnected');
          });

      this.socketService.onOnlineUpdate()
          .subscribe((_users: any) => {
              this.online = _users;
          });
  }

  public onClickInfo(): void {
      this.infoDialogRef = this.dialog.open(DialogInfoComponent);
  }

  public onClickList(): void {
      this.usersDialogRef = this.dialog.open(DialogUsersComponent,{data: {online: this.online}});
  }

}
