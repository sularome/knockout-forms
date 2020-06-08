import { FormComponent } from '../FormComponent';
import * as ko from 'knockout';

ko.bindingHandlers.kfModel = <ko.BindingHandler<ko.Observable<any>>>{
  init: (
    element: HTMLElement,
    valueAccessor: () => ko.Observable<any>,
    allBindings,
    viewModel,
    bindingContext) => {
    let controlsDescendantBindings: boolean = false;
    const control: FormComponent = new FormComponent<any, any>({ initialValue: valueAccessor() });
    const name: string | null = element.getAttribute('name');
    if (name) {
      const innerBindingContext = bindingContext.extend({ [name]: control });
      ko.applyBindingsToDescendants(innerBindingContext, element);
      controlsDescendantBindings = true;
    }
    ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
      control.dispose();
    });
    return { controlsDescendantBindings };
  },
};