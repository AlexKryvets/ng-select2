import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {Select2Module} from '@teamsoft/ng-select2';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        Select2Module
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
