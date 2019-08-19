import {Observable, Subscription} from 'rxjs';
import {ArrayAdapter} from '@teamsoft/select2-adapters/base-adapters';
import {Select2Component} from './select2.component';
import {buildValueString} from './utils';
import {Select2OptionValueDirective} from './select2-option-value.directive';

export type CreateObservableFunction = (params: { term: string }) => Observable<any>;

export class ObservableAdapter extends ArrayAdapter {
    private createObservable: CreateObservableFunction;
    private observableSubscription: Subscription;
    private select2Component: Select2Component;

    constructor($element, options) {
        super($element, options);
        this.select2Component = options.get('select2Component');
        this.createObservable = options.get('createObservable') as CreateObservableFunction;
    }

    query(params, callback) {
        if (this.observableSubscription) {
            this.observableSubscription.unsubscribe();
        }

        this.observableSubscription = this.createObservable(params).subscribe((data) => {
            callback({results: data});
        });
    }

    select(data: any) {
        let $option = this.$element.find('option').filter((i, elm: any) => {
            const id = this.select2Component.getOptionId(data.id);
            return elm.value === buildValueString(id, data.id);
        });

        if ($option.length === 0) {
            const id = this.select2Component.registerOption({value: data} as Select2OptionValueDirective);
            $option = this.option(data);
            $option[0].value = buildValueString(id, data.id);
            this.addOptions($option);
        }

        let elementValue = this.$element.val();
        if (Array.isArray(elementValue) && elementValue.indexOf($option.val()) === -1) {
            elementValue.push($option.val());
        } else {
            elementValue = $option.val();
        }

        data.selected = true;
        const elementData = this.$element.select2('data');
        if (Array.isArray(elementData) && elementData.indexOf(data) === -1) {
            elementData.push(data);
        }

        this.$element.val(elementValue);
        this.$element.trigger('change', elementData);
    }
}
