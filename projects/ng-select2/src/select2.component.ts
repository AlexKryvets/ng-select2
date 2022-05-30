import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component, ContentChildren,
  ElementRef,
  forwardRef, Input, OnChanges,
  OnInit, QueryList, Renderer2, SimpleChanges,
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
export class Select2Component implements ControlValueAccessor, OnInit, AfterContentInit, OnChanges {

    @ViewChild('select', { static: true }) select: ElementRef;

    @ContentChildren('option') optionList: QueryList<any>;

    @Input()
    placeholder = '';

    @Input()
    options: Select2Options = {};

    private select2Options: Select2Options = {};

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
    }

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {
        this.$element = jQuery(this.elementRef.nativeElement);
    }

    open() {
        if (this.$select) {
           this.$select.select2('open');
        }
    }

    close() {
        if (this.$select) {
            this.$select.select2('close');
        }
    }

    ngOnInit() {
        this.$select = jQuery(this.select.nativeElement);
        this.select2Options = Object.assign({}, this.options);

        const dropDownParent = this.$select.closest('.modal');
        this.select2Options.select2Component = this;
        if (dropDownParent.length) {
            this.select2Options.dropDownParent = dropDownParent;
        }
        if (this.select2Options.createObservable) {
            this.select2Options.dataAdapter = ObservableAdapter;
        } else {
            this.wrapTemplateResultOption();
        }
        this.$select.on('change', (event, data) => {
            const value = this.$select.val();
            this.onChange(value);
        });
        if (this.placeholder) {
            this.select2Options.placeholder = this.placeholder;
        }
        this.$select.select2(this.select2Options);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.$select && changes.placeholder) {
            this.select2Options.placeholder = changes.placeholder.currentValue;
            this.$select.select2(this.select2Options);
        }
    }

    ngAfterContentInit() {
        this.optionList.changes.subscribe(() => {
            this.$select.select2('close');
            this.$select.select2(this.select2Options);
            this.writeValue(this.value);
        });
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
        if (this.$select) {
            this.$select.trigger('change.select2');
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

    private wrapTemplateResultOption() {
        const templateResult = this.select2Options.templateResult;
        if (templateResult) {
            this.select2Options.templateResult = (result, container) => {
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
}
