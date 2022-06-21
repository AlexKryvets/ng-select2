import {Observable, Subscription} from 'rxjs';
import {ArrayAdapter} from '@teamsoft/select2-adapters/base-adapters';
import {Select2Component} from './select2.component';
import {buildValueString} from './utils';
import {Select2OptionValueDirective} from './select2-option-value.directive';

export type CreateObservableFunction = (params: { term: string }) => Observable<any>;
export interface DataAdapterOptions {
  getOptionValue: (item: any) => any;
}

export class ObservableAdapter extends ArrayAdapter {
    private createObservable: CreateObservableFunction;
    private dataAdapterOptions: DataAdapterOptions = {
      getOptionValue: (item: any) => {
        return item;
      }
    };
    private observableSubscription: Subscription;
    private select2Component: Select2Component;

    constructor($element, options) {
        super($element, options);
        this.select2Component = options.get('select2Component');
        this.createObservable = options.get('createObservable') as CreateObservableFunction;
        this.dataAdapterOptions = options.get('dataAdapterOptions') as DataAdapterOptions;
    }

    query(params, callback) {
        if (this.observableSubscription) {
            this.observableSubscription.unsubscribe();
        }

        this.observableSubscription = this.createObservable(params).subscribe((data) => {
            callback({
                results: data.map((item) => {
                    const optionValue = this.dataAdapterOptions.getOptionValue(item);
                    const id = this.select2Component.getOptionId(optionValue);
                    item.id = buildValueString(id, optionValue);
                    return item;
                })
            });
        });
    }

    select(data: any) {
        const optionValue = this.dataAdapterOptions.getOptionValue(data);
        let $option = this.$element.find('option').filter((i, elm: any) => {
            const id = this.select2Component.getOptionId(optionValue);
            return elm.value === buildValueString(id, optionValue);
        });

        if ($option.length === 0) {
            const id = this.select2Component.registerOption({
                value: this.dataAdapterOptions.getOptionValue(data)
            } as Select2OptionValueDirective);
            $option = this.option(data);
            $option[0].value = buildValueString(id, optionValue);
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
