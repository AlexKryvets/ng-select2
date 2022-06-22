import {Observable, Subscription} from 'rxjs';
import {ArrayAdapter} from '@teamsoft/select2-adapters/base-adapters';
import {Select2Component} from './select2.component';
import {buildValueString} from './utils';
import {Select2OptionValueDirective} from './select2-option-value.directive';

export type CreateObservableFunction = (params: { term: string }) => Observable<any>;

export interface DataAdapterOptions {
    getOptionValue: (item: any) => any;
    getOptionText: (item: any) => string;
}

export class ObservableAdapter extends ArrayAdapter {
    private createObservable: CreateObservableFunction;
    private dataAdapterOptions: DataAdapterOptions = {
        getOptionValue: (item: any) => {
            return item;
        },
        getOptionText: (item: any) => {
            return item.text;
        }
    };
    private observableSubscription: Subscription;
    private select2Component: Select2Component;

    constructor($element, options) {
        super($element, options);
        this.select2Component = options.get('select2Component');
        this.createObservable = options.get('createObservable') as CreateObservableFunction;
        this.dataAdapterOptions = {...this.dataAdapterOptions, ...options.get('dataAdapterOptions')};
    }

    query(params, callback) {
        if (this.observableSubscription) {
            this.observableSubscription.unsubscribe();
        }

        this.observableSubscription = this.createObservable(params).subscribe((data) => {
            callback({
                results: data.map((origData) => {
                    const item: any = {origData};
                    const optionValue = this.dataAdapterOptions.getOptionValue(origData);
                    let id = this.select2Component.getOptionId(optionValue);
                    if (id === null) {
                        id = this.select2Component.registerOption({
                            value: this.dataAdapterOptions.getOptionValue(origData)
                        } as Select2OptionValueDirective);
                    }
                    item.id = buildValueString(id, optionValue);
                    item.text = this.dataAdapterOptions.getOptionText(origData);
                    return item;
                })
            });
        });
    }

    select(data: any) {
        const {origData} = data;
        const optionValue = this.dataAdapterOptions.getOptionValue(origData);
        const id = this.select2Component.getOptionId(optionValue);
        let $option = this.$element.find('option').filter((i, elm: any) => {
            return elm.value === buildValueString(id, optionValue);
        });

        if ($option.length === 0) {
            $option = this.option(data);
            this.addOptions($option);
        }

        let elementValue = this.$element.val();
        if (Array.isArray(elementValue)) {
            const index = elementValue.indexOf($option.val());
            if (index === -1) {
                elementValue.push($option.val());
            } else {
                elementValue.splice(index, 1);
            }
        } else {
            elementValue = $option.val();
        }

        this.$element.val(elementValue);
        this.$element.trigger('change', elementValue);
    }
}
