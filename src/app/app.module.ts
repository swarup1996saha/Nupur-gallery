import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Add this import
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GalleryLightboxComponent } from './gallery-lightbox/gallery-lightbox.component';

@NgModule({
  declarations: [
    AppComponent,
    GalleryLightboxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule  // Add this to imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
