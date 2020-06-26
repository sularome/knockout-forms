import * as ko from 'knockout';
describe('kfForm', () => {
  function bindToHTML(html: string, initialState: any): HTMLElement {
    const el: HTMLDivElement = document.createElement('div');
    el.innerHTML = html;
    ko.applyBindings(initialState, el);
    return el;
  }

  it('should create FormControl and extend context with property the name of the component', () => {
    const initialHTML: string = '<div data-bind="kfForm: \'test\'"><span data-bind="if: test">test</span></div>';
    const resultHTML: string = '<div data-bind="kfForm: \'test\'"><span data-bind="if: test">test</span></div>';
    const el: HTMLElement = bindToHTML(
      initialHTML,
      { value: ko.observable('test') },
    );
    expect(el.innerHTML).toEqual(resultHTML);
  });

});
