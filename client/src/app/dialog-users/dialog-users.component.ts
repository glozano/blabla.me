import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {SocketService} from "../chat/shared/services/socket.service";

@Component({
  selector: 'tcc-dialog-users',
  templateUrl: './dialog-users.component.html',
})
export class DialogUsersComponent implements OnInit {
   online: number;
  protected ioConnection: any;

  constructor(public dialogRef: MatDialogRef<DialogUsersComponent>,
    protected socketService:SocketService,
    @Inject(MAT_DIALOG_DATA) public params: any) {
      this.online = params.online ? params.online : undefined;
  }

  ngOnInit() {
  }
}
