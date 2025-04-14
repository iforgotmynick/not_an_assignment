import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToggleSwitchComponent } from './toggle-switch.component';
import { signal } from '@angular/core';

describe('ToggleSwitchComponent', () => {
  let fixture: ComponentFixture<ToggleSwitchComponent<unknown>>;
  let component: ToggleSwitchComponent<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToggleSwitchComponent],
    });

    fixture = TestBed.createComponent(ToggleSwitchComponent);
    component = fixture.componentInstance;
  });

  it('should set isRight to false when model equals first option', () => {
    const model = signal('left');
    component.model = model;
    component.options = ['left', 'right'];

    fixture.detectChanges();

    expect(component.isRight()).toBe(false);
  });

  it('should set isRight to true when model equals second option', () => {
    const model = signal('right');
    component.model = model;
    component.options = ['left', 'right'];

    fixture.detectChanges();

    expect(component.isRight()).toBe(true);
  });

  it('should toggle from first to second option', () => {
    const model = signal('left');
    component.model = model;
    component.options = ['left', 'right'];

    fixture.detectChanges();

    component.toggle();

    expect(model()).toBe('right');
    expect(component.isRight()).toBe(true);
  });

  it('should toggle from second to first option', () => {
    const model = signal('right');
    component.model = model;
    component.options = ['left', 'right'];

    fixture.detectChanges();

    component.toggle();

    expect(model()).toBe('left');
    expect(component.isRight()).toBe(false);
  });

  it('should work with boolean values', () => {
    const model = signal(true);
    const boolComponent: ToggleSwitchComponent<boolean> = fixture.componentInstance as any;

    boolComponent.model = model;
    boolComponent.options = [false, true];

    fixture.detectChanges();

    expect(boolComponent.isRight()).toBe(true);

    boolComponent.toggle();

    expect(model()).toBe(false);
    expect(boolComponent.isRight()).toBe(false);
  });
});
