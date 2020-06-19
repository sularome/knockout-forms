import * as ko from 'knockout';
import './kfModel';

describe('kfModel', () => {
  function bindToHTML(html: string, initialState: any): HTMLElement {
    const el: HTMLDivElement = document.createElement('div');
    el.innerHTML = html;
    ko.applyBindings(initialState, el);
    return el;
  }

  it('should create FormControl and extend context with property the name of the component', () => {
    const initialHTML: string = '<div data-bind="kfModel: value" name="test"><span data-bind="text: test.value"></span></div>';
    const resultHTML: string = '<div data-bind="kfModel: value" name="test"><span data-bind="text: test.value">test</span></div>';
    const el: HTMLElement = bindToHTML(
      initialHTML,
      { value: ko.observable('test') },
    );
    expect(el.innerHTML).toEqual(resultHTML);
  });

  it('should update view when modelValue changes', () => {
    const initialHTML: string = '<div data-bind="kfModel: value" name="test"><span data-bind="text: test.value"></span></div>';
    const resultHTML: string = '<div data-bind="kfModel: value" name="test"><span data-bind="text: test.value">test</span></div>';
    const modelValue: ko.Observable<string> = ko.observable('initial');
    const el: HTMLElement = bindToHTML(
      initialHTML,
      { value: modelValue },
    );
    expect(el.innerHTML).not.toEqual(resultHTML);
    modelValue('test');
    expect(el.innerHTML).toEqual(resultHTML);
  });
});
