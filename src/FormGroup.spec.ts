import { FormGroup } from './FormGroup';
import { FormComponent } from './FormComponent';
describe('FormGroup', () => {
  it('should allow adding of controls', () => {
    const group: FormGroup<any> = new FormGroup();
    group.addControl('test', new FormComponent({ initialValue: 'test' }));
    expect(group.contains('test')).toEqual(true);
  });
});
