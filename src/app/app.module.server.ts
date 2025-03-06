import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { WebcamModule } from 'ngx-webcam';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    WebcamModule
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
