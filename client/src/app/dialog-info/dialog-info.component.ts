import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'tcc-dialog-info',
  templateUrl: './dialog-info.component.html',
})
export class DialogInfoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public params: any) {
  }

  ngOnInit() {
  }
}
