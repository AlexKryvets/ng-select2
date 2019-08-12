import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {Select2Module} from '../../lib/src/module';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,

        Select2Module
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
