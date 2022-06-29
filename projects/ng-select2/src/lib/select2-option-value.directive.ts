import {Directive, ElementRef, Host, Input, Renderer2} from '@angular/core';
import {buildValueString} from './utils';
import {Select2Component} from './select2.component';

@Directive({
    selector: 'option[optionValue]'
})
export class Select2OptionValueDirective {

    id: string | null= null;
    value: any;

    constructor(private element: ElementRef, private renderer: Renderer2, @Host() private select: Select2Component) {
        if (this.select) {
            this.id = this.select.registerOption(this);
        }
    }

    @Input('optionValue')
    set optionValue(value: any) {
        this.optionValueSetter(value);
    }

    /** @internal */
    setElementValue(value: string): void {
        this.renderer.setProperty(this.element.nativeElement, 'value', value);
    }

    /** @internal */
    setSelected(selected: any) {
        this.renderer.setProperty(this.element.nativeElement, 'selected', selected);
    }

    private optionValueSetter(value: any): void {
        if (this.select) {
            this.value = value;
            this.setElementValue(buildValueString(this.id, value));
        }
    }
}
