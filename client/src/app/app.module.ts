import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatModule } from './chat/chat.module';
import { SharedModule } from './shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './shared/material/material.module';

import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { DialogUsersComponent } from './dialog-users/dialog-users.component';
import { DialogInfoComponent } from './dialog-info/dialog-info.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogUserComponent,
    DialogUsersComponent,
    DialogInfoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ChatModule,
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ],
  providers: [],
  entryComponents: [
      DialogUserComponent,
      DialogUsersComponent,
      DialogInfoComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
