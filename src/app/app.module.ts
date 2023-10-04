import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {Select2Module} from '@teamsoft/ng-select2';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {AppTranslateLoader} from "./app-translate-loader";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        Select2Module,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: AppTranslateLoader,
            },
        }),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
