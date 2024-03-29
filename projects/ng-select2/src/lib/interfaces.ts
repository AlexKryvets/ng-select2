import {CreateObservableFunction, DataAdapterOptions} from './observable-adapter';
import {Select2Component} from './select2.component';

export interface Select2Options {
    language?: string;
    templateResult?: any;
    dropDownParent?: any;
    createObservable?: CreateObservableFunction;
    dataAdapter?: any;
    dataAdapterOptions?: DataAdapterOptions;
    multiple?: boolean;
    select2Component?: Select2Component;
    placeholder?: string;
    width?: number|string;
    allowClear?: boolean;
}
