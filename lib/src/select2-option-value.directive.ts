import {AfterViewInit, Directive, ElementRef, Host, Input, Renderer2} from '@angular/core';
import {buildValueString} from './utils';
import {Select2Component} from './select2.component';

@Directive({
    selector: 'option[optionValue]'
})
export class Select2OptionValueDirective implements AfterViewInit {

    id: string;
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

    ngAfterViewInit() {
        this.select.writeValue(this.select.value);
    }

    /** @internal */
    setElementValue(value: string): void {
        this.renderer.setProperty(this.element.nativeElement, 'value', value);
    }

    /** @internal */
    setSelected(selected) {
        this.renderer.setProperty(this.element.nativeElement, 'selected', selected);
    }

    private optionValueSetter(value: any): void {
        if (this.select) {
            this.value = value;
            this.setElementValue(buildValueString(this.id, value));
        }
    }
}
