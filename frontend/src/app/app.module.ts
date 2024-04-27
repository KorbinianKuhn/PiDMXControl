import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PadButtonModule } from './components/pad-button/pad-button.module';
import { VisualsModule } from './routes/visuals/visuals.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    VisualsModule,
    MatIconModule,
    HttpClientModule,
    PadButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
