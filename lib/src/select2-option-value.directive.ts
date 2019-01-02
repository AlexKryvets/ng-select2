import {Directive, ElementRef, Host, Input, Renderer2} from '@angular/core';
import {buildValueString} from './utils';
import {Select2Component} from './select2.component';

@Directive({
    selector: 'option[ngOptionValue], option[optionValue]'
})
export class Select2OptionValueDirective {

    constructor(private element: ElementRef, private renderer: Renderer2, @Host() private select: Select2Component) {
    }

    @Input('ngOptionValue')
    set ngOptionValue(value: any) {
        const id = this.select.registerOption();
        this.select.optionMap.set(id, value);
        this.setElementValue(buildValueString(id, value));
    }

    @Input('optionValue')
    set optionValue(value: any) {
        this.setElementValue(value);
    }

    /** @internal */
    setElementValue(value: string): void {
        this.renderer.setProperty(this.element.nativeElement, 'value', value);
    }
}
