import {CreateObservableFunction} from './observable-adapter';

export interface Select2Options {
    language?: string;
    templateResult?: any;
    dropDownParent?: any;
    createObservable?: CreateObservableFunction;
    dataAdapter?: any;
    multiple?: boolean;
}
