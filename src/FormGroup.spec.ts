import { FormGroup } from './FormGroup';
import { FormControl } from './FormControl';
describe('FormGroup', () => {
  it('should allow adding of controls', () => {
    const group: FormGroup<any> = new FormGroup();
    group.addControl('test', new FormControl({ initialValue: 'test' }));
    expect(group.contains('test')).toEqual(true);
  });
});
