import {NgModule} from '@angular/core';
import {Select2Component} from './select2.component';
import {Select2OptionValueDirective} from './select2-option-value.directive';

@NgModule({
    declarations: [Select2Component, Select2OptionValueDirective],
    exports: [Select2Component, Select2OptionValueDirective]
})
export class Select2Module {
}
