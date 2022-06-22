import {Component} from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'ng-select2-app';

    data = [
        {id: 1, text: 'First', data: {id: 1}},
        {id: 2, text: 'Second', data: {id: 2}},
        {id: 3, text: 'Third', data: {id: 3}},
    ];

    data$ = this.createData$();

    defaultSelect2Options = {width: 120};

    select2SingleSync = {
        options: {...this.defaultSelect2Options},
        model: 2,
        ngModel: {...this.data[1]}
    };

    select2SingleAsync = {
        options: {...this.defaultSelect2Options},
        model: 1,
        ngModel: {...this.data[0]}
    };

    select2SingleObservable = {
        options: {
            ...this.defaultSelect2Options,
            ...{createObservable: this.createData$.bind(this)},
            ...{
                dataAdapterOptions: {
                    getOptionValue: (item: any) => item.id,
                },
            },
        },
        ngOptions: {...this.defaultSelect2Options, ...{createObservable: this.createData$.bind(this)}},
        model: 3,
        ngModel: {...this.data[2]}
    };

    select2SingleFormControlSync = {
        options: {...this.defaultSelect2Options},
        formControl: new FormControl(2),
        ngFormControl: new FormControl({...this.data[1]})
    };

    select2SingleFormControlAsync = {
        options: {...this.defaultSelect2Options},
        formControl: new FormControl(1),
        ngFormControl: new FormControl({...this.data[0]})
    };

    select2SingleFormControlObservable = {
        options: {
            ...this.defaultSelect2Options,
            ...{createObservable: this.createData$.bind(this)},
            ...{
                dataAdapterOptions: {
                    getOptionValue: (item: any) => item.id,
                },
            },
        },
        ngOptions: {...this.defaultSelect2Options, ...{createObservable: this.createData$.bind(this)}},
        formControl: new FormControl(3),
        ngFormControl: new FormControl({...this.data[2]})
    };

    select2MultipleSync = {
        options: {...this.defaultSelect2Options, ...{multiple: true}},
        model: [1, 2],
        ngModel: [{...this.data[0]}, {...this.data[1]}]
    };

    select2MultipleAsync = {
        options: {...this.defaultSelect2Options, ...{multiple: true}},
        model: [2, 3],
        ngModel: [{...this.data[1]}, {...this.data[2]}]
    };

    select2MultipleObservable = {
        options: {
            ...this.defaultSelect2Options,
            ...{multiple: true, createObservable: this.createData$.bind(this)},
            ...{
                dataAdapterOptions: {
                    getOptionValue: (item: any) => item.id,
                },
            },
        },
        ngOptions: {
            ...this.defaultSelect2Options,
            ...{multiple: true, createObservable: this.createData$.bind(this)},
        },
        model: [1, 3],
        ngModel: [{...this.data[0]}, {...this.data[2]}]
    };

    select2MultipleFormControlSync = {
        options: {...this.defaultSelect2Options, ...{multiple: true}},
        formControl: new FormControl([1, 2]),
        ngFormControl: new FormControl([{...this.data[0]}, {...this.data[1]}])
    };

    select2MultipleFormControlAsync = {
        options: {...this.defaultSelect2Options, ...{multiple: true}},
        formControl: new FormControl([2, 3]),
        ngFormControl: new FormControl([{...this.data[1]}, {...this.data[2]}])
    };

    select2MultipleFormControlObservable = {
        options: {
            ...this.defaultSelect2Options,
            ...{multiple: true, createObservable: this.createData$.bind(this)},
            ...{
                dataAdapterOptions: {
                    getOptionValue: (item: any) => item.id,
                },
            },
        },
        ngOptions: {...this.defaultSelect2Options, ...{multiple: true, createObservable: this.createData$.bind(this)}},
        formControl: new FormControl([1, 3]),
        ngFormControl: new FormControl([{...this.data[0]}, {...this.data[2]}])
    };

    createData$(): Observable<any> {
        return of(this.data).pipe(delay(1000));
    }

    toJSON(data) {
        return JSON.stringify(data);
    }

    compareWith(value1, value2) {
        return value1 === value2;
    }

    ngCompareWith(value1, value2) {
        return value1 && value2 && value1.id === value2.id;
    }
}
