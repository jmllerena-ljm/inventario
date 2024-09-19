import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecioPromedioProductoComponent } from './precio-promedio-producto.component';

describe('PrecioPromedioProductoComponent', () => {
  let component: PrecioPromedioProductoComponent;
  let fixture: ComponentFixture<PrecioPromedioProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrecioPromedioProductoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrecioPromedioProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
