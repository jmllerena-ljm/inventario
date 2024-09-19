import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailGuideComponent } from './detail-guide.component';

describe('DetailGuideComponent', () => {
  let component: DetailGuideComponent;
  let fixture: ComponentFixture<DetailGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailGuideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
