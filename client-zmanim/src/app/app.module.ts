import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]), // This is crucial for router-outlet to work
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [],
})
export class AppModule {}
