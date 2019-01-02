import {Observable, Subscription} from 'rxjs';
import {ArrayAdapter} from '@teamsoft/select2-adapters/base-adapters';

export type CreateObservableFunction = (params: {term: string}) => Observable<any>;

export class ObservableAdapter extends ArrayAdapter {
    private createObservable: CreateObservableFunction;
    private observableSubscription: Subscription;

    constructor($element, options) {
        super($element, options);
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
        let $option = this.$element.find('option').filter(function (i, elm) {
            return elm.value === data.id.toString();
        });

        if ($option.length === 0) {
            $option = this.option(data);

            this.addOptions($option);
        }

        data.selected = true;

        const val = data.id;

        this.$element.val(val);
        this.$element.trigger('change', data);
    }
}
