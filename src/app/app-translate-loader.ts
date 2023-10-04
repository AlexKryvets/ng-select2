import {TranslateLoader} from "@ngx-translate/core";
import {Observable, of} from "rxjs";
import {delay} from "rxjs/operators";

type KeyValuePair = {[key: string]: string};

const EN: KeyValuePair = {
    'First': 'First',
    'Second': 'Second',
    'Third': 'Third',
};
const UK: KeyValuePair = {
    'First': 'Перший',
    'Second': 'Другий',
    'Third': 'Третій',
};
export class AppTranslateLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<{[key: string]: string}> {
        let trans: KeyValuePair;
        switch (lang){
            case 'uk':
                trans = UK;
                break;
            case 'en':
            default:
                trans = EN;
        }
        return of(trans).pipe(delay(2000));
    }
}
