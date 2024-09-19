import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IqbfComponent } from './iqbf.component';

describe('IqbfComponent', () => {
  let component: IqbfComponent;
  let fixture: ComponentFixture<IqbfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IqbfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IqbfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
