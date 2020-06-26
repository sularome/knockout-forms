import * as ko from 'knockout';
import { FormGroup } from '../FormGroup';

ko.bindingHandlers.kfModel = <ko.BindingHandler<string>>{
  init: (
    element: HTMLElement,
    valueAccessor: () => string,
    allBindings,
    viewModel,
    bindingContext) => {
    let controlsDescendantBindings: boolean = false;
    const formGroup: FormGroup<any> = new FormGroup<any>();
    const name: string | null = valueAccessor();
    const innerBindingContext = bindingContext.extend({ [name]: formGroup });
    ko.applyBindingsToDescendants(innerBindingContext, element);
    controlsDescendantBindings = true;
    ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
      formGroup.dispose();
    });
    return { controlsDescendantBindings };
  },
};
