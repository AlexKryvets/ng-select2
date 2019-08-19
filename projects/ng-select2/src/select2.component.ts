import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component, ContentChildren,
    ElementRef,
    forwardRef, Input,
    OnInit, QueryList, Renderer2,
    ViewChild,
    ɵlooseIdentical as looseIdentical
} from '@angular/core';
import {Select2Options} from './interfaces';
import {ObservableAdapter} from './observable-adapter';
import {buildValueString} from './utils';
import {Select2OptionValueDirective} from './select2-option-value.directive';

declare var jQuery: any;

export const SELECT_2_COMPONENT_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Select2Component),
    multi: true
};

@Component({
    selector: 'select2',
    template: `<select #select>
        <ng-content></ng-content>
    </select>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    // encapsulation: ViewEncapsulation.None,
    providers: [SELECT_2_COMPONENT_ACCESSOR]
})
export class Select2Component implements ControlValueAccessor, OnInit, AfterContentInit {

    @ViewChild('select') select: ElementRef;

    @ContentChildren('option') optionList: QueryList<any>;

    @Input()
    options: Select2Options = {};

    @Input()
    set compareWith(fn: (o1: any, o2: any) => boolean) {
        if (typeof fn !== 'function') {
            throw new Error(`compareWith must be a function, but received ${JSON.stringify(fn)}`);
        }
        this._compareWith = fn;
    }

    value: any;

    /** @internal */
    optionMap: Map<string, any> = new Map<string, Select2OptionValueDirective>();
    /** @internal */
    idCounter = 0;

    private $element: any;

    private $select: any;

    private _compareWith: (o1: any, o2: any) => boolean = looseIdentical;

    onChange = (_: any) => {
    };

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {
        this.$element = jQuery(this.elementRef.nativeElement);
    }

    ngOnInit() {
        this.$select = jQuery(this.select.nativeElement);
        const dropDownParent = this.$select.closest('.modal');
        this.options.select2Component = this;
        if (dropDownParent.length) {
            this.options.dropDownParent = dropDownParent;
        }
        if (this.options.createObservable) {
            this.options.dataAdapter = ObservableAdapter;
        } else {
            this.wrapTemplateResultOption();
        }
        this.$select.on('change', (event, data) => {
            const value = this.$select.val();
            this.onChange(value);
        });
        this.$select.select2(this.options);
    }

    ngAfterContentInit() {
        this.optionList.changes.subscribe(() => {
            this.$select.select2(this.options);
            this.writeValue(this.value);
        });
    }

    private wrapTemplateResultOption() {
        const templateResult = this.options.templateResult;
        if (templateResult) {
            this.options.templateResult = (result, container) => {
                let data;
                if (result.id) {
                    data = this.getOptionValue(result.id);
                }
                return templateResult(data || result, container);
            };
        }
    }


    private setElementValue(newValue: string | string[]) {
        if (this.$select) {
            if (Array.isArray(newValue)) {
                this.$select.find('option').each(() => {
                    // this.renderer.setElementProperty(option, 'selected', (newValue.indexOf(option.value) > -1));
                });
            } else {
                this.$select.val(newValue);
                // this.renderer.setElementProperty(this.selector.nativeElement, 'value', newValue);
            }
            this.$select.trigger('change.select2');
        }
    }

    writeValue(value: any) {
        this.value = value;
        if (Array.isArray(value)) {
            let optionSelectedStateSetter: (opt: Select2OptionValueDirective, o: any) => void;
            if (Array.isArray(value)) {
                const ids = value.map((v) => {
                    return this.getOptionId(v);
                });
                optionSelectedStateSetter = function (opt, o) {
                    opt.setSelected(ids.indexOf(o.toString()) > -1);
                };
            } else {
                optionSelectedStateSetter = function (opt, o) {
                    opt.setSelected(false);
                };
            }
            this.optionMap.forEach(optionSelectedStateSetter);
        } else {
            const id: string | null = this.getOptionId(value);
            if (id == null) {
                this.renderer.setProperty(this.select.nativeElement, 'selectedIndex', -1);
            }
            const valueString = buildValueString(id, value);
            this.setElementValue(valueString);
        }
    }

    registerOnChange(fn: any) {
        this.onChange = (_: string | [string]) => {
            if (Array.isArray(_)) {
                const selected = [];
                for (let i = 0; i < _.length; i++) {
                    const value = this.getOptionValue(_[i]);
                    selected.push(value);
                }
                this.value = selected;
                fn(this.value);
            } else if (typeof _ === 'string') {
                this.value = this.getOptionValue(_);
                fn(this.value);
            }
        };
    }

    registerOnTouched() {
    }

    setDisabledState(isDisabled: boolean): void {
        // this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }

    /** @internal */
    registerOption(value: Select2OptionValueDirective): string {
        const id: string = (this.idCounter++).toString();
        this.optionMap.set(id, value);
        return id;
    }

    /** @internal */
    getOptionId(value: any): string | null {
        for (const id of Array.from(this.optionMap.keys())) {
            if (this._compareWith(this.optionMap.get(id).value, value)) {
                return id;
            }
        }
        return null;
    }

    /** @internal */
    getOptionValue(valueString: string): any {
        const id: string = valueString.split(':')[0];
        return this.optionMap.has(id) ? this.optionMap.get(id).value : valueString;
    }
}
